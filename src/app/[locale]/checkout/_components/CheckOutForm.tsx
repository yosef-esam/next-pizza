"use client"

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import { getServerSession, Session } from 'next-auth'
import { authOptions } from '@/server/auth'
import { useClientSession } from '@/hooks/useClientSession';
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearCart, selectCartItems } from '@/redux/features/cart/cartSlice'
import { removeItemFromCart } from '@/redux/features/cart/cartSlice'
import { date } from 'zod'

function CheckOutForm({amount,session}:{amount:number,session:Session| null;}) {
    const cart = useAppSelector(selectCartItems);
    const dispatch = useAppDispatch();
 
    const stripe = useStripe();
    const elements = useElements();
   const [loading,setLoadin]=useState(false)
   console.log(session)
   
   const [ErrorMessage,setErrorMessage]=useState<string | undefined>()
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();
  
      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
      const handleError =(error: any)=>{
        setLoadin(false)
        setErrorMessage(error.mesasge)
      }
      createOrder()
   
      const {error:SubmitError}=await elements.submit();
      if(SubmitError){
        handleError(SubmitError);
        return
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-intent`, {
        method: "POST",
        body: JSON.stringify({ amount }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }
      
      const { clientSecret } = await res.json();
      const result = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
          return_url: window.location.origin + "/success",
        },
        redirect: "if_required", // 👈 prevent auto redirect
      });
      
      if (result.error) {
        console.log(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        console.log("✅ Payment successful");
        dispatch(clearCart());
        sendEmail()
        // Wait a bit to ensure Redux updates and localStorage clears
        setTimeout(() => {
          window.location.href = "/success";
        }, 300); // 300ms delay
      }
    };
    const createOrder = async () => {
        const orderData = {
          userEmail: session?.user.email,
          phone: session?.user.phone, 
          streetAddress: session?.user.streetAddress,
          postalCode: session?.user.postalCode,
          city: session?.user.city,
          country: session?.user.country,
          subTotal: amount,
          paid: true,
          deliveryFee: 5,
          totalPrice: amount + 5,
          products: cart.map((item) => ({
            name: item?.name,
            basePrice: item?.basePrice,
            quantity: item?.quantity,
            id: item?.id,
          })),
        };
      
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
      
        if (res.ok) {
        
          console.log("✅ Order created");
          // Optional: clear cart
         
        } else {
          console.error("❌ Failed to create order");
        }
      };
      const sendEmail=async()=>{
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send`,{
         method:"POST",
          body:JSON.stringify({
            name: session?.user.name,
            userEmail: session?.user.email,
          phone: session?.user.phone, 
          streetAddress: session?.user.streetAddress,
          postalCode: session?.user.postalCode,
          city: session?.user.city,
          country: session?.user.country,
          subTotal: amount,
          totalPrice: amount + 5,
          products: cart.map((item) => ({
            name: item?.name,
            basePrice: item?.basePrice,
            quantity: item?.quantity,
            id: item?.id,
          })),

          }),headers:{
           'content-type':"application/json"
          }
   
       
       }).then(res=>res.json()).then(data=>{
         console.log(data)
       })
     }
   
    return (
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto">
        <PaymentElement />
        <button
          disabled={!stripe}
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow hover:from-blue-700 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg tracking-wide"
        >
          Submit Payment
        </button>
      </form>
    
      )
}

export default CheckOutForm