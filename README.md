# Agents IA Kalo

L'équipe communication de Kalo (électroménager, Mamoudzou), sous forme de skills Claude.

| Agent | Rôle |
| --- | --- |
| `kalo-chef-com` | Reçoit les demandes de com et les confie au bon agent |
| `kalo-marque` | Charte, ton et règles de Kalo |
| `kalo-calendrier` | Calendrier Facebook du mois |
| `kalo-post-facebook` | Textes des posts |
| `kalo-visuel-produit` | Affiches « Nouvel arrivage » (format validé) |
| `kalo-community-manager` | Réponses aux commentaires et messages |

## Installer

**Claude Code** : ouvre ce dossier avec Claude Code, les agents de `.claude/skills/` sont chargés automatiquement. Pour les avoir partout, copie `.claude/skills/*` dans `~/.claude/skills/`.

**claude.ai** : Réglages → Capacités → Skills → « Importer une skill », puis importe le dossier zippé de chaque agent (`.claude/skills/<agent>`).

Ensuite, demande simplement : « Fais l'affiche du lave-linge Hyundai 7 kg à 369 €, classe E » ou « Prépare le calendrier de novembre ».
