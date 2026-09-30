#!/usr/bin/env bash
# Assemble le site publié sur lytis.legal : la vitrine à la racine,
# la démonstration sous /demo/. Lancé par Render depuis la racine du dépôt.
set -euo pipefail
rm -rf public
mkdir -p public
cp -r vitrine/. public/
rm -f public/construire.sh public/README.md
cp -r demo/site public/demo
rm -f public/demo/robots.txt
echo "Site assemblé dans public/ ($(find public -type f | wc -l) fichiers)"
