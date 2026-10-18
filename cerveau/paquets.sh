#!/bin/bash
# Refait les zips d'import des 15 agents Kalo et le paquet .plugin (tout en un)
set -euo pipefail
SK="$(cd "$(dirname "$0")/.." && pwd)/.claude/skills"
OUT=/mnt/project-files/kalo
TMP=$(mktemp -d)
# le haut de chaque SKILL.md doit rester du YAML valide (nom = dossier, description présente)
python3 - "$SK" <<'PY'
import glob, re, sys, yaml
for f in sorted(glob.glob(sys.argv[1] + "/kalo-*/SKILL.md")):
    d = yaml.safe_load(re.match(r"^---\n(.*?)\n---", open(f, encoding="utf-8").read(), re.S).group(1))
    assert d["name"] == f.split("/")[-2] and d.get("description"), f
PY
AGENTS=$(cd $SK && ls -d kalo-*)
for a in $AGENTS; do (cd $SK && zip -qr -X $TMP/$a.zip $a -x "*.DS_Store"); done
cp $TMP/kalo-*.zip $OUT/agents-zip/
(cd $SK && zip -qr -X $TMP/agents-kalo-expert.zip $AGENTS -x "*.DS_Store")
cp $TMP/agents-kalo-expert.zip $OUT/agents-kalo-expert.zip
# paquet .plugin
P=$TMP/equipe-kalo
mkdir -p $P/.claude-plugin $P/skills
for a in $AGENTS; do cp -r $SK/$a $P/skills/; done
cat > $P/.claude-plugin/plugin.json <<'JSON'
{
  "name": "equipe-kalo",
  "version": "1.1.0",
  "description": "L'équipe communication de Kalo (Mamoudzou) : 15 agents avec leur prénom, leur île et le cerveau commun à lire avant chaque tâche.",
  "author": { "name": "Kalo" },
  "keywords": ["kalo", "communication", "mayotte", "facebook", "affiches"]
}
JSON
cat > $P/README.md <<'MD'
# Équipe com Kalo

Les 15 agents de communication de Kalo, chacun avec son prénom et son île, autour du cerveau commun (`/mnt/project-files/kalo/cerveau/`).

| Île | Agents |
|---|---|
| Centre | David (`kalo-cerveau`) |
| Pilotage | Chimène (`kalo-chef-com`), Chanisse (`kalo-calendrier`), Zayeb (`kalo-operations-commerciales`) |
| Marque | Gamil (`kalo-marque`), Ousséni (`kalo-critique`) |
| Écriture | Zaïna (`kalo-post-facebook`), Anli (`kalo-whatsapp-sms`), Thomas (`kalo-fiches-produits`) |
| Création | Sahel (`kalo-visuel-produit`), Kamil (`kalo-video-courte`) |
| Clients | Charza (`kalo-community-manager`), Nasser (`kalo-avis-clients`) |
| Analyse | Nahim (`kalo-statistiques`), Chloé (`kalo-veille-concurrence`) |

Toute demande de com passe d'abord par Chimène, qui répartit. Chaque livrable passe par Ousséni (avocat du diable, 3 tours au plus) avant de revenir à Chimène ; les missions créatives se font en duo. Rien n'est publié sans validation.
MD
python3 -c "import json;d=json.load(open('$P/.claude-plugin/plugin.json'));assert d['name']=='equipe-kalo'"
for a in $AGENTS; do test -f $P/skills/$a/SKILL.md; done
(cd $P && zip -qr -X $TMP/equipe-kalo.plugin . -x "*.DS_Store")
cp $TMP/equipe-kalo.plugin $OUT/equipe-kalo.plugin
ls -la $OUT/equipe-kalo.plugin $OUT/agents-kalo-expert.zip
unzip -l $OUT/equipe-kalo.plugin | tail -3
rm -rf $TMP
