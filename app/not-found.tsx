import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="contenu" className="shell flex min-h-[60vh] flex-col justify-center py-24">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="display mt-5 text-[length:var(--text-h2)]">
          Cette page est introuvable.
        </h1>
        <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ink-muted">
          La pièce que vous cherchez n&apos;est pas au dossier. Revenez à
          l&apos;accueil pour reprendre la lecture.
        </p>
        <Link href="/" className="btn btn-primary mt-8 self-start">
          Retour à l&apos;accueil
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
