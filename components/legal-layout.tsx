import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type LegalLayoutProps = {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
};

/**
 * Gabarit commun aux pages légales.
 * Les styles de prose sont définis ici pour éviter une dépendance
 * à @tailwindcss/typography sur trois pages statiques.
 */
export function LegalLayout({ title, updatedAt, children }: LegalLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main id="contenu" className="border-b border-line py-16 sm:py-24">
        <div className="shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Informations légales</p>
            <h1 className="display mt-5 text-[length:var(--text-h2)]">{title}</h1>
            <p className="mt-4 text-[0.8125rem] text-ink-faint">
              Dernière mise à jour : {updatedAt}
            </p>

            <div className="prose-legal mt-12">
              {children}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
