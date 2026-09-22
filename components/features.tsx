import { Reveal } from "@/components/reveal";

const features = [
  {
    index: "01",
    title: "Analyse éclair",
    lead: "2 800 pages dépouillées pendant que vous instruisez un autre dossier.",
    body: "Déposez la procédure complète, y compris les PDF scannés : l'OCR et l'extraction tournent en arrière-plan. Vous recevez une notification quand le classeur est prêt.",
    points: ["PDF scannés et natifs", "Cotes reconnues automatiquement", "Traitement en arrière-plan"],
  },
  {
    index: "02",
    title: "Chronologie intelligente",
    lead: "Les faits remis dans l'ordre, les versions mises face à face.",
    body: "Juristia reconstruit la ligne de temps des faits et de la procédure, identifie les acteurs, et signale les écarts entre deux auditions d'un même témoin.",
    points: ["Chronologie faits / procédure", "Fiches acteurs et rôles", "Contradictions signalées"],
  },
  {
    index: "03",
    title: "Traçabilité absolue",
    lead: "Aucune affirmation sans sa source. Jamais.",
    body: "Chaque élément affiché renvoie à la cote, à la page et à la ligne du PDF d'origine. Un clic ouvre la pièce au bon endroit : vous vérifiez en deux secondes, vous citez sans risque.",
    points: ["Renvoi cote · page · ligne", "Ouverture directe du PDF", "Export des références"],
  },
];

export function Features() {
  return (
    <section id="produit" className="border-b border-line py-20 sm:py-28">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Le produit</p>
          <h2 className="display mt-5 text-[length:var(--text-h2)]">
            Trois certitudes,
            <br />
            à chaque dossier.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px border border-line bg-line sm:mt-16 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal
              key={feature.index}
              delay={index * 90}
              as="article"
              className="flex flex-col bg-paper p-7 sm:p-9"
            >
              <span className="eyebrow text-seal">{feature.index}</span>
              <h3 className="display mt-6 text-[length:var(--text-h3)] leading-tight">
                {feature.title}
              </h3>
              <p className="mt-4 text-[1rem] leading-relaxed text-ink">
                {feature.lead}
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                {feature.body}
              </p>

              <ul className="mt-7 space-y-2.5 border-t border-line pt-6 text-[0.875rem] text-ink-muted">
                {feature.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-seal"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
