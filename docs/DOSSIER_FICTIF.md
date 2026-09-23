# Dossier fictif de démonstration (phase 1.b)

**Fichier** : `fixtures/source/Procedure_2026-00517_CI_Lyon.pdf`, 34 pages, cotes D1 à D25, texte
natif (sans OCR). **Sources** : `tools/dossier-fictif/`. Le contenu est dans `contenu.py`, la mise en
page dans `build.py`, le rendu PDF dans `render_pdf.mjs` et le banc de test dans `verifier_moteur.py`.

Ce document est le **corrigé** du dossier. Il ne doit pas être montré avant la démo si l'on veut
laisser un avocat trouver seul les irrégularités.

## 1. L'affaire

Le jeudi 17 septembre 2026 vers 17h58, avenue Berthelot à Lyon 7ème, le sac à main de Sophie
DELCOURT, 41 ans, est arraché. Elle chute. Anthony VERGNE, 24 ans, intérimaire, est interpellé à 18h11
rue Sébastien-Gryphe. Il porte sur lui le téléphone de la victime, neuf barrettes de résine de cannabis
et 185 euros. Il reste en garde à vue jusqu'au 18 septembre à 15h40, puis il est déféré en vue d'une comparution immédiate.

Personnages, tous inventés :

| Rôle | Nom |
|---|---|
| Mis en cause | VERGNE Anthony, né le 11/06/2002 à Saint-Étienne, 12 rue des Tilleuls à Vénissieux |
| Victime | DELCOURT Sophie, née le 04/03/1985 à Roanne, comptable |
| Témoin | BOUZID Yacine, employé du tabac-presse « Le Carillon » (enseigne inventée) |
| OPJ de nuit / de jour | Lt Damien COSTE / Cne Nathalie ROCHER |
| Autres fonctionnaires | BC O. MANSART, GPX I. LEROY, P. SERRE, M. TISSOT, BP K. VIDAL |
| Avocat commis d'office | Me Bastien LAFARGUE |
| Médecins UMJ | Dr Claire MONTEIL (gardé à vue), Dr Paul ESTRADE (victime) |
| Parquet | Mme Laure DESCHAMPS, substitut de permanence |
| Enquête sociale rapide | Mme Amandine ROYER |

Les numéros de téléphone sont pris dans la tranche 06 39 98 xx xx. À ma connaissance, cette tranche
est réservée par l'Arcep aux œuvres de fiction ; c'est à vérifier avant diffusion large. Le numéro de
procédure 2026/00517 est celui du brief. Aucun élément n'est tiré d'une procédure réelle.

## 2. Les pièces

| Cote | Pages | Pièce | Heure de l'acte |
|---|---|---|---|
| D1 | 1-2 | PV d'interpellation (BAC) | 17/09 18h11 |
| D2 | 3 | PV de recherches et de découverte du sac | 17/09 18h25 |
| D3 | 4 | PV de fouille et de saisie (scellés 1 à 4) | 17/09 18h50 |
| D4 | 5-6 | PV de plainte et d'audition de la victime | 17/09 19h20 |
| D5 | 7 | Réquisition à l'UMJ pour la victime | 17/09 20h10 |
| D6 | 8-9 | PV de notification de placement en garde à vue et des droits | 17/09 20h41 |
| D7 | 10 | Réquisition médecin (gardé à vue) | 17/09 20h48 |
| D8 | 11 | PV d'avis à avocat | 17/09 20h58 |
| D9 | 12-13 | PV d'audition de témoin | 17/09 21h05 |
| D10 | 14 | PV d'avis à magistrat | 17/09 21h56 |
| D11 | 15 | Certificat médical, examen du gardé à vue | 17/09 22h35 |
| D12 | 16 | PV de déroulement de l'entretien avec l'avocat | 17/09 23h40 |
| D13 | 17-18 | 1re audition de garde à vue (avocat présent) | 17/09 23h45 |
| D14 | 19 | PV de pesée et de narcotest | 18/09 08h05 |
| D15 | 20 | PV d'avis à famille | 18/09 08h15 |
| D16 | 21 | Certificat médical initial de la victime (ITT 6 jours) | 18/09 09h40 |
| D17 | 22-23 | Exploitation de la vidéoprotection (2 sources) | 18/09 10h30 |
| D18 | 24-25 | 2e audition de garde à vue (avocat présent) | 18/09 11h30 |
| D19 | 26 | Confrontation victime / mis en cause | 18/09 13h15 |
| D20 | 27 | PV de restitution | 18/09 14h00 |
| D21 | 28 | Bulletin n° 1 du casier judiciaire (3 condamnations) | 18/09 11h02 |
| D22 | 29-30 | Enquête sociale rapide | 18/09 14h30 |
| D23 | 31 | Compte rendu au magistrat et instructions | 18/09 15h10 |
| D24 | 32 | PV de fin de garde à vue et de défèrement | 18/09 15h40 |
| D25 | 33-34 | Rapport de synthèse | 18/09 15h50 |

