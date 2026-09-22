import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="py-24 sm:py-32">
      <div className="shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="display text-[length:var(--text-h2)]">
            Votre prochain dossier vous attend.
            <br />
            <em className="italic text-seal">Pas trois week-ends de lecture.</em>
          </h2>
          <p className="mx-auto mt-7 max-w-lg text-[1rem] leading-relaxed text-ink-muted">
            Connectez-vous à votre espace client ou demandez une démonstration
            sur l&apos;un de vos dossiers en cours, en conditions réelles.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={site.appUrl} className="btn btn-primary" rel="noopener">
              Accéder à mon espace
            </a>
            <a
              href={`mailto:${site.contactEmail}?subject=Demande%20de%20démonstration%20Juristia`}
              className="btn btn-outline"
            >
              Demander une démonstration
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
