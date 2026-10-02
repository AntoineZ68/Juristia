"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bean, Cherry, Wheat } from "lucide-react";
import { ASSETS } from "@/lib/assets";
import Reveal from "../motion/Reveal";
import SmartImage from "../motion/SmartImage";
import SplitText from "../motion/SplitText";

/** Bloc Bento : un halo lumineux suit le curseur et le fond s'éclaire au survol. */
function BentoCard({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className={className}>
      <div
        data-cursor
        className="group relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-colors duration-700 hover:border-white/25 hover:bg-white/[0.09] sm:p-9"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(244,232,225,0.16), transparent 60%)" }}
        />
        <div className="relative flex h-full flex-col">{children}</div>
      </div>
    </Reveal>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-creme/20 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-creme/70">
      {children}
    </span>
  );
}

export default function Formule() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const texY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const texScale = useTransform(scrollYProgress, [0, 1], [1.25, 1.05]);

  return (
    <section id="formule" ref={ref} className="grain relative overflow-hidden bg-prune py-28 text-creme sm:py-40">
      {/* Image 1 — texture soie, en fond très atténué */}
      <motion.div aria-hidden style={{ y: texY, scale: texScale }} className="pointer-events-none absolute inset-0">
        <SmartImage {...ASSETS.texture} alt="" className="h-full w-full object-cover opacity-[0.35] mix-blend-luminosity" />
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-prune/60 via-transparent to-prune-deep/80" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <Reveal as="p" className="mb-8 text-[10.5px] font-semibold uppercase tracking-[0.32em] text-poudre/60">
              02 — La Formule
            </Reveal>
            <SplitText
              className="font-serif text-[clamp(2.8rem,6.4vw,6.4rem)] leading-[0.92] tracking-[-0.03em]"
              lines={[["Trois ingrédients."], [{ text: "Une synergie.", className: "italic text-poudre" }]]}
            />
          </div>
          <Reveal as="p" delay={0.15} className="max-w-[44ch] text-[15.5px] leading-[1.8] text-creme/65 lg:justify-self-end">
            Apporter du fer ne suffit pas : encore faut-il que le corps l&apos;absorbe. Chaque ingrédient OnCycle a été
            choisi pour ce qu&apos;il apporte, et pour ce qu&apos;il permet aux deux autres d&apos;accomplir.
          </Reveal>
        </div>

        <div className="mt-16 grid auto-rows-[minmax(240px,auto)] gap-4 md:grid-cols-6 lg:mt-24">
          {/* Bloc 1 — Cacao */}
          <BentoCard className="md:col-span-6 md:row-span-2 lg:col-span-3">
            <div className="flex items-start justify-between">
              <Bean className="h-7 w-7 text-poudre" strokeWidth={1.2} />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-creme/45">Le socle</span>
            </div>
            <p className="mt-auto pt-16 font-serif text-[clamp(6rem,13vw,11rem)] leading-[0.85] tracking-[-0.04em] text-poudre">
              70<span className="align-top text-[0.4em]">%</span>
            </p>
            <h3 className="mt-10 font-serif text-[2.4rem] leading-none sm:text-[2.8rem]">Cacao Noir Grand Cru</h3>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.75] text-creme/65">
              Une fève issue du commerce équitable, naturellement concentrée en fer et en magnésium. Sa puissance
              aromatique porte toute la recette, sans excès de sucre : le plaisir reste intact, la fonction aussi.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Tag>Fer</Tag>
              <Tag>Magnésium</Tag>
              <Tag>Polyphénols</Tag>
            </div>
          </BentoCard>

          {/* Bloc 2 — Lentilles */}
          <BentoCard className="md:col-span-3" delay={0.1}>
            <div className="flex items-start justify-between">
              <Wheat className="h-7 w-7 text-poudre" strokeWidth={1.2} />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-creme/45">L&apos;innovation</span>
            </div>
            <h3 className="mt-10 font-serif text-[2.2rem] leading-none sm:text-[2.5rem]">Lentilles Torréfiées</h3>
            <p className="mt-4 text-[14.5px] leading-[1.75] text-creme/65">
              Notre seconde source de fer, plus des protéines et des fibres. Une torréfaction lente efface toute note
              végétale et révèle un goût de noisette grillée.
            </p>
            <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-creme/10 pt-6">
              <div>
                <dd className="font-serif text-4xl">24 g</dd>
                <dt className="text-[11.5px] text-creme/50">protéines / 100 g de farine</dt>
              </div>
              <div>
                <dd className="font-serif text-4xl">100 %</dd>
                <dt className="text-[11.5px] text-creme/50">lentilles origine France</dt>
              </div>
            </dl>
          </BentoCard>

          {/* Bloc 3 — Vitamine C */}
          <BentoCard className="md:col-span-3" delay={0.2}>
            <div className="flex items-start justify-between">
              <Cherry className="h-7 w-7 text-poudre" strokeWidth={1.2} />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-creme/45">Le multiplicateur</span>
            </div>
            <div className="mt-8 flex items-end gap-5">
              <p className="font-serif text-[6.5rem] leading-[0.8] tracking-[-0.04em] text-poudre">×3</p>
              <h3 className="pb-2 font-serif text-[2.2rem] leading-none sm:text-[2.5rem]">Vitamine C</h3>
            </div>
            <p className="mt-5 text-[14.5px] leading-[1.75] text-creme/65">
              Les framboises et le cassis apportent la vitamine C qui débloque l&apos;absorption du fer végétal :
              jusqu&apos;à 2 à 3 fois plus de fer assimilé selon les études*.
            </p>
            <p className="mt-auto border-t border-creme/10 pt-6 text-[12px] leading-relaxed text-creme/55">
              <span className="font-semibold text-poudre">Allégation EFSA autorisée :</span> « La vitamine C accroît
              l&apos;absorption du fer. » — Règl. (UE) 432/2012
            </p>
          </BentoCard>
        </div>

        <Reveal as="p" className="mt-8 max-w-3xl text-[10.5px] leading-relaxed text-creme/40">
          * Ordre de grandeur issu de la littérature sur le fer non héminique en présence d&apos;acide ascorbique (Lynch
          &amp; Cook, 1980 ; Hallberg et al., 1989). Seule la formulation entre guillemets constitue l&apos;allégation
          réglementaire.
        </Reveal>
      </div>
    </section>
  );
}
