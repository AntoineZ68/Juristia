"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "./ui";

const links = [
  { href: "#constat", label: "Le Constat" },
  { href: "#synergie", label: "La Synergie" },
  { href: "#gamme", label: "La Gamme" },
  { href: "#science", label: "La Science" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-stone-200/80 bg-creme/75 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
        <a href="#top" className="text-[1.65rem]" aria-label="OnCycle, retour en haut">
          <Logo />
        </a>

        <ul className="hidden items-center gap-9 text-[13.5px] font-medium text-cacao/75 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="group relative py-1 transition-colors hover:text-cacao">
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-grenat transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#waitlist"
            className="group hidden items-center gap-1.5 rounded-full bg-cacao px-5 py-2.5 text-[13px] font-semibold text-creme transition-all hover:bg-grenat sm:inline-flex"
          >
            Rejoindre la liste d&apos;attente
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/60 lg:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        className={`overflow-hidden transition-[max-height] duration-500 lg:hidden ${open ? "max-h-[100svh]" : "max-h-0"}`}
      >
        <ul className="flex h-[calc(100svh-4rem)] flex-col gap-1 border-t border-stone-200 px-5 pt-6">
          {links.map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between border-b border-stone-200 py-5 font-serif text-4xl"
              >
                {l.label}
                <span className="font-sans text-xs text-cacao/40">0{i + 1}</span>
              </a>
            </li>
          ))}
          <li className="mt-8">
            <a
              href="#waitlist"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-cacao px-6 py-4 text-sm font-semibold text-creme"
            >
              Rejoindre la liste d&apos;attente <ArrowUpRight className="h-4 w-4" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
