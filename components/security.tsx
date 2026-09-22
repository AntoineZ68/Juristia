import { Reveal } from "@/components/reveal";
import { hosting } from "@/lib/site";

/**
 * ⚠️ À VALIDER AVANT MISE EN LIGNE
 * Les engagements ci-dessous sont des affirmations juridiquement opposables.
 * Chaque ligne doit être confirmée par le contrat d'hébergement et le DPO
 * avant publication (localisation réelle des serveurs, sous-traitants IA,
 * durées de conservation). Ne jamais afficher une certification non obtenue.
 */
const pillars = [
  {
    // Argument différenciant sur le marché français : mis en avant sur toute
    // la largeur plutôt que noyé dans la grille.
    title: hosting.title,
    body: hosting.body,
    featured: true,
  },
  {
    title: "Secret professionnel",
    body: "Cloisonnement strict par cabinet, chiffrement au repos et en transit, journalisation de chaque accès. Aucun accès humain à vos pièces sans votre demande explicite.",
  },
  {
    title: "Conformité RGPD",
    body: "Accord de sous-traitance (DPA), registre des traitements, durées de conservation paramétrables et suppression définitive sur simple demande.",
  },
  {
    title: "Zéro entraînement",
    body: "Vos procédures ne sont jamais utilisées pour entraîner un modèle, ni le nôtre, ni celui de nos sous-traitants. Contractuellement garanti.",
  },
  {
    // ⚠️ Ne laisser cette carte que si l'export est réellement disponible
    // dans l'application. Une promesse de réversibilité non tenue se retourne
    // contre vous en audit comme en référencement client.
    title: "Réversibilité",
    body: "Vos dossiers et leurs analyses sont exportables à tout moment, et supprimés définitivement sur simple demande. Aucun effet de verrou.",
  },
];

export function Security() {
  return (
    <section id="securite" className="bg-ink py-20 text-paper sm:py-28">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-paper/55">Confiance</p>
              <h2 className="display mt-5 text-[length:var(--text-h2)] text-paper">
                Conçu pour la sécurité
                <br />
                <em className="italic">absolue</em> des données.
              </h2>
              <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-paper/70">
                Un dossier pénal contient ce qu&apos;un cabinet a de plus sensible.
                L&apos;architecture de Juristia a été pensée à partir de cette
                contrainte, pas l&apos;inverse.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <dl className="grid gap-px overflow-hidden border border-paper/15 bg-paper/15 sm:grid-cols-2">
              {pillars.map((pillar, index) => (
                <Reveal
                  key={pillar.title}
                  delay={index * 80}
                  className={`bg-ink p-6 sm:p-7 ${
                    "featured" in pillar ? "sm:col-span-2" : ""
                  }`}
                >
                  <dt className="text-[1.0625rem] font-medium text-paper">
                    {pillar.title}
                  </dt>
                  <dd className="mt-3 text-[0.875rem] leading-relaxed text-paper/65">
                    {pillar.body}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
