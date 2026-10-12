// Déposez vos visuels finaux dans /public/images avec ces noms exacts.
// Tant qu'un fichier est absent, le site affiche automatiquement le placeholder SVG.
export const ASSETS = {
  // Image 1 — texture soie violette + fèves (fond de la section Formule)
  texture: { src: "/images/texture-soie.jpg", fallback: "/images/texture-soie.svg" },
  // Image 2 — photo produit (tablette chocolat + lentilles soufflées + framboises, étui crème). Hero.
  // Si le .webp est absent, on retombe sur l'ancienne photo (.jpg).
  heroProduct: { src: "/images/hero-tablette.webp", fallback: "/images/hero-tablette.jpg" },
};
