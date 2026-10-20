#!/bin/bash
# Fabrique le paquet .plugin de l'équipe com Meubles & Déco (20 agents md-*)
# Usage : bash meubles-deco/paquet.sh [dossier_de_sortie]
set -euo pipefail
ICI="$(cd "$(dirname "$0")" && pwd)"
SK="$ICI/skills"
OUT="${1:-$ICI/dist}"
mkdir -p "$OUT"
TMP=$(mktemp -d)
python3 - "$SK" <<'PY'
import glob, re, sys, yaml
fs = sorted(glob.glob(sys.argv[1] + "/md-*/SKILL.md"))
assert len(fs) == 20, f"{len(fs)} agents au lieu de 20"
for f in fs:
    d = yaml.safe_load(re.match(r"^---\n(.*?)\n---", open(f, encoding="utf-8").read(), re.S).group(1))
    assert d["name"] == f.split("/")[-2] and d.get("description"), f
PY
P=$TMP/equipe-meubles-deco
mkdir -p $P/.claude-plugin $P/skills
cp -r "$SK"/md-* $P/skills/
cat > $P/.claude-plugin/plugin.json <<'JSON'
{
  "name": "equipe-meubles-deco",
  "version": "1.0.0",
  "description": "L'équipe communication de Meubles & Déco et Dagonii (Mayotte) : 20 agents, avec Maxime au centre qui tient le cerveau commun sur GitHub.",
  "author": { "name": "Meubles & Déco" },
  "keywords": ["meubles-deco", "dagonii", "communication", "mayotte", "facebook", "affiches"]
}
JSON
cp "$ICI/README.md" $P/README.md
(cd $P && zip -qr -X "$TMP/equipe-meubles-deco.plugin" . -x "*.DS_Store")
cp "$TMP/equipe-meubles-deco.plugin" "$OUT/"
ls -la "$OUT/equipe-meubles-deco.plugin"
rm -rf "$TMP"
