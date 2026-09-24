"""Construit les fichiers servis par la démo à partir de source/ :

- site/pages/pNNN.webp : chaque page du dossier scanné, passages cités surlignés
  (mêmes couleurs que le PDF surligné de l'application) ;
- site/data.js : les données du dossier, plus la position de chaque citation sur
  sa page pour que la visionneuse puisse y amener le lecteur.

Refuse de construire si une seule citation n'est pas retrouvée à sa page.

Usage : python3 tools/build.py   (nécessite pymupdf et Pillow)
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import pymupdf
from PIL import Image, ImageChops, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
from sourcage import RACINE, charger_donnees, localiser, references  # noqa: E402

PDF_SOURCE = RACINE / "source" / "dossier_scanne.pdf"
SITE = RACINE / "site"
DOSSIER_PAGES = SITE / "pages"
LARGEUR_SORTIE = 1100

# Couleurs de surlignage de l'application (src/depouille/surlignage.py),
# plus une teinte dédiée aux contradictions.
COULEURS = {
    "procedure": (255, 217, 51),
    "declaration": (153, 217, 255),
    "faits": (178, 255, 178),
    "contradiction": (255, 176, 160),
}
# Ordre de priorité quand un même passage relève de plusieurs catégories.
PRIORITE = ["contradiction", "faits", "declaration", "procedure"]


def main() -> None:
    donnees_completes = charger_donnees()
    donnees = donnees_completes["donnees"]

    zones_par_page: dict[int, dict[str, list]] = {}
    positions: dict[str, list] = {}
    echecs = []
    for categorie, page, citation in references(donnees):
        r = localiser(page, citation)
        if not r.valide:
            echecs.append((page, citation, round(r.score, 2), r.nombres_manquants))
            continue
        rects = r.zones()
        zones_par_page.setdefault(page, {}).setdefault(categorie, []).extend(rects)
        positions[f"{page}|{citation}"] = rects
    if echecs:
        for e in echecs:
            print("Citation introuvable :", e, file=sys.stderr)
        sys.exit(1)

    DOSSIER_PAGES.mkdir(exist_ok=True)
    doc = pymupdf.open(PDF_SOURCE)
    dimensions = {}
    for i, page in enumerate(doc, start=1):
        xref = page.get_images()[0][0]
        pix = pymupdf.Pixmap(doc, xref)
        image = Image.frombytes("L" if pix.n == 1 else "RGB", (pix.width, pix.height), pix.samples).convert("RGB")
        calque = Image.new("RGB", image.size, "white")
        dessin = ImageDraw.Draw(calque)
        zones = zones_par_page.get(i, {})
        deja = []
        for categorie in PRIORITE:
            for rect in zones.get(categorie, []):
                if any(_recouvre(rect, autre) for autre in deja):
                    continue
                dessin.rectangle(rect, fill=COULEURS[categorie])
                deja.append(rect)
        image = ImageChops.multiply(image, calque)
        echelle = LARGEUR_SORTIE / image.width
        image = image.resize((LARGEUR_SORTIE, round(image.height * echelle)), Image.LANCZOS)
        image.save(DOSSIER_PAGES / f"p{i:03d}.webp", "WEBP", quality=62, method=6)
        dimensions[i] = (pix.width, pix.height)

    # Positions exprimées en fraction de la page : indépendantes de la
    # taille d'affichage.
    positions_relatives = {}
    for cle, rects in positions.items():
        page = int(cle.split("|", 1)[0])
        l, h = dimensions[page]
        positions_relatives[cle] = [
            [round(x0 / l, 4), round(y0 / h, 4), round(x1 / l, 4), round(y1 / h, 4)] for x0, y0, x1, y1 in rects
        ]

    # Table page -> source et index du classeur, au format de l'API réelle.
    pieces = donnees["index_pieces"]
    nb_pages = doc.page_count
    for j, p in enumerate(pieces):
        p["page_fin"] = pieces[j + 1]["page_debut"] - 1 if j + 1 < len(pieces) else nb_pages
        p.setdefault("heure", None)
        p["fichier_source"] = donnees_completes["dossier"]["fichier_source"]
    sources = []
    for n in range(1, nb_pages + 1):
        piece = next(p for p in pieces if p["page_debut"] <= n <= p["page_fin"])
        sources.append({
            "page": n,
            "fichier_source": donnees_completes["dossier"]["fichier_source"],
            "page_fichier": n,
            "cote": piece["cote"] if piece["cote"] != "—" else None,
            "type_piece": piece["type"],
            "illisible": False,
        })
    donnees["sources"] = sources
    donnees_completes["positions"] = positions_relatives

    (SITE / "data.js").write_text(
        "// Fichier généré par tools/build.py à partir de source/dossier.json — ne pas modifier à la main.\n"
        f"window.JURISTIA_DEMO = {json.dumps(donnees_completes, ensure_ascii=False, separators=(',', ':'))};\n",
        encoding="utf-8",
    )
    print(f"{nb_pages} pages, {len(positions)} citations localisées.")


def _recouvre(a, b) -> bool:
    return not (a[2] <= b[0] or b[2] <= a[0] or a[3] <= b[1] or b[3] <= a[1])


if __name__ == "__main__":
    main()
