# Audit de l'application Juristia (phase 1.a)

Repo audité, en lecture seule : `AntoineZ68/Antoine-Zoller`, branche `claude/inspiring-knuth-ug7qgd`,
commit `60c6bff`. C'est la seule branche du repo, et elle correspond à la version déployée sur
`antoine-zoller.onrender.com`. Les chemins ci-dessous sont relatifs à ce repo.
Aucune clé, URL de projet Supabase ou valeur d'environnement n'est recopiée ici.

## 0. Quatre écarts avec le brief, à connaître avant la phase 2

1. **Pas de React, pas de TypeScript.** Le frontend est une page HTML/JS unique, sans build,
   de 1 442 lignes (`web/frontend/index.html`). Il n'y a pas de types TypeScript : le contrat de
   données est le schéma Pydantic `DonneesDossier` (`web/backend/app/schemas.py`). « Même stack »
   veut donc dire une page statique en JS vanilla. « Mêmes types » veut dire reprendre `DonneesDossier`,
   qu'on pourra traduire en JSDoc.
2. **Les résultats d'analyse ne sont pas dans des tables Supabase.** Postgres ne contient que deux
   tables de métadonnées (`dossiers`, `traitement_etapes`). Tout le contenu extrait (pièces,
   personnes, événements, déclarations, résumé) vit dans un fichier SQLite par dossier, stocké
   dans le bucket `dossiers-resultats`. Le frontend le lit à travers `GET /api/dossiers/{id}/donnees`.
   Aucune requête SQL sur Postgres ne permet donc d'exporter l'analyse (voir `docs/EXPORT_ANALYSE.md`).
3. **Les cartes de garde à vue et la frise sont dans l'onglet « Analyse IA », pas dans
   « Chronologie ».** L'onglet Chronologie ne contient que la chronologie des faits
   (`index.html:1085`). Le parcours guidé de la phase 2 doit en tenir compte.
4. **Il y a 8 documents générés, pas 6.** « Signalements procéduraux » et « Rapport de contrôle »
   s'ajoutent à la liste (`index.html:550`). Le rapport de contrôle affiche les tokens et le coût
   des appels au modèle : il faudra décider s'il a sa place dans une démo commerciale.

## 1. Architecture et routes

| Couche | Emplacement | Rôle |
|---|---|---|
| Frontend | `web/frontend/index.html` | Page unique : authentification Supabase, liste des dossiers, détail, classeur PDF |
| API | `web/backend/app/main.py` (FastAPI, Docker sur Render) | Dépôt, suivi, données, URL signées |
| Pipeline | `web/backend/app/pipeline.py` | Enchaîne les 6 étapes du moteur en tâche de fond, envoie les résultats dans Storage |
| Moteur | `src/depouille/*` | ingest → classify → index → chrono → decl → build |
| Base | `web/backend/supabase/migrations/000{1,2,3}_*.sql` | `dossiers`, `traitement_etapes`, RLS par propriétaire |

Routes de l'API (`main.py`) :

| Route | Ligne | Usage côté front |
|---|---|---|
| `POST /api/dossiers` (multipart `fichiers[]`, `nom`, `reference`) | 101 | Formulaire « Nouveau dossier » |
| `GET /api/dossiers` | 157 | Barre latérale |
| `GET /api/dossiers/{id}` | 164 | Suivi des étapes pendant le traitement |
| `GET /api/dossiers/{id}/donnees` | 190 | **Tout le contenu des 3 onglets et du classeur** |
| `GET /api/dossiers/{id}/documents[/{nom}]` | 408, 421 | Carte « Documents transmis » |
| `GET /api/dossiers/{id}/livrables/{nom}` | 448 | URL signée de 5 min vers un livrable, dont le PDF surligné |
| `DELETE /api/dossiers/{id}` | 381 | Bouton « Supprimer » |

## 2. Écrans des captures et code correspondant

