"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { useLenis } from "../motion/SmoothScroll";
import BusinessPlan from "./BusinessPlan";

const HASH = "#business-plan";

type Ctx = { open: () => void; close: () => void; isOpen: boolean };
const BusinessContext = createContext<Ctx>({ open: () => {}, close: () => {}, isOpen: false });
export const useBusinessPlan = () => useContext(BusinessContext);

/**
 * Panneau « Business model » ouvrable de trois façons :
 *  - le bouton discret entre la Gamme et le pied de page,
 *  - la touche B (raccourci caché),
 *  - l'adresse /#business-plan.
 * Il s'ouvre par-dessus le site : fermer ramène exactement à la même position de scroll.
 */
export default function BusinessProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const lenis = useLenis();
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
    window.history.replaceState(null, "", HASH);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    lastFocus.current?.focus?.({ preventScroll: true });
  }, []);

  // Ouverture directe par l'adresse /#business-plan
  useEffect(() => {
    if (window.location.hash === HASH) setOpen(true);
  }, []);

  // Raccourci caché : B (ignoré pendant la saisie dans un champ)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key !== "b" && e.key !== "B") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      setOpen((o) => {
        if (!o) {
          lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          window.history.replaceState(null, "", HASH);
        }
        return true;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Fige le site derrière le panneau
  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = prev;
    };
  }, [isOpen, lenis]);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <BusinessContext.Provider value={value}>
      {children}
      <AnimatePresence>{isOpen && <BusinessPlan key="business-plan" onClose={close} />}</AnimatePresence>
    </BusinessContext.Provider>
  );
}
