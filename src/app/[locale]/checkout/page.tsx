// File: app/checkout/page.tsx
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/server/auth";
import ChekcoutPage from "./_components/CkeckOutPage";

export default async function CheckoutPageWrapper() {
  const initialSession = await getServerSession(authOptions);

  return <ChekcoutPage initialSession={initialSession as unknown as Session} />;
}