| Élément | Code |
|---|---|
| Barre latérale : marque, « + Nouveau dossier », liste, pied avec e-mail, déconnexion, avertissement de veille | `index.html:467-482` (HTML), `rendreListeLaterale()` |
| En-tête du dossier : titre, badge d'état, « Supprimer », date d'envoi, nb de pages, « Index du dossier » | `rendreDetailDossier()` `index.html:1115` |
| Onglets | `ONGLETS_DOSSIER` `index.html:563` |
| Informations générales : résumé avec mention IA, Informations (personnes et rôles), Documents générés, Documents transmis | `rendreDetailDossier()` (panneauInfos), `rendreBlocInformations()` |
| Chronologie des faits : 4 faits affichés puis « Voir les N fait(s) supplémentaire(s) » | `rendreBlocChronologie()` `index.html:1085` |
| Analyse IA | `rendreBlocAnalyseIA()` `index.html:1001` (détail au §5) |
| Pastille « Page N · Dx » | `badgeSource()` `index.html:862`. Infobulle `fichier · p.N · cote Dx`, variante orange si la page est peu lisible |
| Classeur (panneau de droite) : Pièce / Index, ‹ Page N / T ›, nom du fichier, fermeture | `index.html:512-533`, `ouvrirClasseur()` `:811`, `afficherPageClasseur()` `:783`, `rendreIndexClasseur()` `:840` |
| Mobile | `@media (max-width: 720px)` `index.html:129` et `:259` : la barre latérale et le contenu alternent, et le classeur passe en plein écran |

**Visualiseur PDF.** pdf.js 3.11.174 est chargé depuis cdnjs au premier clic (`index.html:708`). Il
affiche `00_dossier_surligne.pdf`, le dossier fusionné où les citations retenues sont déjà surlignées
(jaune pour la procédure, bleu pour les déclarations, vert pour les faits, `src/depouille/surlignage.py`).
La page N du classeur est la page N du PDF fusionné : une pastille « Page N » appelle simplement
`ouvrirClasseur(N)`, sans aucune recherche de texte. Le rendu se fait en canvas, à la largeur du panneau et à la densité de l'écran.

**Design tokens** (`index.html:18`) : `--fond #f6f3ed`, `--fond-barre #f1ece3`, `--carte #fffdf9`,
`--carte-creuse #f3efe6`, `--bordure #ded7c9`, `--encre #16120d`, `--texte-att #55655b`,
`--accent #55705f`, `--succes #426b4b`, `--erreur #a6412f`, `--alerte #7c5f19` ; rayons 14 / 9 / 999 px.
Polices Google Fonts : Inter pour l'interface, Playfair Display pour les titres et la marque, Newsreader pour les citations.

## 3. Format exact des données

### Postgres (Supabase)
- `dossiers` : `id, owner_id, nom, reference, statut (en_attente|en_cours|termine|erreur),
  etape_courante, message_erreur, fichier_source_path, resultat_db_path, couleurs_surlignage,
  nb_pages, cree_le, mis_a_jour_le`.
- `traitement_etapes` : `dossier_id, etape (ingest|classify|index|chrono|decl|build), statut, debut,
  fin, tokens_in, tokens_out, cout_usd, message_erreur`.

### Storage
- `dossiers-source/{owner_id}/{dossier_id}/{fichier}.pdf` : les PDF déposés.
- `dossiers-resultats/{dossier_id}/depouille.db` : la base SQLite de l'analyse (le contenu).
- `dossiers-resultats/{dossier_id}/out/` : `00_dossier_surligne.pdf`, `01_index.xlsx`,
  `02_chronologie_procedure.docx`, `03_chronologie_faits.docx`, `04_declarations.xlsx`,
  `05_personnalite.docx`, `06_signalements_procedure.docx`, `99_controle.md`.

### Réponse de `GET /api/dossiers/{id}/donnees` (`schemas.py`, `DonneesDossier`)
```
resume: str | null
personnes: [{nom, role}]                        role ∈ mis_en_cause|victime|témoin|expert|enqueteur
chronologie_faits: [{page, citation, description, personne?, date?, heure?}]
chronologie_procedure: [{date?, heure?, nature, page, citation, personne?}]
duree_garde_a_vue: {duree_totale_garde_a_vue, delai_placement_notification_droits,
                    delai_demande_realisation_examen_medical, delai_demande_realisation_entretien_avocat} | null
signalements: [{titre, description, page_reference?, citation_reference?}]
confrontations: [{point_factuel, declarations: [{personne?, page, citation}]}]
recoupements: [{type_entite, valeur, occurrences: [{page, citation, valeur_brute}]}]
sources: [{page, fichier_source, page_fichier, cote?, type_piece?, illisible}]
index_pieces: [{type, page_debut, page_fin, date?, heure?, cote?, fichier_source?}]
```
Cette réponse est exactement ce que consomme le frontend. C'est donc elle qui doit servir de fixture en phase 2.

