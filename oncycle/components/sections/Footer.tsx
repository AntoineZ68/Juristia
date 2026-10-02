"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { EASE } from "@/lib/motion";
import LegalLinks from "../legal/LegalLinks";
import Reveal from "../motion/Reveal";

// Endpoint optionnel (Formspree, Tally, Brevo…). Sans lui, le formulaire reste en mode démo.
const ENDPOINT = process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT;

type Status = "idle" | "loading" | "success" | "error" | "consent";

function Signup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consent) return setStatus("consent");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus("error");
    setStatus("loading");
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email, source: "batch-01", consentement: "oui" }),
        });
        if (!res.ok) throw new Error("request failed");
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.p
          key="ok"
          role="status"
          className="flex items-center gap-4 font-serif text-[1.9rem] leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-framboise">
            <Check className="h-4 w-4" />
          </span>
          Bienvenue dans le cycle. Votre place pour le batch #01 est réservée.
        </motion.p>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          exit={{ opacity: 0, y: -20, transition: { duration: 0.5, ease: EASE } }}
        >
          <label htmlFor="email" className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-creme/70">
            Votre adresse email
          </label>
          <div className="group relative mt-3 flex items-end gap-4">
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              aria-invalid={status === "error"}
              aria-describedby="email-help"
              placeholder="prenom@email.com"
              className="peer w-full border-b border-creme/40 bg-transparent pb-4 pt-2 font-serif text-[clamp(1.6rem,3vw,2.4rem)] text-creme outline-none transition-[border-width] duration-300 placeholder:text-creme/40 focus:border-b-2 focus:border-creme"
            />
            <button
              type="submit"
              disabled={!consent || status === "loading"}
              aria-label="Rejoindre le batch #01"
              title={consent ? "Rejoindre le batch #01" : "Cochez la case de consentement pour continuer"}
              className="mb-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-creme/50 transition-colors duration-500 enabled:hover:bg-creme enabled:hover:text-cacao disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
            </button>
          </div>
          <div className="mt-6 flex items-start gap-3">
            <span className="relative mt-0.5 flex h-5 w-5 shrink-0">
              <input
                id="consent"
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (status === "consent") setStatus("idle");
                }}
                aria-invalid={status === "consent"}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-[5px] border border-creme/60 bg-transparent transition-colors checked:border-creme checked:bg-creme"
              />
              <Check
                aria-hidden
                strokeWidth={3}
                className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 text-cacao opacity-0 peer-checked:opacity-100"
              />
            </span>
            <label htmlFor="consent" className="cursor-pointer text-[13px] leading-relaxed text-creme/80">
              J&apos;accepte de recevoir des informations sur le lancement d&apos;OnCycle et que mon e-mail soit conservé
              à cette fin.{" "}
              <a href="/confidentialite/" className="text-creme underline decoration-creme/50 underline-offset-4 hover:decoration-creme">
                En savoir plus
              </a>
            </label>
          </div>
          <p id="email-help" className={`mt-4 text-[12px] leading-relaxed ${status === "error" || status === "consent" ? "text-[#f5a3b3]" : "text-creme/70"}`} aria-live="polite">
            {status === "consent"
              ? "Merci de cocher la case de consentement pour rejoindre la liste."
              : status === "error"
              ? "Merci de saisir une adresse email valide. Si le problème persiste, réessayez dans quelques instants."
              : "Votre e-mail sert uniquement à vous informer du lancement d'OnCycle et du batch #01. Il n'est jamais revendu, et vous pouvez retirer votre consentement à tout moment."}
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

const socials = ["Instagram", "TikTok", "LinkedIn"];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-8%", "0%"]);

  return (
    <footer id="rejoindre" ref={ref} className="on-dark grain relative overflow-hidden bg-cacao text-creme">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 pb-10 pt-28 sm:px-8 sm:pt-40 lg:grid-cols-2">
        <div>
          <Reveal as="p" className="text-[10.5px] font-semibold uppercase tracking-[0.32em] text-poudre/60">
            04 — Pré-lancement · Batch #01
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-8 max-w-[24ch] font-serif text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]">
            Soyez parmi les <em className="text-poudre">100 premières</em> à goûter OnCycle.
          </Reveal>
        </div>
        <Reveal delay={0.2} className="self-end">
          <Signup />
        </Reveal>
      </div>

      {/* Signature massive */}
      <div className="overflow-hidden">
        <motion.p
          style={{ x }}
          aria-label="Rejoignez le cycle."
          className="select-none whitespace-nowrap px-3 pb-[0.12em] font-serif text-[12.6vw] leading-[0.95] tracking-[-0.04em]"
        >
          Rejoignez le <em className="text-framboise">cycle.</em>
        </motion.p>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1400px] flex-col gap-4 border-t border-creme/10 px-5 py-8 text-[11px] uppercase tracking-[0.18em] text-creme/70 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <span>© {new Date().getFullYear()} OnCycle.</span>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <LegalLinks className="contents" linkClassName="transition-colors hover:text-creme" />
          {socials.map((s) => (
            <span key={s} className="text-creme/50" title="Bientôt disponible">
              {s}
            </span>
          ))}
        </div>
        <span>Projet conçu dans le cadre du Programme PCE</span>
      </div>
      <p className="mx-auto max-w-[1400px] px-5 pb-8 text-[11px] leading-relaxed text-creme/60 sm:px-8">
        Vos données servent uniquement à vous informer du lancement et ne sont jamais revendues (RGPD). Ce produit ne se
        substitue pas à une alimentation variée et équilibrée ni à un avis médical.
      </p>
    </footer>
  );
}
