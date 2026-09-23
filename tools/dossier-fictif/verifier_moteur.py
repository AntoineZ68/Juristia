"""Fait tourner les étapes DÉTERMINISTES du moteur Juristia (src/depouille du repo de
l'app, lu sans modification) sur le texte attendu du dossier fictif.

But : savoir avant tout dépôt dans l'app ce que produiront la classification par
en-têtes, la détection de cotes, la chronologie de garde à vue (4 cartes de délais),
la frise de procédure, les signalements, les recoupements et les déclarations
Question/Réponse.

Limites, à lire avant d'interpréter le résultat :
- le texte vient de build/pages_texte.json (ce que pdfplumber doit extraire du PDF),
  pas d'une extraction réelle du PDF : dans cet environnement, pdfplumber, pymupdf et
  rapidfuzz ne sont pas installables, et on les remplace par des bouchons ;
- les appels au modèle (Mistral en production) sont SIMULÉS pour deux fonctions
  seulement, afin de laisser tourner la suite du pipeline : le typage des pièces
  sans intitulé reconnu et l'identification de la personne d'une pièce. Les valeurs
  simulées sont celles qu'on attend du modèle ; le vrai résultat peut différer. La
  chronologie des faits, le résumé et les déclarations en style narratif (100 % modèle)
  ne sont pas couverts.

Usage : python3 verifier_moteur.py /chemin/vers/antoine-zoller
"""

from __future__ import annotations

import json
import sqlite3
import sys
import tempfile
import types
from pathlib import Path

ICI = Path(__file__).resolve().parent


# --- Bouchons des dépendances absentes (affichage et correspondance floue OCR) -----
def _installer_bouchons() -> None:
    rich = types.ModuleType("rich")
    console_mod = types.ModuleType("rich.console")
    table_mod = types.ModuleType("rich.table")

    class Console:
        def __init__(self, *a, **k):
            pass

        def print(self, *a, **k):
            pass

    class Table:
        def __init__(self, *a, **k):
            pass

        def add_column(self, *a, **k):
            pass

        def add_row(self, *a, **k):
            pass

    console_mod.Console = Console
    table_mod.Table = Table
    rapidfuzz = types.ModuleType("rapidfuzz")
    fuzz = types.ModuleType("rapidfuzz.fuzz")
    fuzz.partial_ratio = lambda a, b: 0  # jamais appelé : aucune page n'est OCRisée
    rapidfuzz.fuzz = fuzz
    sys.modules.update({"rich": rich, "rich.console": console_mod, "rich.table": table_mod,
                        "rapidfuzz": rapidfuzz, "rapidfuzz.fuzz": fuzz})


# --- Ce qu'on attend du modèle pour les pièces que les règles ne couvrent pas --------
TYPE_ATTENDU_DU_MODELE = {
    "D2": "PV de constatations",
    "D8": "Pièce de procédure – autre",
    "D10": "Pièce de procédure – autre",
    "D15": "Pièce de procédure – autre",
    "D19": "PV d'audition",
    "D20": "Pièce de procédure – autre",
    "D23": "Pièce de procédure – autre",
}
PERSONNE_ATTENDUE_DU_MODELE = {
    "D2": ("Sophie DELCOURT", "victime"),
    "D3": ("Anthony VERGNE", "mis_en_cause"),
    "D4": ("Sophie DELCOURT", "victime"),
    "D5": ("Sophie DELCOURT", "victime"),
    "D7": ("Anthony VERGNE", "mis_en_cause"),
    "D8": ("Anthony VERGNE", "mis_en_cause"),
    "D9": ("Yacine BOUZID", "témoin"),
    "D10": ("Anthony VERGNE", "mis_en_cause"),
    "D13": ("Anthony VERGNE", "mis_en_cause"),
    "D14": ("Anthony VERGNE", "mis_en_cause"),
    "D15": ("Anthony VERGNE", "mis_en_cause"),
    "D17": ("Anthony VERGNE", "mis_en_cause"),
    "D18": ("Anthony VERGNE", "mis_en_cause"),
    "D19": ("Anthony VERGNE", "mis_en_cause"),
    "D20": ("Sophie DELCOURT", "victime"),
    "D21": ("Anthony VERGNE", "mis_en_cause"),
    "D22": ("Anthony VERGNE", "mis_en_cause"),
    "D23": ("Anthony VERGNE", "mis_en_cause"),
    "D25": ("Anthony VERGNE", "mis_en_cause"),
}


