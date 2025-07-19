'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {  Routes } from '@/constants/enums';
import { getTotalAmount } from '@/lib/cart';
import { formatCurrency } from '@/lib/formatters';
import { selectCartItems } from '@/redux/features/cart/cartSlice';
import { useAppSelector } from '@/redux/hooks';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

function CheckoutForm() {
  const router = useRouter();
  const cart = useAppSelector(selectCartItems);
  const totalAmount = getTotalAmount(cart);
  const {locale} = useParams();
  
if (cart === undefined) {
  return <p>Loading...</p>;
}
console.log(`/${locale}/${Routes.CHECKOUT}`)
if (cart.length === 0) {
  return <p>Your cart is empty.</p>;
}
  return (
  (
      <div className='grid gap-6 bg-gray-100 rounded-md p-4'>
        <h2 className='text-2xl text-black font-semibold'>Checkout</h2>
        <form>
          <div className='grid gap-4'>
            <div className='grid gap-1'>
              <Label htmlFor='phone' className='text-accent'>
                Phone
              </Label>
              <Input
                id='phone'
                placeholder='Enter your phone'
                type='text'
                name='phone'
              />
            </div>
            <div className='grid gap-1'>
              <Label htmlFor='address' className='text-accent'>
                Street address
              </Label>
              <Textarea
                id='address'
                placeholder='Enter your address'
                name='address'
                className='resize-none'
              />
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <div className='grid gap-1'>
                <Label htmlFor='postal-code' className='text-accent'>
                  Postal code
                </Label>
                <Input
                  type='text'
                  id='postal-code'
                  placeholder='Enter postal code'
                  name='postal-code'
                />
              </div>
              <div className='grid gap-1'>
                <Label htmlFor='city' className='text-accent'>
                  City
                </Label>
                <Input
                  type='text'
                  id='city'
                  placeholder='Enter your City'
                  name='city'
                />
              </div>
              <div className='grid gap-1'>
                <Label htmlFor='country' className='text-accent'>
                  Country
                </Label>
                <Input
                  type='text'
                  id='country'
                  placeholder='Enter your country'
                  name='country'
                />
              </div>
            </div>
            <Link
              href={`/${locale}/${Routes.CHECKOUT}?amount=${totalAmount}`}
              className='h-10 bg-primary text-white rounded-md flex items-center justify-center'
            >
              Pay {formatCurrency(totalAmount)}
            </Link>
          </div>
        </form>
      </div>
    )
  );
}

export default CheckoutForm;
