# Lytis — site vitrine

Site statique (HTML/CSS/JS, polices servies localement, aucun appel externe,
aucun cookie). Le formulaire « Programme pilote » ouvre la messagerie du
visiteur (mailto) : rien n'est collecté par le site.

## Réglages

Tout se règle dans `config.js` : adresse de la démo, e-mail de contact,
LinkedIn, photo et texte du fondateur. Si le domaine n'est pas `lytis.legal`,
remplacer aussi `https://lytis.legal/` dans `index.html` (balises `canonical`
et `og:image`).

## Lancer en local

```bash
cd vitrine && python3 -m http.server 8000
```

## Déployer (Render, Static Site)

Un seul site sur `lytis.legal` : la vitrine à la racine, la démonstration
sous `lytis.legal/demo/`. `construire.sh` assemble les deux dans `public/`.

1. Root Directory : vide (racine du dépôt)
2. Build Command : `bash vitrine/construire.sh` — Publish Directory : `public`
3. Headers : `/demo/*` → `X-Robots-Tag: noindex, nofollow`
4. Custom Domains : `lytis.legal` et `www.lytis.legal`
