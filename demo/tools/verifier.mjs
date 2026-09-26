// Contrôle de la démo dans un vrai navigateur (Chromium via Playwright) :
// - aucune requête hors du site (hors mesure d'audience, désactivée par défaut) ;
// - aucune erreur JavaScript ;
// - balise noindex présente ;
// - parcours guidé jusqu'à la pièce D28 page 29, passage repéré ;
// - captures desktop et mobile dans captures/.
//
// Usage : NODE_PATH=$(npm root -g) node tools/verifier.mjs
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = join(RACINE, "site");
const TYPES = { ".pdf": "application/pdf", ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".webp": "image/webp", ".txt": "text/plain" };

const serveur = createServer(async (req, res) => {
  const chemin = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^\/+/, "") || "index.html";
  try {
    const contenu = await readFile(join(SITE, chemin));
    res.writeHead(200, { "content-type": TYPES[extname(chemin)] || "application/octet-stream" });
    res.end(contenu);
  } catch {
    res.writeHead(404); res.end();
  }
}).listen(0);
const port = serveur.address().port;
const origine = `http://localhost:${port}`;

const echecs = [];
const verifier = (condition, message) => { console.log(`${condition ? "OK " : "ÉCHEC"}  ${message}`); if (!condition) echecs.push(message); };

await mkdir(join(RACINE, "captures"), { recursive: true });
const navigateur = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

