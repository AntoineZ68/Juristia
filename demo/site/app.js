// Démo Lytis — vitrine statique.
//
// Les fonctions de rendu reprennent celles de l'application
// (web/frontend/index.html) : mêmes classes, même balisage, même texte. Seule
// la source des données change — un fichier local (data.js) au lieu de l'API
// et de Supabase — et toute action qui demanderait un serveur (dépôt,
// suppression, téléchargement) est remplacée par un renvoi vers l'accès.
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

// Tous les boutons d'accès pointent vers une seule adresse, réglée dans config.js.
document.querySelectorAll("[data-cta]").forEach((a) => { a.href = CONFIG.urlAcces || "#"; });

document.addEventListener("click", (e) => {
  const cta = e.target.closest("[data-cta]");
  if (cta) suivre("CTA", { emplacement: cta.dataset.cta });
});

// --- Utilitaires ------------------------------------------------------------

function esc(texte) {
  return String(texte ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function lireStockage(cle) { try { return localStorage.getItem(cle); } catch { return null; } }
function ecrireStockage(cle, valeur) { try { localStorage.setItem(cle, valeur); } catch { /* navigation privée */ } }

// --- Libellés (repris de l'application, complétés pour ce dossier) ---------

const LIVRABLES = [
  ["00_dossier_surligne.pdf", "PDF surligné"],
  ["01_index.xlsx", "Index des pièces"],
  ["02_chronologie_procedure.docx", "Chronologie de la procédure"],
  ["03_chronologie_faits.docx", "Chronologie des faits"],
  ["04_declarations.xlsx", "Déclarations"],
  ["05_personnalite.docx", "Personnalité"],
  ["06_signalements_procedure.docx", "Signalements procéduraux"],
  ["99_controle.md", "Rapport de contrôle"],
];

const ICONE_DOCUMENT = `<svg class="icone-doc" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg>`;
const ICONE_INDEX = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H18v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H18"/><path d="M8 7.5h6M8 11h6"/></svg>`;

const ONGLETS_DOSSIER = [
  ["infos", "Informations générales", `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`],
  ["chrono", "Chronologie", `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`],
  ["analyse", "Analyse IA", `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.9 4.9L19 8.8l-4.9 1.9L12 15.6l-1.9-4.9L5 8.8l4.9-1.9L12 2z"></path><path d="M19 15l.9 2.2L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.8L19 15z"></path></svg>`],
];

const LIBELLES_STATUT = { en_attente: "En attente", en_cours: "En cours", termine: "Terminé", erreur: "Erreur" };

const LIBELLES_ROLE = {
  client: "Client (mis en cause)", mis_en_cause: "Mis en cause", victime: "Victime", témoin: "Témoin",
  expert: "Expert", enqueteur: "Enquêteur", magistrat: "Magistrat", avocat: "Avocat",
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
  ouvrirClasseur(ref.page, ref.citation);
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

function basculerModeClasseur(mode) {
  document.querySelectorAll(".mode-classeur").forEach((b) => b.classList.toggle("actif", b.dataset.mode === mode));
  document.getElementById("classeur-piece").hidden = mode !== "piece";
  document.getElementById("classeur-index").hidden = mode !== "index";
  document.getElementById("classeur-navigation").hidden = mode !== "piece";
  if (mode === "index") rendreIndexClasseur();
}
window.basculerModeClasseur = basculerModeClasseur;

function cheminPage(n) {
  return `pages/p${String(n).padStart(3, "0")}.webp`;
}

function majNavigationClasseur() {
  document.getElementById("classeur-position").textContent = `Page ${classeurPage} / ${NB_PAGES}`;
  document.getElementById("classeur-source").textContent = libelleSource(classeurPage);
  const boutons = document.querySelectorAll(".classeur-navigation button");
  boutons[0].disabled = classeurPage <= 1;
  boutons[1].disabled = classeurPage >= NB_PAGES;
}

// Position verticale d'un élément dans la zone défilante du classeur.
function hautDans(conteneur, element) {
  return element.getBoundingClientRect().top - conteneur.getBoundingClientRect().top + conteneur.scrollTop;
}

function afficherPageClasseur(numero, citation) {
  classeurPage = Math.min(Math.max(1, numero), NB_PAGES);
  citationReperee = citation || null;
  majNavigationClasseur();
  const zones = (citation && DEMO.positions[`${classeurPage}|${citation}`]) || [];
  const conteneur = document.getElementById("classeur-piece");
  const source = sourcesParPage.get(classeurPage);
  conteneur.innerHTML = `
    <div class="page-cadre" onclick="basculerZoom(this)" title="Cliquer pour agrandir">
      <img src="${cheminPage(classeurPage)}" width="1100" height="1556" alt="Page ${classeurPage} du dossier${source && source.cote ? `, cote ${source.cote}` : ""}" decoding="async" />
      ${zones.map(([x0, y0, x1, y1]) => `<span class="zone-reperage" style="left:${x0 * 100}%;top:${y0 * 100}%;width:${(x1 - x0) * 100}%;height:${(y1 - y0) * 100}%"></span>`).join("")}
    </div>`;
  const corps = document.getElementById("classeur-corps");
  if (zones.length) {
    // Amène le passage cité sous les yeux du lecteur, sans attendre le
    // chargement de l'image : ses dimensions sont connues d'avance.
    requestAnimationFrame(() => {
      const cadre = conteneur.querySelector(".page-cadre");
      const haut = Math.min(...zones.map((z) => z[1]));
      corps.scrollTop = Math.max(0, hautDans(corps, cadre) + haut * cadre.clientHeight - corps.clientHeight * 0.3);
    });
  } else {
    corps.scrollTop = 0;
  }
  // Page suivante préchargée : le feuilletage reste instantané.
  if (classeurPage < NB_PAGES) { const img = new Image(); img.src = cheminPage(classeurPage + 1); }
}

// Clic sur la page : agrandissement ×2, centré sur le passage cité s'il y en a un.
function basculerZoom(cadre) {
  const corps = document.getElementById("classeur-corps");
  const agrandie = cadre.classList.toggle("agrandie");
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
  document.getElementById("avis-titre").textContent = `${nomAction} — disponible dans votre espace`;
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

function rendreContradictions() {
  return `
    <div class="carte bloc-contradictions">
      <h2>Contradictions entre pièces</h2>
      <ul class="liste-contradictions">
        ${donnees.contradictions.map((c, i) => `
          <li class="contradiction ${c.vedette ? "vedette" : ""}" data-contradiction="${i}">
            <div class="titre-signalement">${esc(c.titre)}</div>
            <div class="description-signalement">${esc(c.description)}</div>
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

function rendreBlocAnalyseIA() {
  const sections = [rendreContradictions()];

  sections.push(`
    <div class="carte">
      <h2>Points d'attention structurels</h2>
      <ul class="liste-signalements">${donnees.signalements.map((s) => `
        <li class="signalement">
          <div class="titre-signalement">${esc(s.titre)}</div>
          <div class="description-signalement">${esc(s.description)}</div>
          ${s.citation_reference ? `<div class="source-signalement">${badgeSource(s.page_reference, s.citation_reference)} « ${esc(s.citation_reference)} »</div>` : ""}
        </li>`).join("")}</ul>
    </div>`);

  sections.push(`
    <div class="carte">
      <h2>Chronologie de garde à vue</h2>
      ${donnees.gardes_a_vue.map((d) => `
        <div class="gav-personne">${esc(d.personne)}</div>
        <div class="stats-gav">
          <div class="stat-gav"><div class="valeur-stat">${esc(d.duree_totale_garde_a_vue)}</div><div class="libelle-stat">Durée totale</div></div>
          <div class="stat-gav"><div class="valeur-stat">${esc(d.delai_placement_notification_droits)}</div><div class="libelle-stat">Placement → notification des droits</div></div>
          <div class="stat-gav"><div class="valeur-stat">${esc(d.delai_demande_realisation_examen_medical)}</div><div class="libelle-stat">Demande → examen médical</div></div>
          <div class="stat-gav"><div class="valeur-stat">${esc(d.delai_demande_realisation_entretien_avocat)}</div><div class="libelle-stat">Demande → entretien avocat</div></div>
        </div>`).join("")}
      <p class="note-resume" style="margin-top:14px;">Délais calculés à partir des horodatages vérifiés du dossier — à recouper avec les textes applicables, jamais une conclusion en soi.</p>
    </div>`);

  sections.push(`
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
    </div>`);

  sections.push(`
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
    </div>`);

  sections.push(`
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
    </div>`);

  return sections.join("");
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

function rendreDetailDossier() {
  references.length = 0;
  const badge = `<span class="badge badge-${dossier.statut}">${LIBELLES_STATUT[dossier.statut]}</span>`;
  const cree = new Date(dossier.cree_le).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Paris" });

  const infos = `
    <div class="infos-rapides">
      <span>Envoyé le <strong>${cree}</strong></span>
      <span><strong>${dossier.nb_pages}</strong> page(s)</span>
      <button type="button" class="bouton-index" onclick="ouvrirIndexClasseur()">${ICONE_INDEX}<span>Index du dossier</span></button>
    </div>`;

  const panneauInfos = `
    <div class="carte bloc-resume">
      <h2>Résumé de l'affaire</h2>
      <p class="texte-resume">${esc(donnees.resume)}</p>
      <p class="note-resume">Généré par l'IA à partir des faits déjà vérifiés ci-dessous — à recouper, jamais à citer tel quel.</p>
    </div>
    ${rendreBlocInformations()}
    <div class="carte">
      <h2>Documents générés</h2>
      <div class="grille-livrables">
        ${LIVRABLES.map(([, libelle]) =>
          `<button type="button" onclick="actionIndisponible('${libelle.replace(/'/g, "\\'")}')">${ICONE_DOCUMENT}<span>${libelle}</span></button>`
        ).join("")}
      </div>
    </div>
    <div class="carte">
      <h2>Documents transmis</h2>
      <div class="liste-documents-transmis">
        <button type="button" onclick="ouvrirClasseur(1)">${ICONE_DOCUMENT}<span>${esc(dossier.fichier_source)}</span></button>
      </div>
    </div>`;

  const panneauChrono = rendreBlocChronologie();
  const panneauAnalyse = rendreBlocAnalyseIA();

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
    <div class="panneau-onglet" data-panneau="analyse" ${ongletDossierActif === "analyse" ? "" : "hidden"}>${panneauAnalyse}</div>`;
}

function ouvrirDossier() {
  document.getElementById("appli").classList.add("contenu-actif");
  document.getElementById("bouton-retour-mobile").hidden = false;
}
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

// --- Visite guidée -----------------------------------------------------------

const CLE_PARCOURS = "lytis-demo-parcours-vu";
const vedette = donnees.contradictions.find((c) => c.vedette) || donnees.contradictions[0];
const preuveVedette = vedette.sources[vedette.sources.length - 1];

const ETAPES_PARCOURS = [
  {
    onglet: "infos",
    cible: ".bloc-resume",
    titre: "Le dossier est déjà lu",
    texte: () => `${dossier.nb_pages} pages scannées, dépouillées : résumé, ${donnees.personnes.length} personnes identifiées, ${donnees.index_pieces.length} pièces indexées. Vous arrivez sur un dossier prêt à travailler.`,
  },
  {
    onglet: "chrono",
    cible: ".bloc-chronologie .badge-source",
    titre: "Chaque fait est sourcé",
    texte: () => `${donnees.chronologie_faits.length} faits datés, chacun avec la citation exacte, la cote et la page. Un clic sur le badge ouvre la pièce, passage surligné.`,
  },
  {
    onglet: "analyse",
    cible: ".contradiction.vedette",
    titre: "Les pièces qui ne concordent pas",
    texte: () => `${donnees.contradictions.length} contradictions relevées, chacune reliée à deux sources. Ici : le rapport de synthèse impute au client un cambriolage commis pendant ses heures de travail.`,
  },
  {
    onglet: "analyse",
    cible: ".contradiction.vedette .declaration-personne:last-child .badge-source",
    titre: "Vérifiez vous-même",
    texte: () => {
      const s = sourcesParPage.get(preuveVedette.page);
      return `Ouvrez la pièce ${s && s.cote ? s.cote + ", " : ""}page ${preuveVedette.page} : le relevé de pointage, ligne surlignée.`;
    },
    bouton: "Ouvrir la pièce",
  },
];

let parcoursActif = false;
let etapeParcours = 0;

function lancerParcours() {
  parcoursActif = true;
  etapeParcours = 0;
  fermerClasseur();
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
    cible.scrollIntoView({ block: "center", behavior: "smooth" });
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
  let top = r.bottom + 14;
  if (top + hauteur > window.innerHeight - 12) top = Math.max(12, r.top - hauteur - 14);
  const left = Math.min(Math.max(12, r.left), window.innerWidth - largeur - 12);
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
    if (parcoursActif) terminerParcours(false);
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
suivre("Arrivée");
if (!lireStockage(CLE_PARCOURS)) setTimeout(lancerParcours, 700);
