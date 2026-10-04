"use client";

import { ArrowUpRight } from "lucide-react";
import { useBusinessPlan } from "./BusinessContext";

/** Bouton volontairement discret, entre la Gamme et le pied de page. */
export default function BusinessTrigger() {
  const { open } = useBusinessPlan();
  return (
    <section aria-label="Business model" className="bg-creme py-14 sm:py-20">
      <div className="mx-auto flex max-w-[1400px] justify-center px-5 sm:px-8">
        <button
          type="button"
          onClick={open}
          data-cursor
          aria-haspopup="dialog"
          className="group inline-flex items-center gap-3 rounded-full border border-cacao/15 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-cacao/45 transition-all duration-500 hover:border-cacao hover:bg-cacao hover:text-creme"
        >
          Business model
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  );
}
