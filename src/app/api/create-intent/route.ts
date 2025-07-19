import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: Request) {
  const body = await req.json();
  const { amount } = body;

  if (!amount) {
    return NextResponse.json({ error: 'Missing amount' }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('Stripe Error:', err.message);
    return NextResponse.json({ error: 'Stripe error' }, { status: 500 });
  }
}
