import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { LEGAL } from "@/lib/legal";
import LegalLinks from "./LegalLinks";

/** Gabarit sobre des pages légales : même identité que le site, sans animations. */
export default function LegalPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <>
      <header className="border-b border-cacao/10">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:h-20 sm:px-8">
          <a href="/" className="font-serif text-[1.7rem] leading-none tracking-[-0.02em]">
            OnCycle<span className="text-framboise">.</span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-cacao/30 px-5 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 hover:bg-cacao hover:text-creme"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Retour au site
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.32em] text-framboise">{eyebrow}</p>
        <h1 className="mt-6 font-serif text-[clamp(2.6rem,6vw,4.4rem)] leading-[1] tracking-[-0.03em]">{title}</h1>
        <p className="mt-6 text-[13px] text-cacao/70">Dernière mise à jour : {LEGAL.miseAJour}</p>
        {intro && <div className="mt-10 text-[17px] leading-[1.75] text-cacao/85">{intro}</div>}
        <div className="legal-prose mt-12">{children}</div>
      </main>

      <footer className="on-dark bg-cacao text-creme">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-8 text-[11px] uppercase tracking-[0.18em] text-creme/70 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <span>© {new Date().getFullYear()} OnCycle.</span>
          <LegalLinks className="flex flex-wrap gap-x-6 gap-y-2" linkClassName="transition-colors hover:text-creme" />
          <span>Projet conçu dans le cadre du Programme PCE</span>
        </div>
      </footer>
    </>
  );
}
