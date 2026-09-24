# Lytis — démo statique

Vitrine en lecture seule : un dossier pénal **entièrement fictif** (information
JI 26/00044, affaire GENTIANE, 31 pages scannées), déjà dépouillé, présenté dans
l'interface de l'application Lytis. Aucun compte, aucun serveur, aucun dépôt
de document possible.

```
demo/
  site/          ← le site publié (et rien d'autre)
    index.html     page unique, noindex
    app.css        styles de l'application, copiés sans modification
    demo.css       ajouts : bandeau, visite guidée, contradictions, zoom
    app.js         rendu (fonctions reprises de l'application) + visite guidée
    config.js      mesure d'audience (désactivée par défaut) et lien d'accès
    data.js        GÉNÉRÉ — données du dossier + position des citations
    pages/         GÉNÉRÉ — les 31 pages, passages cités surlignés (WebP)
    fonts/         Inter, Playfair Display, Newsreader (servies localement)
  source/        ← ce qui sert à construire le site (non publié)
    dossier_scanne.pdf   le dossier fictif
    ocr/pNNN.tsv         texte reconnu de chaque page, avec position des mots
    dossier.json         l'analyse : résumé, faits, procédure, contradictions…
  tools/
    sourcage.py          retrouve chaque citation dans sa page
    build.py             génère site/data.js et site/pages/
    test_sourcage.py     tests (sourçage, noindex, pas d'upload, pas de secret)
    verifier.mjs         contrôle dans Chromium + captures
  captures/      captures desktop et mobile
```

## Lancer en local

```bash
cd demo/site
python3 -m http.server 8000
# puis http://localhost:8000/?c=essai
```

## Modifier le dossier fictif

Toute l'analyse affichée vient de `source/dossier.json`. Chaque élément porte une
`page` et une `citation` **recopiée mot pour mot** du PDF.

```bash
cd demo
pip install pymupdf pillow           # une fois
python3 tools/build.py               # régénère data.js et les pages surlignées
python3 -m unittest discover -s tools -v
```

`build.py` refuse de construire, et le test échoue, si une seule citation est
introuvable à sa page. Tous les chiffres d'une citation (heures, dates, plaques)
doivent y figurer **à l'identique** : « 09h58 » au lieu de « 07h58 » est rejeté.

Pour changer le PDF lui-même, remplacer `source/dossier_scanne.pdf`, puis
régénérer l'OCR (Tesseract, français) :

```bash
python3 -c "
import pymupdf
d = pymupdf.open('source/dossier_scanne.pdf')
for i, p in enumerate(d, 1):
    pymupdf.Pixmap(d, p.get_images()[0][0]).save(f'/tmp/p{i:03d}.png')
"
for f in /tmp/p*.png; do tesseract "$f" "source/ocr/$(basename "$f" .png)" -l fra --psm 4 tsv; done
```

Les compteurs affichés (faits, personnes, pièces, contradictions) sont calculés
à partir des listes du fichier : ils ne peuvent pas diverger du contenu.

## Contrôler avant d'envoyer

```bash
cd demo
python3 -m unittest discover -s tools -v
NODE_PATH=$(npm root -g) node tools/verifier.mjs   # nécessite Playwright + Chromium
```

`verifier.mjs` vérifie dans un vrai navigateur : aucune requête hors du site,
aucune erreur JavaScript, balise noindex, parcours guidé jusqu'à la pièce D28
page 29 avec le passage repéré, zoom, absence de champ de dépôt, pas de
défilement horizontal sur mobile. Il régénère les captures.

## Déployer (Render, Static Site)

1. Render → **New + → Static Site**, dépôt `AntoineZ68/Juristia`, branche de la démo.
2. **Root Directory** : `demo/site` — **Build Command** : vide — **Publish Directory** : `.`
3. **Settings → Headers** : ajouter `/*` → `X-Robots-Tag: noindex, nofollow`.
4. **Custom Domain** (par ex. `demo.lytis.legal`), puis un enregistrement CNAME chez le
   registraire du domaine vers l'adresse fournie par Render.

## Mentions légales et confidentialité

Accessibles depuis le bandeau (« Confidentialité ») et le bas de la barre
latérale. L'identité de l'éditeur se renseigne dans `site/config.js`
(`editeur`) ; tant qu'un champ est vide, la page affiche « à compléter » et
`tools/verifier.mjs` le signale. Le paragraphe sur la mesure d'audience suit
automatiquement la configuration de Plausible.

## Aucun lien sortant

La démo ne renvoie vers aucun site : les actions indisponibles affichent « Ceci est une démonstration ».

## Mesure d'audience

Désactivée par défaut : la page ne fait alors **aucune** requête externe. Pour
l'activer, créer le site de la démo dans Plausible (sans cookie) et
renseigner `plausible.domaine` dans `site/config.js`.

Évènements envoyés : `pageview`, `Arrivée`, `Parcours terminé`, `Parcours passé`,
`Contradiction` (avec `phare: oui/non`), `Source ouverte` (cote, page). Chacun porte la propriété `campagne`, lue dans le lien :
`https://<adresse-de-la-demo>/?c=barreau-lyon-oct`. Aucun identifiant individuel.

## Ce que la démo montre, et ce qui la distingue de l'application

- Écrans, styles, onglets, libellés et visionneuse : ceux de l'application.
- La visionneuse affiche des images pré-rendues au lieu du PDF via pdf.js :
  même rendu, bien plus léger, aucune bibliothèque externe.
- **Ajouts propres à la démo** : les onglets « Procédure » (pistes de nullité
  triées selon la qualité à agir du client, délais de garde à vue, frise) et
  « Fond » (contradictions, charges et éléments à décharge par fait imputé,
  recoupements), qui remplacent l'onglet « Analyse IA » de l'application, le résumé détaillé sourcé phrase par phrase, la
  reconstitution de la journée du 12/02, la carte « Contradictions entre pièces »,
  l'intitulé par personne dans la chronologie de garde à vue (l'application
  n'en affiche qu'une), les rôles « Magistrat » et « Avocat », le bandeau, la
  visite guidée et le zoom sur la page.
- L'analyse du dossier a été rédigée à la main à partir de la lecture du PDF,
  puis vérifiée automatiquement contre le texte des pages. Ce n'est pas une
  sortie brute du moteur.
