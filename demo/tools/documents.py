"""Génère les deux documents téléchargeables de la démo, à partir des mêmes
données que le site (lancer après build.py) :

- site/documents/dossier_surligne.pdf : les 31 pages, passages surlignés ;
- site/documents/note_defense.pdf : note de travail (résumé, voie et délai,
  pistes de nullité, faits imputés, contradictions), chaque élément renvoyant
  à sa cote et à sa page.

Usage : python3 tools/documents.py   (nécessite pymupdf et Pillow)
"""

from __future__ import annotations

import html
import io
import sys
from pathlib import Path

import pymupdf
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from sourcage import RACINE, charger_donnees  # noqa: E402

SITE = RACINE / "site"
SORTIE = SITE / "documents"
FILIGRANE = "DOSSIER FICTIF — DÉMONSTRATION — AUCUNE VALEUR JURIDIQUE"

QUALITES = {
    "oui": "Semble invocable par le client",
    "discutable": "Qualité à agir à démontrer",
    "non": "A priori non invocable par le client",
}


def pdf_surligne(nb_pages: int) -> None:
    doc = pymupdf.open()
    for n in range(1, nb_pages + 1):
        image = Image.open(SITE / "pages" / f"p{n:03d}.webp").convert("RGB")
        tampon = io.BytesIO()
        image.save(tampon, "JPEG", quality=70, optimize=True)
        page = doc.new_page(width=595.2, height=841.9)  # A4
        page.insert_image(page.rect, stream=tampon.getvalue())
    doc.set_metadata({"title": "Dossier surligné — démonstration Lytis (dossier fictif)", "creator": "Lytis"})
    doc.save(SORTIE / "dossier_surligne.pdf", garbage=4, deflate=True)


