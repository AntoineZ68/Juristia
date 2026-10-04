"use client";

import { MotionConfig } from "framer-motion";
import CustomCursor from "@/components/motion/CustomCursor";
import Intro from "@/components/motion/Intro";
import SmoothScroll from "@/components/motion/SmoothScroll";
import BusinessProvider from "@/components/business/BusinessContext";
import BusinessTrigger from "@/components/business/BusinessTrigger";
import Constat from "@/components/sections/Constat";
import Footer from "@/components/sections/Footer";
import Formule from "@/components/sections/Formule";
import Gamme from "@/components/sections/Gamme";
import Hero from "@/components/sections/Hero";
import Navbar from "@/components/sections/Navbar";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Intro>
          <BusinessProvider>
            <CustomCursor />
            <Navbar />
            <main>
              <Hero />
              <Constat />
              <Formule />
              <Gamme />
              <BusinessTrigger />
            </main>
            <Footer />
          </BusinessProvider>
        </Intro>
      </SmoothScroll>
    </MotionConfig>
  );
}
