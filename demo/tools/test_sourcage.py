"""Tests de la démo — bibliothèque standard uniquement.

Usage : python3 -m unittest discover -s tools -v   (depuis demo/)
"""

from __future__ import annotations

import json
import re
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from sourcage import RACINE, charger_donnees, localiser, references  # noqa: E402

DONNEES = charger_donnees()
NB_PAGES = DONNEES["dossier"]["nb_pages"]


class TestSourcage(unittest.TestCase):
    def test_chaque_citation_existe_a_sa_page(self):
        """Toute citation affichée est retrouvée à la page annoncée, avec
        tous ses chiffres (heures, dates, plaques) à l'identique."""
        echecs = []
        for categorie, page, citation in references(DONNEES["donnees"]):
            r = localiser(page, citation)
            if not r.valide:
                echecs.append(f"[{categorie}] p.{page} score={r.score:.2f} chiffres manquants={r.nombres_manquants} « {citation} »")
        self.assertEqual(echecs, [], "\n" + "\n".join(echecs))

    def test_une_citation_inventee_est_rejetee(self):
        """Contre-épreuve : le test doit savoir dire non."""
        self.assertFalse(localiser(29, "jeudi 19/02/2026 09h58 12h03 4h05").valide)  # heure modifiée
        self.assertFalse(localiser(12, "ZV-553-RT").valide)  # la page 12 porte ZV-535-RT
        self.assertFalse(localiser(3, "Il n'y avait personne dans le chemin.").valide)
        self.assertFalse(localiser(27, "interpellé à 06h05 à son domicile").valide)

    def test_pages_referencees_existent(self):
        for _, page, _ in references(DONNEES["donnees"]):
            self.assertTrue(1 <= page <= NB_PAGES, page)
        for n in range(1, NB_PAGES + 1):
            self.assertTrue((RACINE / "site" / "pages" / f"p{n:03d}.webp").exists(), f"image de la page {n} absente — lancer tools/build.py")

    def test_contradictions_reliees_a_deux_sources_distinctes(self):
        for c in DONNEES["donnees"]["contradictions"]:
            pages = {s["page"] for s in c["sources"]}
            self.assertGreaterEqual(len(pages), 2, c["titre"])
        self.assertEqual(sum(1 for c in DONNEES["donnees"]["contradictions"] if c.get("vedette")), 1)

    def test_index_couvre_tout_le_dossier(self):
        pieces = DONNEES["donnees"]["index_pieces"]
        debuts = [p["page_debut"] for p in pieces]
        self.assertEqual(debuts, sorted(debuts))
        self.assertEqual(debuts[0], 1)
        self.assertLessEqual(debuts[-1], NB_PAGES)

    def test_data_js_a_jour(self):
        """data.js est généré : il doit refléter source/dossier.json."""
        contenu = (RACINE / "site" / "data.js").read_text(encoding="utf-8")
        genere = json.loads(contenu[contenu.index("=") + 1:].strip().rstrip(";"))
        for cle in ("resume", "personnes", "chronologie_faits", "chronologie_procedure", "contradictions",
                    "confrontations", "recoupements", "gardes_a_vue",
                    "resume_detaille", "journee", "defense", "questions"):
            self.assertEqual(genere["donnees"][cle], DONNEES["donnees"][cle], f"{cle} : relancer tools/build.py")
        self.assertEqual(len(genere["donnees"]["sources"]), NB_PAGES)


