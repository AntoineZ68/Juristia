# Juristia — Site vitrine

Landing page du SaaS Juristia (analyse assistée par IA des dossiers pénaux).
Objectif unique : convertir l'avocat pénaliste et le rediriger vers l'application
existante (bouton « Se connecter » / « Accéder à mon espace »).

## Stack

- **Next.js 16** (App Router, React 19) — rendu statique, SEO-friendly
- **Tailwind CSS 4** — configuration CSS-first, tokens dans `app/globals.css`
- **TypeScript** strict
- Aucune dépendance UI tierce : tout le site est statique, sans image à charger
  (l'aperçu produit et la carte OpenGraph sont générés en HTML/CSS)

## Démarrer

```bash
npm install
cp .env.example .env.local   # renseigner l'URL de l'application
npm run dev                  # http://localhost:3000
```

Build de production :

```bash
npm run build && npm run start
```

## Variables d'environnement

| Variable | Rôle | Défaut |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (metadata, sitemap, OG) | `https://www.juristia.fr` |
| `NEXT_PUBLIC_APP_URL` | **Application métier existante** — cible de tous les CTA « Se connecter » | `https://app.juristia.fr` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Adresse des demandes de démonstration | `contact@juristia.fr` |

Ces variables sont lues dans `lib/site.ts`, seul point de configuration du site.

## Architecture

```
app/
  layout.tsx              polices, metadata, JSON-LD (SoftwareApplication)
  page.tsx                one-pager : assemblage des sections
  globals.css             design system (tokens couleurs/typo, boutons, prose)
  opengraph-image.tsx     carte de partage générée à la volée
  sitemap.ts / robots.ts
  mentions-legales/ cgv/ confidentialite/   pages légales
components/
  site-header.tsx         header sticky + menu mobile plein écran
  hero.tsx                accroche + CTA principal
  product-mock.tsx        aperçu du classeur interactif (HTML/CSS, sans image)
  security.tsx            bande sombre « sécurité absolue des données »
  features.tsx            3 blocs de valeur
  how-it-works.tsx        3 étapes
  pricing.tsx             3 offres
  final-cta.tsx / site-footer.tsx
  reveal.tsx              apparition au scroll (IntersectionObserver, ~30 lignes)
lib/site.ts               configuration + navigation
```

## Direction artistique

- **Papier crème `#f6f3ee` / encre chaude `#16130f`**, une seule couleur
  d'accent (« sceau » vert profond `#1f3b33`) utilisée avec parcimonie.
- **Instrument Serif** pour les titres (autorité, éditorial) / **Inter** pour le
  texte et l'interface (modernité, lisibilité).
- Hairlines à 1 px, angles quasi droits (rayon 4 px), aucune ombre sauf sur
  l'aperçu produit. Le blanc tournant fait le travail : ne pas densifier.
- Toutes les sections s'alignent sur la gouttière `.shell` (max 78rem).

## À compléter avant mise en ligne

Ces points sont signalés par des commentaires `⚠️` dans le code et par un
surlignage jaune (`.todo`) sur les pages légales :

1. **Pages légales** (`app/mentions-legales`, `app/cgv`, `app/confidentialite`) :
   raison sociale, RCS, hébergeur, DPO, durées de conservation, ressort
   compétent. Trames à faire relire par un conseil — ce ne sont pas des
   documents juridiques validés.
2. **Engagements de sécurité** (`components/security.tsx`) : chaque affirmation
   (hébergement en France, absence de transfert hors UE, zéro entraînement) est
   opposable. À confirmer contractuellement avec l'hébergeur et les
   fournisseurs de modèles avant publication. Ne jamais afficher une
   certification non obtenue.
3. **Tarifs** (`components/pricing.tsx`) : montants de départ à aligner sur la
   grille réelle, et à répercuter dans le JSON-LD de `app/layout.tsx`.
4. **Promesses de performance** : « 2 800 pages », « 41 min » (hero et
   `product-mock.tsx`) doivent correspondre à des mesures réelles.
5. **Preuve sociale** : aucun logo ni témoignage n'a été inventé. Dès que des
   cabinets référents acceptent d'être cités, insérer un bandeau entre le hero
   et la section sécurité — c'est le levier de conversion qui manque aujourd'hui.
6. **Mesure d'audience** : aucun traceur n'est posé. Si un outil est ajouté,
   un bandeau de consentement conforme CNIL devient obligatoire (voir
   `app/confidentialite/page.tsx`, section Cookies).

## Déploiement

Site 100 % statique après build : déployable sur Vercel (zéro configuration),
Netlify ou tout hébergeur Node. Renseigner les trois variables
d'environnement, puis pointer le DNS. Les en-têtes de sécurité
(`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) sont définis
dans `next.config.ts`.
