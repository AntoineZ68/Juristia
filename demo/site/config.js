// Réglages de la démo.
//
// Mesure d'audience : Plausible (sans cookie, sans identifiant individuel).
// Laisser `domaine` vide désactive toute mesure — la page ne fait alors
// aucune requête hors de son propre domaine. Pour l'activer, créer le site
// dans Plausible puis renseigner le domaine exact, par ex. "demo.votre-domaine.fr".
//
// Campagne : ajouter ?c=nom-de-campagne au lien envoyé par e-mail. La valeur
// est transmise telle quelle à chaque évènement, jamais un identifiant de
// destinataire.
//
// Éditeur : identité exigée par l'article 6 de la loi pour la confiance dans
// l'économie numérique (LCEN) pour un site édité dans un cadre professionnel.
// Tant qu'un champ est vide, la page « Mentions légales » l'affiche comme
// « à compléter » : ne pas diffuser la démo largement dans cet état.
window.LYTIS_CONFIG = {
  editeur: {
    nom: "Antoine Zoller",
    statut: "Projet en cours de création",
    adresse: "143 rue Stéphane Déchant, 69350 La Mulatière",
    email: "antoine.zoller@edu.em-lyon.com",   // contact, y compris pour les demandes RGPD
    directeur: "Antoine Zoller",
  },
  hebergeur: {
    nom: "Render Services, Inc.",
    adresse: "525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis",
    site: "render.com",
  },
  plausible: {
    domaine: "",
    script: "https://plausible.io/js/script.manual.js",
  },
};