class TestContenu(unittest.TestCase):
    """Garde-fous issus des relectures : chaque erreur corrigée reste corrigée."""

    def test_pas_d_in_limine_litis_pendant_l_instruction(self):
        # Pendant l'instruction, les nullités passent par la chambre de l'instruction (art. 173).
        for nom in ("app.js", "data.js"):
            texte = (RACINE / "site" / nom).read_text(encoding="utf-8")
            self.assertNotIn("in limine litis", texte, nom)

    def test_citations_sans_guillemets_doubles(self):
        # L'interface encadre déjà chaque citation de « ».
        for _, page, citation in references(DONNEES["donnees"]):
            self.assertFalse(citation.startswith("«") or citation.endswith("»"), f"p.{page} {citation}")

    def test_chronologie_des_faits_triee(self):
        def cle(f):
            j, m, a = f["date"].split("/")
            return (a, m, j, f.get("heure") or "00h00")
        faits = DONNEES["donnees"]["chronologie_faits"]
        self.assertEqual(faits, sorted(faits, key=cle))

    def test_personnes_citees_dans_les_pv_presentes(self):
        noms = " ".join(p["nom"] for p in DONNEES["donnees"]["personnes"])
        for nom in ("FAVRE-BONVIN", "GAILLARD-ROUX", "PETITJEAN", "DUMOLARD", "PELLOUX", "DUFOUR"):
            self.assertIn(nom, noms)

    def test_questions_au_dossier_sourcees(self):
        """Toute réponse porte une source par phrase, sauf l'aveu d'une
        question hors dossier, qui doit le dire."""
        for q in DONNEES["donnees"]["questions"]:
            for phrase in q["reponse"]:
                if not phrase["sources"]:
                    self.assertEqual(q.get("nature"), "hors_dossier", q["question"])
                    self.assertIn("pièces du dossier", phrase["texte"])

    def test_documents_telechargeables_presents(self):
        for nom in ("note_defense.pdf", "dossier_surligne.pdf"):
            self.assertTrue((RACINE / "site" / "documents" / nom).exists(), f"{nom} : lancer tools/documents.py")


FICHIERS_SITE = ["index.html", "app.js", "config.js", "data.js", "app.css", "demo.css", "fonts.css"]


class TestSite(unittest.TestCase):
    def test_noindex(self):
        html = (RACINE / "site" / "index.html").read_text(encoding="utf-8")
        self.assertIn('<meta name="robots" content="noindex, nofollow" />', html)
        self.assertIn("Disallow: /", (RACINE / "site" / "robots.txt").read_text(encoding="utf-8"))

    def test_aucun_upload(self):
        for nom in FICHIERS_SITE:
            texte = (RACINE / "site" / nom).read_text(encoding="utf-8")
            self.assertNotIn('type="file"', texte, nom)
            self.assertNotIn("FormData", texte, nom)

    def test_aucune_ressource_externe(self):
        """Seules adresses externes admises : le script de mesure Plausible (chargé seulement si configuré)."""
        admises = {"https://plausible.io/js/script.manual.js",
                   "http://www.w3.org/2000/svg"}  # espace de noms SVG : un identifiant, pas une requête
        for nom in FICHIERS_SITE:
            texte = (RACINE / "site" / nom).read_text(encoding="utf-8")
            for url in re.findall(r"https?://[^\s\"'`)<>]+", texte):
                self.assertIn(url, admises, f"{nom} : {url}")

    def test_aucun_secret(self):
        motifs = [
            r"sk-[A-Za-z0-9]{16,}", r"sb_(publishable|secret)_", r"supabase\.co", r"eyJ[A-Za-z0-9_-]{20,}\.",
            r"(?i)(api[_-]?key|secret|password|token)\s*[:=]\s*['\"][^'\"]{8,}", r"onrender\.com",
            r"-----BEGIN [A-Z ]*PRIVATE KEY-----",
        ]
        for chemin in RACINE.rglob("*"):
            if not chemin.is_file() or "captures" in chemin.parts or chemin.suffix in {".webp", ".png", ".woff2", ".pdf", ".tsv", ".pyc"}:
                continue
            texte = chemin.read_text(encoding="utf-8", errors="ignore")
            for motif in motifs:
                self.assertIsNone(re.search(motif, texte), f"{chemin.relative_to(RACINE)} : motif {motif}")


if __name__ == "__main__":
    unittest.main()
