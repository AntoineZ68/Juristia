"use client";

import { useState } from "react";
import { Bean, Cherry, Plus, Wheat } from "lucide-react";
import Reveal from "./Reveal";
import { Eyebrow, SectionTitle } from "./ui";

const pillars = [
  {
    id: "cacao",
    n: "01",
    icon: Bean,
    name: "Cacao Noir Intense",
    short: "Cacao noir",
    tag: "70 % et plus",
    role: "La base nutritive",
    text: "Naturellement concentré en fer et en magnésium. Le magnésium contribue à une fonction musculaire normale et à réduire la fatigue — un soutien précieux quand les crampes s'installent.",
    facts: [
      ["Fer", "≈ 11 mg / 100 g"],
      ["Magnésium", "≈ 220 mg / 100 g"],
    ],
    color: "#221510",
  },
  {
    id: "lentille",
    n: "02",
    icon: Wheat,
    name: "Farine de Lentilles Torréfiée",
    short: "Lentilles",
    tag: "Origine France",
    role: "La seconde source de fer",
    text: "Fer végétal, fibres et protéines. Sublimée par une torréfaction précise qui délivre des notes de noisette grillée, sans aucune amertume végétale.",
    facts: [
      ["Protéines", "≈ 24 g / 100 g"],
      ["Fibres", "≈ 11 g / 100 g"],
    ],
    color: "#8a6440",
  },
  {
    id: "vitc",
    n: "03",
    icon: Cherry,
    name: "Vitamine C Active",
    short: "Vitamine C",
    tag: "Fruits rouges",
    role: "Le catalyseur d'absorption",
    text: "Le fer végétal (non héminique) est naturellement peu absorbé. La vitamine C lève ce frein : c'est l'allégation officielle autorisée par l'EFSA — « La vitamine C accroît l'absorption du fer ».",
    facts: [
      ["Allégation EFSA", "Règl. (UE) 432/2012"],
      ["Absorption du fer", "x2 à x3*"],
    ],
    color: "#832232",
  },
];

export default function Synergie() {
  const [active, setActive] = useState(2);
  const p = pillars[active];

  return (
    <section id="synergie" className="relative overflow-hidden bg-white py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>02 — La Synergie OnCycle</Eyebrow>
          <SectionTitle>
            Une formule pensée <em className="text-grenat">ingrédient par ingrédient.</em>
          </SectionTitle>
          <p className="mt-6 max-w-xl leading-[1.75] text-cacao/65">
            Trois ingrédients, une seule logique : apporter le fer, puis s&apos;assurer que le corps l&apos;absorbe
            réellement. Sélectionnez un pilier pour explorer son rôle.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Diagramme */}
          <Reveal className="relative mx-auto aspect-square w-full max-w-[480px]">
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
              <circle cx="200" cy="200" r="190" fill="none" stroke="#e7e5e4" strokeDasharray="2 6" />
              {[
                [200, 80],
                [96, 260],
                [304, 260],
              ].map(([x, y], i) => (
                <line
                  key={i}
                  x1="200"
                  y1="200"
                  x2={x}
                  y2={y}
                  stroke={i === active ? pillars[i].color : "#d6d3d1"}
                  strokeWidth={i === active ? 1.6 : 1}
                  style={{ transition: "all .5s" }}
                />
              ))}
              <path d="M200 80 L96 260 L304 260 Z" fill="none" stroke="#e7e5e4" />
            </svg>

            {/* noyau */}
            <div className="absolute left-1/2 top-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-cacao text-center text-creme shadow-lift">
              <span className="font-serif text-xl leading-none sm:text-2xl">
                OnCycle<span className="text-grenat">.</span>
              </span>
              <span className="mt-1 text-[8.5px] uppercase tracking-[0.2em] text-creme/50 sm:text-[9.5px]">Synergie</span>
            </div>

            {pillars.map((pl, i) => {
              const pos = [
                "left-1/2 top-[20%]",
                "left-[24%] top-[65%]",
                "left-[76%] top-[65%]",
              ][i];
              const Icon = pl.icon;
              const isActive = i === active;
              return (
                <button
                  key={pl.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  aria-label={pl.name}
                  className={`absolute ${pos} flex h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border transition-all duration-500 ${
                    isActive ? "scale-110 border-transparent text-creme shadow-lift" : "border-stone-200 bg-creme text-cacao hover:border-cacao/30"
                  }`}
                  style={isActive ? { background: pl.color } : undefined}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
                  <span className="mt-1 text-[10px] font-semibold">{pl.n}</span>
                </button>
              );
            })}

            <Plus className="absolute left-[38%] top-[40%] h-3 w-3 text-cacao/25" />
            <Plus className="absolute right-[38%] top-[40%] h-3 w-3 text-cacao/25" />
          </Reveal>

          {/* Détail */}
          <div>
            <div role="tablist" aria-label="Piliers de la formule" className="grid grid-cols-3 gap-2">
              {pillars.map((pl, i) => (
                <button
                  key={pl.id}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={`rounded-2xl border px-3 py-3 text-left transition-all sm:px-4 ${
                    i === active ? "border-cacao bg-cacao text-creme" : "border-stone-200 hover:border-cacao/30"
                  }`}
                >
                  <span className="block text-[10px] font-semibold opacity-60">{pl.n}</span>
                  <span className="mt-1 block text-[12.5px] font-semibold leading-tight sm:text-sm">{pl.short}</span>
                </button>
              ))}
            </div>

            <div key={p.id} role="tabpanel" className="mt-6 rounded-[28px] border border-stone-200 bg-creme p-8 sm:p-10" style={{ animation: "fadeUp .6s cubic-bezier(.2,.7,.2,1)" }}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-creme" style={{ background: p.color }}>
                  {p.role}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cacao/45">{p.tag}</span>
              </div>
              <h3 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">{p.name}</h3>
              <p className="mt-5 leading-[1.8] text-cacao/70">{p.text}</p>
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200">
                {p.facts.map(([k, v]) => (
                  <div key={k} className="bg-white px-5 py-4">
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-cacao/45">{k}</dt>
                    <dd className="mt-1 font-serif text-2xl">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="mt-5 text-[11px] leading-relaxed text-cacao/40">
              * Ordre de grandeur issu de la littérature scientifique sur l&apos;absorption du fer non héminique en
              présence d&apos;acide ascorbique (Lynch &amp; Cook, 1980 ; Hallberg et al., 1989). Seule la formulation
              « La vitamine C accroît l&apos;absorption du fer » constitue l&apos;allégation réglementaire autorisée.
              Valeurs ingrédients indicatives (tables Ciqual/USDA).
            </p>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}
