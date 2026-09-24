// Réglages de la démo.
//
// Mesure d'audience : Plausible (sans cookie, sans identifiant individuel).
// Laisser `domaine` vide désactive toute mesure — la page ne fait alors
// aucune requête hors de son propre domaine. Pour l'activer, créer le site
// dans Plausible puis renseigner le domaine exact, par ex. "demo.juristia.fr".
//
// Campagne : ajouter ?c=nom-de-campagne au lien envoyé par e-mail. La valeur
// est transmise telle quelle à chaque évènement, jamais un identifiant de
// destinataire.
window.JURISTIA_CONFIG = {
  plausible: {
    domaine: "",
    script: "https://plausible.io/js/script.manual.js",
  },
  urlAcces: "https://juristia.fr/#demo",
};
