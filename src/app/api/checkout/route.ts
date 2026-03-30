import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const { amount, email, userId, type } = await req.json();

    // 1. One-time Credit Purchase
    if (type === 'credits') {
      if (!amount || amount < 5) {
        return NextResponse.json({ error: 'Minimum purchase is $5' }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${(amount * 1000).toLocaleString()} Pathgen Credits`,
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
          userId,
          email,
          credits: (amount * 1000).toString(),
          type: 'credits'
        },
      });

      return NextResponse.json({ url: session.url });
    } 
    
    // 2. Pro Plan Subscription ($15/mo)
    if (type === 'subscription') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              recurring: { interval: 'month' },
              product_data: {
                name: 'Pathgen Pro Plan',
                description: '2,000 req/min, AI Analysis, and Real-time Webhooks.',
              },
              unit_amount: 1500, // $15.00
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer_email: email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
        metadata: {
          userId,
          email,
          type: 'subscription'
        },
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Invalid checkout type' }, { status: 400 });

  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
