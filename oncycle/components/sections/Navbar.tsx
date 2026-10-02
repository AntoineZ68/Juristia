"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useIntroDone } from "../motion/Intro";
import Magnetic from "../motion/Magnetic";

const links = [
  { href: "#constat", label: "Le Constat" },
  { href: "#formule", label: "La Formule" },
  { href: "#gamme", label: "La Gamme" },
  { href: "#rejoindre", label: "Le Cycle" },
];

export default function Navbar() {
  const ready = useIntroDone();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Se cache quand on descend, réapparaît dès qu'on remonte.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 320 && !open);
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
        initial={{ y: -120 }}
        animate={{ y: ready && !hidden ? 0 : -120 }}
        transition={{ duration: 0.9, ease: EASE, delay: ready && !scrolled ? 0.6 : 0 }}
      >
        <nav
          className={`mx-auto grid h-14 max-w-[1400px] grid-cols-[1fr_auto] items-center rounded-full border px-5 transition-colors duration-500 sm:h-16 sm:px-7 lg:grid-cols-[1fr_auto_1fr] ${
            scrolled || open
              ? "border-white/50 bg-creme/60 shadow-[0_8px_32px_-12px_rgba(34,21,16,0.18)] backdrop-blur-md backdrop-saturate-150"
              : "border-transparent bg-transparent"
          }`}
        >
          <a href="#top" className="font-serif text-[1.7rem] font-medium leading-none tracking-[-0.02em]">
            OnCycle<span className="text-framboise">.</span>
          </a>

          <ul className="hidden items-center gap-10 text-[12px] font-medium uppercase tracking-[0.16em] lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative block overflow-hidden py-1">
                  <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                    {l.label}
                  </span>
                  <span className="absolute inset-x-0 top-full block py-1 text-framboise transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-3">
            <div className="hidden sm:block">
            <Magnetic strength={0.25}>
              <a
                href="#rejoindre"
                className="inline-flex items-center rounded-full border border-cacao/80 px-6 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] transition-colors duration-500 hover:bg-cacao hover:text-creme"
              >
                Précommander
              </a>
            </Magnetic>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="relative flex h-10 w-10 items-center justify-center lg:hidden"
            >
              <span className={`absolute h-px w-5 bg-cacao transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute h-px w-5 bg-cacao transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-creme px-6 pb-12 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
            data-lenis-prevent
          >
            <ul>
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden border-b border-cacao/10">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-4 font-serif text-[3.2rem] leading-none"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 + i * 0.07, ease: EASE }}
                  >
                    {l.label}
                    <span className="font-sans text-[11px] tracking-[0.2em] text-cacao/40">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <a
              href="#rejoindre"
              onClick={() => setOpen(false)}
              className="mt-10 rounded-full bg-cacao py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-creme"
            >
              Précommander
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