def main(chemin_app: Path) -> int:
    _installer_bouchons()
    sys.path.insert(0, str(chemin_app / "src"))

    from depouille import classify
    from depouille.chrono import calculer_durees, lancer_chrono
    from depouille.config import Config
    from depouille.conformite import detecter_signalements
    from depouille.db import ouvrir_db
    from depouille.declarations import lancer_declarations
    from depouille.qualite_texte import pages_peu_lisibles
    from depouille.recoupements import detecter_recoupements
    from depouille.regex_patterns import detecter_cote

    import contenu

    pages = json.loads((ICI / "build" / "pages_texte.json").read_text(encoding="utf-8"))
    cote_par_page = {p["page"]: p["cote"] for p in pages}

    # Bouchons des deux appels au modèle, pilotés par la cote de la pièce en cours.
    def cote_du_texte(texte: str) -> str:
        premiere = texte.splitlines()[0].strip()
        return premiere.replace("Cote ", "")

    def type_llm(config, texte, console, compteur):
        attendu = TYPE_ATTENDU_DU_MODELE.get(cote_du_texte(texte))
        return (attendu, 0.9) if attendu else ("Non identifié", 0.0)

    def personne_llm(config, texte, connues, console, compteur):
        return PERSONNE_ATTENDUE_DU_MODELE.get(cote_du_texte(texte))

    classify._classifier_type_llm = type_llm
    classify.identifier_personne_via_llm = personne_llm

    with tempfile.TemporaryDirectory() as tmp:
        db = ouvrir_db(Path(tmp) / "depouille.db")
        for p in pages:
            db.execute(
                """INSERT INTO pages (numero_global, fichier_source, page_fichier, texte, ocr_applique,
                   empreinte_sha256, cote_detectee, statut) VALUES (?, ?, ?, ?, 0, ?, ?, 'ingere')""",
                (p["page"], contenu.NOM_FICHIER, p["page"], p["texte"], str(p["page"]), detecter_cote(p["texte"])),
            )
        db.commit()

        console = sys.modules["rich.console"].Console()
        classify.lancer_classification(db, Config(offline=False, provider="simulé"), False, console)
        lancer_chrono(db, Config(offline=True, provider="offline"), False, console)
        lancer_declarations(db, Config(offline=True, provider="offline"), False, console)

        rapport = _rapport(db, cote_par_page, calculer_durees, detecter_signalements,
                           detecter_recoupements, pages_peu_lisibles)
    sortie = ICI / "build" / "rapport_moteur.json"
    sortie.write_text(json.dumps(rapport, ensure_ascii=False, indent=1), encoding="utf-8")
    _afficher(rapport)
    return 0


