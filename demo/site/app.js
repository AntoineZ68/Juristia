// Démo Lytis — vitrine statique, sans aucun lien sortant.
//
// Les fonctions de rendu reprennent celles de l'application
// (web/frontend/index.html) : mêmes classes, même balisage, même texte. Seule
// la source des données change — un fichier local (data.js) au lieu de l'API
// et de Supabase — et toute action qui demanderait un serveur (dépôt,
// suppression, téléchargement) affiche simplement « ceci est une démonstration ».
"use strict";

const DEMO = window.LYTIS_DEMO;
const CONFIG = window.LYTIS_CONFIG || {};
const dossier = DEMO.dossier;
const donnees = DEMO.donnees;

// --- Mesure d'audience (sans cookie) ---------------------------------------

const campagne = (() => {
  try {
    const c = new URLSearchParams(location.search).get("c");
    return c ? c.slice(0, 64) : "direct";
  } catch { return "direct"; }
})();

(function chargerMesure() {
  const p = CONFIG.plausible || {};
  if (!p.domaine) return;
  window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
  const s = document.createElement("script");
  s.defer = true;
  s.dataset.domain = p.domaine;
  s.src = p.script;
  document.head.appendChild(s);
  // Page vue sans le paramètre de campagne dans l'URL : il voyage en propriété.
  window.plausible("pageview", { u: location.origin + location.pathname, props: { campagne } });
})();

function suivre(evenement, proprietes = {}) {
  if (typeof window.plausible !== "function") return;
  window.plausible(evenement, { props: { campagne, ...proprietes } });
}

// --- Utilitaires ------------------------------------------------------------

