"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { EASE } from "@/lib/motion";
import Reveal from "../motion/Reveal";

// Endpoint optionnel (Formspree, Tally, Brevo…). Sans lui, le formulaire reste en mode démo.
const ENDPOINT = process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT;

type Status = "idle" | "loading" | "success" | "error";

function Signup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus("error");
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
          <label htmlFor="email" className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-creme/50">
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
              placeholder="prenom@email.com"
              className="peer w-full border-b border-creme/25 bg-transparent pb-4 pt-2 font-serif text-[clamp(1.6rem,3vw,2.4rem)] text-creme outline-none transition-[border-width] duration-300 placeholder:text-creme/25 focus:border-b-2 focus:border-creme"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              aria-label="Rejoindre la liste"
              className="mb-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-creme/30 transition-colors duration-500 hover:bg-creme hover:text-cacao disabled:opacity-60"
            >
              {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
            </button>
          </div>
          <p className={`mt-4 text-[12px] ${status === "error" ? "text-[#f08ca0]" : "text-creme/40"}`} aria-live="polite">
            {status === "error"
              ? "Merci de saisir une adresse email valide."
              : "Accès prioritaire aux 100 premières tablettes. Aucun spam, désinscription en un clic."}
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
    <footer id="rejoindre" ref={ref} className="grain relative overflow-hidden bg-cacao text-creme">
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

      <div className="mx-auto mt-10 flex max-w-[1400px] flex-col gap-4 border-t border-creme/10 px-5 py-8 text-[11px] uppercase tracking-[0.18em] text-creme/45 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <span>© {new Date().getFullYear()} OnCycle.</span>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <a href="#" className="transition-colors hover:text-creme">Mentions légales</a>
          <a href="#" className="transition-colors hover:text-creme">Confidentialité</a>
          {socials.map((s) => (
            <a key={s} href="#" className="transition-colors hover:text-creme">
              {s}
            </a>
          ))}
        </nav>
        <span>Projet conçu dans le cadre du Programme PCE</span>
      </div>
      <p className="mx-auto max-w-[1400px] px-5 pb-8 text-[10.5px] leading-relaxed text-creme/30 sm:px-8">
        Vos données servent uniquement à vous informer du lancement et ne sont jamais revendues (RGPD). Ce produit ne se
        substitue pas à une alimentation variée et équilibrée ni à un avis médical.
      </p>
    </footer>
  );
}