### Sortie du modèle (Mistral via `llm/mistral_provider.py`, API `/v1/chat/completions`)
Le modèle ne produit que du JSON intermédiaire. Chaque citation est ensuite revérifiée mot pour mot
sur la page annoncée (`verification.py`) :
- classification d'une pièce sans intitulé reconnu : `{"type", "confiance"}` ;
- personne concernée par une pièce : `{"nom", "role"}` ;
- faits : `[{"page", "citation", "description", "personne_source"}]` ;
- déclarations en style narratif : `[{"page", "citation", "point_factuel"}]` ;
- résumé : une phrase de 30 mots au plus, en texte libre.
Les modèles viennent de `MODELE_CLASSIFICATION` et `MODELE_ANALYSE`. **À vérifier sur Render** :
leurs valeurs par défaut sont des noms de modèles Anthropic (`pipeline.py:56`). Avec
`LLM_PROVIDER=mistral` et ces variables absentes, chaque appel échoue, et l'échec est silencieux :
pièces « Non identifié », aucun fait extrait. La capture actuelle montre des faits : la configuration de production semble donc correcte.

## 4. Ce que le moteur fait de façon déterministe, et ce qui dépend du modèle

| Résultat affiché | Moteur | Dépend de |
|---|---|---|
| Type des pièces | Règles sur l'en-tête en capitales, sinon le modèle | Intitulés standard |
| Cote | Expression régulière `cote D12` | Le mot « cote » suivi d'**au moins 2 chiffres** (voir §6) |
| 4 cartes de garde à vue, frise | Expressions régulières sur **6 formulations précises** | Voir §6 |
| Signalements | Absences structurelles, durée > 24 h / 48 h | Frise |
| Identifiants recoupés | Téléphone, plaque SIV, IBAN, adresse sur ≥ 2 pages | — |
| Points communs, divergences | Lignes « Question : » / « Réponse : » ; question **identique** mot pour mot | Rédaction des PV |
| Chronologie des faits, résumé | Modèle, puis vérification littérale | Mistral |
| Personnalité (docx) | Phrases des pièces « Enquête de personnalité » et « Casier judiciaire », plus « né le » / « demeurant » | Types de pièces |

## 5. Fonctionnalités réellement opérationnelles

Opérationnelles dans le code déployé :
- création de compte et connexion (Supabase Auth), isolation des cabinets par RLS ;
- dépôt de un ou plusieurs PDF, OCR automatique des pages sans texte (Tesseract), suivi des 6 étapes ;
- **Informations générales** : résumé en une phrase, personnes et rôles, 8 documents
  téléchargeables, documents transmis ;
- **Chronologie** : chronologie des faits datée et sourcée, chaque fait avec sa pastille « Page N · Dx » ;
- **Analyse IA**, dans cet ordre : (1) chronologie de garde à vue (4 cartes), (2) frise de la procédure,
  (3) points d'attention structurels, (4) identifiants recoupés, (5) points communs entre plusieurs
  personnes. Aucun de ces blocs ne qualifie juridiquement : « à vérifier », jamais « nullité » ;
- classeur : PDF surligné page par page, index des pièces, navigation ;
- suppression d'un dossier (Storage puis base), restauration du dossier ouvert après rechargement.

Inexistant : recherche plein texte, annotations, export global, partage, multi-utilisateur par
cabinet, qualification juridique. Rien de tout cela ne doit apparaître dans la démo.

## 6. Défauts trouvés en faisant tourner le moteur sur le dossier de démo

Méthode : `tools/dossier-fictif/verifier_moteur.py` exécute les étapes déterministes du vrai moteur
(`src/depouille`, non modifié) sur le texte du dossier. Chaque point ci-dessous a été reproduit.

