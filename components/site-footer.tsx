import Link from "next/link";

import { Logo } from "@/components/logo";
import { legalLinks, nav, site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper-deep">
      <div className="shell py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-xs text-[0.875rem] leading-relaxed text-ink-muted">
              {site.baseline}
            </p>
            <a
              href={`mailto:${site.contactEmail}`}
              className="mt-5 inline-block text-[0.875rem] text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
            >
              {site.contactEmail}
            </a>
          </div>

          <nav aria-label="Produit" className="lg:col-span-3">
            <p className="eyebrow">Produit</p>
            <ul className="mt-5 space-y-3 text-[0.875rem]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.appUrl}
                  rel="noopener"
                  className="text-ink-muted transition-colors hover:text-ink"
                >
                  Espace client
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Informations légales" className="lg:col-span-4">
            <p className="eyebrow">Informations légales</p>
            <ul className="mt-5 space-y-3 text-[0.875rem]">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line-strong pt-7 text-[0.8125rem] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. Tous droits réservés.
          </p>
          <p className="max-w-lg sm:text-right">
            Juristia est un outil d&apos;aide à l&apos;analyse documentaire. Il ne constitue
            ni un cabinet d&apos;avocats, ni une consultation juridique, et ne se substitue
            pas au travail de l&apos;avocat.
          </p>
        </div>
      </div>
    </footer>
  );
}
