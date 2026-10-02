"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import Reveal from "./Reveal";
import { Logo } from "./ui";

// Endpoint optionnel (Formspree, Tally, Brevo…). Sans lui, le formulaire reste en mode démo.
const ENDPOINT = process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT;

type Status = "idle" | "loading" | "success" | "error";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email, source: "batch-01" }),
        });
        if (!res.ok) throw new Error("request failed");
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="waitlist" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="relative overflow-hidden rounded-[32px] bg-grenat px-6 py-16 text-creme sm:px-14 sm:py-24">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-creme/10" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-creme/15" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-grenat-deep blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-creme/25 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em]">
              Pré-lancement · Batch #01
            </span>
            <h2 className="mt-8 font-serif text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl">
              Soyez parmi les <em>100 premières</em> à tester le premier batch OnCycle.
            </h2>
            <p className="mx-auto mt-6 max-w-lg leading-[1.75] text-creme/70">
              Accès prioritaire aux 4 recettes, tarif fondatrice et participation aux tests de dégustation.
            </p>

            {status === "success" ? (
              <div className="mx-auto mt-10 flex max-w-lg items-center justify-center gap-3 rounded-full bg-creme px-6 py-4 text-cacao" role="status">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-grenat text-creme">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold">Bienvenue dans le batch #01. Nous revenons vers vous très vite.</span>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mx-auto mt-10 max-w-lg">
                <div className="flex flex-col gap-2 rounded-[28px] bg-creme p-2 sm:flex-row sm:rounded-full">
                  <label htmlFor="email" className="sr-only">
                    Adresse email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    aria-invalid={status === "error"}
                    className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3.5 text-[15px] text-cacao placeholder:text-cacao/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-cacao px-6 py-3.5 text-sm font-semibold text-creme transition-colors hover:bg-black disabled:opacity-70"
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Rejoindre le batch #01
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
                <p className={`mt-4 text-xs ${status === "error" ? "text-poudre" : "text-creme/55"}`} aria-live="polite">
                  {status === "error"
                    ? "Merci de saisir une adresse email valide."
                    : "Aucun spam. Votre email sert uniquement à vous informer du lancement."}
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-stone-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <a href="#top" className="text-5xl">
            <Logo />
          </a>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cacao/55">
            Le chocolat noir fonctionnel pensé pour le cycle féminin.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-cacao/55 md:items-end">
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#constat" className="hover:text-cacao">Le Constat</a>
            <a href="#synergie" className="hover:text-cacao">La Synergie</a>
            <a href="#gamme" className="hover:text-cacao">La Gamme</a>
            <a href="#science" className="hover:text-cacao">La Science</a>
          </nav>
          <p className="max-w-md text-xs leading-relaxed md:text-right">
            Confidentialité : vos données sont utilisées uniquement pour vous informer du lancement OnCycle et ne sont
            jamais revendues. Désinscription possible à tout moment (RGPD).
          </p>
        </div>
      </div>
      <div className="border-t border-stone-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-[11px] text-cacao/40 sm:flex-row sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} OnCycle. Tous droits réservés.</span>
          <span>Projet conçu dans le cadre du Programme PCE</span>
          <span>Ce produit ne se substitue pas à une alimentation variée et équilibrée.</span>
        </div>
      </div>
    </footer>
  );
}
