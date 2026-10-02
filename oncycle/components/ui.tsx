import type { ReactNode } from "react";

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <p
      className={`mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] ${
        tone === "light" ? "text-poudre/70" : "text-grenat"
      }`}
    >
      <span className={`h-px w-8 ${tone === "light" ? "bg-poudre/40" : "bg-grenat/50"}`} />
      {children}
    </p>
  );
}

export function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-serif text-[2.6rem] leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[4rem] ${className}`}>
      {children}
    </h2>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif tracking-[-0.02em] ${className}`}>
      OnCycle<span className="text-grenat">.</span>
    </span>
  );
}
