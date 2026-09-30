# Lytis — site vitrine

Site statique (HTML/CSS/JS, polices servies localement, aucun appel externe,
aucun cookie). Le formulaire « Programme pilote » ouvre la messagerie du
visiteur (mailto) : rien n'est collecté par le site.

## Réglages

Tout se règle dans `config.js` : adresse de la démo, e-mail de contact,
LinkedIn, photo et texte du fondateur. Si le domaine n'est pas `lytis.fr`,
remplacer aussi `https://lytis.fr/` dans `index.html` (balises `canonical`
et `og:image`).

## Lancer en local

```bash
cd vitrine && python3 -m http.server 8000
```

## Déployer (Render, Static Site)

1. Render → New + → Static Site, dépôt `AntoineZ68/Juristia`, cette branche.
2. Root Directory : `vitrine` — Build Command : vide — Publish Directory : `.`
3. Settings → Custom Domains : ajouter `lytis.fr` et `www.lytis.fr`, puis créer
   chez le registraire les enregistrements DNS indiqués par Render.
