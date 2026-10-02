"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useLenis } from "./SmoothScroll";

const IntroContext = createContext(false);
/** true une fois le loader retiré : les animations d'entrée du Hero s'y synchronisent. */
export const useIntroDone = () => useContext(IntroContext);

const WORD = "OnCycle";

function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cacao text-creme"
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 1.1, ease: EASE } }}
      aria-label="Chargement"
      role="status"
    >
      <motion.div
        className="flex items-baseline font-serif text-[16vw] leading-none tracking-[-0.03em] sm:text-[8.5rem]"
        exit={{ y: -60, opacity: 0, transition: { duration: 0.6, ease: EASE } }}
      >
        {WORD.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: EASE }}
          >
            {char}
          </motion.span>
        ))}
        <motion.span
          className="text-framboise"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 + WORD.length * 0.07 + 0.1, ease: EASE }}
        >
          .
        </motion.span>
      </motion.div>
      <div className="absolute bottom-10 left-1/2 h-px w-40 -translate-x-1/2 overflow-hidden bg-creme/15">
        <motion.div
          className="h-full origin-left bg-creme/70"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        />
      </div>
      <motion.p
        className="absolute bottom-14 text-[10px] uppercase tracking-[0.35em] text-creme/45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Nutrition fonctionnelle · Cycle féminin
      </motion.p>
    </motion.div>
  );
}

export default function Intro({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const lenis = useLenis();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setLoading(false), reduce ? 300 : 2100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [loading, lenis]);

  return (
    <IntroContext.Provider value={!loading}>
      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>
      {children}
    </IntroContext.Provider>
  );
}