## 3. Les trois irrégularités, révélées uniquement par les horodatages et les mentions

1. **Notification des droits tardive** (art. 63-1 CPP : notification « immédiate »). La garde à vue
   court depuis 18h11 (D6 : « à compter du 17 septembre 2026 à 18 heures 11 minutes »), et
   l'intéressé est présenté à l'OPJ à 18h34. Les droits ne sont notifiés qu'à 20h41, soit
   **2 h 30** plus tard. Seule justification : « l'officier de police judiciaire de quart étant retenu
   jusqu'alors par une procédure distincte ». La chambre criminelle juge de façon constante qu'un
   retard non justifié par une circonstance insurmontable porte nécessairement atteinte aux intérêts
   de la personne, et la charge de travail n'est pas une telle circonstance. *Visible dans l'app :
   carte « Placement → notification des droits : 150 min ».*
2. **Avis au parquet tardif** (art. 63 CPP : information du procureur « dès le début » de la mesure).
   L'avis est donné à 21h56 (D10), **3 h 45** après le début de la mesure, sans explication.
   *Visible dans l'app : seulement si le modèle en extrait le fait dans la chronologie des faits.
   Aucune carte ne le calcule.*
3. **Avis à la famille hors délai** (art. 63-2 CPP : au plus tard 3 heures après la demande, sauf
   circonstance insurmontable mentionnée en procédure). La mère est demandée à 20h41 (D6) et avisée
   le lendemain à 08h15 (D15), soit **11 h 34** plus tard, sans aucune mention de tentative ni de
   circonstance. *Même remarque : aucune carte ne le calcule.*

Autres délais, calculables mais non irréguliers en soi : examen médical demandé (réquisition reçue)
à 20h52 et réalisé à 22h35, soit 103 min ; entretien demandé à 20h41 et réalisé à 23h10, soit
149 min ; durée totale de 21 h 29.

## 4. Les contradictions, vérifiables par la vidéo, les horaires ou le certificat médical

| # | Point | Versions | Élément objectif |
|---|---|---|---|
| 1 | **Coup de poing** (qualification de violences, ITT) | Victime (D4) : coup de poing à la joue gauche. Témoin (D9) : « Je n'ai pas vu de coup de poing ». Confrontation (D19) : la victime ne sait plus si le choc venait du poing ou de la chute | Vidéo (D17) : « aucun geste de frappe […] n'est visible ». Certificat (D16) : « Aucune lésion n'est constatée au niveau de la face ». Certificat du gardé à vue (D11) : aucune lésion des mains |
| 2 | **Tenue de l'auteur** (identification) | Victime : casquette **rouge**, sweat à capuche gris. Témoin : casquette **noire**, bombers noir | Interpellation (D1) : casquette noire, bombers noir, « Il ne porte pas de sweat à capuche ». Vidéo : couvre-chef sombre, visage non exploitable |
| 3 | **Heure des faits** | Victime : « environ 18h20 ». Témoin : un peu avant 18h | Appel de la salle de commandement à 18h02 (D1). Vidéo : 17h58, horloge corrigée de 3 minutes |
| 4 | **Origine du téléphone** (même personne, deux auditions) | D13 : « trouvé par terre rue de Marseille ». D18 : « acheté 40 euros » place Gabriel-Péri vers 18h05, alors qu'en D13 il quittait son ami « vers 18h05 » à Jean Macé | Vidéo : le sac est jeté à 17h58 à 250 m de là |

