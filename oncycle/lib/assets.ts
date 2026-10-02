// Déposez vos visuels finaux dans /public/images avec ces noms exacts.
// Tant qu'un fichier est absent, le site affiche automatiquement le placeholder SVG.
export const ASSETS = {
  // Image 1 — texture soie violette + fèves (fond de la section Formule)
  texture: { src: "/images/texture-soie.jpg", fallback: "/images/texture-soie.svg" },
  // Image 2 — tablette coupée, cœur framboise, sur ardoise (Hero)
  heroProduct: { src: "/images/hero-tablette.jpg", fallback: "/images/tablette-coeur-framboise.svg" },
};
