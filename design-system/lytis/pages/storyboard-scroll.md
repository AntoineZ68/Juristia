# Storyboard — « Le dossier qui se transforme »

Section épinglée unique, placée juste après le hero. Contenu : le dossier fictif de la démo
(affaire GENTIANE, JI 26/00044, client MARTINON Lucas, 31 pages). Toutes les cotes, pages et
citations ci-dessous existent dans la démo.

## Mise en page

- **Desktop (≥ 1020 px)** : colonne gauche 40 % (texte de l'étape), colonne droite 60 % (maquette
  épinglée, 16:10, cadre de fenêtre Lytis). Indicateur d'étapes 1 → 6 à gauche, cliquable
  (clic = défilement jusqu'à l'étape).
- **Tablette (768 px)** : même principe, maquette au-dessus, texte en dessous, dans l'écran épinglé.
- **Mobile (375 px)** : pas d'épinglage. Six cartes successives, chacune avec sa vignette de
  maquette dans l'état final de l'étape, qui s'anime une fois (0,6 s) à l'entrée dans l'écran.
- **Reduced-motion / sans JS** : six blocs statiques, maquette dans l'état final, mêmes textes.

Longueur de défilement : 6 étapes × 90 % de hauteur d'écran ≈ 540 vh au total sur desktop.
Chaque transition est liée au défilement (scrub 0.8) ; le texte change par fondu enchaîné
(0,35 s, déclenché à 50 % de l'étape), pas par scrub, pour rester lisible.

## Étapes

| # | Déclencheur | Maquette | Texte à gauche |
|---|---|---|---|
| 1 | 0 → 15 % | Cinq pages scannées (grain, texte flouté) tombent en pile dans la zone de dépôt, légère rotation aléatoire ±4°, chacune avec sa cote : D1, D6, D12, D15, D24. Compteur « 31 pages ». | **Le dossier arrive tel quel.** — PDF scannés, pièces dans le désordre : Lytis prend la copie comme vous la recevez. |
| 2 | 15 → 30 % | La pile s'étale en éventail ; la page D15 (p. 16) passe au premier plan. Une ligne de lecture bordeaux la parcourt de haut en bas ; trois passages se surlignent dans les couleurs de la démo (vert, jaune, violet). | **Chaque page est lue.** — Faits, actes de procédure, déclarations : chaque passage utile est repéré, y compris dans les scans. |
| 3 | 30 → 48 % | Les pages se retirent à gauche ; une frise horizontale se trace. Six événements glissent et se posent : 22/01 Meylan (D3 · p. 4) · 12/02 14h05 Biviers, borne BIV-CROIX-02 (D6 · p. 7) · 20/02 commission rogatoire (D8 · p. 9) · 23/02 pose de balise (D9 · p. 10) · 10/03 05h40 perquisition (D15 · p. 16) · 10/03 11h00 audition (D24 · p. 25). | **La chronologie se construit.** — 27 faits datés, remis dans l'ordre, chacun avec sa cote et sa page. |
| 4 | 48 → 64 % | La frise se compacte en haut ; quatre cartes « Nullités possibles » apparaissent, avec une jauge : Perquisition du domicile commencée à 05h40 — *paraît sérieuse* · Réquisition sur la ligne du client sans autorisation retrouvée — *paraît sérieuse* · Géolocalisation posée deux jours avant l'ordonnance — *à approfondir* · Notification des droits différée de 3 h 52 — *paraît fragile*. | **Les nullités possibles ressortent.** — Classées selon ce que votre client paraît pouvoir invoquer. L'appréciation reste la vôtre. |
| 5 | 64 → 80 % | Les cartes s'effacent ; l'écran se sépare en deux colonnes qui s'écartent depuis le centre : **À charge** / **À décharge**, pour le fait n°4 (Biviers, 12/02). À charge : « Je suis resté dans la voiture… » (D24 · p. 25), borne BIV-CROIX-02 (D6 · p. 7). À décharge : « Je ne suis jamais entré dans une maison. » (D24 · p. 25), « Aucune trace exploitable n'a pu être attribuée à MARTINON Lucas » (D27 · p. 28). | **Charge et décharge, fait par fait.** — Ce qui relie votre client à chaque fait, et ce qui l'en éloigne. |
| 6 | 80 → 100 % | **Moment signature.** Le curseur (simulé) se pose sur le badge « D15 · p. 16 » de la perquisition. Un trait bordeaux se dessine (tracé SVG progressif) jusqu'à la page 16, qui s'ouvre en zoom (échelle 1 → 1,6) centrée sur la phrase exacte, surlignée : « commençons la perquisition de l'appartement (T2, plan ci-dessous) à 05h40 ». Puis encart : « Citation retrouvée mot pour mot, page 16. » | **Rien sans sa source.** — Chaque élément renvoie à l'extrait exact de la pièce. Un clic, et vous vérifiez. |

Après l'étape 6, l'épinglage se libère ; la maquette reste interactive : l'utilisateur peut
survoler / cliquer les autres badges pour rejouer le tracé vers leur page. Bouton sous la
maquette : « Voir ce dossier dans la démonstration ».

## Hero

1. Titre « Le droit pénal a son IA. » révélé ligne par ligne (masque `clip-path`, 0,8 s,
   décalage 0,12 s), « son IA » en italique qui apparaît en dernier.
2. Chapeau et boutons en fondu (0,45 s, +0,3 s).
3. Maquette produit inclinée (rotateX 18°, perspective 1600 px) qui se redresse et monte
   vers l'écran au défilement des 60 premiers % de la hauteur d'écran (scrub), puis transmet
   le relais au scroll-telling.

## Section confiance

Trois blocs (Mistral AI, hébergement en Europe, secret professionnel) sur fond bordeaux.
Micro-animations à l'entrée uniquement : tracé de l'icône (SVG, 0,6 s), puis texte.
Aucun badge de certification qui n'existe pas.

## Performance visée

Pages scannées de la maquette : 5 images WebP ≤ 40 Ko chacune, chargées à l'approche de la section.
GSAP + ScrollTrigger ≈ 45 Ko compressés. Aucune vidéo.
