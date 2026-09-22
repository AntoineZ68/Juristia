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
 * ⚠️ ENGAGEMENT OPPOSABLE — à aligner sur l'infrastructure réelle avant publication.
 *
 * Render ne propose AUCUNE région française : Oregon, Ohio, Virginie, Francfort,
 * Singapour. Tant que l'application tourne sur Render, la seule formulation exacte
 * est « Union européenne », et uniquement si le service est bien en région Frankfurt.
 * Supabase propose en revanche une région Paris (eu-west-3).
 *
 * Formulations possibles, par ordre de force commerciale décroissante :
 *   1. "Hébergement en France"          → compute ET base ET fichiers en France.
 *   2. "Hébergement dans l'Union européenne" → tout en UE (Render Frankfurt + Supabase UE).
 *   3. "Hébergement en Europe"          → formulation de repli, tant que ce n'est pas vérifié.
 *
 * La mention « aucun transfert hors UE » ne peut être affichée que si le fournisseur
 * de modèles d'IA traite lui aussi les données en UE. Un appel à une API américaine
 * (OpenAI, Anthropic sans résidence UE) constitue un transfert hors UE à déclarer.
 */
export const hosting = {
  /** Ligne courte sous le CTA du hero. */
  short: "Hébergement dans l'Union européenne",
  /** Titre de la carte dans la section sécurité. */
  title: "Hébergement européen",
  body: "Vos dossiers sont stockés et traités sur une infrastructure située dans l'Union européenne. La localisation exacte et la liste à jour des sous-traitants figurent dans la politique de confidentialité.",
} as const;
