"use client";

import { MotionConfig } from "framer-motion";
import CustomCursor from "@/components/motion/CustomCursor";
import Intro from "@/components/motion/Intro";
import SmoothScroll from "@/components/motion/SmoothScroll";
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
          <CustomCursor />
          <Navbar />
          <main>
            <Hero />
            <Constat />
            <Formule />
            <Gamme />
          </main>
          <Footer />
        </Intro>
      </SmoothScroll>
    </MotionConfig>
  );
}
