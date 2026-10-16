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

## Skills de communication ajoutées (sources GitHub)

Sélectionnées pour un commerce comme Kalo (Facebook, WhatsApp, pub locale, affiches). Les skills pensées pour les logiciels SaaS ont été écartées. Ces skills sont en anglais, mais elles répondent en français si on leur parle en français.

| Skill | À quoi elle sert | Source |
| --- | --- | --- |
| `social` | Posts et planning réseaux sociaux | coreyhaines31/marketingskills (MIT) |
| `copywriting` | Textes de vente (pages, annonces) | idem |
| `copy-editing` | Relecture et amélioration de textes | idem |
| `content-strategy` | Stratégie de contenu | idem |
| `ad-creative` | Accroches et variantes de pubs | idem |
| `ads` | Campagnes Facebook/Instagram et Google | idem |
| `emails` | Séquences d'emails | idem |
| `sms` | SMS et WhatsApp marketing | idem |
| `influencer-marketing` | Partenariats avec influenceurs | idem |
| `public-relations` | Relations presse, communiqués | idem |
| `community-marketing` | Animer la communauté | idem |
| `marketing-psychology` | Leviers psychologiques de vente | idem |
| `offers` | Construire des offres et promotions | idem |
| `events` | Événements en magasin | idem |
| `video` | Vidéos courtes (Reels) | idem |
| `image` | Visuels marketing | idem |
| `marketing-plan` | Plan marketing complet | idem |
| `canvas-design` | Affiches et visuels graphiques | anthropics/skills (Apache 2.0) |

Versions : marketingskills @ 365b412, anthropics/skills @ dbd4588 (16/10/2026). Les agents `kalo-*` passent avant : charte, ton et règles Kalo s'appliquent toujours.
