"""Localise chaque citation de la démo dans le texte reconnu (OCR) de sa page.

Sert à deux choses :
- au test de sourçage (test_sourcage.py) : toute citation affichée doit
  exister à la page annoncée ;
- à la construction (build.py) : les zones trouvées sont surlignées sur
  l'image de la page, comme le fait l'application sur le PDF.

Bibliothèque standard uniquement : le test tourne sans rien installer.
"""

from __future__ import annotations

import csv
import json
import re
import unicodedata
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
DOSSIER_OCR = RACINE / "source" / "ocr"
FICHIER_DONNEES = RACINE / "source" / "dossier.json"

# Seuil de ressemblance entre la citation et le passage reconnu. L'OCR d'un
# scan introduit quelques erreurs de caractères (« 2V » pour « ZV ») : on
# tolère ces écarts, jamais un passage absent de la page.
SEUIL = 0.90


def normaliser(texte: str) -> str:
    texte = unicodedata.normalize("NFKD", texte.lower())
    texte = "".join(c for c in texte if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "", texte)


@dataclass
class Mot:
    texte: str
    ligne: tuple[int, int, int]
    gauche: int
    haut: int
    largeur: int
    hauteur: int


def mots_de_la_page(page: int) -> list[Mot]:
    mots = []
    with open(DOSSIER_OCR / f"p{page:03d}.tsv", encoding="utf-8") as f:
        for r in csv.DictReader(f, delimiter="\t", quoting=csv.QUOTE_NONE):
            if r["level"] != "5" or not normaliser(r["text"] or ""):
                continue
            mots.append(Mot(
                texte=normaliser(r["text"]),
                ligne=(int(r["block_num"]), int(r["par_num"]), int(r["line_num"])),
                gauche=int(r["left"]), haut=int(r["top"]),
                largeur=int(r["width"]), hauteur=int(r["height"]),
            ))
    return mots


_CACHE: dict[int, list[Mot]] = {}


def nombres(texte: str) -> list[str]:
    return re.findall(r"\d+", texte)


@dataclass
class Resultat:
    score: float
    mots: list[Mot]
    citation: str = ""

    @property
    def nombres_manquants(self) -> list[str]:
        """Chiffres de la citation absents du passage trouvé. Une heure, une
        date ou une plaque ne se lit jamais « à peu près » : un seul chiffre
        différent suffit à rejeter la citation."""
        passage = "".join(m.texte for m in self.mots)
        # L'ordre compte : on consomme le passage au fur et à mesure.
        manquants, curseur = [], 0
        for n in nombres(self.citation):
            i = passage.find(n, curseur)
            if i < 0:
                manquants.append(n)
            else:
                curseur = i + len(n)
        return manquants

    @property
    def valide(self) -> bool:
        return self.score >= SEUIL and not self.nombres_manquants

    def zones(self, marge: int = 3) -> list[tuple[int, int, int, int]]:
        """Un rectangle par ligne de texte couverte par la citation."""
        par_ligne: dict[tuple[int, int, int], list[Mot]] = {}
        for m in self.mots:
            par_ligne.setdefault(m.ligne, []).append(m)
        rects = []
        for mots in par_ligne.values():
            x0 = min(m.gauche for m in mots) - marge
            y0 = min(m.haut for m in mots) - marge
            x1 = max(m.gauche + m.largeur for m in mots) + marge
            y1 = max(m.haut + m.hauteur for m in mots) + marge
            rects.append((x0, y0, x1, y1))
        return rects


def localiser(page: int, citation: str) -> Resultat:
    if page not in _CACHE:
        _CACHE[page] = mots_de_la_page(page)
    mots = _CACHE[page]
    cible = normaliser(citation)
    # Nombre de mots de la citation, pour borner la fenêtre de recherche.
    n = max(1, len([t for t in re.split(r"\s+", citation) if normaliser(t)]))
    meilleur = Resultat(0.0, [], citation)
    for taille in range(max(1, n - 3), n + 4):
        for debut in range(0, max(1, len(mots) - taille + 1)):
            fenetre = mots[debut:debut + taille]
            texte = "".join(m.texte for m in fenetre)
            sm = SequenceMatcher(None, cible, texte, autojunk=False)
            if sm.real_quick_ratio() <= meilleur.score or sm.quick_ratio() <= meilleur.score:
                continue
            score = sm.ratio()
            if score > meilleur.score:
                meilleur = Resultat(score, fenetre, citation)
    return meilleur


def references(donnees: dict) -> list[tuple[str, int, str]]:
    """Toutes les (catégorie, page, citation) affichées dans la démo."""
    refs = []
    for f in donnees["chronologie_faits"]:
        refs.append(("faits", f["page"], f["citation"]))
    for e in donnees["chronologie_procedure"]:
        refs.append(("procedure", e["page"], e["citation"]))
    for c in donnees["contradictions"]:
        for s in c["sources"]:
            refs.append(("contradiction", s["page"], s["citation"]))
    for c in donnees["confrontations"]:
        for d in c["declarations"]:
            refs.append(("declaration", d["page"], d["citation"]))
    for r in donnees["recoupements"]:
        for o in r["occurrences"]:
            refs.append(("declaration", o["page"], o["citation"]))
    for bloc in donnees.get("resume_detaille", []):
        for phrase in bloc["phrases"]:
            for src in phrase["sources"]:
                refs.append(("faits", src["page"], src["citation"]))
    for e in donnees.get("journee", {}).get("evenements", []):
        refs.append(("faits", e["page"], e["citation"]))
    defense = donnees.get("defense", {})
    for piste in defense.get("forme", []):
        for src in piste["sources"]:
            refs.append(("procedure", src["page"], src["citation"]))
    for ligne in defense.get("fond", []):
        for src in ligne["charge"] + ligne["decharge"]:
            refs.append(("declaration", src["page"], src["citation"]))
    return refs


def charger_donnees() -> dict:
    return json.loads(FICHIER_DONNEES.read_text(encoding="utf-8"))
