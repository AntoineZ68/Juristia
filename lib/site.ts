/**
 * Configuration unique du site vitrine.
 * Tout ce qui est susceptible de changer (URL de l'app, contact, tarifs)
 * est centralisé ici pour éviter d'aller le chercher dans les composants.
 */

export const site = {
  name: "Juristia",
  legalName: "Juristia",
  baseline: "L'analyse des dossiers pénaux, assistée par intelligence artificielle.",
  description:
    "Juristia analyse l'intégralité d'un dossier pénal — procès-verbaux, auditions, expertises, scellés — et restitue une chronologie sourcée où chaque fait renvoie à sa page dans le PDF.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.juristia.fr",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://app.juristia.fr",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@juristia.fr",
} as const;

export const nav = [
  { label: "Le produit", href: "/#produit" },
  { label: "Méthode", href: "/#methode" },
  { label: "Sécurité", href: "/#securite" },
  { label: "Tarifs", href: "/#tarifs" },
] as const;

export const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Conditions générales de vente", href: "/cgv" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
] as const;

/**
 * ⚠️ ENGAGEMENT OPPOSABLE — à maintenir aligné sur l'infrastructure réelle.
 *
 * État déclaré au 22/09/2026 : compute et base de données en région européenne,
 * analyse réalisée par Mistral AI (société française). La chaîne ne comporte
 * donc aucun fournisseur de modèles américain.
 *
 * Nuance à connaître avant de durcir la formulation : héberger EN Europe et
 * n'avoir AUCUN sous-traitant non européen sont deux choses différentes. Si
 * l'infrastructure est opérée par des sociétés de droit américain (Render Inc.,
 * Supabase Inc.), leurs régions UE stockent bien les données en Europe, mais la
 * maison mère reste soumise au CLOUD Act. D'où la formulation retenue :
 * "hébergement et traitement dans l'Union européenne" (exact, vérifiable) plutôt
 * que "aucun sous-traitant non européen" (faux en l'état). Le jour où le compute
 * passe chez OVHcloud, Scaleway ou Clever Cloud, la mention peut être durcie —
 * et c'est l'argument qui fera la différence sur les gros cabinets.
 *
 * Les sous-traitants doivent être nommés dans la politique de confidentialité :
 * c'est une obligation RGPD, pas une option marketing.
 */
export const hosting = {
  /** Ligne courte sous le CTA du hero. */
  short: "Hébergement et traitement dans l'Union européenne",
  /** Carte mise en avant dans la section sécurité. */
  title: "Une chaîne technique européenne",
  body: "L'analyse est réalisée par Mistral AI, modèle français, sur une infrastructure située dans l'Union européenne. Aucune de vos pièces n'est transmise à un fournisseur américain de modèles d'IA. La liste des sous-traitants et de leurs localisations figure dans la politique de confidentialité.",
} as const;
