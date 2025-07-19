import { getServerSession } from 'next-auth';
import CartItems from './_components/CartItems';
import CheckoutForm from './_components/CheckoutForm';
import { authOptions } from '@/server/auth';
import EditUserForm from '@/components/edit-user-form';
import { Locale } from '@/i18n.config';
import getTrans from '@/lib/translation';
import { Session } from 'next-auth';

async function CartPage({params}:{params:Promise<{locale:Locale}>}) {

  const session = await getServerSession(authOptions);
  const { locale } = await params;
  const translations = await getTrans(locale);
  return (
    <main>
      <section className='section-gap'>
        <div className='container'>
          <h1 className='text-primary text-center font-bold text-4xl italic mb-10'>
            Cart
          </h1>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            <CartItems />
            <EditUserForm user={session?.user as Session['user']} translations={translations} />
            </div>
        </div>
      </section>
    </main>
  );
}

export default CartPage;