async function session(nom, options) {
  const contexte = await navigateur.newContext(options);
  const page = await contexte.newPage();
  const externes = [];
  const erreurs = [];
  page.on("request", (r) => { if (!r.url().startsWith(origine) && !r.url().startsWith("data:")) externes.push(r.url()); });
  page.on("pageerror", (e) => erreurs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") erreurs.push(m.text()); });
  const debut = Date.now();
  await page.goto(`${origine}/?c=controle`, { waitUntil: "load" });
  console.log(`    [${nom}] chargement : ${Date.now() - debut} ms`);
  return { contexte, page, externes, erreurs };
}

// --- Ordinateur -------------------------------------------------------------
{
  const { contexte, page, externes, erreurs } = await session("ordinateur", { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const robots = await page.getAttribute('meta[name="robots"]', "content");
  verifier(robots === "noindex, nofollow", "balise <meta name=robots content=noindex, nofollow>");
  await page.waitForSelector("#parcours:not([hidden]) #parcours-bulle");
  verifier(await page.isVisible("#classeur-index .entree-index"), "ordinateur : index du dossier ouvert à l'arrivée");
  await page.click('.mode-classeur[data-mode="piece"]');
  await page.waitForSelector("#classeur-piece .page-cadre img", { timeout: 5000 }).catch(() => {});
  verifier(await page.isVisible("#classeur-piece .page-cadre img"), "onglet « Pièce » à l'arrivée : la page 1 s'affiche (pas d'écran vide)");
  await page.click('.mode-classeur[data-mode="index"]');
  await page.screenshot({ path: join(RACINE, "captures/01-accueil-visite.png") });
  const capturesVisite = ["02-journee-reconstituee.png", "03-procedure.png", "04-fond.png"];
  for (const nom of capturesVisite) {
    await page.click("#parcours-suivant");
    await page.waitForTimeout(700);
    await page.screenshot({ path: join(RACINE, "captures", nom) });
  }
  await page.click("#parcours-suivant"); // « Ouvrir la pièce »
  await page.waitForSelector("#classeur:not([hidden]) .page-cadre img");
  await page.waitForFunction(() => document.querySelector(".page-cadre img").complete);
  await page.waitForTimeout(600);
  const position = await page.textContent("#classeur-position");
  const source = await page.textContent("#classeur-source");
  verifier(position.trim() === "Page 29 / 31", `pièce ouverte à la bonne page (${position.trim()})`);
  verifier(source.includes("cote D28"), `référence affichée : ${source}`);
  verifier(await page.locator(".zone-reperage").count() > 0, "passage cité repéré sur la page");
  await page.screenshot({ path: join(RACINE, "captures/05-piece-D28-surlignee.png") });
  verifier(await page.locator("#classeur-legende .legende-item").count() === 5, "légende du surlignage : 5 couleurs");
  await page.click("#classeur-legende .legende-ligne");
  verifier(await page.isVisible("#classeur-legende .legende-details"), "légende dépliable avec la signification des couleurs");
  await page.screenshot({ path: join(RACINE, "captures/05c-legende-surlignage.png") });
  await page.click("#classeur-legende .legende-ligne");
  await page.click(".page-cadre");
  await page.waitForTimeout(300);
  verifier(await page.locator(".page-cadre.agrandie").count() === 1, "clic sur la page : agrandissement");
  await page.screenshot({ path: join(RACINE, "captures/05b-piece-D28-agrandie.png") });
  await page.click(".page-cadre");

  await page.click("#fermer-classeur");
  await page.click('.onglet[data-onglet="chrono"]');
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(RACINE, "captures/06-chronologie.png") });
  await page.click('.onglet[data-onglet="infos"]');
  await page.click(".bouton-resume-detaille");
  verifier(await page.isVisible(".resume-detaille .renvoi-source"), "résumé détaillé dépliable, avec renvois aux pièces");
  await page.screenshot({ path: join(RACINE, "captures/08-resume-detaille.png"), fullPage: false });
  // Questions au dossier : zone qui se déplie sous la barre, pièces à droite
  await page.click('.onglet[data-onglet="infos"]');
  verifier(await page.locator('.mode-classeur[data-mode="questions"]').count() === 0, "le classeur ne garde que Pièce et Index");
  await page.click(".barre-interroger");
  verifier(await page.isVisible("#zone-questions .suggestion"), "« Interroger le dossier » déplie les questions sous la barre");
  await page.click('#zone-questions .suggestion:has-text("sans son avocat")');
  verifier(await page.isVisible("#zone-questions .bulle-reponse .renvoi-source"), "réponse affichée sous la barre, avec renvois aux pièces");
  await page.click('#zone-questions .suggestion:has-text("peine")');
  verifier(await page.isVisible("#zone-questions .bulle-reponse.hors-dossier"), "question hors dossier : Lytis le dit");
  await page.locator("#zone-questions .bulle-reponse .renvoi-source").first().click();
  await page.waitForSelector("#classeur-piece .page-cadre img");
  verifier(await page.isVisible("#zone-questions .bulle-reponse") && await page.isVisible("#classeur-piece .page-cadre"), "clic sur un renvoi : pièce à droite, réponse toujours visible à gauche");
  await page.screenshot({ path: join(RACINE, "captures/15-questions.png") });
  await page.click("#zone-questions .saisie-question");
  verifier(await page.isVisible("#avis-indisponible"), "saisie libre verrouillée : avis « ceci est une démonstration »");
  await page.click("#avis-indisponible button");
  await page.click("#zone-questions .questions-reduire");
  verifier(!(await page.isVisible("#zone-questions")), "« Réduire » replie la zone des questions");
  await page.click('.onglet[data-onglet="fond"]');
  await page.click(".contradiction.vedette .lien-question");
  verifier(await page.isVisible('#zone-questions .bulle-question:has-text("19/02")'), "« Demander au dossier » depuis une carte pose la question sous la barre");
  const nb = await page.locator("#zone-questions .bulle-question").count();
  verifier(nb === 3, `conversation conservée après repli (${nb} questions)`);
  await page.click("#zone-questions .questions-reduire");
  await page.click("#fermer-classeur");

  await page.click('#bandeau-demo button:has-text("Confidentialité")');
  verifier(await page.isVisible("#mentions .mentions-corps h3"), "mentions légales et confidentialité accessibles depuis le bandeau");
  await page.screenshot({ path: join(RACINE, "captures/09-mentions-confidentialite.png") });
  const manquants = await page.locator("#mentions .a-completer").count();
  console.log(manquants ? `    ATTENTION : ${manquants} information(s) d'éditeur à compléter dans site/config.js` : "    Mentions : éditeur complet");
  await page.keyboard.press("Escape");
  await page.click("#bouton-nouveau");
  verifier(await page.isVisible("#vue-nouveau .formulaire-demo"), "« Nouveau dossier » affiche le formulaire de création");
  const saisissables = await page.$$eval("#vue-nouveau input, #vue-nouveau select, #vue-nouveau textarea", (els) => els.filter((e) => !e.disabled && !e.closest(".interactif")).length);
  verifier(saisissables === 0, "formulaire verrouillé : seuls le choix d'intervention et la personne sont manipulables");
  const dateVisible = () => page.isVisible('#vue-nouveau label:has-text("Date de mise en examen")');
  verifier(await dateVisible(), "client mis en examen (MARTINON) : date de mise en examen demandée");
  await page.selectOption("#vue-nouveau select.interactif", { label: "BERTHOLLET Gilles" });
  verifier(!(await dateVisible()), "client non mis en examen (BERTHOLLET) : pas de date demandée");
  await page.click('#vue-nouveau .choix-intervention:has-text("Une partie civile")');
  const partieCivile = await page.$eval("#vue-nouveau select.interactif", (sel) => sel.options[sel.selectedIndex].text);
  verifier(!(await dateVisible()) && partieCivile === "SERMET Odile", `partie civile : ${partieCivile} proposée, pas de date`);
  await page.click('#vue-nouveau .choix-intervention:has-text("La défense")');
  verifier(!(await page.isVisible("#avis-indisponible")), "les choix manipulables n'affichent pas l'avis");
  await page.click("#vue-nouveau .champ input", { force: true });
  verifier(await page.isVisible("#avis-indisponible"), "clic dans un champ : avis « ceci est une démonstration »");
  await page.click("#avis-indisponible button");
  await page.click("#vue-nouveau .zone-depot");
  verifier(await page.isVisible("#avis-indisponible"), "clic sur la zone de dépôt : même avis, aucun fichier sélectionnable");
  await page.screenshot({ path: join(RACINE, "captures/14-nouveau-dossier.png") });
  await page.click(".item-dossier");
  verifier(await page.isVisible("#vue-dossier .barre-onglets"), "retour au dossier depuis la liste");
  verifier(await page.locator('input[type="file"]').count() === 0, "aucun champ de dépôt de fichier dans la page");
  await page.screenshot({ path: join(RACINE, "captures/07-informations-avis.png") });

  // Feuilletage complet : les 31 pages existent.
  await page.click(".bouton-index");
  const entrees = await page.locator(".entree-index").count();
  verifier(entrees === 31, `index du classeur : ${entrees} pièces`);

  verifier(externes.length === 0, `aucune requête externe (${externes.length}) ${externes.join(" ")}`);
  verifier(erreurs.length === 0, `aucune erreur JavaScript ${erreurs.join(" | ")}`);
  await contexte.close();
}

// --- Portable 13-14 pouces : onglets et étiquettes tiennent sans défilement ---
{
  const { contexte, page, erreurs } = await session("portable 1366", { viewport: { width: 1366, height: 768 } });
  await page.click("text=Passer");
  for (const onglet of ["infos", "chrono", "procedure", "fond"]) {
    await page.click(`.onglet[data-onglet="${onglet}"]`);
    const deborde = await page.$eval(".barre-onglets", (el) => el.scrollWidth - el.clientWidth);
    verifier(deborde <= 0, `1366 px : barre d'onglets sans défilement (onglet ${onglet}, ${deborde}px)`);
  }
  await page.click('.onglet[data-onglet="procedure"]');
  const etiquettesHors = await page.$$eval(".piste", (pistes) => pistes.filter((p) => {
    const r = p.getBoundingClientRect();
    return [...p.querySelectorAll(".etiquette")].some((e) => e.getBoundingClientRect().right > r.right + 1);
  }).length);
  verifier(etiquettesHors === 0, "1366 px : aucune étiquette ne déborde de sa carte");
  await page.screenshot({ path: join(RACINE, "captures/13-portable-procedure.png") });
  verifier(erreurs.length === 0, `1366 px : aucune erreur JavaScript ${erreurs.join(" | ")}`);
  await contexte.close();
}

// --- Documents téléchargeables ---
for (const doc of ["documents/note_defense.pdf", "documents/dossier_surligne.pdf"]) {
  const reponse = await fetch(`${origine}/${doc}`);
  const octets = (await reponse.arrayBuffer()).byteLength;
  verifier(reponse.ok && octets > 10000, `document téléchargeable : ${doc} (${Math.round(octets / 1024)} Ko)`);
}

// --- Téléphone --------------------------------------------------------------
{
  const { contexte, page, externes, erreurs } = await session("mobile", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.waitForSelector("#parcours:not([hidden]) #parcours-bulle");
  verifier(await page.isHidden("#classeur"), "mobile : classeur fermé à l'arrivée");
  await page.screenshot({ path: join(RACINE, "captures/10-mobile-visite.png") });
  await page.click("#parcours-suivant"); await page.waitForTimeout(400);
  await page.click("#parcours-suivant"); await page.waitForTimeout(600);
  await page.screenshot({ path: join(RACINE, "captures/11-mobile-procedure.png") });
  await page.click("#parcours-suivant"); await page.waitForTimeout(400);
  await page.click("#parcours-suivant");
  await page.waitForSelector("#classeur:not([hidden]) .page-cadre img");
  await page.waitForFunction(() => document.querySelector(".page-cadre img").complete);
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(RACINE, "captures/12-mobile-piece.png") });
  const debordement = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  verifier(debordement <= 0, `mobile : pas de défilement horizontal (${debordement}px)`);
  verifier(externes.length === 0, `mobile : aucune requête externe ${externes.join(" ")}`);
  verifier(erreurs.length === 0, `mobile : aucune erreur JavaScript ${erreurs.join(" | ")}`);
  await contexte.close();
}

await navigateur.close();
serveur.close();
if (echecs.length) { console.log(`\n${echecs.length} contrôle(s) en échec.`); process.exit(1); }
console.log("\nTous les contrôles sont verts.");
