// Rend build/dossier.html en PDF A4 avec le Chromium de Playwright.
// Usage : NODE_PATH=$(npm root -g) node render_pdf.mjs <sortie.pdf>
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const ici = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(ici, "build", "dossier.html");
const sortie = path.resolve(process.argv[2] ?? path.join(ici, "build", "dossier.pdf"));

const navigateur = await chromium.launch();
const page = await navigateur.newPage();
await page.goto(pathToFileURL(source).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: sortie, format: "A4", printBackground: true, preferCSSPageSize: true,
                 margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await navigateur.close();
console.log(`PDF écrit : ${sortie}`);
