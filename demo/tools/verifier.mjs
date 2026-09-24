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
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".webp": "image/webp", ".txt": "text/plain" };

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
  await page.screenshot({ path: join(RACINE, "captures/01-accueil-visite.png") });
  const capturesVisite = ["02-journee-reconstituee.png", "03-defense-forme.png", "04-defense-fond.png"];
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
  await page.click("#bouton-nouveau");
  verifier(await page.isVisible("#avis-indisponible"), "« Nouveau dossier » renvoie vers l'accès, sans formulaire");
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

// --- Téléphone --------------------------------------------------------------
{
  const { contexte, page, externes, erreurs } = await session("mobile", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.waitForSelector("#parcours:not([hidden]) #parcours-bulle");
  verifier(await page.isHidden("#classeur"), "mobile : classeur fermé à l'arrivée");
  await page.screenshot({ path: join(RACINE, "captures/10-mobile-visite.png") });
  await page.click("#parcours-suivant"); await page.waitForTimeout(400);
  await page.click("#parcours-suivant"); await page.waitForTimeout(600);
  await page.screenshot({ path: join(RACINE, "captures/11-mobile-defense.png") });
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
