import { FAQ } from "@/components/marketing/FAQ";
import { Footer } from "@/components/marketing/Footer";
import { Header } from "@/components/marketing/Header";
import { Hero } from "@/components/marketing/Hero";
import { ProductStory } from "@/components/marketing/ProductStory";
import { ProductDetails } from "@/components/marketing/ProductDetails";
import { Waitlist } from "@/components/marketing/Waitlist";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <ProductStory />
        <ProductDetails />
        <FAQ />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
