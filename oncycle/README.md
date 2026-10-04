# OnCycle. — Site vitrine

One-page Next.js (App Router) + Tailwind CSS v4 + Framer Motion + Lenis + Lucide React, exporté en **site statique**.

## Ajouter les visuels finaux

Déposez vos deux images dans `public/images/` avec ces noms exacts (JPG, ~2000 px de large, < 400 Ko idéalement) :

| Fichier | Usage |
| --- | --- |
| `hero-tablette.jpg` | Photo produit du Hero (tablette coupée, cœur framboise) |
| `texture-soie.jpg` | Texture soie violette + fèves, fond de la section « La Formule » |

Tant qu'un fichier est absent, un placeholder SVG s'affiche automatiquement (`lib/assets.ts`).

## Lancer en local

```bash
cd oncycle
npm install
npm run dev        # http://localhost:3000
npm run build      # génère le site statique dans out/
```

## Structure

```
app/                   layout (Playfair Display + Plus Jakarta Sans), page, styles globaux
components/motion/     briques d'animation : SmoothScroll (Lenis), Intro (loader), CustomCursor,
                       Magnetic, Reveal, SplitText, ShineButton, SmartImage
components/sections/   Navbar, Hero, Constat (sticky), Formule (bento), Gamme (scroll horizontal), Footer
components/ProductPack.tsx   packaging produit dessiné en CSS
lib/                   easing commun, chemins des visuels
```

## Déployer sur Render (gratuit)

1. Sur https://dashboard.render.com : **New → Blueprint**, connecter le dépôt GitHub.
   Render lit `render.yaml` à la racine et crée le site statique automatiquement.
   *(Alternative manuelle : New → Static Site, Root Directory `oncycle`,
   Build Command `npm ci && npm run build`, Publish Directory `out`.)*
2. L'URL publique `https://oncycle.onrender.com` (ou proche) est prête en ~2 min.
   Chaque push sur la branche redéploie le site.

## Collecter les emails de la liste d'attente

Par défaut, le formulaire est en **mode démo** (aucun email n'est enregistré).
Pour collecter réellement : créer un formulaire gratuit sur Formspree, puis définir
la variable d'environnement `NEXT_PUBLIC_WAITLIST_ENDPOINT=https://formspree.io/f/xxxx`
dans Render (Environment) et relancer un déploiement.

## Panneau « Business model » (présentation orale)

Un panneau plein écran en 4 étapes (marché & cible, pricing, go-to-market, concurrence) s'ouvre par-dessus le site, sans quitter la page. Fermer ramène exactement à la même position de scroll.

- **Ouvrir :** le bouton discret « Business model » entre la Gamme et le pied de page, la touche **B** (hors champ de saisie), ou l'adresse `/#business-plan`.
- **Naviguer :** flèches ← →, touches 1 à 4, ou les boutons en bas. **Échap** ferme.
- **Modifier les chiffres :** `components/business/steps.tsx` (prix, coût de revient et marge sont en haut du fichier, la marge est calculée).
