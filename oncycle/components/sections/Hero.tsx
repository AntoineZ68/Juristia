"use client";

import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { ASSETS } from "@/lib/assets";
import { EASE } from "@/lib/motion";
import { useIntroDone } from "../motion/Intro";
import Magnetic from "../motion/Magnetic";
import SmartImage from "../motion/SmartImage";
import ShineButton from "../motion/ShineButton";
import SplitText from "../motion/SplitText";

export default function Hero() {
  const ready = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallaxe : le cadre monte, la photo glisse dans son masque, le titre descend et s'efface.
  const frameY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const productY = useTransform(scrollYProgress, [0, 1], ["-4%", "10%"]);
  const productScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.14]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Inclinaison 3D douce qui suit la souris.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-3, 3]), { stiffness: 120, damping: 20 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 120, damping: 20 });

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-screen flex-col overflow-hidden pt-28 sm:pt-32"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      {/* halos */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[55%] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-poudre blur-[2px]" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[55%] h-[96vmin] w-[96vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-framboise/10" />
      <div aria-hidden className="pointer-events-none absolute -right-[10vmin] top-[10%] h-[40vmin] w-[40vmin] rounded-full bg-framboise/10 blur-[80px]" />

      {/* Titre */}
      <motion.div style={{ y: titleY, opacity: fade }} className="relative z-0 px-5 text-center">
        <motion.p
          className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-framboise sm:mb-8 sm:text-[10.5px] sm:tracking-[0.32em]"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
        >
          Nutrition fonctionnelle · Cycle féminin
        </motion.p>
        <SplitText
          as="h1"
          play={ready}
          delay={0.15}
          stagger={0.08}
          className="mx-auto max-w-[15ch] font-serif text-[clamp(2.6rem,7vw,7rem)] leading-[1] tracking-[-0.03em] sm:max-w-none"
          lines={[["Recharger vos réserves."], [{ text: "Répondre à vos envies.", className: "italic text-framboise" }]]}
        />
      </motion.div>

      {/* Accroche + CTA, visibles dès le premier écran */}
      <motion.div
        style={{ opacity: fade }}
        className="relative z-20 mx-auto mt-8 grid w-full max-w-[1180px] justify-items-center gap-6 px-5 text-center sm:mt-10 sm:px-8 md:grid-cols-[1fr_auto_1fr] md:items-center md:justify-items-stretch md:text-left"
      >
        <motion.p
          className="max-w-[30ch] font-serif text-[1.2rem] leading-[1.35] text-cacao/80 sm:text-[1.35rem]"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
        >
          Le premier chocolat fonctionnel pensé pour le <em className="text-framboise">cycle féminin</em>.
        </motion.p>

        <motion.div
          className="md:justify-self-center"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 1.05 }}
        >
          <Magnetic>
            <ShineButton href="#formule">
              Découvrir la synergie <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </ShineButton>
          </Magnetic>
        </motion.div>

        <motion.div
          className="hidden items-center gap-3 justify-self-end text-[10.5px] font-semibold uppercase tracking-[0.24em] text-cacao/50 md:flex"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
        >
          Fer · Magnésium · Vitamine C
          <motion.span
            className="flex h-9 w-9 items-center justify-center rounded-full border border-cacao/20"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </motion.span>
        </motion.div>
      </motion.div>
      {/* Produit — photo cadrée, révélée par un masque puis animée en parallaxe interne */}
      <motion.div
        style={{ y: frameY }}
        className="relative z-10 mx-auto mb-16 mt-10 w-[calc(100%-2.5rem)] max-w-[1180px] [perspective:1400px] sm:mt-14 sm:w-[calc(100%-4rem)]"
      >
        <motion.div
          data-cursor
          initial={{ clipPath: "inset(18% 12% 18% 12% round 40px)", opacity: 0 }}
          animate={ready ? { clipPath: "inset(0% 0% 0% 0% round 32px)", opacity: 1 } : {}}
          transition={{ duration: 1.8, ease: EASE, delay: 0.35 }}
          style={{ rotateX, rotateY }}
          className="relative aspect-[5/4] overflow-hidden rounded-[32px] bg-[radial-gradient(120%_90%_at_70%_20%,#c76a86_0%,#4a1a2c_55%,#2e0f1b_100%)] shadow-[0_70px_80px_-40px_rgba(34,21,16,0.55),0_24px_30px_-18px_rgba(34,21,16,0.35)] sm:aspect-[2000/1091]"
        >
          <motion.div style={{ y: productY, scale: productScale }} className="absolute inset-[-8%]">
            <SmartImage
              {...ASSETS.heroProduct}
              alt="Deux carrés de chocolat OnCycle coupés, révélant un cœur framboise et lentilles, posés sur une ardoise"
              className="h-full w-full select-none object-cover object-[55%_50%] sm:object-[62%_50%]"
              fallbackClassName="!object-contain p-[10%] [filter:drop-shadow(0_40px_40px_rgba(0,0,0,0.45))]"
              draggable={false}
              fetchPriority="high"
            />
          </motion.div>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cacao/35 via-transparent to-transparent" />
          <motion.span
            className="absolute bottom-5 left-5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-creme backdrop-blur-md sm:bottom-7 sm:left-7"
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 1.4 }}
          >
            <span className="hidden sm:inline">N°03 — </span>La Soyeuse
          </motion.span>
        </motion.div>
      </motion.div>

    </section>
  );
}
