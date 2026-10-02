import { BatteryLow, Cookie } from "lucide-react";
import Reveal from "./Reveal";
import { Eyebrow, SectionTitle } from "./ui";

export default function Constat() {
  return (
    <section id="constat" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <Eyebrow>01 — Le Constat Biologique</Eyebrow>
            <SectionTitle>
              Pourquoi votre corps réclame du <em className="text-grenat">réconfort</em> pendant vos règles.
            </SectionTitle>
          </div>
          <p className="max-w-md text-[16px] leading-[1.75] text-cacao/65 lg:justify-self-end">
            Les envies de chocolat ne sont pas un manque de volonté. Elles traduisent des besoins physiologiques
            réels, amplifiés à chaque cycle.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {/* Carte 1 — sombre */}
          <Reveal className="grain relative overflow-hidden rounded-[28px] bg-cacao p-8 text-creme sm:p-12">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-grenat/40 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-creme/15 bg-creme/5">
                  <BatteryLow className="h-5 w-5 text-poudre" strokeWidth={1.5} />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-poudre/50">Phase menstruelle</span>
              </div>
              <h3 className="mt-14 font-serif text-4xl leading-tight sm:text-[2.75rem]">La chute des réserves en fer</h3>
              <p className="mt-5 max-w-md leading-[1.75] text-creme/70">
                Chaque mois, la perte sanguine entraîne une baisse de fer, alimentant fatigue intense, sensation
                d&apos;épuisement et crampes musculaires.
              </p>
              <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-creme/10 pt-8">
                <div>
                  <dt className="text-xs text-creme/50">Fer perdu par cycle¹</dt>
                  <dd className="mt-1 font-serif text-5xl">≈ 15 <span className="font-sans text-base">mg</span></dd>
                </div>
                <div>
                  <dt className="text-xs text-creme/50">Femmes 15–49 ans anémiées²</dt>
                  <dd className="mt-1 font-serif text-5xl">30 <span className="font-sans text-base">%</span></dd>
                </div>
              </dl>
            </div>
          </Reveal>

          {/* Carte 2 — poudrée */}
          <Reveal delay={120} className="relative overflow-hidden rounded-[28px] border border-grenat/10 bg-poudre p-8 sm:p-12">
            <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-white/60 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-grenat/15 bg-white/60">
                  <Cookie className="h-5 w-5 text-grenat" strokeWidth={1.5} />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-grenat/60">Phase lutéale</span>
              </div>
              <h3 className="mt-14 font-serif text-4xl leading-tight sm:text-[2.75rem]">Le craving sucré légitime</h3>
              <p className="mt-5 max-w-md leading-[1.75] text-cacao/70">
                Le corps recherche instinctivement des calories rapides et du magnésium pour apaiser les tensions.
              </p>
              <ul className="mt-12 space-y-3 border-t border-grenat/15 pt-8 text-sm">
                {["Hausse des dépenses énergétiques en phase lutéale", "Besoin accru de magnésium", "Recherche de plaisir & de réconfort"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-grenat" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-20 max-w-4xl text-center">
          <p className="font-serif text-3xl leading-[1.2] sm:text-[2.6rem]">
            « Ne luttez plus contre votre faim : transformez une envie naturelle en{" "}
            <em className="text-grenat">geste santé</em> cliniquement sensé. »
          </p>
          <p className="mt-8 text-[11px] text-cacao/40">
            ¹ Perte sanguine moyenne de 30 à 40 mL par cycle, soit environ 0,45 mg de fer par mL. ² OMS, Global Health
            Observatory, 2019 (29,9 % des femmes de 15 à 49 ans).
          </p>
        </Reveal>
      </div>
    </section>
  );
}
