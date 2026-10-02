"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { BatteryLow, Waves } from "lucide-react";
import Reveal from "../motion/Reveal";
import SplitText from "../motion/SplitText";

const cards = [
  {
    n: "01",
    icon: BatteryLow,
    phase: "Phase menstruelle",
    title: "La Chute du Fer",
    body: "À chaque cycle, la perte sanguine puise directement dans vos réserves de fer. Résultat : une fatigue qui ne passe pas avec une nuit de sommeil, un souffle plus court, une concentration en berne. Le fer contribue au transport normal de l'oxygène dans l'organisme ; quand il manque, tout ralentit.",
    stats: [
      { value: "≈ 15", unit: "mg", label: "de fer perdus en moyenne par cycle¹" },
      { value: "30", unit: "%", label: "des femmes de 15 à 49 ans anémiées dans le monde²" },
    ],
  },
  {
    n: "02",
    icon: Waves,
    phase: "Phase lutéale",
    title: "Le Besoin de Magnésium",
    body: "Avant et pendant les règles, les crampes s'installent et l'envie de sucré devient irrépressible. Ce n'est pas un caprice : le corps réclame de l'énergie rapide et du magnésium, un minéral qui contribue à une fonction musculaire normale et à réduire la fatigue. Le chocolat noir est l'une des sources les plus concentrées.",
    stats: [
      { value: "375", unit: "mg", label: "de magnésium recommandés chaque jour (VNR)³" },
      { value: "≈ 220", unit: "mg", label: "dans 100 g de cacao noir 70 %⁴" },
    ],
  },
];

function Card({ card, index, progress }: { card: (typeof cards)[number]; index: number; progress: MotionValue<number> }) {
  const Icon = card.icon;
  const start = index * 0.5;
  const scale = useTransform(progress, [start, start + 0.35], [0.92, 1]);
  const rotate = useTransform(progress, [start, start + 0.35], [index ? 3 : -3, 0]);

  return (
    <div className="flex min-h-[80vh] items-center py-10 md:min-h-screen">
      <motion.article
        style={{ scale, rotate }}
        className="relative w-full overflow-hidden rounded-[32px] border border-white/70 bg-white/35 p-8 shadow-[0_30px_80px_-30px_rgba(74,26,44,0.35)] backdrop-blur-2xl sm:p-12"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-framboise/20 bg-white/50">
              <Icon className="h-5 w-5 text-framboise" strokeWidth={1.4} />
            </span>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.26em] text-framboise/70">{card.phase}</span>
          </div>
          <Reveal as="p" className="mt-14 font-serif text-[1rem] italic text-cacao/40">
            {card.n}
          </Reveal>
          <SplitText
            as="h3"
            className="font-serif text-[clamp(2.6rem,4.6vw,4.2rem)] leading-[0.95] tracking-[-0.02em]"
            lines={[[card.title]]}
          />
          <Reveal as="p" delay={0.15} className="mt-6 max-w-[52ch] text-[15.5px] leading-[1.8] text-cacao/70">
            {card.body}
          </Reveal>
          <dl className="mt-10 grid gap-6 border-t border-cacao/10 pt-8 sm:grid-cols-2">
            {card.stats.map((s, i) => (
              <Reveal key={s.label} delay={0.2 + i * 0.1}>
                <dd className="font-serif text-[3.6rem] leading-none text-framboise">
                  {s.value}
                  <span className="ml-1 font-sans text-sm font-medium text-cacao/60">{s.unit}</span>
                </dd>
                <dt className="mt-2 max-w-[24ch] text-[12.5px] leading-snug text-cacao/55">{s.label}</dt>
              </Reveal>
            ))}
          </dl>
        </div>
      </motion.article>
    </div>
  );
}

export default function Constat() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const { scrollYProgress: pinProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useTransform(pinProgress, [0, 1], [0, 1]);
  const blobY = useTransform(scrollYProgress, [0, 1], ["-20%", "30%"]);

  return (
    <section id="constat" ref={ref} className="relative bg-poudre">
      {/* formes colorées qui donnent de la matière au verre dépoli */}
      <motion.div aria-hidden style={{ y: blobY }} className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[5%] top-[18%] h-[38vmax] w-[38vmax] rounded-full bg-framboise/35 blur-[90px]" />
        <div className="absolute right-[30%] top-[55%] h-[30vmax] w-[30vmax] rounded-full bg-prune/30 blur-[90px]" />
        <div className="absolute left-[10%] top-[40%] h-[24vmax] w-[24vmax] rounded-full bg-white/70 blur-[80px]" />
      </motion.div>

      <div className="relative mx-auto grid max-w-[1400px] gap-4 px-5 sm:px-8 md:grid-cols-2 md:gap-16">
        {/* Colonne épinglée */}
        <div className="pt-28 md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-center md:pt-0">
          <Reveal as="p" className="mb-8 text-[10.5px] font-semibold uppercase tracking-[0.32em] text-framboise">
            01 — Le Constat
          </Reveal>
          <SplitText
            className="font-serif text-[clamp(2.8rem,5.6vw,5.6rem)] leading-[0.95] tracking-[-0.03em]"
            lines={[["Pourquoi votre corps"], ["réclame-t-il du"], [{ text: "chocolat ?", className: "italic text-framboise" }]]}
          />
          <Reveal as="p" delay={0.2} className="mt-8 max-w-[42ch] text-[15.5px] leading-[1.8] text-cacao/65">
            Les envies de la fin de cycle ne sont pas un manque de volonté. Ce sont des signaux physiologiques précis.
            Les comprendre, c&apos;est cesser de lutter contre eux.
          </Reveal>

          <div className="mt-12 hidden items-center gap-4 md:flex">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-cacao/50">01</span>
            <div className="h-px w-40 bg-cacao/15">
              <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-framboise" />
            </div>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-cacao/50">02</span>
          </div>

          <Reveal as="p" delay={0.3} className="mt-12 hidden max-w-[54ch] text-[10.5px] leading-relaxed text-cacao/40 md:block">
            ¹ Perte sanguine moyenne de 30 à 40 mL, soit ≈ 0,45 mg de fer par mL. ² OMS, Global Health Observatory, 2019
            (29,9 %). ³ Valeur nutritionnelle de référence, Règl. (UE) 1169/2011. ⁴ Tables de composition Ciqual/USDA.
          </Reveal>
        </div>

        {/* Colonne qui défile */}
        <div className="pb-16 md:pb-0">
          {cards.map((c, i) => (
            <Card key={c.n} card={c} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