| # | Gravité | Défaut | Effet visible | Correctif proposé (dans l'app, pas ici) |
|---|---|---|---|---|
| 1 | **Bloquant** | Citation de la formule d'ouverture recollée à l'en-tête : `texte_sans_entete` retire les titres en capitales mais garde les lignes de métadonnées (« Procédure n° », « Affaire : », tampon). Faute de point, `phrase_contenant` remonte jusqu'au haut de la page, et la citation obtenue n'existe plus d'un seul tenant dans la page : elle est **rejetée** | « NON TROUVÉ » sur la durée totale et l'examen médical, interpellation et fin de garde à vue absentes de la frise, faux signalement « Fin de garde à vue non identifiée ». **Cause probable des 3 « NON TROUVÉ » de la capture actuelle** (non vérifié sur ce PDF, que je n'ai pas) | Dans `chrono._chercher_sur_pages` et `_chercher_ouverture_acte_sur_pages`, faire commencer la citation au plus tard au début de la ligne où commence la formule, ou ignorer toutes les lignes situées avant le titre |
| 2 | **Bloquant (produit)** | Les 4 cartes reposent sur 6 formulations exactes : `réquisition du JJ/MM/AAAA reçue à HHhMM`, `examiné ce jour JJ/MM/AAAA à HHhMM`, `Demande d'entretien formulée le … à …`, `réalisé le … de … à …`, `à compter du … à …`, `notification … droits … à HHhMM` | Sur un vrai dossier rédigé autrement (« examiné le 17 septembre 2026 à 22 heures 35 »), la carte affiche « NON TROUVÉ ». **Le dossier de démo utilise volontairement ces formulations** : la démo montrera donc un taux de réussite supérieur à celui d'un dossier quelconque | Élargir les expressions (heures en toutes lettres, dates en lettres, tournures fréquentes) et constituer un corpus de PV réels anonymisés pour les tests |
| 3 | Majeur | `RE_COTE` exige « cote » suivi de **2 à 6 chiffres** (`regex_patterns.py:46`) | Les cotes D1 à D9 ne sont jamais détectées (pastilles et index sans cote pour les 9 premières pièces). « COTE : D. 4 » (capture actuelle) ne l'est pas non plus | `\bcote\s*:?\s*([A-Za-z])[\s.\-]*(\d{1,6})\b`, puis recoller lettre et chiffres dans `detecter_cote` |
| 4 | Majeur | La deuxième formule d'ouverture (`Le JJ/MM/AAAA à …`) capture « né le 11/06/2002 à Saint-Étienne » | Date de naissance prise pour la date de l'acte, donc faits mal datés et mal triés | Exclure `n[ée]e?\s+le` devant la date |
| 5 | Majeur | `_premiere_mention_ou_creation` compare les noms par chaîne exacte (« Prénom NOM ») et non par ensemble de mots, contrairement à `_personne_par_nom` | Si le modèle a enregistré la victime en « DELCOURT Sophie », son certificat médical la recrée en « Sophie DELCOURT » avec le rôle par défaut **mis en cause** | Réutiliser `_mots()` pour chercher une personne existante avant de créer |
| 6 | Moyen | `RE_QUESTION` est sensible à la casse | « QUESTION : » / « REPONSE : », fréquents en pratique, ne passent pas par l'extraction déterministe | Ajouter `re.IGNORECASE` et gérer « REPONSE » sans accent |
| 7 | Moyen | Dans une confrontation, toutes les réponses sont attribuées à la personne principale de la pièce | Les réponses de la victime sont rangées sous le nom du mis en cause dans `04_declarations.xlsx` | Lire « Réponse de X : » |
| 8 | Moyen | Les « points communs » regroupent sur le texte exact de la question | « Avez-vous quelque chose à ajouter ? » posé à deux personnes ressort comme un point commun | Liste d'exclusion, ou regroupement par le modèle |
| 9 | Mineur | `RE_DEMEURANT` s'arrête à la première virgule | « Demeurant 12 » au lieu de l'adresse complète | S'arrêter au point ou à la fin de ligne |
| 10 | Sécurité | Le contenu extrait (citations, noms) est injecté par `innerHTML` sans échappement | Un PDF piégé peut exécuter du script dans la session d'un avocat, avec son jeton Supabase à portée | Échapper systématiquement (`textContent` ou fonction `echapper()`) |

Les numéros 1, 3 et 4 ont été vérifiés sur le dossier de démo avant et après ajustement (voir
`docs/DOSSIER_FICTIF.md`, §5).
