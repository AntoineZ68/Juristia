import Link from "next/link";

import { site } from "@/lib/site";

/**
 * Marque typographique : un mot, une serif, pas de pictogramme.
 * Le point final agit comme sceau — c'est le seul ornement de l'identité.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — accueil`}
      className={`display inline-flex items-baseline text-[1.6rem] leading-none text-ink transition-opacity hover:opacity-70 ${className}`}
    >
      {site.name}
      <span aria-hidden="true" className="ml-[1px] text-seal">
        .
      </span>
    </Link>
  );
}
