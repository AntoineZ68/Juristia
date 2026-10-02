import { Check, Globe2, HandHeart, MapPin, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { Eyebrow, SectionTitle } from "./ui";

const claims = [
  {
    claim: "Source significative de Fer et de Magnésium",
    basis: "≥ 15 % des VNR pour 100 g — Annexe du Règl. (CE) 1924/2006",
  },
  {
    claim: "Contribue à réduire la fatigue et favorise un métabolisme énergétique normal",
    basis: "Allégations autorisées pour le fer et le magnésium — Règl. (UE) 432/2012",
  },
  {
    claim: "La vitamine C accroît l'absorption du fer",
    basis: "Allégation autorisée pour la vitamine C — Règl. (UE) 432/2012",
  },
];

const sourcing = [
  { icon: MapPin, title: "Lentilles vertes", origin: "France", text: "Légumineuses cultivées et torréfiées localement." },
  { icon: Globe2, title: "Framboises, myrtilles, cassis", origin: "Europe", text: "Fruits lyophilisés à basse température pour préserver la vitamine C." },
  { icon: HandHeart, title: "Cacao grand cru", origin: "Commerce équitable", text: "Fèves issues de filières certifiées, traçables jusqu'à la coopérative." },
];

export default function Transparence() {
  return (
    <section id="science" className="grain relative overflow-hidden bg-cacao py-28 text-creme sm:py-36">
      <div className="pointer-events-none absolute -left-40 top-20 h-[460px] w-[460px] rounded-full bg-grenat/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow tone="light">04 — Validations &amp; Transparence</Eyebrow>
          <SectionTitle>
            Des promesses <em className="text-poudre">encadrées</em>, pas du marketing.
          </SectionTitle>
          <p className="mt-6 max-w-xl leading-[1.75] text-creme/60">
            Chaque allégation de santé mise en avant par OnCycle s&apos;appuie sur le registre européen des allégations
            autorisées après évaluation scientifique de l&apos;EFSA.
          </p>
        </Reveal>

        <ol className="mt-16 divide-y divide-creme/10 border-y border-creme/10">
          {claims.map((c, i) => (
            <Reveal as="li" key={c.claim} delay={i * 80} className="grid gap-4 py-8 md:grid-cols-[80px_1fr_auto] md:items-center md:gap-8">
              <span className="font-serif text-2xl text-creme/30">0{i + 1}</span>
              <p className="font-serif text-[1.9rem] leading-[1.15] sm:text-4xl">« {c.claim} »</p>
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-ambre/40 bg-ambre/10 px-3 py-1.5 text-[11px] font-medium text-ambre-soft md:max-w-[260px] md:self-center">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-ambre" />
                {c.basis}
              </span>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-16 overflow-hidden rounded-[28px] border border-creme/10 bg-creme/[0.04] backdrop-blur">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-creme/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-poudre/60">Sourcing</p>
              <h3 className="mt-4 font-serif text-4xl leading-tight">Un circuit court, une traçabilité totale.</h3>
              <ul className="mt-8 space-y-3 text-sm text-creme/70">
                {["Sans additifs ni arômes artificiels", "Sans édulcorants", "100 % végétal"].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-grenat">
                      <Check className="h-3 w-3" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <ul className="grid divide-y divide-creme/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {sourcing.map(({ icon: Icon, title, origin, text }) => (
                <li key={title} className="p-8">
                  <Icon className="h-6 w-6 text-poudre" strokeWidth={1.4} />
                  <p className="mt-8 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ambre">{origin}</p>
                  <p className="mt-2 font-serif text-2xl leading-tight">{title}</p>
                  <p className="mt-3 text-[13.5px] leading-[1.7] text-creme/55">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
