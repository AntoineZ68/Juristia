import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "dark" | "light";
  className?: string;
};

/** CTA avec reflet lumineux qui balaie le bouton au survol. */
export default function ShineButton({ href, children, variant = "dark", className = "" }: Props) {
  const tone =
    variant === "dark"
      ? "bg-cacao text-creme hover:bg-framboise"
      : "bg-creme text-cacao hover:bg-white";
  return (
    <a
      href={href}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-[18px] text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 ${tone} ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[400%]"
      />
      <span className="relative flex items-center gap-3">{children}</span>
    </a>
  );
}