def note_defense(donnees_completes: dict) -> None:
    d = donnees_completes["donnees"]
    dossier = donnees_completes["dossier"]
    cotes = {s["page"]: s["cote"] for s in d["sources"]}
    e = html.escape

    def ref(page: int) -> str:
        cote = cotes.get(page)
        return f'<span class="ref">[{cote + " · " if cote else ""}p.{page}]</span>'

    def cit(s: dict) -> str:
        qui = f"<b>{e(s['personne'])}</b> — " if s.get("personne") else ""
        return f"<li>{qui}« {e(s['citation'])} » {ref(s['page'])}</li>"

    defense = d["defense"]
    parties = [
        f"<h1>Note de travail — Défense de {e(defense['client'])}</h1>",
        f"<p class='meta'>{e(dossier['reference'])} · {dossier['nb_pages']} pages analysées · "
        "document généré par Lytis pour la démonstration, sur un dossier entièrement fictif. "
        "Appréciations proposées au vu de la copie du dossier, à confirmer par l'avocat.</p>",
        "<h2>Résumé</h2>",
    ]
    for bloc in d["resume_detaille"]:
        parties.append(f"<h3>{e(bloc['titre'])}</h3><p>")
        parties.append(" ".join(
            f"{e(ph['texte'])} " + " ".join(ref(s["page"]) for s in ph["sources"]) for ph in bloc["phrases"]
        ))
        parties.append("</p>")

    parties.append("<h2>Procédure — pistes de nullité</h2>")
    parties.append(f"<p class='encadre'><b>{e(defense['delai']['titre'])}.</b> {e(defense['delai']['texte'])}</p>")
    for piste in defense["forme"]:
        etiquette = QUALITES[piste["qualite"]] + (f" · piste qui {'reste ' if piste['force'].startswith('à ') else ''}{piste['force']}" if piste["qualite"] != "non" else "")
        parties.append(
            f"<h3>{e(piste['titre'])}</h3><p class='etiquette'>{e(etiquette)}</p>"
            f"<p><b>Textes.</b> {e(piste['texte'])}<br/><b>Constat.</b> {e(piste['analyse'])}<br/>"
            f"<b>Qualité à agir.</b> {e(piste['qualite_motif'])}<br/><b>Grief.</b> {e(piste['grief'])}</p>"
            f"<ul>{''.join(cit(s) for s in piste['sources'])}</ul>"
        )

    parties.append("<h2>Fond — faits imputés au client</h2>")
    for f in defense["fond"]:
        parties.append(f"<h3>{e(f['fait'])}</h3><p>{e(f['synthese'])}</p>")
        parties.append(f"<p class='rubrique'>À charge</p><ul>{''.join(cit(s) for s in f['charge'])}</ul>")
        decharge = "".join(cit(s) for s in f["decharge"]) or f"<li>{e(f.get('decharge_vide', '—'))}</li>"
        parties.append(f"<p class='rubrique'>À décharge</p><ul>{decharge}</ul>")
        if f.get("a_verifier"):
            items = "".join(f"<li>« {e(v['citation'])} » {ref(v['page'])} — {e(v['note'])}</li>" for v in f["a_verifier"])
            parties.append(f"<p class='rubrique'>À exploiter / à vérifier</p><ul>{items}</ul>")

    parties.append("<h2>Contradictions entre pièces</h2>")
    for c in d["contradictions"]:
        parties.append(f"<h3>{e(c['titre'])}</h3><p>{e(c['description'])}</p><ul>{''.join(cit(s) for s in c['sources'])}</ul>")

    parties.append("<p class='meta'>Pistes et rapprochements proposés à partir des pièces du dossier ; "
                   "leur appréciation et leur qualification reviennent à l'avocat.</p>")

    css = """
    * { font-family: sans-serif; }
    body { font-size: 10pt; line-height: 1.45; color: #16120d; }
    h1 { font-size: 17pt; margin: 0 0 4pt; }
    h2 { font-size: 13pt; margin: 16pt 0 6pt; color: #3d5548; border-bottom: 1px solid #ded7c9; }
    h3 { font-size: 10.5pt; margin: 10pt 0 3pt; }
    p { margin: 0 0 5pt; }
    ul { margin: 0 0 6pt 12pt; padding: 0; }
    li { margin-bottom: 2pt; }
    .meta { color: #606c66; font-size: 8.5pt; }
    .ref { color: #3d5548; font-size: 8.5pt; }
    .etiquette { color: #7c5f19; font-size: 8.5pt; font-weight: bold; }
    .rubrique { font-weight: bold; font-size: 9pt; margin: 4pt 0 2pt; }
    .encadre { background-color: #f3efe6; padding: 6pt; }
    """
    story = pymupdf.Story(html="".join(parties), user_css=css)
    tampon = io.BytesIO()
    auteur = pymupdf.DocumentWriter(tampon)
    page_utile = pymupdf.Rect(56, 56, 595 - 56, 842 - 64)
    suite = True
    while suite:
        appareil = auteur.begin_page(pymupdf.paper_rect("a4"))
        suite, _ = story.place(page_utile)
        story.draw(appareil)
        auteur.end_page()
    auteur.close()

    doc = pymupdf.open("pdf", tampon.getvalue())
    for i, page in enumerate(doc, start=1):
        page.insert_text((56, 842 - 30), FILIGRANE, fontsize=7, color=(0.45, 0.45, 0.45))
        page.insert_text((595 - 56 - 40, 842 - 30), f"{i} / {doc.page_count}", fontsize=7, color=(0.45, 0.45, 0.45))
    doc.set_metadata({"title": f"Note de défense — {defense['client']} — démonstration Lytis (dossier fictif)", "creator": "Lytis"})
    doc.save(SORTIE / "note_defense.pdf", garbage=4, deflate=True)


def main() -> None:
    SORTIE.mkdir(exist_ok=True)
    donnees = charger_donnees()
    # Les cotes par page viennent de data.js, déjà construit par build.py.
    contenu = (SITE / "data.js").read_text(encoding="utf-8")
    import json
    genere = json.loads(contenu[contenu.index("=") + 1:].strip().rstrip(";"))
    donnees["donnees"]["sources"] = genere["donnees"]["sources"]
    pdf_surligne(donnees["dossier"]["nb_pages"])
    note_defense(donnees)
    for f in sorted(SORTIE.iterdir()):
        print(f"{f.name} : {f.stat().st_size // 1024} Ko")


if __name__ == "__main__":
    main()
