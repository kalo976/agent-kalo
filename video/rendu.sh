#!/usr/bin/env bash
# Rend la vidéo Kalo « Nouvel arrivage » (1080 × 1920, 15 s) pour un produit.
# Usage : ./rendu.sh produits/hisense-7kg-blanc.json sorties/hisense-7kg-blanc.mp4
# Le JSON a le même format que les affiches : {fond, produit, specs[], prix, classe, photo}.
# La photo (packshot détouré) doit se trouver dans public/packshots/.
set -euo pipefail
cd "$(dirname "$0")"
PRODUIT="$(realpath "$1")"
SORTIE="${2:-out/video.mp4}"
NAV=()
# Dans le conteneur Claude, on utilise le Chromium déjà installé
if [ -d /opt/pw-browsers ]; then
  NAV=(--browser-executable="$(ls -d /opt/pw-browsers/chromium_headless_shell-*/*/ | head -1)headless_shell")
fi
npx remotion render src/index.ts NouvelArrivage "$SORTIE" --props="$PRODUIT" --codec=h264 --crf=18 "${NAV[@]}"