Il y a aussi des éléments à décharge, volontairement présents. Le visage n'est identifié ni par la
vidéo ni en confrontation. Il manque de l'argent : la victime avait deux billets de 20 et deux de 10,
et VERGNE ne porte qu'un billet de 20 et un de 10. Le conditionnement du cannabis pose la question
détention ou cession. Le casier fonde une récidive légale (vol, 27/06/2024).

## 5. Choix de rédaction imposés par le moteur (en toute transparence)

Le dossier respecte le style réel des PV. Plusieurs tournures ont toutefois été choisies parce que
le moteur ne reconnaît qu'elles (voir `docs/AUDIT_APP.md`, §6). Chacune est plausible, mais leur
réunion rend ce dossier plus favorable à l'outil qu'un dossier réel pris au hasard :

- les horodatages de garde à vue suivent exactement les 6 formulations reconnues (§6, n° 2 de l'audit) ;
- les auditions utilisent « Question : » / « Réponse : » en casse mixte ;
- victime et témoin reçoivent **la même question mot pour mot** sur l'heure, la tenue, les gestes
  et la reconnaissance, faute de quoi aucun « point commun » ne ressort ;
- la ligne « Affaire : … » se termine par un point, et les certificats commencent par « Lyon, le … ».
  Sans cela, le défaut n° 1 fait rejeter l'interpellation, l'examen médical et la fin de garde à vue ;
- l'enquête sociale indique « réalisée le 18/09/2026 à 14h30 » : sinon la date de naissance devient la
  date de l'acte (défaut n° 4) ;
- les personnes sont introduites par « dénommé(e) : NOM Prénom » ou « se nommer : NOM Prénom » ;
- le tampon porte le mot « Cote » (« Cote D12 ») et ne recouvre jamais l'en-tête.

**Laissé tel quel** : les cotes D1 à D9 à un chiffre. Le moteur ne les détecte pas (défaut n° 3). Si
l'app n'est pas corrigée avant l'analyse, les pastilles et l'index des 9 premières pièces
n'afficheront pas de cote. Je recommande de corriger l'expression (une ligne) plutôt que d'écrire
« D01 », qu'aucun greffe n'utilise.

## 6. Résultat attendu (banc de test, étapes déterministes)

`python3 tools/dossier-fictif/verifier_moteur.py <chemin du repo de l'app>` donne :

- **cartes de garde à vue** : 21.5 h · **150 min** · 103 min · 149 min ;
- **frise** : 8 événements vérifiés (interpellation, placement, notification, demande et réalisation
  de l'examen, demande et réalisation de l'entretien, fin de garde à vue) ; 0 citation rejetée ;
- **signalements structurels** : aucun (le moteur ne qualifie pas un délai de 150 min) ;
- **identifiants recoupés** : 06 39 98 41 27 (p. 1, 5, 27), 06 39 98 17 54 (p. 8, 20, 29),
  « 12 rue des Tilleuls à Vénissieux » (p. 8, 17, 20, 29) ;
- **points communs victime / témoin** : heure des faits, tenue, gestes, reconnaissance ;
- **divergence** de VERGNE entre D13 et D18 sur l'origine du téléphone ;
- **types de pièces** : 18 sur 25 reconnus par les règles d'en-tête, 7 laissés au modèle (D2, D8,
  D10, D15, D19, D20, D23) ;
- **cotes détectées** : D10 à D25 (16 sur 25).

Limites du banc de test : le texte est celui que pdfplumber doit extraire, et non une extraction
réelle du PDF (pdfplumber n'a pas pu être installé ici). Le typage des 7 pièces et l'identification des
personnes sont simulés. La chronologie des faits, le résumé et la personnalité dépendent de Mistral et
ne sont pas couverts. Le vrai passage dans l'app reste donc indispensable.

## 7. Régénérer le PDF

```bash
cd tools/dossier-fictif
python3 build.py                                    # mise en page et texte attendu
NODE_PATH=$(npm root -g) node render_pdf.mjs ../../fixtures/source/Procedure_2026-00517_CI_Lyon.pdf
python3 verifier_moteur.py /chemin/vers/antoine-zoller
```
Prérequis : Python 3.11 (stdlib seule), Node 18+ avec Playwright et son Chromium, police Liberation Mono.
