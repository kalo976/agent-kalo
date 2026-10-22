#!/bin/bash
# Refait le fichier à installer equipe-com-kalo.plugin :
# 1) recopie les SKILL.md à jour de .claude/skills dans plugin/equipe-com-kalo/skills
# 2) vérifie le plugin avec `claude plugin validate`
# 3) zippe le résultat dans le dossier courant.
set -euo pipefail
P="$(cd "$(dirname "$0")" && pwd)"
SK="$(cd "$P/../.." && pwd)/.claude/skills"
for d in "$P"/skills/*/; do n=$(basename "$d"); cp "$SK/$n/SKILL.md" "$d/SKILL.md"; done
command -v claude >/dev/null && claude plugin validate "$P" --profile directory | grep -E "×|√" || true
rm -f equipe-com-kalo.plugin
(cd "$P" && zip -qr -X "$OLDPWD/equipe-com-kalo.plugin" . -x "*.DS_Store" -x "construire.sh")
ls -la equipe-com-kalo.plugin
