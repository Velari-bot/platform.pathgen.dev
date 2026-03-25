import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/admin';
import admin from '@/lib/firebase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover' as never,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret as string);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Handle successful payments
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (metadata?.email && metadata?.credits) {
      const email = metadata.email;
      const creditsToAdd = parseFloat(metadata.amount); 
      // amount is in dollars? the creditsReceived was amount * 100.
      // let's use the actual dollar amount to update the balance.
      
      try {
        const billRef = adminDb.collection('billing').doc(email);
        const invoiceRef = billRef.collection('invoices').doc();

        await adminDb.runTransaction(async (transaction) => {
          const doc = await transaction.get(billRef);
          const currentBalance = doc.exists ? (doc.data()?.balance || 0) : 0;
          const newBalance = currentBalance + creditsToAdd;

          transaction.set(billRef, { 
            balance: newBalance,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });

          transaction.set(invoiceRef, {
            amount: creditsToAdd,
            type: "Stripe Purchase",
            status: "Paid",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            stripeSessionId: session.id
          });
        });

        console.log(`Successfully updated balance for ${email}: +$${creditsToAdd}`);
      } catch (error) {
        console.error('Error updating billing state in Firestore:', error);
        return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
