import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  const session = event.data.object as any;

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const metadata = session.metadata;
      if (!metadata) break;

      const userId = metadata.userId;
      const type = metadata.type;

      if (type === 'credits') {
        const creditsToAdd = parseInt(metadata.credits || '0');
        if (userId && creditsToAdd > 0) {
          try {
            const userRef = adminDb.collection('users').doc(userId);
            const userDoc = await userRef.get();
            
            if (userDoc.exists) {
              const currentCredits = (userDoc.data()?.credits || 0);
              await userRef.update({
                credits: currentCredits + creditsToAdd,
                last_purchase_at: new Date().toISOString()
              });
              
              // Also log the transaction
              await adminDb.collection('billing').doc(metadata.email).collection('invoices').add({
                amount: parseInt(metadata.amount || '0'),
                credits: creditsToAdd,
                type: 'credit_purchase',
                status: 'paid',
                createdAt: new Date()
              });
            }
          } catch (e) {
            console.error('Failed to update credits:', e);
          }
        }
      }

      if (type === 'subscription') {
        if (userId) {
          try {
            await adminDb.collection('users').doc(userId).update({
              tier: 2, // Pro tier
              subscription_id: session.subscription,
              last_purchase_at: new Date().toISOString()
            });
            
            // Log to billing
            await adminDb.collection('billing').doc(metadata.email).update({
              tier: 2,
              updatedAt: new Date().toISOString()
            });
          } catch (e) {
            console.error('Failed to update subscription:', e);
          }
        }
      }
      break;

    case 'customer.subscription.deleted':
      // Handle cancellation
      const sub = event.data.object as Stripe.Subscription;
      const subUserQ = await adminDb.collection('users').where('subscription_id', '==', sub.id).get();
      if (!subUserQ.empty) {
        const userDoc = subUserQ.docs[0];
        await userDoc.ref.update({
          tier: 1, // Back to free tier
          subscription_id: null
        });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