def _rapport(db: sqlite3.Connection, cote_par_page, calculer_durees, detecter_signalements,
             detecter_recoupements, pages_peu_lisibles) -> dict:
    pieces = [
        {
            "cote_attendue": cote_par_page[r["page_debut"]],
            "pages": f"{r['page_debut']}-{r['page_fin']}",
            "type": r["type"],
            "cote_detectee": r["cote"],
            "date": r["date_apparente"],
            "heure": r["heure_apparente"],
            "personne": r["nom"],
            "methode_personne": r["methode_personne_principale"],
        }
        for r in db.execute(
            """SELECT pi.*, p.nom FROM pieces pi LEFT JOIN personnes p ON p.id = pi.personne_principale_id
               ORDER BY pi.page_debut"""
        )
    ]
    procedure = [dict(r) for r in db.execute(
        """SELECT ep.date, ep.heure, ep.nature, ep.page, ep.statut_verif, ep.citation
           FROM evenements_procedure ep ORDER BY ep.date, ep.heure""")]
    declarations = [dict(r) for r in db.execute(
        """SELECT p.nom AS personne, d.point_factuel, d.page, d.statut_verif, d.citation
           FROM declarations d LEFT JOIN personnes p ON p.id = d.personne_id ORDER BY d.page""")]
    groupes: dict[str, list] = {}
    for d in declarations:
        if d["statut_verif"] == "verifie":
            groupes.setdefault(d["point_factuel"], []).append(d)
    confrontations = {k: [(d["personne"], d["page"]) for d in v] for k, v in groupes.items()
                      if len({d["personne"] for d in v if d["personne"]}) >= 2}
    divergences = [dict(r) for r in db.execute(
        """SELECT p.nom, dv.point_factuel, da.page AS page_a, db_.page AS page_b
           FROM divergences dv JOIN declarations da ON da.id = dv.declaration_id_a
           JOIN declarations db_ ON db_.id = dv.declaration_id_b
           LEFT JOIN personnes p ON p.id = dv.personne_id""")]
    return {
        "nb_pages": db.execute("SELECT COUNT(*) FROM pages").fetchone()[0],
        "personnes": [dict(r) for r in db.execute("SELECT nom, role FROM personnes ORDER BY role, nom")],
        "pieces": pieces,
        "duree_garde_a_vue": calculer_durees(db),
        "chronologie_procedure": procedure,
        "signalements": [s.titre for s in detecter_signalements(db)],
        "recoupements": [
            {"type": e.type_entite, "valeur": e.valeur, "pages": [o.page for o in e.occurrences]}
            for e in detecter_recoupements(db)
        ],
        "declarations_qr": declarations,
        "confrontations": confrontations,
        "divergences": divergences,
        "pages_peu_lisibles": [n for n, _, _ in pages_peu_lisibles(db)],
        "rejets": [dict(r) for r in db.execute("SELECT table_origine, page_annoncee, citation_proposee FROM rejets_verification")],
    }


def _afficher(r: dict) -> None:
    print(f"Pages : {r['nb_pages']}")
    print("\nPièces (type / cote détectée / date-heure de l'acte / personne) :")
    for p in r["pieces"]:
        print(f"  {p['cote_attendue']:>4} p.{p['pages']:<6} {p['type']:<50} cote={p['cote_detectee'] or '—':<5} "
              f"{p['date'] or '—'} {p['heure'] or ''}  {p['personne'] or '—'} ({p['methode_personne']})")
    print("\nPersonnes :", ", ".join(f"{x['nom']} ({x['role']})" for x in r["personnes"]))
    print("\nCartes de garde à vue :")
    for k, v in r["duree_garde_a_vue"].items():
        print(f"  {k:<45} {v}")
    print("\nFrise de procédure :")
    for e in r["chronologie_procedure"]:
        print(f"  {e['date']} {e['heure']}  {e['nature']:<32} p.{e['page']:<3} {e['statut_verif']}")
    print("\nSignalements :", r["signalements"] or "aucun")
    print("\nRecoupements :")
    for e in r["recoupements"]:
        print(f"  {e['type']:<10} {e['valeur']:<40} pages {e['pages']}")
    verifiees = [d for d in r["declarations_qr"] if d["statut_verif"] == "verifie"]
    print(f"\nDéclarations Q/R : {len(r['declarations_qr'])} extraites, {len(verifiees)} vérifiées")
    print("Points communs (≥ 2 personnes) :")
    for k, v in r["confrontations"].items():
        print(f"  « {k} » -> {v}")
    print("Divergences (même personne, deux auditions) :")
    for d in r["divergences"]:
        print(f"  {d['nom']} : « {d['point_factuel']} » p.{d['page_a']} / p.{d['page_b']}")
    print("\nPages signalées peu lisibles :", r["pages_peu_lisibles"] or "aucune")
    print("Citations rejetées :", len(r["rejets"]))
    for x in r["rejets"]:
        print("  ", x)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(Path(sys.argv[1]).resolve()))
