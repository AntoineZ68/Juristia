# OnCycle. — Site vitrine

One-page Next.js (App Router) + Tailwind CSS v4 + Lucide React, exporté en **site statique**.

## Lancer en local

```bash
cd oncycle
npm install
npm run dev        # http://localhost:3000
npm run build      # génère le site statique dans out/
```

## Structure

```
app/            layout (polices Instrument Serif + Plus Jakarta Sans), page, styles globaux
components/     Header, Hero, Constat, Synergie (interactif), Gamme, Transparence, Waitlist + Footer
components/ProductPack.tsx   packaging produit dessiné en CSS (réutilisé dans le hero et la gamme)
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
