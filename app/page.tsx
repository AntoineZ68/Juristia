import { Features } from "@/components/features";
import { FinalCta } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Pricing } from "@/components/pricing";
import { Security } from "@/components/security";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="contenu">
        <Hero />
        <Security />
        <Features />
        <HowItWorks />
        <Pricing />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
