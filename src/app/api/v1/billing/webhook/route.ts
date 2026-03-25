import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db, users, creditTransactions } from '@/lib/db';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // @ts-expect-error - Stripe types might not be updated yet for the exact preview string
    apiVersion: '2025-01-27-preview',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email;
        const amountTotal = session.amount_total || 0;

        // Map amount to credits (as per checklist)
        // Starter — $4.99 — 5,000 credits
        // Pro — $19.99 — 25,000 credits
        // Studio — $49.99 — 75,000 credits
        let creditsToAdd = 0;
        if (amountTotal >= 4999) creditsToAdd = 75000;
        else if (amountTotal >= 1999) creditsToAdd = 25000;
        else if (amountTotal >= 499) creditsToAdd = 5000;

        if (customerEmail && creditsToAdd > 0) {
            await db.transaction(async (tx) => {
                const [user] = await tx.select().from(users).where(eq(users.email, customerEmail));
                
                if (user) {
                    await tx.update(users)
                        .set({ credits: user.credits + creditsToAdd })
                        .where(eq(users.id, user.id));

                    await tx.insert(creditTransactions).values({
                        userId: user.id,
                        amount: creditsToAdd,
                        type: 'purchase',
                        description: `Stripe Payment: ${session.id}`
                    });
                }
            });
        }
    }

    return NextResponse.json({ received: true });
}
