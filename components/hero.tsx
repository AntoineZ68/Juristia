import { ProductMock } from "@/components/product-mock";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 lg:pt-28">
      {/* Halo très léger, uniquement pour donner de la profondeur au papier. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(31,59,51,0.07),transparent_70%)]"
      />

      <div className="shell relative">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Défense pénale · Intelligence artificielle</p>
              <h1 className="display mt-6 text-[length:var(--text-display)]">
                Le dossier pénal,
                <br />
                <em className="italic text-seal">lu</em> en une heure.
              </h1>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pb-3">
            <Reveal delay={120}>
              <p className="max-w-md text-[1.0625rem] leading-relaxed text-ink-muted">
                Juristia dépouille l&apos;intégralité de la procédure — procès-verbaux,
                auditions, expertises, écoutes, scellés — et vous restitue un classeur
                interactif : chronologie des faits, fiches acteurs, contradictions.
                Chaque élément reste relié à sa cote et à sa page.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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

              <p className="mt-6 text-[0.8125rem] leading-relaxed text-ink-faint">
                Hébergement en France · Chiffrement de bout en bout · Vos dossiers ne
                servent jamais à entraîner de modèle.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={200} className="mt-16 sm:mt-20">
          <ProductMock />
        </Reveal>
      </div>
    </section>
  );
}
