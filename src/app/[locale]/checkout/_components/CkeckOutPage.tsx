'use client'
import {CheckoutProvider, Elements} from '@stripe/react-stripe-js';
import {loadStripe, StripeElementsOptions} from '@stripe/stripe-js';
import { useSearchParams } from 'next/navigation';
import React from 'react'

import { Session } from 'next-auth';
import { useClientSession } from '@/hooks/useClientSession';
import CheckOutForm from './CheckOutForm';

function ChekcoutPage({initialSession}:{initialSession:Session| null}) {
  const  searchParams=useSearchParams();
  const amount = parseFloat(searchParams.get("amount") || "0");
  const session = useClientSession(initialSession);
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

  const options:StripeElementsOptions = {
    mode:'payment',
    currency:'usd',
    amount: Math.round(amount * 100), // Stripe wants amount in cents
  };
  
  return(
      <Elements stripe={stripePromise} options={options}>
      <CheckOutForm amount = {Number(searchParams.get("amount"))} session={session.data} />
    </Elements>
  )
}

export default ChekcoutPage