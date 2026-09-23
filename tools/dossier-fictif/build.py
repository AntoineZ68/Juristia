"""Met en page le dossier fictif (contenu.py) et produit :

- build/dossier.html : une page HTML par feuillet A4, rendue en PDF par render_pdf.mjs ;
- build/pages_texte.json : le texte attendu de chaque page, ligne par ligne, tel que
  l'extrait pdfplumber (layout=True, espaces multiples réduits), utilisé par
  verifier_moteur.py pour faire tourner le moteur d'analyse sans passer par le PDF.

Les retours à la ligne sont calculés ici (police à chasse fixe) et jamais laissés au
navigateur : le texte du PDF est ainsi connu exactement à l'avance.

Usage : python3 build.py
"""

from __future__ import annotations

import html
import json
import textwrap
from pathlib import Path

import contenu

ICI = Path(__file__).resolve().parent
SORTIE = ICI / "build"

LARGEUR = 88               # caractères par ligne de corps
LIGNES_PAR_PAGE = 64       # lignes disponibles sous le tampon
COL_SIGNATURE_DROITE = 48  # colonne de départ de la signature de droite

POLICE_REG = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"
POLICE_GRAS = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"


def _envelopper(texte: str, prefixe: str = "", retrait: str = "") -> list[str]:
    return textwrap.wrap(texte, width=LARGEUR, initial_indent=prefixe, subsequent_indent=retrait,
                         break_long_words=False, break_on_hyphens=False)


def _lignes_bloc(bloc) -> list[tuple[str, str]]:
    """Renvoie les lignes d'un bloc sous forme (style, texte). Styles : corps, gras, sig."""
    genre = bloc[0]
    if genre == "p":
        return [("corps", l) for l in _envelopper(bloc[1])] + [("corps", "")]
    if genre == "h":
        return [("gras", bloc[1]), ("corps", "")]
    if genre == "liste":
        lignes = []
        for item in bloc[1]:
            lignes += [("corps", l) for l in _envelopper(item, "- ", "  ")]
        return lignes + [("corps", "")]
    if genre == "qr":
        question, reponse = bloc[1], bloc[2]
        if question.startswith("à "):
            destinataire = question.split(" : ", 1)[0][2:]
            ligne_q = f"Question {question}"
            prefixe_r = f"Réponse de {destinataire} : "
        else:
            ligne_q = f"Question : {question}"
            prefixe_r = "Réponse : "
        assert len(ligne_q) <= LARGEUR, f"question trop longue pour une ligne : {ligne_q}"
        assert reponse.rstrip().endswith((".", "?", "!")), f"réponse non terminée : {reponse}"
        lignes = [("gras", ligne_q)]
        lignes += [("corps", l) for l in _envelopper(reponse, prefixe_r, "  ")]
        return lignes + [("corps", "")]
    if genre == "sig":
        lignes = [("corps", "")]
        for gauche, droite in bloc[1]:
            lignes.append(("sig", gauche.ljust(COL_SIGNATURE_DROITE) + droite))
        return lignes
    if genre == "sp":
        return [("corps", "")]
    raise ValueError(genre)


def _entete_premiere_page(pc, feuillet: str) -> list[tuple[str, str]]:
    lignes = [("service", l) for l in contenu.ENTETES[pc["entete"]]]
    if pc["meta"]:
        lignes.append(("meta", f"{contenu.META[0]} - Feuillet {feuillet}"))
        lignes += [("meta", l) for l in contenu.META[1:]]
    lignes.append(("regle", ""))
    lignes += [("titre", t) for t in pc["titre"]]
    lignes.append(("corps", ""))
    return lignes


def _entete_continuation(pc, feuillet: str) -> list[tuple[str, str]]:
    return [
        ("meta", f"Procédure n° {contenu.PROCEDURE} - {contenu.SERVICE_COURT[pc['entete']]} - Feuillet {feuillet}"),
        ("meta", pc["suite"]),
        ("regle", ""),
    ]


