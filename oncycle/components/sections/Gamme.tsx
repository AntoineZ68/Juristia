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
};

const products: Product[] = [
  {
    n: "01",
    name: "L'Originelle",
    accroche: "Croustillante",
    desc: "Un chocolat noir d'origine où éclatent des lentilles vertes soufflées. Un croquant aérien, presque céréalier, pour le carré de 16 h qui redonne de l'élan.",
    tone: "cacao",
    bg: "#e9dcd2",
    tags: ["Source de fer", "Texture croquante", "Riche en fibres"],
    iron: "9,8",
  },
  {
    n: "02",
    name: "L'Essentielle",
    accroche: "Torréfiée",
    desc: "Notre recette signature. La farine de lentille torréfiée se fond dans un chocolat soyeux et dévoile des notes de praliné et de noisette grillée. Velouté de bout en bout.",
    tone: "noisette",
    bg: "#efe2d4",
    tags: ["Source de fer", "Texture fondante", "Notes de noisette"],
    iron: "10,4",
  },
  {
    n: "03",
    name: "L'Éclat",
    accroche: "Baies Rouges",
    desc: "Des éclats de framboises et de myrtilles lyophilisées viennent piquer le cacao d'une acidité vive. La vitamine C des fruits active l'absorption du fer. La plus tonique.",
    tone: "grenat",
    bg: "#f1dcdc",
    tags: ["Source de fer", "Vitamine C", "Pointe acidulée"],
    iron: "9,6",
  },
];

function ProductPanel({ p }: { p: Product }) {
  return (
    <article className="flex h-full w-[86vw] shrink-0 flex-col gap-6 sm:w-[70vw] lg:w-[min(64vw,1000px)] lg:flex-row lg:gap-10">
      {/* Visuel */}
      <div
        data-cursor
        className="group relative flex min-h-[38vh] flex-1 items-center justify-center overflow-hidden rounded-[32px] lg:h-full"
        style={{ background: p.bg }}
      >
        <span className="pointer-events-none absolute -bottom-[0.18em] -left-[0.04em] select-none font-serif text-[clamp(10rem,24vw,22rem)] leading-none text-white/50">
          {p.n}
        </span>
        <div className="relative w-[38%] max-w-[260px] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 group-hover:-rotate-3 group-hover:scale-[1.03]">
          <ProductPack tone={p.tone} number={p.n} name={`${p.name} ${p.accroche}`} large />
          <div className="absolute -bottom-8 left-[8%] h-8 w-[84%] rounded-[50%] bg-cacao/30 blur-xl" />
        </div>
      </div>

      {/* Texte */}
      <div className="flex flex-col justify-end lg:w-[34%] lg:pb-4">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-framboise">Tablette N°{p.n}</p>
        <h3 className="mt-4 font-serif text-[clamp(2.6rem,4vw,4rem)] leading-[0.92] tracking-[-0.02em]">
          {p.name}
          <br />
          <em className="text-framboise">{p.accroche}</em>
        </h3>
        <p className="mt-5 line-clamp-3 text-[14.5px] leading-[1.75] text-cacao/65 sm:line-clamp-none">{p.desc}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t} className="rounded-full border border-cacao/15 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-cacao/70">
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
              Une base fonctionnelle commune, trois textures pour s&apos;accorder à chaque humeur du cycle. Faites défiler
              pour les découvrir.
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
