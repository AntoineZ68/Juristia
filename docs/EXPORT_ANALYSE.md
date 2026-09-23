# Déposer le dossier dans l'app et exporter l'analyse

Instructions déduites du code de l'app (`AntoineZ68/Antoine-Zoller`, commit `60c6bff`).
Rappel : l'analyse n'est **pas** stockée dans Postgres, mais dans un fichier SQLite du bucket
`dossiers-resultats` (voir `docs/AUDIT_APP.md`, §0).

## 0. Avant le dépôt (10 minutes, fortement recommandé)

1. **Décider des correctifs produit à appliquer avant l'analyse.** Les fixtures seront la sortie
   réelle, figée. Sans les correctifs n° 3 (cotes D1 à D9) et n° 5 (doublon de personne) de l'audit,
   la démo en portera les défauts.
2. **Vérifier l'environnement du service backend sur Render** : `LLM_PROVIDER=mistral`,
   `MISTRAL_API_KEY` renseignée, `MODELE_CLASSIFICATION` et `MODELE_ANALYSE` renseignés avec des
   modèles Mistral (par exemple `mistral-small-latest` et `mistral-large-latest`). Leurs valeurs par
   défaut sont des noms de modèles Anthropic. S'ils sont absents, l'analyse « réussit » sans aucun fait extrait.
3. **Créer un compte dédié à la démo**, avec une adresse que vous réservez à cet usage. Le dossier
   n'est alors pas mêlé à vos essais, et l'export ne contient que lui.

## 1. Déposer le PDF

1. Ouvrir `https://antoine-zoller.onrender.com` et se connecter avec le compte dédié. Au premier
   appel, le backend peut mettre jusqu'à 50 s à sortir de veille.
2. Cliquer sur **+ Nouveau dossier**.
3. **Nom du dossier** : `VERGNE Anthony`. **Référence** : `2026/00517 · CI Lyon`.
4. **Fichier(s) PDF** : `fixtures/source/Procedure_2026-00517_CI_Lyon.pdf` (un seul fichier).
5. Cliquer sur **Envoyer**. Le détail affiche les 6 étapes : Lecture du PDF, Classification,
   Index, Chronologie, Déclarations, Assemblage. Comptez quelques minutes. Le badge doit passer à **TERMINÉ**.
6. Contrôle rapide avant export. Dans l'onglet Analyse IA, les cartes doivent afficher 21.5 h,
   150 min, 103 min et 149 min. Le bouton « Index du dossier » doit lister 25 pièces. Si ce n'est pas le
   cas, **ne pas corriger à la main** : m'envoyer quand même l'export, on corrigera le dossier ou le produit.

## 2. Exporter, méthode recommandée : depuis le navigateur

Cette méthode exporte exactement ce que consomme l'interface : le JSON de `/donnees`, puis les
8 livrables via leurs URL signées. Le script réutilise les fonctions de la page elle-même
(`appelApi`, `dossierOuvertId`, `LIVRABLES`). Aucune clé n'est copiée.

1. Ouvrir le dossier `VERGNE Anthony` dans l'app.
2. Ouvrir la console du navigateur (F12, onglet **Console**).
3. Coller le script ci-dessous et valider. Si Chrome demande l'autorisation de télécharger plusieurs
   fichiers, cliquer sur **Autoriser**.

```js
(async () => {
  const id = dossierOuvertId;
  if (!id) { console.error("Ouvrez d'abord le dossier VERGNE Anthony."); return; }
  const telecharger = (nom, blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nom;
    document.body.appendChild(a); a.click(); a.remove();
  };
  const json = (obj) => new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  telecharger("dossier.json", json(await appelApi(`/api/dossiers/${id}`)));
  telecharger("donnees.json", json(await appelApi(`/api/dossiers/${id}/donnees`)));
  telecharger("documents.json", json(await appelApi(`/api/dossiers/${id}/documents`)));
  for (const [nom] of LIVRABLES) {
    try {
      const { url } = await appelApi(`/api/dossiers/${id}/livrables/${nom}`);
      const reponse = await fetch(url);
      if (!reponse.ok) throw new Error("HTTP " + reponse.status);
      telecharger(nom, await reponse.blob());
      await new Promise((r) => setTimeout(r, 700));
    } catch (e) {
      console.warn(nom, "non exporté :", e.message);
    }
  }
  console.log("Export terminé.");
})();
```

Fichiers attendus : `dossier.json`, `donnees.json`, `documents.json`, `00_dossier_surligne.pdf`,
`01_index.xlsx`, `02_chronologie_procedure.docx`, `03_chronologie_faits.docx`, `04_declarations.xlsx`,
`05_personnalite.docx`, `06_signalements_procedure.docx` et `99_controle.md`. Un livrable absent
signifie que le moteur ne l'a pas produit, et c'est une information en soi.

## 3. Compléments depuis le tableau de bord Supabase

**SQL Editor** : métadonnées et coût du traitement. C'est tout ce que contient Postgres.

```sql
-- Le dossier de démo (le plus récent portant ce nom pour le compte dédié)
select d.id, d.nom, d.reference, d.statut, d.nb_pages, d.cree_le, d.mis_a_jour_le,
       d.fichier_source_path, d.resultat_db_path
from public.dossiers d
join auth.users u on u.id = d.owner_id
where d.nom = 'VERGNE Anthony'
  and u.email = '<adresse du compte démo>'
order by d.cree_le desc
limit 1;

-- Étapes, durées, tokens et coût
select etape, statut, debut, fin, fin - debut as duree,
       tokens_in, tokens_out, cout_usd, message_erreur
from public.traitement_etapes
where dossier_id = '<id obtenu ci-dessus>'
order by debut;
```

**Storage** : télécharger aussi la base d'analyse, utile pour auditer les rejets de vérification :

- `dossiers-resultats/<id>/depouille.db`, qui contient les tables `pieces`, `personnes`,
  `evenements_procedure`, `evenements_faits`, `declarations`, `divergences`, `rejets_verification`,
  `resume_affaire` et `run_log` ;
- les livrables sont aussi dans `dossiers-resultats/<id>/out/`, si le script de la section 2 en a manqué.

## 4. Ce qu'il faut me renvoyer

Les 11 fichiers de la section 2, `depouille.db` et le résultat des deux requêtes SQL (copie du
tableau ou CSV). Déposez-les dans `fixtures/export/` du repo de démo, ou joignez-les à la
conversation. Je ne les retoucherai pas : si un résultat est faux, je vous le signale avec la page et
la citation en cause.