def _paginer(pc) -> list[list[tuple[str, str]]]:
    """Répartit les blocs d'une pièce sur des feuillets. Un bloc n'est jamais coupé
    (une citation ne doit pas chevaucher deux pages) ; un intertitre reste avec le bloc
    qui le suit. On pagine avec un en-tête provisoire de même hauteur, puis on insère
    les en-têtes définitifs une fois le nombre de feuillets connu."""
    haut_premiere = len(_entete_premiere_page(pc, "1/1"))
    haut_suite = len(_entete_continuation(pc, "1/1"))

    blocs = [_lignes_bloc(b) for b in pc["blocs"]]
    # Rattache chaque intertitre au bloc suivant.
    fusionnes = []
    i = 0
    while i < len(blocs):
        if pc["blocs"][i][0] == "h" and i + 1 < len(blocs):
            fusionnes.append(blocs[i] + blocs[i + 1])
            i += 2
        else:
            fusionnes.append(blocs[i])
            i += 1

    pages: list[list[tuple[str, str]]] = [[]]
    dispo = LIGNES_PAR_PAGE - haut_premiere
    for bloc in fusionnes:
        if len(bloc) > dispo and pages[-1]:
            pages.append([])
            dispo = LIGNES_PAR_PAGE - haut_suite
        assert len(bloc) <= dispo, f"bloc trop long pour une page (D{pc['cote']})"
        pages[-1].extend(bloc)
        dispo -= len(bloc)
    # Retire les lignes vides en fin de page.
    for page in pages:
        while page and page[-1] == ("corps", ""):
            page.pop()
    return pages


def construire():
    feuillets = []  # (cote, lignes complètes)
    for pc in contenu.PIECES:
        corps_pages = _paginer(pc)
        n = len(corps_pages)
        for k, corps in enumerate(corps_pages, start=1):
            entete = _entete_premiere_page(pc, f"{k}/{n}") if k == 1 else _entete_continuation(pc, f"{k}/{n}")
            feuillets.append((pc["cote"], entete + corps))
    return feuillets


def _texte_extrait(cote: int, lignes) -> str:
    """Texte attendu en sortie de pdfplumber : tampon d'abord (plus haut sur la page),
    puis chaque ligne sans retrait, espaces multiples réduits à un seul."""
    sortie = [f"Cote D{cote}"]
    for style, texte in lignes:
        if style == "regle":
            continue
        sortie.append(" ".join(texte.split()))
    return "\n".join(sortie).strip("\n")


CSS = f"""
@font-face {{ font-family: 'PV'; src: url('file://{POLICE_REG}'); font-weight: 400; }}
@font-face {{ font-family: 'PV'; src: url('file://{POLICE_GRAS}'); font-weight: 700; }}
@page {{ size: A4; margin: 0; }}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
html, body {{ background: #fff; }}
body {{ font-family: 'PV', monospace; font-size: 9pt; color: #111;
        font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }}
.feuillet {{ position: relative; width: 210mm; height: 297mm; overflow: hidden; page-break-after: always; }}
.feuillet:last-child {{ page-break-after: auto; }}
.tampon {{ position: absolute; top: 20pt; right: 40pt; border: 1.4pt solid #c0392b; color: #c0392b;
          font-weight: 700; font-size: 10.5pt; padding: 2pt 9pt; }}
.contenu {{ position: absolute; top: 58pt; left: 54pt; width: 480pt; }}
.l {{ height: 11.5pt; line-height: 11.5pt; white-space: pre; }}
.service {{ font-weight: 400; font-size: 8.5pt; }}
.meta {{ font-size: 8.5pt; }}
.regle {{ height: 8pt; border-bottom: 0.8pt solid #111; margin-bottom: 5pt; }}
.titre {{ font-weight: 700; text-align: center; }}
.gras {{ font-weight: 700; }}
"""


def ecrire_html(feuillets, chemin: Path):
    morceaux = [f"<!doctype html><html lang='fr'><head><meta charset='utf-8'><style>{CSS}</style></head><body>"]
    for cote, lignes in feuillets:
        morceaux.append("<section class='feuillet'>")
        morceaux.append(f"<div class='tampon'>Cote D{cote}</div><div class='contenu'>")
        for style, texte in lignes:
            if style == "regle":
                morceaux.append("<div class='regle'></div>")
                continue
            classe = {"corps": "l", "sig": "l", "gras": "l gras", "titre": "l titre",
                      "service": "l service", "meta": "l meta"}[style]
            morceaux.append(f"<div class='{classe}'>{html.escape(texte)}</div>")
        morceaux.append("</div></section>")
    morceaux.append("</body></html>")
    chemin.write_text("".join(morceaux), encoding="utf-8")


def main():
    SORTIE.mkdir(exist_ok=True)
    feuillets = construire()
    ecrire_html(feuillets, SORTIE / "dossier.html")
    pages = [
        {"page": i, "cote": f"D{cote}", "texte": _texte_extrait(cote, lignes)}
        for i, (cote, lignes) in enumerate(feuillets, start=1)
    ]
    (SORTIE / "pages_texte.json").write_text(json.dumps(pages, ensure_ascii=False, indent=1), encoding="utf-8")
    par_cote = {}
    for p in pages:
        par_cote.setdefault(p["cote"], []).append(p["page"])
    print(f"{len(pages)} pages, {len(par_cote)} cotes")
    for cote, nums in par_cote.items():
        print(f"  {cote:>4} : pages {nums[0]}-{nums[-1]}")


if __name__ == "__main__":
    main()
