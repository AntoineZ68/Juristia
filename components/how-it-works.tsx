import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

const steps = [
  {
    step: "Étape 1",
    title: "Déposez le dossier",
    body: "Glissez la procédure complète dans l'espace client : un PDF de 3 000 pages, une série de scans, ou les deux. Aucune préparation, aucun renommage de fichiers.",
  },
  {
    step: "Étape 2",
    title: "L'IA extrait et structure",
    body: "Reconnaissance du texte, identification des cotes, des dates, des personnes, des qualifications et des déclarations. Chaque donnée extraite conserve son ancrage dans le PDF source.",
  },
  {
    step: "Étape 3",
    title: "Naviguez dans le classeur",
    body: "Chronologie, fiches acteurs, recherche instantanée, contradictions. Vous préparez votre stratégie de défense au lieu de chercher une page.",
  },
];

export function HowItWorks() {
  return (
    <section id="methode" className="border-b border-line py-20 sm:py-28">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal className="lg:sticky lg:top-28">
              <p className="eyebrow">La méthode</p>
              <h2 className="display mt-5 text-[length:var(--text-h2)]">
                Trois gestes,
                <br />
                <em className="italic">c&apos;est tout.</em>
              </h2>
              <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-ink-muted">
                Pas de paramétrage, pas de formation de deux jours. Un avocat
                doit pouvoir s&apos;en servir le soir même de la réception du dossier.
              </p>
              <a
                href={site.appUrl}
                rel="noopener"
                className="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-[0.9375rem] text-ink transition-opacity hover:opacity-60"
              >
                Ouvrir mon espace client
                <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          </div>

          <ol className="lg:col-span-8">
            {steps.map((item, index) => (
              <Reveal
                key={item.step}
                as="li"
                delay={index * 80}
                className="grid gap-4 border-t border-line py-9 sm:grid-cols-[132px_1fr] sm:gap-8 last:border-b"
              >
                <p className="eyebrow pt-1">{item.step}</p>
                <div>
                  <h3 className="display text-[length:var(--text-h3)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
