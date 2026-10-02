// Toutes les informations légales du site, centralisées ici.
// Toute valeur entre crochets s'affiche surlignée sur le site : remplacez-la avant la mise en ligne publique.

export const LEGAL = {
  /** Personne ou structure qui décide de la collecte des e-mails. */
  responsable: "[PRÉNOM NOM ou nom de la structure]",
  /** Adresse e-mail de contact (exercice des droits, questions). */
  contactEmail: "[E-MAIL DE CONTACT]",
  /** Durée de conservation des e-mails. */
  conservation:
    "[À DÉFINIR, par exemple : 24 mois après la dernière interaction, ou jusqu'au retrait du consentement s'il intervient avant]",

  /** Éditeur du site (LCEN, art. 6-III). */
  editeur: "[NOM de l'éditeur]",
  editeurAdresse:
    "[ADRESSE — ou, si vous êtes un particulier non professionnel souhaitant rester anonyme, supprimez cette ligne : les coordonnées de l'hébergeur ci-dessous suffisent (LCEN, art. 6-III-2), à condition d'avoir communiqué votre identité à l'hébergeur]",
  directeurPublication: "[NOM du directeur de la publication]",

  /** Sous-traitant de la liste d'attente. */
  formspreeGaranties:
    "[À VÉRIFIER sur formspree.io/legal/privacy-policy avant publication — d'après les extraits consultés, Formspree indique s'appuyer sur les clauses contractuelles types de la Commission européenne]",

  /** Hébergeur. */
  renderNom: "Render Services, Inc.",
  renderAdresse:
    "[ADRESSE À VÉRIFIER sur render.com/terms — les sources consultées indiquent 525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis]",
  renderGaranties:
    "[À VÉRIFIER sur render.com/privacy — Render a annoncé sa certification au Data Privacy Framework UE–États-Unis ; contrôlez qu'elle est active sur dataprivacyframework.gov]",

  /** Date de dernière mise à jour des pages légales. */
  miseAJour: "2 octobre 2026",
} as const;

export const isPlaceholder = (v: string) => v.startsWith("[");
