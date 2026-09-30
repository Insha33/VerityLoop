import { ContextOrbit } from "@/components/marketing/ContextOrbit";
import { FAQ } from "@/components/marketing/FAQ";
import { Footer } from "@/components/marketing/Footer";
import { Header } from "@/components/marketing/Header";
import { Hero } from "@/components/marketing/Hero";
import { MotionEffects } from "@/components/marketing/MotionEffects";
import { ProductWalkthrough } from "@/components/marketing/ProductWalkthrough";
import { Solutions } from "@/components/marketing/Solutions";
import { Waitlist } from "@/components/marketing/Waitlist";
import { Workflow } from "@/components/marketing/Workflow";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <MotionEffects />
      <Header />
      <main id="main">
        <Hero />
        <ProductWalkthrough />
        <Workflow />
        <Solutions />
        <ContextOrbit />
        <FAQ />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
