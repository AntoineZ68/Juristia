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
