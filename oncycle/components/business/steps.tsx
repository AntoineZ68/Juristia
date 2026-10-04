"use client";

import { useEffect, useState, type ReactNode } from "react";
import { animate, motion } from "framer-motion";
import { Check, Store, X } from "lucide-react";
import { EASE } from "@/lib/motion";

/* ───────────── Données du business model (une seule source de vérité) ───────────── */
const PRICE = 7.9; // € la tablette de 80 g
const UNIT_COST = 2.5; // € coût de revient unitaire estimé
const MARGIN = (PRICE - UNIT_COST) / PRICE; // marge brute ≈ 68 %

/* ───────────── Briques communes ───────────── */
function Item({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } } }}
    >
      {children}
    </motion.div>
  );
}

function StepLayout({
  eyebrow,
  title,
  intro,
  after,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  after?: ReactNode;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } } }}
      className="grid w-full gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16"
    >
      <div>
        <Item>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-poudre/70">{eyebrow}</p>
        </Item>
        <Item>
          <h2 className="mt-6 font-serif text-[clamp(2.4rem,5.2vw,5rem)] leading-[0.98] tracking-[-0.03em]">{title}</h2>
        </Item>
        <Item>
          <p className="mt-6 max-w-[46ch] text-[clamp(1rem,1.45vw,1.2rem)] leading-[1.7] text-creme/80">{intro}</p>
        </Item>
        {after && <Item className="mt-8">{after}</Item>}
      </div>
      <Item className="w-full">{children}</Item>
    </motion.div>
  );
}

function CountUp({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: ReactNode; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.35, onUpdate: setV });
    return () => c.stop();
  }, [to]);
  const txt = v.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <>
      {prefix}
      {txt}
      {suffix}
    </>
  );
}

const em = (t: string) => <em className="text-poudre">{t}</em>;

/* ───────────── 01 — Marché & cible ───────────── */
export function StepMarche() {
  return (
    <StepLayout
      eyebrow="01 — Marché & cible"
      title={<>Deux marchés. {em("Une cible.")}</>}
      intro="Avoir un bon produit, c'est bien. Mais pour que ce soit un vrai projet d'entreprise, il faut un business model solide. OnCycle se positionne à la croisée de la FoodTech et de la FemTech, deux marchés en forte croissance."
    >
      <div className="mx-auto w-full max-w-[580px]">
        <div className="relative mx-auto aspect-[1.5/1] w-full">
          <div className="absolute left-0 top-1/2 aspect-square h-[90%] -translate-y-1/2 rounded-full border border-creme/35 bg-framboise/30" />
          <div className="absolute right-0 top-1/2 aspect-square h-[90%] -translate-y-1/2 rounded-full border border-creme/35 bg-poudre/[0.12]" />
          <span className="absolute left-[20%] top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[clamp(1.1rem,2.4vw,1.9rem)]">FoodTech</span>
          <span className="absolute left-[80%] top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[clamp(1.1rem,2.4vw,1.9rem)]">FemTech</span>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cacao px-4 py-2 font-serif text-[clamp(1rem,2vw,1.5rem)] shadow-lift">
            OnCycle<span className="text-framboise">.</span>
          </span>
        </div>

        <div className="mt-6 flex items-center gap-5 rounded-[24px] border border-creme/15 bg-creme/[0.05] p-5 sm:gap-6 sm:p-6">
          <p className="shrink-0 whitespace-nowrap font-serif text-[clamp(2.4rem,4.4vw,3.6rem)] leading-none text-poudre">
            18–35<span className="ml-1 font-sans text-base text-creme/70">ans</span>
          </p>
          <p className="text-[clamp(0.9rem,1.2vw,1.05rem)] leading-[1.6] text-creme/80">
            Des femmes qui achètent déjà des <strong className="font-semibold text-creme">produits premium</strong> et qui veulent du{" "}
            <strong className="font-semibold text-creme">sens</strong> dans leur consommation.
          </p>
        </div>
      </div>
    </StepLayout>
  );
}

