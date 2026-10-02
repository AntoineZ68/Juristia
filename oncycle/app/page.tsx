import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Constat from "@/components/Constat";
import Synergie from "@/components/Synergie";
import Gamme from "@/components/Gamme";
import Transparence from "@/components/Transparence";
import Waitlist, { Footer } from "@/components/Waitlist";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Constat />
        <Synergie />
        <Gamme />
        <Transparence />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
