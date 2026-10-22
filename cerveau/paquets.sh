#!/bin/bash
# Refait les zips d'import des 20 agents Kalo et le paquet .plugin (tout en un)
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
  "version": "1.2.0",
  "description": "L'équipe communication de Kalo (Mamoudzou) : 20 agents avec leur prénom, leur île et le cerveau commun à lire avant chaque tâche.",
  "author": { "name": "Kalo" },
  "keywords": ["kalo", "communication", "mayotte", "facebook", "affiches"]
}
JSON
cat > $P/README.md <<'MD'
# Équipe com Kalo

Les 20 agents de communication de Kalo, chacun avec son prénom et son île, autour du cerveau commun (`/mnt/project-files/kalo/cerveau/`).

| Île | Agents |
|---|---|
| Centre | David (`kalo-cerveau`) |
| Pilotage | Chimène (`kalo-chef-com`), Chanisse (`kalo-calendrier`), Zayeb (`kalo-operations-commerciales`) |
| Marque | Gamil (`kalo-marque`), Ousséni (`kalo-critique`) |
| Écriture | Zaïna (`kalo-post-facebook`), Anli (`kalo-whatsapp-sms`), Thomas (`kalo-fiches-produits`) |
| Création | Sahel (`kalo-visuel-produit`), Kamil (`kalo-video-courte`) |
| Arène | Roukia (`kalo-challenger-affiches`), Bacar (`kalo-challenger-videos`), Faïza (`kalo-challenger-posts`), Fahardine (`kalo-challenger-operations`), Mariama (`kalo-challenger-calendrier`) |
| Clients | Charza (`kalo-community-manager`), Nasser (`kalo-avis-clients`) |
| Analyse | Nahim (`kalo-statistiques`), Chloé (`kalo-veille-concurrence`) |

Toute demande de com passe d'abord par Chimène, qui répartit. Chaîne qualité du 22/10/2026 : pour affiches, vidéos, posts, opérations et calendrier, les 2 sous-agents de l'atelier, puis le superviseur qui corrige lui-même, puis un seul échange avec le challenger de l'île Arène, puis Ousséni (sans note, par erreurs flagrantes) si la mission compte 2 livrables au plus, tribunal seulement si nécessaire, puis Chimène qui valide avec au moins 8/10 ; les autres livrables passent par Ousséni avant Chimène. Rien n'est publié sans validation.
MD
python3 -c "import json;d=json.load(open('$P/.claude-plugin/plugin.json'));assert d['name']=='equipe-kalo'"
for a in $AGENTS; do test -f $P/skills/$a/SKILL.md; done
(cd $P && zip -qr -X $TMP/equipe-kalo.plugin . -x "*.DS_Store")
cp $TMP/equipe-kalo.plugin $OUT/equipe-kalo.plugin
ls -la $OUT/equipe-kalo.plugin $OUT/agents-kalo-expert.zip
unzip -l $OUT/equipe-kalo.plugin | tail -3
rm -rf $TMP