function esc(texte) {
  return String(texte ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function lireStockage(cle) { try { return localStorage.getItem(cle); } catch { return null; } }
function ecrireStockage(cle, valeur) { try { localStorage.setItem(cle, valeur); } catch { /* navigation privée */ } }

// --- Libellés (repris de l'application, complétés pour ce dossier) ---------

// Documents téléchargeables, générés par tools/documents.py à partir des
// mêmes données que le site.
const DOCUMENTS_GENERES = [
  ["documents/note_defense.pdf", "Note de défense", "Résumé, pistes de nullité, faits imputés et contradictions, chaque élément sourcé · PDF, 5 pages"],
  ["documents/dossier_surligne.pdf", "Dossier surligné", "Les 31 pages, passages retenus surlignés par couleur · PDF, 4.2 Mo"],
];

const ICONE_DOCUMENT = `<svg class="icone-doc" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg>`;
const ICONE_INDEX = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H18v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H18"/><path d="M8 7.5h6M8 11h6"/></svg>`;

const ONGLETS_DOSSIER = [
  ["infos", "Dossier", `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`],
  ["chrono", "Chronologie", `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`],
  ["procedure", "Procédure", `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`],
  ["fond", "Fond", `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"></path></svg>`],
];

const LIBELLES_STATUT = { en_attente: "En attente", en_cours: "En cours", termine: "Terminé", erreur: "Erreur" };

const LIBELLES_ROLE = {
  client: "Client (mis en cause)", mis_en_cause: "Mis en cause", victime: "Victime", témoin: "Témoin",
  expert: "Expert", enqueteur: "Enquêteur", magistrat: "Magistrat", avocat: "Avocat",
  greffe: "Greffe", autre: "Autre intervenant",
};

const NB_FAITS_APERCU = 4;

const LIBELLES_NATURE_PROCEDURE = {
  interpellation: "Interpellation",
  placement_garde_a_vue: "Placement en garde à vue",
  notification_droits: "Notification des droits",
  prolongation_garde_a_vue: "Prolongation de garde à vue",
  fin_garde_a_vue: "Fin de garde à vue",
  demande_examen_medical: "Demande d'examen médical",
  realisation_examen_medical: "Examen médical réalisé",
  demande_entretien_avocat: "Demande d'entretien avocat",
  realisation_entretien_avocat: "Entretien avocat réalisé",
  debut_perquisition: "Début de perquisition",
  fin_perquisition: "Fin de perquisition",
  debut_audition: "Début d'audition",
  fin_audition: "Fin d'audition",
  depot_plainte: "Dépôt de plainte",
  audition_temoin: "Audition de témoin",
  exploitation_lapi: "Exploitation de la lecture automatisée des plaques",
  autorisation_requisitions: "Autorisation de réquisitions du parquet",
  requisition: "Réquisition à opérateur",
  requisitoire_introductif: "Réquisitoire introductif",
  commission_rogatoire: "Commission rogatoire",
  pose_geolocalisation: "Pose d'une balise de géolocalisation",
  ordonnance_geolocalisation: "Ordonnance autorisant la géolocalisation",
  surveillance: "Surveillance",
  ordonnance_perquisition_nuit: "Ordonnance de perquisition de nuit (706-91)",
  avis_magistrat: "Avis au juge d'instruction",
  detention_provisoire: "Placement en détention provisoire",
};

let ongletDossierActif = "infos";

function basculerOnglet(nom) {
  ongletDossierActif = nom;
  document.querySelectorAll(".onglet").forEach((b) => b.classList.toggle("actif", b.dataset.onglet === nom));
  document.querySelectorAll(".panneau-onglet").forEach((p) => { p.hidden = p.dataset.panneau !== nom; });
}
window.basculerOnglet = basculerOnglet;

// --- Sources : chaque élément affiché renvoie à sa page ---------------------

const sourcesParPage = new Map(donnees.sources.map((s) => [s.page, s]));
const references = []; // { page, citation } — indexées par les badges

function libelleSource(page) {
  const source = sourcesParPage.get(page);
  if (!source) return "";
  const cote = source.cote ? ` · cote ${source.cote}` : "";
  return `${source.fichier_source} · p.${source.page_fichier}${cote}`;
}

function badgeSource(page, citation) {
  if (!page) return "";
  const source = sourcesParPage.get(page);
  const cote = source && source.cote ? ` · ${source.cote}` : "";
  const infobulle = libelleSource(page) || "Voir la page dans le dossier";
  references.push({ page, citation: citation || null });
  const i = references.length - 1;
  return `<button type="button" class="badge-source" title="${esc(infobulle)}" data-ref="${i}" onclick="ouvrirSource(${i})">Page ${page}${cote}</button>`;
}

function ouvrirSource(i) {
  const ref = references[i];
  if (!ref) return;
  const source = sourcesParPage.get(ref.page);
  suivre("Source ouverte", { cote: (source && source.cote) || "—", page: String(ref.page) });
  const depuisQuestions = modeClasseur === "questions" && !document.getElementById("classeur").hidden;
  ouvrirClasseur(ref.page, ref.citation);
  document.getElementById("retour-questions").hidden = !depuisQuestions;
  if (parcoursActif && etapeParcours === ETAPES_PARCOURS.length - 1) terminerParcours(true);
}
window.ouvrirSource = ouvrirSource;

// --- Classeur : visionneuse du dossier, en panneau latéral ------------------
//
// L'application affiche le PDF surligné avec pdf.js. Ici, chaque page est une
// image pré-rendue avec ses surlignages : même rendu, dix fois plus léger, et
// aucune bibliothèque tierce à charger.

const NB_PAGES = dossier.nb_pages;
let classeurPage = 1;
let citationReperee = null;

function fermerClasseur() {
  document.getElementById("classeur").hidden = true;
}
window.fermerClasseur = fermerClasseur;

let modeClasseur = "piece";

function basculerModeClasseur(mode) {
  document.querySelectorAll(".mode-classeur").forEach((b) => b.classList.toggle("actif", b.dataset.mode === mode));
  document.getElementById("classeur-piece").hidden = mode !== "piece";
  document.getElementById("classeur-index").hidden = mode !== "index";
  document.getElementById("classeur-questions").hidden = mode !== "questions";
  if (mode !== "piece") document.getElementById("retour-questions").hidden = true;
  modeClasseur = mode;
  document.getElementById("classeur-navigation").hidden = mode !== "piece";
  document.getElementById("classeur-legende").hidden = mode !== "piece";
  if (mode === "index") rendreIndexClasseur();
}
window.basculerModeClasseur = basculerModeClasseur;

function cheminPage(n) {
  return `pages/p${String(n).padStart(3, "0")}.webp`;
}

// Légende du surlignage : quelle couleur pour quel type d'information, et
// combien de passages de chaque couleur sur la page affichée. Les couleurs
// sont celles des pages pré-rendues (tools/build.py) : elles ne se changent pas.
const CATEGORIES_SURLIGNAGE = [
  ["faits", "Faits", "Ce qui s'est passé : chronologie des faits, résumé, journée reconstituée."],
  ["procedure", "Procédure", "Actes, heures et délais de la procédure."],
  ["declaration", "Déclarations et preuves", "Propos des personnes entendues, charges, éléments à décharge, identifiants recoupés."],
  ["contradiction", "Contradictions", "Passages qui ne concordent pas d'une pièce à l'autre."],
  ["nullite", "Pistes de nullité", "Passages sur lesquels repose une piste de l'onglet Procédure."],
];
let legendeDepliee = false;

function rendreLegende() {
  const el = document.getElementById("classeur-legende");
  const couleurs = DEMO.surlignage.couleurs;
  const compte = DEMO.surlignage.par_page[String(classeurPage)] || {};
  el.innerHTML = `
    <button type="button" class="legende-ligne" onclick="basculerLegende()" aria-expanded="${legendeDepliee}" title="Signification des couleurs">
      ${CATEGORIES_SURLIGNAGE.map(([c, libelle]) => `
        <span class="legende-item ${compte[c] ? "" : "absent"}">
          <span class="legende-pastille" style="background:${couleurs[c]}"></span>${libelle}${compte[c] ? ` <strong>${compte[c]}</strong>` : ""}
        </span>`).join("")}
      <span class="legende-info">${legendeDepliee ? "▴" : "ⓘ"}</span>
    </button>
    ${legendeDepliee ? `
      <dl class="legende-details">
        ${CATEGORIES_SURLIGNAGE.map(([c, libelle, detail]) => `
          <dt><span class="legende-pastille" style="background:${couleurs[c]}"></span>${libelle}</dt><dd>${detail}</dd>`).join("")}
        <dd class="legende-note">Les chiffres indiquent le nombre de passages surlignés sur la page affichée. Un passage relevant de plusieurs catégories prend la couleur de la plus importante.</dd>
      </dl>` : ""}`;
}

function basculerLegende() {
  legendeDepliee = !legendeDepliee;
  rendreLegende();
  if (legendeDepliee) suivre("Légende surlignage");
}
window.basculerLegende = basculerLegende;

function majNavigationClasseur() {
  document.getElementById("classeur-position").textContent = `Page ${classeurPage} / ${NB_PAGES}`;
  document.getElementById("classeur-source").textContent = libelleSource(classeurPage);
  rendreLegende();
  document.querySelector('.classeur-navigation [title="Page précédente"]').disabled = classeurPage <= 1;
  document.querySelector('.classeur-navigation [title="Page suivante"]').disabled = classeurPage >= NB_PAGES;
}

// Position verticale d'un élément dans la zone défilante du classeur.
function hautDans(conteneur, element) {
  return element.getBoundingClientRect().top - conteneur.getBoundingClientRect().top + conteneur.scrollTop;
}

const ICONE_LOUPE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"></path></svg>`;
const imagesChargees = new Set();
let rendusClasseur = 0;

function prechargerPage(n) {
  if (n < 1 || n > NB_PAGES || imagesChargees.has(n)) return;
  const img = new Image();
  img.onload = () => imagesChargees.add(n);
  img.src = cheminPage(n);
}

function afficherPageClasseur(numero, citation) {
  classeurPage = Math.min(Math.max(1, numero), NB_PAGES);
  citationReperee = citation || null;
  majNavigationClasseur();
  const page = classeurPage;
  const jeton = ++rendusClasseur;
  const zones = (citation && DEMO.positions[`${page}|${citation}`]) || [];
  const conteneur = document.getElementById("classeur-piece");
  const corps = document.getElementById("classeur-corps");
  const source = sourcesParPage.get(page);

  const afficher = () => {
    // Un clic rapide sur plusieurs pages : seule la dernière demandée s'affiche.
    if (jeton !== rendusClasseur) return;
    conteneur.classList.remove("page-en-chargement");
    conteneur.innerHTML = `
      <div class="page-cadre" onclick="basculerZoom(this)">
        <img src="${cheminPage(page)}" width="1100" height="1556" alt="Page ${page} du dossier${source && source.cote ? `, cote ${source.cote}` : ""}" />
        ${zones.map(([x0, y0, x1, y1]) => `<span class="zone-reperage" style="left:${x0 * 100}%;top:${y0 * 100}%;width:${(x1 - x0) * 100}%;height:${(y1 - y0) * 100}%"></span>`).join("")}
        <span class="indice-zoom">${ICONE_LOUPE}<span>Agrandir</span></span>
      </div>`;
    if (zones.length) {
      // Amène le passage cité sous les yeux du lecteur.
      requestAnimationFrame(() => {
        const cadre = conteneur.querySelector(".page-cadre");
        const haut = Math.min(...zones.map((z) => z[1]));
        corps.scrollTop = Math.max(0, hautDans(corps, cadre) + haut * cadre.clientHeight - corps.clientHeight * 0.3);
      });
    } else {
      corps.scrollTop = 0;
    }
  };

  // La page précédente reste affichée tant que la nouvelle n'est pas prête :
  // jamais de page blanche avec des cadres de surlignage dans le vide.
  if (imagesChargees.has(page)) {
    afficher();
  } else {
    if (!conteneur.querySelector(".page-cadre")) {
      conteneur.innerHTML = `<div class="chargement"><span class="spinner"></span> Ouverture de la pièce…</div>`;
    }
    conteneur.classList.add("page-en-chargement");
    const img = new Image();
    img.onload = () => { imagesChargees.add(page); afficher(); };
    img.onerror = afficher;
    img.src = cheminPage(page);
  }
  // Pages voisines préchargées : le feuilletage reste instantané.
  prechargerPage(page + 1);
  prechargerPage(page - 1);
}

// Clic sur la page : agrandissement ×2, centré sur le passage cité s'il y en a un.
function basculerZoom(cadre) {
  const corps = document.getElementById("classeur-corps");
  const agrandie = cadre.classList.toggle("agrandie");
  cadre.querySelector(".indice-zoom span").textContent = agrandie ? "Réduire" : "Agrandir";
  const zone = cadre.querySelector(".zone-reperage");
  requestAnimationFrame(() => {
    if (agrandie && zone) {
      corps.scrollLeft = Math.max(0, zone.offsetLeft - 24);
      corps.scrollTop = Math.max(0, hautDans(corps, cadre) + zone.offsetTop - corps.clientHeight * 0.3);
    } else if (!agrandie) {
      corps.scrollLeft = 0;
    }
  });
}
window.basculerZoom = basculerZoom;

function allerPageClasseur(delta) {
  afficherPageClasseur(classeurPage + delta);
}
window.allerPageClasseur = allerPageClasseur;

function ouvrirClasseur(page, citation) {
  document.getElementById("classeur").hidden = false;
  basculerModeClasseur("piece");
  afficherPageClasseur(page, citation);
}
window.ouvrirClasseur = ouvrirClasseur;

// Onglet « Pièce » : si aucune page n'est encore affichée (classeur ouvert
// sur l'index ou les questions), afficher la page courante au lieu d'un
// panneau vide.
function montrerPiece() {
  basculerModeClasseur("piece");
  if (!document.querySelector("#classeur-piece .page-cadre")) afficherPageClasseur(classeurPage);
}
window.montrerPiece = montrerPiece;

function ouvrirIndexClasseur() {
  document.getElementById("classeur").hidden = false;
  basculerModeClasseur("index");
}
window.ouvrirIndexClasseur = ouvrirIndexClasseur;

function rendreIndexClasseur() {
  const element = document.getElementById("classeur-index");
  element.innerHTML = `<div class="liste-index">
    ${donnees.index_pieces.map((p) => {
      const pages = p.page_fin > p.page_debut ? `Pages ${p.page_debut}–${p.page_fin}` : `Page ${p.page_debut}`;
      const date = p.date ? ` · ${p.date}${p.heure ? " à " + p.heure : ""}` : "";
      const cote = p.cote && p.cote !== "—" ? ` · cote ${p.cote}` : "";
      return `<button type="button" class="entree-index" onclick="ouvrirClasseur(${p.page_debut})">
        <span class="type-piece">${esc(p.type)}</span>
        <span class="meta-piece">${pages}${date}${cote}</span>
      </button>`;
    }).join("")}
  </div>`;
}

// --- Actions qui demandent un serveur ---------------------------------------

let minuteurAvis = null;
function actionIndisponible(nomAction) {
  const avis = document.getElementById("avis-indisponible");
  document.getElementById("avis-titre").textContent = `${nomAction} — ceci est une démonstration`;
  avis.hidden = false;
  clearTimeout(minuteurAvis);
  minuteurAvis = setTimeout(fermerAvis, 9000);
}
window.actionIndisponible = actionIndisponible;

function fermerAvis() {
  document.getElementById("avis-indisponible").hidden = true;
}
window.fermerAvis = fermerAvis;

// --- Vues (reprises de l'application) ---------------------------------------

function rendreListeLaterale() {
  document.getElementById("liste-dossiers").innerHTML = `
    <button type="button" class="item-dossier selectionne" onclick="ouvrirDossier()">
      <span class="nom-item">${esc(dossier.nom)}</span>
      <span class="ligne-meta">
        <span class="ref-item">${esc(dossier.reference || "")}</span>
        <span class="pastille pastille-${dossier.statut}" title="${LIBELLES_STATUT[dossier.statut]}"></span>
      </span>
    </button>`;
}

function rendreBlocInformations() {
  return `
    <div class="carte">
      <h2>Informations</h2>
      <ul class="liste-personnes">
        ${donnees.personnes.map((p) => `<li><span class="role-personne">${LIBELLES_ROLE[p.role] || esc(p.role)}</span> ${esc(p.nom)}</li>`).join("")}
      </ul>
    </div>`;
}

function carteContradictions(domaine, titre) {
  const items = donnees.contradictions.map((c, i) => ({ ...c, i })).filter((c) => c.domaine === domaine);
  if (!items.length) return "";
  return `
    <div class="carte bloc-contradictions">
      <h2>${titre}</h2>
      <ul class="liste-contradictions">
        ${items.map((c) => `
          <li class="contradiction ${c.vedette ? "vedette" : ""}" data-contradiction="${c.i}">
            <div class="piste-entete">
              <div class="titre-signalement">${esc(c.titre)}</div>
              ${c.concerne ? `<span class="etiquette qualite-non">Concerne ${esc(c.concerne)}</span>` : ""}
            </div>
            <div class="description-signalement">${esc(c.description)}</div>
            ${c.question ? lienQuestion(c.question) : ""}
            <div class="sources-contradiction">
              ${c.sources.map((s) => `
                <div class="declaration-personne">
                  <div class="nom-declarant">${esc(s.personne || "NON TROUVÉ")} ${badgeSource(s.page, s.citation)}</div>
                  <div class="citation-declarant">« ${esc(s.citation)} »</div>
                </div>`).join("")}
            </div>
          </li>`).join("")}
      </ul>
      <p class="note-resume" style="margin-top:14px;">Rapprochements établis à partir des citations vérifiées du dossier — à apprécier par l'avocat, jamais une conclusion en soi.</p>
    </div>`;
}

function carteGardesAVue() {
  return `
    <div class="carte">
      <h2>Garde à vue : délais calculés</h2>
      ${donnees.gardes_a_vue.map((d) => `
        <div class="gav-personne">${esc(d.personne)}</div>
        <div class="stats-gav">
          <div class="stat-gav"><div class="valeur-stat">${esc(d.duree_totale_garde_a_vue)}</div><div class="libelle-stat">Durée totale</div></div>
          <div class="stat-gav"><div class="valeur-stat">${esc(d.delai_placement_notification_droits)}</div><div class="libelle-stat">Placement → notification des droits</div></div>
          <div class="stat-gav"><div class="valeur-stat">${esc(d.delai_demande_realisation_examen_medical)}</div><div class="libelle-stat">Demande → examen médical</div></div>
          <div class="stat-gav"><div class="valeur-stat">${esc(d.delai_demande_realisation_entretien_avocat)}</div><div class="libelle-stat">Demande → entretien avocat</div></div>
        </div>`).join("")}
      <p class="note-resume" style="margin-top:14px;">Délais calculés à partir des horodatages vérifiés du dossier — à recouper avec les textes applicables, jamais une conclusion en soi.</p>
    </div>`;
}

function carteFriseProcedure() {
  return `
    <div class="carte">
      <h2>Frise de la procédure</h2>
      <ul class="liste-faits frise">
        ${donnees.chronologie_procedure.map((e) => `
          <li>
            <div class="fait-entete">
              <span class="fait-page">${e.date ? `${e.date}${e.heure ? " à " + e.heure : ""} — ` : ""}</span>${badgeSource(e.page, e.citation)}
              ${e.personne ? `<span class="fait-personne">${esc(e.personne)}</span>` : ""}
            </div>
            <div class="fait-description">${LIBELLES_NATURE_PROCEDURE[e.nature] || esc(e.nature)}</div>
            <blockquote class="fait-citation">« ${esc(e.citation)} »</blockquote>
          </li>`).join("")}
      </ul>
    </div>`;
}

function carteRecoupements() {
  return `
    <div class="carte">
      <h2>Identifiants recoupés</h2>
      <ul class="liste-confrontations">${donnees.recoupements.map((e) => `
        <li class="confrontation">
          <div class="point-factuel">${esc(e.type_entite)} — ${esc(e.valeur)}</div>
          ${e.occurrences.map((o) => `
            <div class="declaration-personne">
              <div class="nom-declarant">${badgeSource(o.page, o.citation)}</div>
              <div class="citation-declarant">« ${esc(o.citation)} »</div>
            </div>`).join("")}
        </li>`).join("")}</ul>
    </div>`;
}

function carteConfrontations() {
  return `
    <div class="carte">
      <h2>Points communs entre plusieurs personnes</h2>
      <ul class="liste-confrontations">${donnees.confrontations.map((c) => `
        <li class="confrontation">
          <div class="point-factuel">${esc(c.point_factuel)}</div>
          ${c.declarations.map((d) => `
            <div class="declaration-personne">
              <div class="nom-declarant">${esc(d.personne || "NON TROUVÉ")} ${badgeSource(d.page, d.citation)}</div>
              <div class="citation-declarant">« ${esc(d.citation)} »</div>
            </div>`).join("")}
        </li>`).join("")}</ul>
    </div>`;
}

function rendreBlocChronologie() {
  const faits = donnees.chronologie_faits;
  const rendreFait = (f) => `
    <li>
      <div class="fait-entete">
        <span class="fait-page">${f.date ? `${f.date}${f.heure ? " à " + f.heure : ""} — ` : ""}</span>${badgeSource(f.page, f.citation)}
        ${f.personne ? `<span class="fait-personne">${esc(f.personne)}</span>` : ""}
      </div>
      <div class="fait-description">${esc(f.description || "")}</div>
      <blockquote class="fait-citation">« ${esc(f.citation)} »</blockquote>
    </li>`;
  const apercu = faits.slice(0, NB_FAITS_APERCU).map(rendreFait).join("");
  const reste = faits.slice(NB_FAITS_APERCU).map(rendreFait).join("");
  const boutonPlus = reste
    ? `<button type="button" class="lien" onclick="this.parentElement.classList.add('developpe'); this.hidden = true;">
         Voir les ${faits.length - NB_FAITS_APERCU} fait(s) supplémentaire(s)
       </button>`
    : "";
  return `
    <div class="carte bloc-chronologie">
      <h2>Chronologie des faits</h2>
      <ul class="liste-faits frise">${apercu}</ul>
      <ul class="liste-faits frise reste">${reste}</ul>
      ${boutonPlus}
    </div>`;
}

// --- Ajouts de la démo : résumé détaillé, journée reconstituée, défense ------

// Renvoi compact vers une pièce, à la manière d'une note de bas de page.
function renvoiSource(page, citation) {
  const source = sourcesParPage.get(page);
  references.push({ page, citation });
  const i = references.length - 1;
  const cote = source && source.cote ? `${source.cote} · ` : "";
  return `<button type="button" class="renvoi-source" title="${esc(libelleSource(page))} — « ${esc(citation)} »" onclick="ouvrirSource(${i})">${cote}p.${page}</button>`;
}

function rendreResumeDetaille() {
  const blocs = donnees.resume_detaille || [];
  if (!blocs.length) return "";
  const nbPhrases = blocs.reduce((n, b) => n + b.phrases.length, 0);
  return `
    <button type="button" class="lien bouton-resume-detaille" data-libelle="Lire le résumé détaillé — ${nbPhrases} points, chacun sourcé" onclick="basculerResumeDetaille(this)">Lire le résumé détaillé — ${nbPhrases} points, chacun sourcé</button>
    <div class="resume-detaille" hidden>
      ${blocs.map((b) => `
        <h3>${esc(b.titre)}</h3>
        <p>${b.phrases.map((ph) => `${esc(ph.texte)} ${ph.sources.map((s) => renvoiSource(s.page, s.citation)).join(" ")}`).join(" ")}</p>`).join("")}
    </div>`;
}

function basculerResumeDetaille(bouton) {
  const bloc = bouton.nextElementSibling;
  bloc.hidden = !bloc.hidden;
  bouton.textContent = bloc.hidden ? bouton.dataset.libelle : "Replier le résumé détaillé";
  if (!bloc.hidden) suivre("Résumé détaillé");
}
window.basculerResumeDetaille = basculerResumeDetaille;

const TYPES_JOURNEE = [
  ["victime", "Victime"],
  ["temoin", "Témoin"],
  ["vehicule", "Véhicule (LAPI)"],
  ["telephone", "Téléphonie"],
];

function minutes(heure) {
  const [h, m] = heure.split("h").map(Number);
  return h * 60 + (m || 0);
}

function rendreJournee() {
  const j = donnees.journee;
  if (!j) return "";
  const debut = minutes(j.debut);
  const duree = minutes(j.fin) - debut;
  const pos = (h) => `${((minutes(h) - debut) / duree) * 100}%`;
  const graduations = [];
  for (let m = Math.ceil(debut / 60) * 60; m <= debut + duree; m += 60) graduations.push(m);
  const pistes = TYPES_JOURNEE.map(([type, libelle]) => {
    const evts = j.evenements.map((e, i) => ({ ...e, i })).filter((e) => e.type === type);
    return `
      <div class="journee-piste">
        <div class="journee-libelle">${libelle}</div>
        <div class="journee-axe">
          ${evts.map((e) => e.fin
            ? `<button type="button" class="journee-plage type-${type}" style="left:${pos(e.heure)};width:calc(${pos(e.fin)} - ${pos(e.heure)})" title="${e.heure}–${e.fin} · ${esc(e.libelle)}" onclick="ouvrirEvenementJournee(${e.i})"></button>`
            : `<button type="button" class="journee-point type-${type}" style="left:${pos(e.heure)}" title="${e.heure} · ${esc(e.libelle)}" onclick="ouvrirEvenementJournee(${e.i})"></button>`).join("")}
        </div>
      </div>`;
  }).join("");
  return `
    <div class="carte bloc-journee">
      <h2>${esc(j.titre)}</h2>
      <div class="journee-graphe">
        ${pistes}
        <div class="journee-piste journee-heures">
          <div class="journee-libelle"></div>
          <div class="journee-axe">${graduations.map((m) => `<span style="left:${((m - debut) / duree) * 100}%">${Math.floor(m / 60)}h</span>`).join("")}</div>
        </div>
      </div>
      <ul class="journee-liste">
        ${j.evenements.map((e) => `
          <li class="type-${e.type}">
            <span class="journee-heure">${e.heure}${e.fin ? "–" + e.fin : ""}</span>
            <span class="journee-texte">${esc(e.libelle)}</span>
            ${badgeSource(e.page, e.citation)}
          </li>`).join("")}
      </ul>
      <ul class="journee-constats">${j.constats.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    </div>`;
}

function ouvrirEvenementJournee(i) {
  const e = donnees.journee.evenements[i];
  const k = references.findIndex((r) => r.page === e.page && r.citation === e.citation);
  if (k >= 0) ouvrirSource(k);
}
window.ouvrirEvenementJournee = ouvrirEvenementJournee;

const LIBELLES_QUALITE = {
  oui: ["Invocable par votre client", "qualite-oui"],
  discutable: ["Qualité à agir discutable", "qualite-discutable"],
  non: ["Non invocable par votre client", "qualite-non"],
};

function rendrePiste(p) {
  const [libelleQualite, classeQualite] = LIBELLES_QUALITE[p.qualite];
  return `
    <li class="piste ${classeQualite}">
      <div class="piste-entete">
        <div class="titre-signalement">${esc(p.titre)}</div>
        <div class="piste-etiquettes">
          <span class="etiquette ${classeQualite}">${libelleQualite}</span>
          ${p.qualite !== "non" ? `<span class="etiquette force">Piste ${esc(p.force)}</span>` : ""}
        </div>
      </div>
      <dl class="piste-details">
        <dt>Textes</dt><dd>${esc(p.texte)}</dd>
        <dt>Constat</dt><dd>${esc(p.analyse)}</dd>
        <dt>Qualité à agir</dt><dd>${esc(p.qualite_motif)}</dd>
        <dt>Grief</dt><dd>${esc(p.grief)}</dd>
      </dl>
      ${p.question ? lienQuestion(p.question) : ""}
      <div class="sources-contradiction">
        ${p.sources.map((s) => `
          <div class="declaration-personne">
            <div class="nom-declarant">${badgeSource(s.page, s.citation)}</div>
            <div class="citation-declarant">« ${esc(s.citation)} »</div>
          </div>`).join("")}
      </div>
    </li>`;
}

function enteteDefense(titre, sousTitre, complement = "") {
  return `
    <div class="carte defense-entete">
      <h2>${titre}</h2>
      <p class="defense-sous-titre">${sousTitre}</p>
      ${complement}
    </div>`;
}

function rendreOngletProcedure() {
  const d = donnees.defense;
  const retenues = d.forme.filter((p) => p.qualite !== "non");
  const ecartees = d.forme.filter((p) => p.qualite === "non");
  const compte = (q) => d.forme.filter((p) => p.qualite === q).length;
  return `
    ${enteteDefense(`Défense de forme — ${esc(d.client)}`, "Nullités, garde à vue et régularité des actes. Pendant l'instruction, les nullités se soulèvent par requête devant la chambre de l'instruction.", `
      <div class="defense-delai">
        <div class="titre-signalement">${esc(d.delai.titre)}</div>
        <div class="description-signalement">${esc(d.delai.texte)}</div>
      </div>`)}
    <div class="carte">
      <h2>Pistes de nullité</h2>
      <p class="defense-intro">${d.forme.length} irrégularités apparentes relevées dans le dossier. ${compte("oui")} sont invocables par votre client, ${compte("discutable")} suppose de démontrer sa qualité à agir, ${compte("non")} ne concernent que les coauteurs.</p>
      <ul class="liste-pistes">${retenues.map(rendrePiste).join("")}</ul>
      <details class="pistes-ecartees">
        <summary>Écartées pour votre client (${ecartees.length}) — droits propres aux coauteurs</summary>
        <ul class="liste-pistes">${ecartees.map(rendrePiste).join("")}</ul>
      </details>
    </div>
    ${carteGardesAVue()}
    ${carteContradictions("procedure", "Contradictions dans les actes de procédure")}
    ${carteFriseProcedure()}
    <p class="note-resume defense-note">Pistes proposées à partir des pièces du dossier — leur appréciation et leur qualification reviennent à l'avocat.</p>`;
}

function rendreOngletFond() {
  const d = donnees.defense;
  const colonne = (titre, items, classe, siVide = "") => `
    <div class="fond-colonne ${classe}">
      <div class="fond-titre">${titre} <span>${items.length}</span></div>
      ${!items.length && siVide ? `<p class="fond-vide">${esc(siVide)}</p>` : ""}
      ${items.map((s) => `
        <div class="declaration-personne">
          <div class="nom-declarant">${s.personne ? esc(s.personne) + " " : ""}${badgeSource(s.page, s.citation)}</div>
          <div class="citation-declarant">« ${esc(s.citation)} »</div>
        </div>`).join("")}
    </div>`;
  return `
    ${enteteDefense(`Défense au fond — ${esc(d.client)}`, "Ce que les pièces établissent, ce qu'elles contredisent et ce qui manque à l'accusation, fait par fait.")}
    ${carteContradictions("fond", "Contradictions entre pièces")}
    <div class="carte">
      <h2>Faits imputés au client : charges et éléments à décharge</h2>
      <ul class="liste-fond">
        ${d.fond.map((f) => `
          <li class="fait-fond">
            <div class="piste-entete">
              <div class="titre-signalement">${esc(f.fait)}</div>
              <span class="etiquette niveau-${f.niveau}">Charges ${esc(f.niveau)}s</span>
            </div>
            <div class="description-signalement">${esc(f.synthese)}</div>
            <div class="fond-colonnes">
              ${colonne("À charge", f.charge, "charge")}
              ${colonne("À décharge", f.decharge, "decharge", f.decharge_vide)}
            </div>
            ${(f.a_verifier || []).length ? `
              <div class="fond-a-verifier">
                <div class="fond-titre">À exploiter / à vérifier <span>${f.a_verifier.length}</span></div>
                ${f.a_verifier.map((v) => `
                  <div class="declaration-personne">
                    <div class="nom-declarant">${v.personne ? esc(v.personne) + " " : ""}${badgeSource(v.page, v.citation)}</div>
                    <div class="citation-declarant">« ${esc(v.citation)} »</div>
                    <div class="note-a-verifier">${esc(v.note)}</div>
                  </div>`).join("")}
              </div>` : ""}
          </li>`).join("")}
      </ul>
    </div>
    ${carteRecoupements()}
    ${carteConfrontations()}
    <p class="note-resume defense-note">Rapprochements proposés à partir des pièces du dossier — leur appréciation revient à l'avocat.</p>`;
}

function rendreDetailDossier() {
  references.length = 0;
  const badge = `<span class="badge badge-${dossier.statut}">${LIBELLES_STATUT[dossier.statut]}</span>`;
  const cree = new Date(dossier.cree_le).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Paris" });

  const infos = `
    <div class="infos-rapides">
      <span>Envoyé le <strong>${cree}</strong></span>
      <span><strong>${dossier.nb_pages}</strong> page(s)</span>
      <button type="button" class="bouton-index" onclick="ouvrirIndexClasseur()">${ICONE_INDEX}<span>Index du dossier</span></button>
    </div>
    <button type="button" class="barre-interroger" onclick="ouvrirQuestions()">
      ${ICONE_QUESTION}<span>Interroger le dossier…</span><small>Réponses tirées des pièces, chacune sourcée</small>
    </button>`;

  const panneauInfos = `
    <div class="carte bloc-resume">
      <h2>Résumé de l'affaire</h2>
      <p class="texte-resume">${esc(donnees.resume)}</p>
      ${rendreResumeDetaille()}
      <p class="note-resume">Généré par l'IA à partir des faits déjà vérifiés ci-dessous — à recouper, jamais à citer tel quel.</p>
    </div>
    ${rendreBlocInformations()}
    <div class="carte">
      <h2>Documents générés</h2>
      <div class="grille-livrables documents-demo">
        ${DOCUMENTS_GENERES.map(([chemin, titre, detail]) => `
          <a class="document-genere" href="${chemin}" target="_blank" rel="noopener" onclick="suivre('Document', { nom: '${titre}' })">
            ${ICONE_DOCUMENT}<span><strong>${titre}</strong><small>${detail}</small></span>
          </a>`).join("")}
      </div>
    </div>
    <div class="carte">
      <h2>Documents transmis</h2>
      <div class="liste-documents-transmis">
        <button type="button" onclick="ouvrirClasseur(1)">${ICONE_DOCUMENT}<span>${esc(dossier.fichier_source)}</span></button>
      </div>
    </div>`;

  const panneauChrono = rendreJournee() + rendreBlocChronologie();
  const panneauProcedure = rendreOngletProcedure();
  const panneauFond = rendreOngletFond();

  document.getElementById("vue-dossier").innerHTML = `
    <div class="entete-detail">
      <div>
        <h2>${esc(dossier.nom)}</h2>
        ${dossier.reference ? `<div class="ref-detail">${esc(dossier.reference)}</div>` : ""}
      </div>
      <div class="entete-actions">
        ${badge}
        <button type="button" id="bouton-supprimer-dossier" onclick="actionIndisponible('Suppression')">Supprimer</button>
      </div>
    </div>
    ${infos}
    <div class="barre-onglets">
      ${ONGLETS_DOSSIER.map(([id, libelle, icone]) => `
        <button type="button" class="onglet ${ongletDossierActif === id ? "actif" : ""}" data-onglet="${id}" onclick="basculerOnglet('${id}')">
          ${icone}<span>${libelle}</span>
        </button>`).join("")}
    </div>
    <div class="panneau-onglet" data-panneau="infos" ${ongletDossierActif === "infos" ? "" : "hidden"}>${panneauInfos}</div>
    <div class="panneau-onglet" data-panneau="chrono" ${ongletDossierActif === "chrono" ? "" : "hidden"}>${panneauChrono}</div>
    <div class="panneau-onglet" data-panneau="procedure" ${ongletDossierActif === "procedure" ? "" : "hidden"}>${panneauProcedure}</div>
    <div class="panneau-onglet" data-panneau="fond" ${ongletDossierActif === "fond" ? "" : "hidden"}>${panneauFond}</div>`;
}

function afficherVue(nom) {
  document.getElementById("vue-dossier").hidden = nom !== "dossier";
  document.getElementById("vue-nouveau").hidden = nom !== "nouveau";
  document.querySelector(".item-dossier").classList.toggle("selectionne", nom === "dossier");
  document.getElementById("appli").classList.add("contenu-actif");
  document.getElementById("bouton-retour-mobile").hidden = false;
  document.getElementById("colonne-contenu").scrollTop = 0;
}

function ouvrirDossier() {
  afficherVue("dossier");
}

// --- Nouveau dossier : le formulaire, verrouillé ----------------------------
//
// L'avocat voit ce qu'on lui demandera pour lancer une analyse. Seuls deux
// choix sont manipulables — pour qui il intervient, et quelle personne — afin
// de montrer que le formulaire s'adapte (la date de mise en examen n'est
// demandée que pour un client mis en examen). Rien ne peut être saisi, aucun
// fichier ne peut être choisi : tout autre clic affiche l'avis habituel.
//
// Les personnes et informations proposées sont celles que Lytis détecte dans
// le dossier de démonstration.

const PERSONNES_DETECTEES = {
  defense: [
    { nom: "MARTINON Lucas", qualite: "Mis en examen — à confirmer", source: "copie délivrée à son avocat (art. 114 CPP), inventaire p.1", misEnExamen: true, date: "", detention: "Non détectée" },
    { nom: "FONTANEL Yannick", qualite: "Mis en examen", source: "ordonnance du JLD, C1 p.31", misEnExamen: true, date: "au plus tard le 12/03/2026 (C1 p.31)", detention: "Détention provisoire depuis le 12/03/2026 (C1 p.31)" },
    { nom: "BERTHOLLET Gilles", qualite: "Gardé à vue, remis en liberté sur convocation", source: "registre de garde à vue, D22 p.23", misEnExamen: false, detention: "Non" },
  ],
  partie_civile: [
    { nom: "SERMET Odile", qualite: "Constituée partie civile", source: "PV de plainte, D1 p.2" },
  ],
};

const nouveauDossier = { intervention: "defense", personne: 0 };

function choisirIntervention(valeur) {
  nouveauDossier.intervention = valeur;
  nouveauDossier.personne = 0;
  rendreNouveauDossier();
  suivre("Nouveau dossier — intervention", { choix: valeur });
}
window.choisirIntervention = choisirIntervention;

function choisirPersonne(index) {
  nouveauDossier.personne = Number(index);
  rendreNouveauDossier();
}
window.choisirPersonne = choisirPersonne;

function clicFormulaire(evenement) {
  if (evenement.target.closest(".interactif")) return;
  actionIndisponible("Nouveau dossier");
}
window.clicFormulaire = clicFormulaire;

function champ(libelle, controle, aide = "") {
  return `
    <div class="champ">
      <label>${libelle}</label>
      ${controle}
      ${aide ? `<p class="aide-champ">${aide}</p>` : ""}
    </div>`;
}

function rendreNouveauDossier() {
  const { intervention, personne } = nouveauDossier;
  const personnes = PERSONNES_DETECTEES[intervention] || [];
  const choisie = personnes[personne];
  const option = (valeur, titre, detail) => `
    <label class="choix-intervention interactif ${intervention === valeur ? "actif" : ""}">
      <input type="radio" name="intervention" value="${valeur}" ${intervention === valeur ? "checked" : ""} onchange="choisirIntervention('${valeur}')" />
      <span><strong>${titre}</strong><small>${detail}</small></span>
    </label>`;

  let blocPersonne = "";
  if (choisie) {
    const selecteur = `<select class="interactif" onchange="choisirPersonne(this.value)">${personnes.map((p, i) => `<option value="${i}" ${i === personne ? "selected" : ""}>${esc(p.nom)}</option>`).join("")}</select>`;
    blocPersonne = `
      <div class="grille-champs">
        ${champ(intervention === "defense" ? "Votre client" : "La partie civile que vous assistez", selecteur, "Choisi parmi les personnes détectées dans le dossier.")}
        ${champ("Qualité détectée", `<input type="text" disabled value="${esc(choisie.qualite)}" />`, `Source : ${esc(choisie.source)}.`)}
      </div>
      ${choisie.misEnExamen ? `
        <div class="bloc-conditionnel">
          ${champ("Date de mise en examen — confirmation obligatoire",
            `<input type="text" disabled ${choisie.date ? `value="${esc(choisie.date)}"` : `placeholder="jj/mm/aaaa — non trouvée dans la copie"`} />`,
            "Demandée parce que votre client est mis en examen : elle fait courir le délai de six mois pour soulever les nullités (art. 173-1 CPP). Lytis la propose quand il la trouve ; vous la confirmez.")}
        </div>` : ""}
      ${intervention === "defense" && !choisie.misEnExamen ? `<p class="note-conditionnelle">Pas de mise en examen détectée pour cette personne : aucune date à renseigner, aucun délai de nullité à suivre pour l'instant.</p>` : ""}`;
  } else {
    blocPersonne = `<p class="note-conditionnelle">Lecture neutre : chronologie, procédure, contradictions et recoupements, sans tri selon la qualité à agir d'un client.</p>`;
  }

  const detecte = [
    ["Référence", "JI 26/00044 · parquet 26.038.01152"],
    ["Juridiction", "TJ de Grenoble, cabinet d'instruction n°2"],
    ["Stade", "Information judiciaire"],
    ...(intervention === "defense" && choisie ? [["Détention", choisie.detention]] : []),
    ["Nom du dossier", choisie ? `${choisie.nom} — JI 26/00044` : "Affaire GENTIANE — JI 26/00044"],
  ];

  document.getElementById("vue-nouveau").innerHTML = `
    <div class="entete-detail">
      <div>
        <h2>Nouveau dossier</h2>
        <div class="ref-detail">Deux étapes : déposer la copie, dire pour qui vous intervenez. Lytis déduit le reste du dossier.</div>
      </div>
    </div>
    <div class="formulaire-demo" onclick="clicFormulaire(event)">
      <div class="carte">
        <h2><span class="numero-etape">1</span>La copie du dossier</h2>
        <div class="zone-depot" aria-disabled="true">
          ${ICONE_DOCUMENT}
          <strong>Déposez les pièces</strong>
          <span>PDF, Word, images (scans ou photos), archives ZIP — plusieurs fichiers à la fois. Les pièces scannées ou photographiées sont lues automatiquement.</span>
        </div>
      </div>

      <div class="carte">
        <h2><span class="numero-etape">2</span>Vous intervenez pour</h2>
        <div class="choix-interventions">
          ${option("defense", "La défense d'un mis en cause", "Gardé à vue, mis en examen, prévenu, accusé")}
          ${option("partie_civile", "Une partie civile", "Victime constituée ou à constituer")}
          ${option("neutre", "Sans client désigné", "Lecture neutre du dossier")}
        </div>
        ${blocPersonne}
      </div>

      <div class="carte">
        <h2>Détecté automatiquement, modifiable ensuite</h2>
        <dl class="liste-detectee">
          ${detecte.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}
        </dl>
        <p class="aide-champ">Valeurs détectées sur le dossier de démonstration.</p>
      </div>

      <div class="carte">
        <h2>Ce que vous obtiendrez</h2>
        <ul class="liste-obtenu">
          <li><strong>Chronologie</strong> — faits datés, journée des faits reconstituée, chacun avec sa citation, sa cote et sa page.</li>
          <li><strong>Procédure</strong> — pistes de nullité triées selon ce que votre client peut invoquer, délais de garde à vue, frise des actes.</li>
          <li><strong>Fond</strong> — contradictions entre pièces, charges et éléments à décharge par fait, recoupements.</li>
          <li><strong>Documents</strong> — note de défense et dossier surligné, prêts à télécharger.</li>
        </ul>
      </div>

      <div class="actions-formulaire">
        <button type="button" class="bouton-primaire" disabled>Lancer l'analyse</button>
        <span class="aide-champ">Démonstration : rien ne peut être déposé ni envoyé.</span>
      </div>
    </div>`;
}

function ouvrirNouveauDossier() {
  fermerClasseur();
  rendreNouveauDossier();
  afficherVue("nouveau");
  suivre("Nouveau dossier");
}
window.ouvrirNouveauDossier = ouvrirNouveauDossier;
window.ouvrirDossier = ouvrirDossier;

function retourListeMobile() {
  document.getElementById("appli").classList.remove("contenu-actif");
  fermerClasseur();
}
window.retourListeMobile = retourListeMobile;

// Clic sur une contradiction : la mesure distingue la contradiction phare.
document.addEventListener("click", (e) => {
  const item = e.target.closest("[data-contradiction]");
  if (!item || !e.target.closest(".badge-source")) return;
  const c = donnees.contradictions[Number(item.dataset.contradiction)];
  suivre("Contradiction", { titre: c.titre.slice(0, 60), phare: c.vedette ? "oui" : "non" });
});

// --- Questions au dossier ----------------------------------------------------
//
// Dans le produit, l'avocat interroge librement son dossier ; chaque réponse
// ne s'appuie que sur les pièces, chaque phrase porte sa source, et Lytis dit
// quand l'information n'y figure pas. Dans la démonstration, sans serveur, les
// réponses sont préparées et vérifiées contre le PDF comme tout le reste :
// on choisit une question proposée, la saisie libre est verrouillée.

const ICONE_QUESTION = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"></path><path d="M9.5 9.5a2.5 2.5 0 0 1 4.8 1c0 1.7-2.3 2-2.3 3.5M12 17h.01"></path></svg>`;
const QUESTIONS = new Map((donnees.questions || []).map((q) => [q.id, q]));
const filQuestions = [];

function lienQuestion(id) {
  const q = QUESTIONS.get(id);
  if (!q) return "";
  return `<button type="button" class="lien-question" onclick="event.stopPropagation(); ouvrirQuestions('${id}')">${ICONE_QUESTION}<span>Demander au dossier : « ${esc(q.question)} »</span></button>`;
}

function rendreQuestions() {
  const el = document.getElementById("classeur-questions");
  const restantes = [...QUESTIONS.values()].filter((q) => !filQuestions.includes(q.id));
  el.innerHTML = `
    <div class="questions">
      <div class="questions-intro">
        <div class="questions-titre">${ICONE_QUESTION}<span>Questions au dossier</span></div>
        <ul>
          <li>Réponses tirées <strong>uniquement des pièces</strong> du dossier.</li>
          <li>Chaque phrase renvoie à sa <strong>cote et sa page</strong> : un clic ouvre la pièce.</li>
          <li>Si l'information n'y est pas, Lytis <strong>le dit</strong>.</li>
        </ul>
      </div>
      <div class="fil-questions">
        ${filQuestions.map((id) => {
          const q = QUESTIONS.get(id);
          return `
            <div class="bulle-question">${esc(q.question)}</div>
            <div class="bulle-reponse ${q.nature === "hors_dossier" ? "hors-dossier" : ""}">
              ${q.reponse.map((ph) => `<p>${esc(ph.texte)} ${ph.sources.map((s) => renvoiSource(s.page, s.citation)).join(" ")}</p>`).join("")}
            </div>`;
        }).join("")}
      </div>
      ${restantes.length ? `
        <div class="suggestions">
          <div class="suggestions-titre">${filQuestions.length ? "Autres questions" : "Questions proposées"}</div>
          ${restantes.map((q) => `<button type="button" class="suggestion" onclick="poserQuestion('${q.id}')">${esc(q.question)}</button>`).join("")}
        </div>` : ""}
      <div class="saisie-question" onclick="actionIndisponible('Question libre')">
        <input type="text" disabled placeholder="Posez votre question sur le dossier…" />
        <button type="button" class="bouton-primaire" disabled>Envoyer</button>
      </div>
      <p class="aide-champ questions-note">Démonstration : réponses préparées sur le dossier fictif, vérifiées contre les pièces. La saisie libre est réservée à votre espace.</p>
    </div>`;
}

function poserQuestion(id) {
  if (!QUESTIONS.has(id)) return;
  if (!filQuestions.includes(id)) filQuestions.push(id);
  rendreQuestions();
  suivre("Question", { id });
  // Amène la dernière réponse sous les yeux.
  requestAnimationFrame(() => {
    const reponses = document.querySelectorAll("#classeur-questions .bulle-question");
    const derniere = [...reponses].find((b) => b.textContent === QUESTIONS.get(id).question);
    if (derniere) derniere.scrollIntoView({ block: "start", behavior: "smooth" });
  });
}
window.poserQuestion = poserQuestion;

function ouvrirQuestions(id) {
  document.getElementById("classeur").hidden = false;
  basculerModeClasseur("questions");
  rendreQuestions();
  if (id) poserQuestion(id);
  else document.getElementById("classeur-corps").scrollTop = 0;
}
window.ouvrirQuestions = ouvrirQuestions;

// --- Mentions légales et confidentialité -------------------------------------
//
// Le texte suit l'état réel de la page : il dit « aucune mesure d'audience »
// tant que Plausible n'est pas configuré, et signale chaque information
// d'éditeur manquante au lieu d'en inventer une.

function champEditeur(valeur) {
  return valeur ? esc(valeur) : `<span class="a-completer">à compléter</span>`;
}

function rendreMentions() {
  const e = CONFIG.editeur || {};
  const h = CONFIG.hebergeur || {};
  const mesure = CONFIG.plausible && CONFIG.plausible.domaine;
  return `
    <section>
      <h3>Nature du site</h3>
      <p>Ce site présente une démonstration d'un prototype de logiciel d'aide à l'analyse de dossiers pénaux, Lytis. Il ne propose ni service, ni vente, ni création de compte. Aucune fonction n'y traite de document réel.</p>
    </section>
    <section>
      <h3>Dossier fictif</h3>
      <p>Le dossier présenté est entièrement fictif. Les personnes, adresses, numéros de téléphone, plaques d'immatriculation et références de procédure sont inventés ; les communes citées ne servent que de décor. Toute ressemblance avec des personnes ou des affaires réelles serait fortuite.</p>
    </section>
    <section>
      <h3>Absence de conseil juridique</h3>
      <p>Les analyses affichées (pistes de nullité, contradictions, charges et éléments à décharge) illustrent le fonctionnement envisagé du logiciel. Elles ne constituent pas une consultation juridique et n'ont aucune valeur juridique. Leur appréciation revient toujours à l'avocat.</p>
    </section>
    <section>
      <h3>Données personnelles</h3>
      <ul>
        <li><strong>Aucune collecte.</strong> Le site ne comporte ni formulaire, ni compte, ni dépôt de document : il ne recueille aucune donnée vous concernant.</li>
        <li><strong>Aucun cookie.</strong> Votre navigateur conserve seulement l'indication que la visite guidée a déjà été vue, pour ne pas la relancer. Cette information reste sur votre appareil et n'est jamais transmise ; elle relève des traceurs de personnalisation de l'interface, dispensés de consentement.</li>
        <li><strong>Mesure d'audience.</strong> ${mesure
          ? "Fréquentation mesurée avec Plausible Analytics, sans cookie ni identifiant individuel : seules des statistiques agrégées sont produites (pages vues, étapes de la démonstration, campagne indiquée dans le lien)."
          : "Aucune mesure d'audience n'est active sur ce site."}</li>
        <li><strong>Hébergement.</strong> Comme tout hébergeur, ${esc(h.nom || "l'hébergeur")} enregistre des journaux techniques de connexion (adresse IP, date, page demandée) à des fins de sécurité et de bon fonctionnement, sur le fondement de l'intérêt légitime. L'hébergeur est établi aux États-Unis ; ces journaux sont traités dans les conditions de sa politique de confidentialité (${esc(h.site || "")}/privacy).</li>
        <li><strong>Vos droits.</strong> Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition et de limitation, à exercer auprès de l'éditeur : ${champEditeur(e.email)}. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).</li>
      </ul>
    </section>
    <section>
      <h3>Éditeur</h3>
      <dl class="mentions-identite">
        <dt>Nom</dt><dd>${champEditeur(e.nom)}</dd>
        <dt>Statut</dt><dd>${champEditeur(e.statut)}</dd>
        <dt>Adresse</dt><dd>${champEditeur(e.adresse)}</dd>
        <dt>Contact</dt><dd>${champEditeur(e.email)}</dd>
        <dt>Directeur de la publication</dt><dd>${champEditeur(e.directeur)}</dd>
      </dl>
    </section>
    <section>
      <h3>Hébergeur</h3>
      <p>${esc(h.nom || "")} — ${esc(h.adresse || "")} — ${esc(h.site || "")}</p>
    </section>
    <section>
      <h3>Propriété intellectuelle</h3>
      <p>La présentation, les textes et l'interface de cette démonstration ne peuvent être reproduits sans l'accord de l'éditeur.</p>
    </section>`;
}

function ouvrirMentions() {
  document.getElementById("mentions-corps").innerHTML = rendreMentions();
  document.getElementById("mentions").hidden = false;
  document.querySelector(".mentions-fermer").focus();
  suivre("Mentions légales");
}
window.ouvrirMentions = ouvrirMentions;

function fermerMentions() {
  document.getElementById("mentions").hidden = true;
}
window.fermerMentions = fermerMentions;

// --- Visite guidée -----------------------------------------------------------

const CLE_PARCOURS = "lytis-demo-parcours-vu";
const vedette = donnees.contradictions.find((c) => c.vedette) || donnees.contradictions[0];
const preuveVedette = vedette.sources[vedette.sources.length - 1];

const ETAPES_PARCOURS = [
  {
    onglet: "infos",
    cible: ".bloc-resume",
    titre: "Le dossier est déjà lu",
    texte: () => `${dossier.nb_pages} pages scannées, dépouillées : ${donnees.personnes.length} personnes, ${donnees.index_pieces.length} pièces indexées. Le résumé détaillé renvoie chaque phrase à sa pièce.`,
  },
  {
    onglet: "chrono",
    cible: ".bloc-journee .journee-graphe",
    titre: "La journée des faits, reconstituée",
    texte: () => `Victime, témoin, lecture des plaques, bornages : ${donnees.journee.evenements.length} évènements du ${donnees.journee.date} croisés sur un même axe, chacun cliquable vers sa pièce.`,
  },
  {
    onglet: "procedure",
    cible: ".liste-pistes .piste:first-child .piste-entete",
    titre: "Procédure : les nullités, triées pour votre client",
    texte: () => {
      const f = donnees.defense.forme;
      const n = (q) => f.filter((p) => p.qualite === q).length;
      return `${f.length} irrégularités relevées : ${n("oui")} invocables par votre client, ${n("discutable")} où sa qualité à agir reste à démontrer, ${n("non")} qui ne concernent que ses coauteurs.`;
    },
  },
  {
    onglet: "fond",
    cible: ".contradiction.vedette .declaration-personne:last-child .badge-source",
    titre: "Fond : les pièces qui ne concordent pas",
    texte: () => `Le rapport de synthèse impute au client le cambriolage du 19/02 ; son relevé de pointage le place au travail à la même heure. Ouvrez la pièce ${(sourcesParPage.get(preuveVedette.page) || {}).cote || ""}, page ${preuveVedette.page}.`,
    bouton: "Ouvrir la pièce",
  },
];

let parcoursActif = false;
let etapeParcours = 0;

function lancerParcours() {
  parcoursActif = true;
  etapeParcours = 0;
  document.getElementById("parcours").hidden = false;
  afficherEtape();
}
window.lancerParcours = lancerParcours;

function afficherEtape() {
  const etape = ETAPES_PARCOURS[etapeParcours];
  basculerOnglet(etape.onglet);
  document.querySelectorAll(".parcours-cible").forEach((el) => el.classList.remove("parcours-cible"));
  const cible = document.querySelector(etape.cible);
  document.getElementById("parcours-etape").textContent = `${etapeParcours + 1} / ${ETAPES_PARCOURS.length}`;
  document.getElementById("parcours-titre").textContent = etape.titre;
  document.getElementById("parcours-texte").textContent = etape.texte();
  document.getElementById("parcours-suivant").textContent = etape.bouton || "Suivant";
  const bulle = document.getElementById("parcours-bulle");
  if (cible) {
    cible.classList.add("parcours-cible");
    cible.scrollIntoView({ block: window.innerWidth <= 720 ? "start" : "center", behavior: "smooth" });
    // Positionne la bulle une fois le défilement terminé.
    setTimeout(() => placerBulle(bulle, cible), 350);
  }
  placerBulle(bulle, cible);
}

function placerBulle(bulle, cible) {
  if (!parcoursActif) return;
  if (window.innerWidth <= 720 || !cible) {
    bulle.classList.add("bulle-bas");
    bulle.style.left = bulle.style.top = "";
    return;
  }
  bulle.classList.remove("bulle-bas");
  const r = cible.getBoundingClientRect();
  const largeur = bulle.offsetWidth;
  const hauteur = bulle.offsetHeight;
  const marge = 16;
  const hautBorne = (t) => Math.min(Math.max(12, t), window.innerHeight - hauteur - 12);
  let left;
  let top;
  // Bord droit de la colonne de lecture : la bulle se place au-delà, sur le
  // classeur au besoin, pour ne jamais masquer le texte qu'elle commente.
  const colonne = document.querySelector("#colonne-contenu > div");
  const bordDroit = Math.max(r.right, colonne ? colonne.getBoundingClientRect().right : r.right);
  if (bordDroit + marge + largeur <= window.innerWidth - 12) {
    left = bordDroit + marge;
    top = hautBorne(r.top);
  } else if (r.left - marge - largeur >= 12) {
    left = r.left - marge - largeur;
    top = hautBorne(r.top);
  } else {
    left = Math.min(Math.max(12, r.left), window.innerWidth - largeur - 12);
    top = r.bottom + marge;
    if (top + hauteur > window.innerHeight - 12) top = Math.max(12, r.top - hauteur - marge);
  }
  bulle.style.left = `${left}px`;
  bulle.style.top = `${top}px`;
}

function etapeSuivante() {
  if (etapeParcours < ETAPES_PARCOURS.length - 1) {
    etapeParcours += 1;
    afficherEtape();
    return;
  }
  const i = references.findIndex((r) => r.page === preuveVedette.page && r.citation === preuveVedette.citation);
  suivre("Contradiction", { titre: vedette.titre.slice(0, 60), phare: "oui" });
  if (i >= 0) ouvrirSource(i);
  terminerParcours(true);
}
window.etapeSuivante = etapeSuivante;

function terminerParcours(complet) {
  if (!parcoursActif) return;
  parcoursActif = false;
  document.getElementById("parcours").hidden = true;
  document.querySelectorAll(".parcours-cible").forEach((el) => el.classList.remove("parcours-cible"));
  ecrireStockage(CLE_PARCOURS, "1");
  suivre(complet ? "Parcours terminé" : "Parcours passé", { etape: String(etapeParcours + 1) });
}
window.terminerParcours = terminerParcours;

window.addEventListener("resize", () => {
  if (!parcoursActif) return;
  placerBulle(document.getElementById("parcours-bulle"), document.querySelector(".parcours-cible"));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!document.getElementById("mentions").hidden) fermerMentions();
    else if (parcoursActif) terminerParcours(false);
    else fermerAvis();
  }
  if (!document.getElementById("classeur").hidden && !document.getElementById("classeur-piece").hidden) {
    if (e.key === "ArrowRight") allerPageClasseur(1);
    if (e.key === "ArrowLeft") allerPageClasseur(-1);
  }
});

// --- Démarrage ---------------------------------------------------------------

rendreListeLaterale();
rendreDetailDossier();
// Sur ordinateur, l'index du dossier est ouvert d'emblée : l'avocat voit tout
// de suite qu'il a le classeur complet sous la main. Sur téléphone, le
// classeur couvrirait tout l'écran : il reste fermé.
if (window.matchMedia("(min-width: 721px)").matches) ouvrirIndexClasseur();
suivre("Arrivée");
if (!lireStockage(CLE_PARCOURS)) setTimeout(lancerParcours, 700);
