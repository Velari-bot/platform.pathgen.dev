import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover' as never,
});

export async function POST(req: Request) {
  try {
    const { amount, email, orgId } = await req.json();

    if (!amount || amount < 5) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${(amount * 100).toLocaleString()} Pathgen Credits`,
              description: 'Usage-based API credits for the Pathgen developer platform.',
            },
            unit_amount: Math.round(amount * 100), // In cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: {
        email,
        orgId,
        credits: (amount * 100).toString(),
        amount: amount.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
