# Lytis — design system (MASTER)

> Généré avec ui-ux-pro-max (`"legal tech criminal law AI SaaS premium trust editorial serif"`,
> variance 4, motion 6, densité 4), puis adapté à l'identité Lytis existante.
> Une page qui a son fichier dans `pages/` le suit en priorité ; sinon, ce fichier fait foi.

## Ce qu'on garde du moteur, ce qu'on écarte

| Recommandation du moteur | Décision | Pourquoi |
|---|---|---|
| Palette « navy d'autorité + or » (#1E3A8A / #B45309) | **Écartée** | Code couleur générique des cabinets d'avocats ; l'identité Lytis (bordeaux) est déjà posée sur la bannière LinkedIn et la démo. |
| EB Garamond + Lato | **Écartée** | Playfair Display + Montserrat sont ceux de la bannière ; Inter est celui de la démo. Changer casserait la continuité bannière → site → démo. |
| Style « Glassmorphism » (1re requête) | **Écarté** | Esthétique « app IA », contraire au ton juridique demandé. |
| Pattern « Trust & Authority » : preuves, logos, études de cas | **Adapté** | Aucun logo client ni témoignage n'existe : **interdit de les inventer**. La preuve, c'est le produit (sources cliquables) et la démo. |
| Accessibilité : focus 3-4 px, cibles 44 px, contraste 4.5:1, reduced-motion | **Gardée** | Non négociable. |
| Motion : 1 à 2 sections épinglées max, scrub 0.5-1.5, état final immédiat en reduced-motion | **Gardée** | Une seule section épinglée (le scroll-telling). |

## Couleurs (tokens existants, inchangés)

| Rôle | Token | Valeur | Usage |
|---|---|---|---|
| Fond profond | `--vin-950` | `#22060B` | bas des dégradés, pied de page |
| Bordeaux nuit | `--vin-900` | `#2A070D` | titres sur fond clair |
| Bordeaux | `--vin-800` | `#3A0914` | hero, section confiance |
| Bordeaux vif | `--vin-700` | `#5E0F24` | boutons, liens, accents |
| Bordeaux clair | `--vin-600` | `#7A1830` | coches, traits |
| Crème | `--creme` | `#F4E8DA` | texte sur bordeaux, bouton crème |
| Crème clair | `--creme-clair` | `#FBF7F1` | sections alternées |
| Papier | `--papier` | `#FFFDFA` | fond de page, cartes |
| Encre | `--encre` | `#1E1115` | titres |
| Texte / texte doux | `--texte` / `--texte-doux` | `#3D2C31` / `#6F5C62` | corps / secondaire (AA sur papier) |

**Couleurs du produit** (reprises de la démo, uniquement dans la maquette d'interface) :
faits vert, procédure jaune, déclarations bleu, contradictions saumon, nullités violet —
les mêmes que le surlignage de la démo, pour qu'un avocat qui passe du site à la démo
retrouve exactement les mêmes codes.

Interdits : dégradés violet/rose, néons, fond noir « dark mode », or brillant.

## Typographie

| Rôle | Police | Graisse | Taille (desktop → mobile) |
|---|---|---|---|
| Titres éditoriaux | Playfair Display | 600 (italique 400 pour les accents) | h1 88 → 44 px, h2 52 → 34 px, h3 23 px |
| Marque, surtitres, badges | Montserrat | 500-600, capitales, interlettrage 0.2 em | 12-13 px |
| Corps, interface | Inter | 400-600 | 17 → 16 px, interligne 1.6 |
| Cotes et pages dans la maquette | Inter chiffres tabulaires | 500 | 12 px |

Toutes les polices restent **servies localement** (aucun appel à Google Fonts).

## Espacement, rayons, ombres

Existant conservé : conteneur 1180 px, gouttière mobile 16 px, sections 128 px (88 px mobile),
rayons 10 / 16 / 20 px, ombres `--ombre` et `--ombre-douce` teintées bordeaux (jamais noires).

## Mouvement

| Token | Durée | Courbe | Usage |
|---|---|---|---|
| `--m-rapide` | 180 ms | `power2.out` | survol, focus, boutons |
| `--m-standard` | 450 ms | `power3.out` | apparition d'un bloc |
| `--m-ample` | 800 ms | `expo.out` | révélation du titre, entrée de la maquette |
| scrub | lié au défilement | `none`, lissage 0.8 | scroll-telling uniquement |

Règles :
- Uniquement `transform` et `opacity` (et `clip-path` pour la révélation du titre).
- Une seule section épinglée sur la page : le scroll-telling.
- Pas de défilement « lissé » (Lenis) : il modifie la sensation de la molette et du pavé
  tactile, gêne les lecteurs d'écran et déroute un public non technique. Défilement natif.
- `prefers-reduced-motion` : aucune animation liée au défilement ; chaque étape s'affiche
  dans son état final, empilée, lisible, avec la même mise en page soignée.
- Sans JavaScript : même rendu statique que reduced-motion.

## Pile technique

- Site statique existant (HTML, CSS, JS sans framework) : **conservé**.
- GSAP 3 + ScrollTrigger (licence gratuite), **copiés dans le site** (`vitrine/vendor/`),
  chargés en `defer`, environ 45 Ko compressés. Aucun CDN.
- Maquette produit en HTML/CSS pur ; seules les captures existantes restent en WebP, en lazy loading.

## Composants

- **Bouton plein** : fond `--vin-700`, texte crème, rayon 999 px, hauteur ≥ 44 px, focus 3 px crème ou bordeaux selon le fond.
- **Bouton contour** : bordure 1 px `--vin-700` (ou crème sur bordeaux).
- **Badge de source** : `D12 · p. 13`, Inter 12 px, fond `--vin-voile`, cliquable, ouvre l'extrait.
- **Carte** : papier, bordure `--ligne`, rayon 16-20 px, ombre douce ; pas de soulèvement au survol sur les cartes non cliquables.
- **Maquette d'interface** : cadre de fenêtre sobre (3 points, barre crème), contenus fictifs repris
  du dossier de la démo (affaire GENTIANE, JI 26/00044), jamais de données réelles.

## Contenu

- Le dossier montré dans l'animation est **celui de la démo** : mêmes personnes, mêmes cotes,
  mêmes pages. Un avocat qui clique ensuite sur « Voir la démonstration » retrouve les éléments vus.
- Appréciations toujours au conditionnel (« paraît sérieuse », « à approfondir »).
- Pas de faux témoignages, faux logos, faux chiffres d'usage.

## Contrôle avant livraison

- Captures Playwright 1440 / 768 / 375 px, relues à l'œil, pour chaque section.
- Lighthouse mobile ≥ 90 ; CLS < 0.1 ; aucune requête hors du site.
- Navigation clavier complète, focus visible, contraste AA vérifié.
- Rendu reduced-motion et sans JS vérifiés.
