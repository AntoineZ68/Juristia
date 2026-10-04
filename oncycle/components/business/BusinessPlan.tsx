"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { EASE } from "@/lib/motion";
import { StepConcurrence, StepGTM, StepMarche, StepPricing } from "./steps";

const steps = [
  { id: "marche", label: "Marché & cible", Component: StepMarche },
  { id: "pricing", label: "Pricing", Component: StepPricing },
  { id: "gtm", label: "Go-to-market", Component: StepGTM },
  { id: "concurrence", label: "Concurrence", Component: StepConcurrence },
];
const LAST = steps.length - 1;

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 70 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -70, transition: { duration: 0.4, ease: EASE } }),
};

export default function BusinessPlan({ onClose }: { onClose: () => void }) {
  const [nav, setNav] = useState({ step: 0, dir: 1 });
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = useCallback((target: number) => {
    setNav((n) => {
      const t = Math.max(0, Math.min(LAST, target));
      return t === n.step ? n : { step: t, dir: t > n.step ? 1 : -1 };
    });
  }, []);
  const next = useCallback(() => setNav((n) => (n.step >= LAST ? n : { step: n.step + 1, dir: 1 })), []);
  const prev = useCallback(() => setNav((n) => (n.step <= 0 ? n : { step: n.step - 1, dir: -1 })), []);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (/^[1-4]$/.test(e.key)) {
        go(Number(e.key) - 1);
      } else if (e.key === "Tab" && rootRef.current) {
        // piège à focus : le clavier reste dans le panneau
        const f = Array.from(rootRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled])'));
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        const active = document.activeElement;
        if (!rootRef.current.contains(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, next, prev, onClose]);

  const { Component } = steps[nav.step];

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Business model OnCycle"
      className="on-dark grain fixed inset-0 z-[150] flex flex-col overflow-hidden bg-cacao text-creme"
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={{ clipPath: "inset(0% 0 0 0)", transition: { duration: 0.9, ease: EASE } }}
      exit={{ clipPath: "inset(100% 0 0 0)", transition: { duration: 0.7, ease: EASE } }}
    >
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-framboise/35 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-52 -left-32 h-[460px] w-[460px] rounded-full bg-prune blur-[110px]" />

      {/* En-tête */}
      <header className="relative z-10 flex h-16 shrink-0 items-center justify-between px-5 sm:h-20 sm:px-8 short:h-14 sm:short:h-14">
        <div className="flex items-baseline gap-4">
          <span className="font-serif text-[1.6rem] leading-none tracking-[-0.02em]">
            OnCycle<span className="text-framboise">.</span>
          </span>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.3em] text-creme/60 sm:inline">Business model</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[12px] font-semibold tracking-[0.2em] text-creme/70" aria-live="polite">
            {String(nav.step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-creme/40 px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 hover:bg-creme hover:text-cacao"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Fermer
          </button>
        </div>
      </header>

      {/* Étape */}
      <div data-lenis-prevent className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8">
        <div className="mx-auto flex min-h-full max-w-[1400px] items-center py-6 short:py-2">
          <AnimatePresence mode="wait" custom={nav.dir} initial={false}>
            <motion.div key={steps[nav.step].id} custom={nav.dir} variants={slide} initial="enter" animate="center" exit="exit" className="w-full">
              <Component />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <footer className="relative z-10 shrink-0 border-t border-creme/10 px-5 py-4 sm:px-8 short:py-2">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <button
            type="button"
            onClick={prev}
            disabled={nav.step === 0}
            aria-label="Étape précédente"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-creme/40 transition-colors duration-500 enabled:hover:bg-creme enabled:hover:text-cacao disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div role="tablist" aria-label="Étapes du business model" className="flex flex-1 items-center justify-center gap-1.5 sm:gap-3">
            {steps.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === nav.step}
                aria-label={`Étape ${i + 1} : ${s.label}`}
                onClick={() => go(i)}
                className={`rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 sm:px-4 ${
                  i === nav.step ? "border-creme bg-creme text-cacao" : "border-creme/25 text-creme/75 hover:border-creme/60"
                }`}
              >
                <span className="sm:hidden">{i + 1}</span>
                <span className="hidden sm:inline">
                  {i + 1} · {s.label}
                </span>
              </button>
            ))}
          </div>

          {nav.step < LAST ? (
            <button
              type="button"
              onClick={next}
              aria-label="Étape suivante"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-framboise transition-colors duration-500 hover:bg-creme hover:text-cacao"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              aria-label="Reprendre la visite du site"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center gap-2 rounded-full bg-framboise text-[11.5px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 hover:bg-creme hover:text-cacao sm:w-auto sm:px-5"
            >
              <span className="hidden sm:inline">Reprendre</span>
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
        <p className="mt-3 hidden text-center text-[11px] tracking-[0.12em] text-creme/50 sm:block short:hidden">← → naviguer · 1 à 4 aller à une étape · Échap fermer</p>
      </footer>
    </motion.div>
  );
}
