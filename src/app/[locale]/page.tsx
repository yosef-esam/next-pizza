import About from "@/components/about";
import Contact from "@/components/contact";
import BestSellers from "./_components/BestSellers";
import Hero from "./_components/Hero";
import CartInitializer from "@/components/CartInitializer";

export default async function Home() {
  return (
    <main>
      <CartInitializer />
      <Hero />
      <BestSellers />
      <About />
      <Contact />
    </main>
  );
}
