import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

/**
 * ⚠️ TARIFS À CONFIRMER
 * Les montants ci-dessous sont des valeurs de départ, à aligner sur la grille
 * réelle avant mise en ligne (et à répercuter dans le JSON-LD de app/layout.tsx).
 */
const plans = [
  {
    name: "Confrère",
    price: "290 €",
    unit: "/ mois HT",
    pitch: "Pour l'avocat qui traite ses dossiers seul.",
    features: [
      "1 utilisateur",
      "5 dossiers par mois",
      "Chronologie, acteurs, contradictions",
      "Support par e-mail sous 24 h",
    ],
    cta: "Commencer",
    href: site.appUrl,
    featured: false,
  },
  {
    name: "Cabinet",
    price: "690 €",
    unit: "/ mois HT",
    pitch: "Pour une équipe de défense pénale qui partage ses dossiers.",
    features: [
      "5 utilisateurs inclus",
      "25 dossiers par mois",
      "Espaces partagés et annotations",
      "Exports chronologie et références",
      "Accompagnement à la prise en main",
    ],
    cta: "Commencer",
    href: site.appUrl,
    featured: true,
  },
  {
    name: "Structure",
    price: "Sur devis",
    unit: "",
    pitch: "Pour les structures à fort volume et les exigences DSI.",
    features: [
      "Utilisateurs et dossiers illimités",
      "SSO et gestion des droits",
      "Engagements contractuels sur mesure",
      "Interlocuteur dédié",
    ],
    cta: "Nous contacter",
    href: `mailto:${site.contactEmail}?subject=Offre%20Structure%20Juristia`,
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="tarifs" className="border-b border-line py-20 sm:py-28">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Tarifs</p>
          <h2 className="display mt-5 text-[length:var(--text-h2)]">
            Le prix d&apos;une demi-journée
            <br />
            de collaborateur.
          </h2>
          <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-muted">
            Sans engagement de durée. Résiliable à tout moment depuis votre espace client.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal
              key={plan.name}
              as="article"
              delay={index * 90}
              className={`flex flex-col rounded-[4px] border p-7 sm:p-8 ${
                plan.featured
                  ? "border-ink bg-paper-pure"
                  : "border-line bg-transparent"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[0.9375rem] font-medium tracking-tight text-ink">
                  {plan.name}
                </h3>
                {plan.featured ? (
                  <span className="rounded-full bg-seal-soft px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide text-seal">
                    Le plus choisi
                  </span>
                ) : null}
              </div>

              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="display text-4xl">{plan.price}</span>
                {plan.unit ? (
                  <span className="text-[0.8125rem] text-ink-faint">{plan.unit}</span>
                ) : null}
              </p>

              <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted">
                {plan.pitch}
              </p>

              <ul className="mt-7 flex-1 space-y-2.5 border-t border-line pt-6 text-[0.875rem] text-ink-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-seal"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                rel="noopener"
                className={`btn mt-8 w-full ${plan.featured ? "btn-primary" : "btn-outline"}`}
              >
                {plan.cta}
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
