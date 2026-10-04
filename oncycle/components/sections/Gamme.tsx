"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import ProductPack, { type PackTone } from "../ProductPack";
import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";

type Product = {
  n: string;
  name: string;
  accroche: string;
  desc: string;
  tone: PackTone;
  bg: string;
  tags: string[];
  iron: string;
  /** Mise en avant « Notre signature ». */
  signature?: boolean;
  /** Lignes de l'étiquette : ce que contient réellement la tablette. */
  composition: string[];
  /** Allégations de l'étiquette : uniquement ce que la recette permet (pas de vitamine C sans fruits). */
  claim: string;
};

// Ordre = ordre du discours. Socle commun : chocolat noir 70 % + farine de lentilles torréfiée.
// Seuls changent : les lentilles soufflées (croustillant) et les fruits rouges (vitamine C).
const products: Product[] = [
  {
    n: "01",
    name: "L'Originelle",
    accroche: "Croustillante",
    desc: "Du chocolat noir et des éclats de lentilles vertes soufflées, pour un effet céréalier réconfortant.",
    tone: "cacao",
    bg: "#e9dcd2",
    tags: ["Source de fer", "Croustillante", "Effet céréalier"],
    iron: "9,8",
    composition: ["Chocolat noir 70 %", "Farine de lentilles torréfiée", "Lentilles vertes soufflées"],
    claim: "Fer · Magnésium",
  },
  {
    n: "02",
    name: "L'Essentielle",
    accroche: "Fruits Rouges",
    desc: "Ici, le croquant ne vient pas de la lentille soufflée, mais des framboises et myrtilles lyophilisées, pour un côté très tonique. La farine de lentilles reste au cœur de la recette pour l'apport en fer.",
    tone: "grenat",
    bg: "#f1dcdc",
    tags: ["Source de fer", "Vitamine C", "Très tonique"],
    iron: "9,6",
    composition: ["Chocolat noir 70 %", "Farine de lentilles torréfiée", "Framboises & myrtilles lyophilisées"],
    claim: "Fer · Magnésium · Vit. C",
  },
  {
    n: "03",
    name: "Fruits Rouges",
    accroche: "Croustillant",
    signature: true,
    desc: "Notre signature. Les fruits rouges s'associent au croustillant des lentilles soufflées : le meilleur des deux mondes.",
    tone: "cassis",
    bg: "#e8dae6",
    tags: ["Source de fer", "Vitamine C", "Croustillant"],
    iron: "9,7",
    composition: ["Chocolat noir 70 %", "Lentilles torréfiées & soufflées", "Fruits rouges lyophilisés"],
    claim: "Fer · Magnésium · Vit. C",
  },
];

function ProductPanel({ p }: { p: Product }) {
  return (
    <article className="flex h-full w-[86vw] shrink-0 flex-col gap-6 sm:w-[70vw] lg:w-[min(64vw,1000px)] lg:flex-row lg:gap-10">
      {/* Visuel */}
      <div
        data-cursor
        className="group relative flex min-h-[30vh] flex-1 sm:min-h-[38vh] items-center justify-center overflow-hidden rounded-[32px] lg:h-full"
        style={{ background: p.bg }}
      >
        <span className="pointer-events-none absolute -bottom-[0.18em] -left-[0.04em] select-none font-serif text-[clamp(10rem,24vw,22rem)] leading-none text-white/50">
          {p.n}
        </span>
        <div className="relative w-[52%] max-w-[260px] sm:w-[38%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 group-hover:-rotate-3 group-hover:scale-[1.03]">
          <ProductPack tone={p.tone} number={p.n} name={p.signature ? `${p.name} ${p.accroche}` : p.name} composition={p.composition} claim={p.claim} />
          <div className="absolute -bottom-8 left-[8%] h-8 w-[84%] rounded-[50%] bg-cacao/30 blur-xl" />
        </div>
      </div>

      {/* Texte */}
      <div className="flex flex-col justify-end lg:w-[34%] lg:pb-4">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-framboise">
          Tablette N°{p.n}
          {p.signature && <span className="ml-3 rounded-full bg-framboise px-2.5 py-1 text-[9.5px] tracking-[0.22em] text-creme">Notre signature</span>}
        </p>
        <h3 className="mt-3 font-serif text-[clamp(2.2rem,4vw,4rem)] leading-[0.92] tracking-[-0.02em]">
          {p.name}
          <br />
          <em className="text-framboise">{p.accroche}</em>
        </h3>
        <p className="mt-5 line-clamp-2 text-[14.5px] leading-[1.75] text-cacao/65 sm:line-clamp-none">{p.desc}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t} className="max-sm:[&:nth-child(3)]:hidden rounded-full border border-cacao/15 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-cacao/70">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-6 hidden border-t border-cacao/10 pt-4 text-[12px] text-cacao/50 sm:block">
          <span className="font-serif text-2xl text-cacao">{p.iron} mg</span> de fer / 100 g · 80 g · 16 carrés
        </p>
      </div>
    </article>
  );
}

export default function Gamme() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // Distance horizontale réelle à parcourir = largeur de la piste - largeur de l'écran.
  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const smoothX = useSpring(x, { stiffness: 140, damping: 30, mass: 0.4 });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  return (
    <section
      id="gamme"
      ref={sectionRef}
      className="relative bg-creme"
      // La hauteur verticale « consomme » exactement la distance horizontale.
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x: smoothX }}
          className="flex h-full items-stretch gap-6 px-5 pb-24 pt-28 will-change-transform sm:gap-10 sm:px-8 lg:gap-16 lg:pt-32"
        >
          {/* Panneau d'introduction */}
          <div className="flex w-[80vw] shrink-0 flex-col justify-end sm:w-[56vw] lg:w-[34vw]">
            <Reveal as="p" className="mb-8 text-[10.5px] font-semibold uppercase tracking-[0.32em] text-framboise">
              03 — La Gamme
            </Reveal>
            <SplitText
              className="font-serif text-[clamp(2.8rem,5.4vw,5.6rem)] leading-[0.92] tracking-[-0.03em]"
              lines={[["Trois tablettes."], [{ text: "Un même rituel.", className: "italic text-framboise" }]]}
            />
            <Reveal as="p" delay={0.15} className="mt-8 max-w-[38ch] text-[15px] leading-[1.8] text-cacao/65">
              Un même socle, chocolat noir et farine de lentilles torréfiée, puis trois façons de répondre à l&apos;envie :
              le réconfort céréalier, le tonique des fruits rouges, ou les deux à la fois. Faites défiler pour les découvrir.
            </Reveal>
          </div>

          {products.map((p) => (
            <ProductPanel key={p.n} p={p} />
          ))}

          <div className="w-[4vw] shrink-0" aria-hidden />
        </motion.div>

        {/* Progression */}
        <div className="absolute inset-x-5 bottom-10 flex items-center gap-4 sm:inset-x-8">
          <span className="text-[10.5px] font-semibold tracking-[0.2em] text-cacao/50">01</span>
          <div className="h-px flex-1 bg-cacao/10">
            <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-cacao" />
          </div>
          <span className="text-[10.5px] font-semibold tracking-[0.2em] text-cacao/50">03</span>
        </div>
      </div>
    </section>
  );
}