/* ───────────── 02 — Pricing ───────────── */
export function StepPricing() {
  const marginPct = Math.round(MARGIN * 100);
  return (
    <StepLayout
      eyebrow="02 — Pricing"
      title={<>Haut de gamme, {em("assumé.")}</>}
      intro="Un positionnement haut de gamme, justifié par la qualité du sourcing et par le coût élevé de la lyophilisation. Une marge brute qui finance notre acquisition client."
      after={
        <ul className="flex flex-wrap gap-2">
          {["Cacao grand cru équitable", "Lentilles origine France", "Lyophilisation (coût élevé)"].map((t) => (
            <li key={t} className="rounded-full border border-creme/25 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-creme/80">
              {t}
            </li>
          ))}
        </ul>
      }
    >
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-creme/15 bg-creme/[0.05] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-creme/60">Prix de vente · 80 g</p>
            <p className="mt-4 whitespace-nowrap font-serif text-[clamp(2.1rem,3.4vw,3.1rem)] leading-none text-poudre">
              <CountUp to={PRICE} decimals={2} suffix=" €" />
            </p>
          </div>
          <div className="rounded-[24px] border border-creme/15 bg-creme/[0.05] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-creme/60">Coût de revient estimé</p>
            <p className="mt-4 whitespace-nowrap font-serif text-[clamp(2.1rem,3.4vw,3.1rem)] leading-none">
              <CountUp to={UNIT_COST} decimals={2} prefix={<span className="mr-1.5 align-[0.35em] text-[0.42em] text-creme/70">≈</span>} suffix=" €" />
            </p>
          </div>
          <div className="rounded-[24px] bg-framboise p-5 shadow-lift">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-creme/80">Marge brute</p>
            <p className="mt-4 whitespace-nowrap font-serif text-[clamp(2.1rem,3.4vw,3.1rem)] leading-none">
              <CountUp to={marginPct} prefix={<span className="mr-1.5 align-[0.35em] text-[0.42em] text-creme/70">≈</span>} suffix=" %" />
            </p>
          </div>
        </div>

        <div className="rounded-[24px] border border-creme/15 bg-creme/[0.05] p-6">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-creme/60">Où va chaque tablette vendue</p>
          <div className="flex h-4 overflow-hidden rounded-full bg-creme/10">
            <motion.div
              className="h-full bg-creme/45"
              initial={{ width: 0 }}
              animate={{ width: `${(UNIT_COST / PRICE) * 100}%` }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
            />
            <motion.div
              className="h-full bg-framboise"
              initial={{ width: 0 }}
              animate={{ width: `${MARGIN * 100}%` }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.7 }}
            />
          </div>
          <div className="mt-3 flex justify-between text-[12px] text-creme/70">
            <span>Coût de revient · ≈ {UNIT_COST.toFixed(2).replace(".", ",")} €</span>
            <span>Marge brute · ≈ {(PRICE - UNIT_COST).toFixed(2).replace(".", ",")} €</span>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}

/* ───────────── 03 — Go-to-market ───────────── */
export function StepGTM() {
  return (
    <StepLayout
      eyebrow="03 — Go-to-market"
      title={<>D'abord le digital. {em("Ensuite, la sélection.")}</>}
      intro="Un lancement en deux temps. Nous ne voulons surtout pas être noyés dans le rayon confiserie d'un supermarché : OnCycle n'est pas une confiserie, c'est un produit de bien-être."
      after={
        <p className="inline-flex items-center gap-3 rounded-full border border-creme/25 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-creme/80">
          <X className="h-4 w-4 text-framboise" aria-hidden />
          Pas de rayon confiserie de supermarché
        </p>
      }
    >
      <div className="relative grid gap-4">
        <div aria-hidden className="absolute bottom-10 left-[34px] top-10 hidden w-px bg-gradient-to-b from-framboise to-creme/20 sm:block" />

        <div className="relative rounded-[24px] border border-creme/20 bg-creme/[0.06] p-6 sm:pl-[84px]">
          <span className="absolute left-5 top-6 hidden h-8 w-8 items-center justify-center rounded-full bg-framboise font-serif text-lg sm:flex">1</span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-poudre/80">Phase 1 · Lancement</p>
          <h3 className="mt-2 font-serif text-[clamp(1.7rem,2.6vw,2.4rem)] leading-tight">100 % digital, en Direct-to-Consumer</h3>
          <ul className="mt-4 space-y-2 text-[clamp(0.9rem,1.2vw,1.05rem)] text-creme/80">
            {["Notre site web comme canal de vente", "Capter la marge maximale", "Récolter de la data sur nos premières clientes pour affiner le marketing"].map((t) => (
              <li key={t} className="flex gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-framboise" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-[24px] border border-creme/15 bg-creme/[0.03] p-6 sm:pl-[84px]">
          <span className="absolute left-5 top-6 hidden h-8 w-8 items-center justify-center rounded-full border border-creme/40 font-serif text-lg sm:flex">2</span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-creme/60">Phase 2 · Extension</p>
          <h3 className="mt-2 font-serif text-[clamp(1.7rem,2.6vw,2.4rem)] leading-tight">Distribution physique très sélective</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {["Concept stores", "Pharmacies orientées bien-être naturel", "Épiceries fines"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2 rounded-full border border-creme/25 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-creme/85">
                <Store className="h-3.5 w-3.5 text-poudre" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StepLayout>
  );
}

/* ───────────── 04 — Concurrence & moat ───────────── */
function MapPoint({ x, y, label, sub, hero = false, above = false }: { x: number; y: number; label: string; sub?: string; hero?: boolean; above?: boolean }) {
  return (
    <>
      <span className="absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center" style={{ left: `${x}%`, top: `${y}%` }}>
        {hero && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-framboise/60" />}
        <span className={`relative inline-flex rounded-full ${hero ? "h-5 w-5 bg-framboise" : "h-3.5 w-3.5 border border-creme/60 bg-cacao"}`} />
      </span>
      <span
        className={`absolute flex -translate-x-1/2 flex-col items-center whitespace-nowrap text-center ${above ? "-translate-y-full pb-4" : "pt-4"}`}
        style={{ left: `${x}%`, top: `${y}%` }}
      >
        <span className={`font-serif leading-tight ${hero ? "text-[clamp(1.3rem,2.4vw,1.9rem)]" : "text-[clamp(0.95rem,1.5vw,1.2rem)] text-creme/90"}`}>{label}</span>
        {sub && <span className="mt-0.5 text-[11px] text-creme/60">{sub}</span>}
      </span>
    </>
  );
}

export function StepConcurrence() {
  return (
    <StepLayout
      eyebrow="04 — Concurrence"
      title={<>Entre le complément {em("et le chocolat.")}</>}
      intro="Notre concurrence est indirecte : d'un côté les géants du complément alimentaire comme Cuure ou Nutri&Co, de l'autre les chocolatiers."
      after={
        <div className="rounded-[24px] bg-framboise p-6 shadow-lift sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-creme/80">Notre avantage concurrentiel · le « moat »</p>
          <p className="mt-3 font-serif text-[clamp(1.35rem,2.2vw,1.9rem)] leading-[1.2]">
            Les seuls à fusionner l&apos;efficacité de l&apos;un avec le plaisir de l&apos;autre, appuyés sur des données scientifiques solides sur l&apos;absorption du fer.
          </p>
        </div>
      }
    >
      <div className="mx-auto w-full max-w-[560px]">
        <div className="relative aspect-square w-full rounded-[28px] border border-creme/15 bg-creme/[0.03]">
          <span aria-hidden className="absolute bottom-5 left-1/2 top-5 w-px bg-creme/15" />
          <span aria-hidden className="absolute left-5 right-5 top-1/2 h-px bg-creme/15" />
          <span className="absolute left-5 top-4 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-creme/60">↑ Efficacité nutritionnelle</span>
          <span className="absolute bottom-4 right-5 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-creme/60">Plaisir →</span>

          <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <line x1="28" y1="30" x2="72" y2="30" stroke="#F4E8E1" strokeOpacity=".4" strokeWidth=".35" strokeDasharray="1.6 1.6" />
            <line x1="76" y1="72" x2="76" y2="34" stroke="#F4E8E1" strokeOpacity=".4" strokeWidth=".35" strokeDasharray="1.6 1.6" />
          </svg>

          <MapPoint x={24} y={30} label="Compléments" sub="Cuure, Nutri&Co" />
          <MapPoint x={76} y={76} label="Chocolatiers" />
          <MapPoint x={76} y={30} label="OnCycle." sub="Efficacité + plaisir" hero above />
        </div>
        <p className="mt-3 text-center text-[11px] text-creme/55">Représentation qualitative des positionnements.</p>
      </div>
    </StepLayout>
  );
}
