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
| `kalo-operations-commerciales` | Black Friday, soldes, fêtes : prix barrés légaux, plan, affiches |
| `kalo-video-courte` | Vidéos courtes : Reels, TikTok, statuts WhatsApp |
| `kalo-statistiques` | Bilan des statistiques Facebook et Instagram |
| `kalo-avis-clients` | Réponses aux avis et demandes d'avis |
| `kalo-whatsapp-sms` | Messages WhatsApp et SMS |
| `kalo-fiches-produits` | Fiches produits du site kalo.yt |
| `kalo-veille-concurrence` | Veille des prix et promos des concurrents |

## Installer

**Claude Code** : ouvre ce dossier avec Claude Code, les agents de `.claude/skills/` sont chargés automatiquement. Pour les avoir partout, copie `.claude/skills/*` dans `~/.claude/skills/`.

**claude.ai** : Réglages → Capacités → Skills → « Importer une skill », puis importe le dossier zippé de chaque agent (`.claude/skills/<agent>`).

Ensuite, demande simplement : « Fais l'affiche du lave-linge Hyundai 7 kg à 369 €, classe E » ou « Prépare le calendrier de novembre ».

## Skills de communication ajoutées (sources GitHub)

Elles viennent des deux dépôts de skills les plus étoilés de GitHub (anthropics/skills ≈ 181 k ★, marketingskills ≈ 43,6 k ★, n° 1 du marketing). Sélectionnées pour un commerce comme Kalo (Facebook, WhatsApp, pub locale, affiches). Les skills pensées pour les logiciels SaaS ont été écartées. Ces skills sont en anglais, mais elles répondent en français si on leur parle en français.

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

## Studio motion design (sources GitHub)

Huit boîtes à outils pour faire de Claude Code un studio de motion design, au service des agents créatifs (`kalo-video-courte`, `kalo-challenger-videos`, `kalo-visuel-produit`). Skills en anglais, copiées dans `.claude/skills/` avec leur licence. Les agents `kalo-*` passent avant.

| Outil | Skills ajoutées | À quoi ça sert | Source |
| --- | --- | --- | --- |
| Product Launch Motion | `product-launch-motion` | Vidéos promo de lancement produit | AbubakrChan/product-launch-motion @ b25b163 (MIT) |
| Motion Graphics Skills | `brand-intake`, `motion-brief-writer`, `motion-prompt-writer`, `motion-effects`, `reference-to-motion`, `launch-video`, `reel-export`, `loop-cover`, `animated-chart`, `milestone-reveal`, `newsletter-promo`, `title-sequence-3d`, `apple-launch-film`, `vox-explainer`, `model-showdown` | Reels, effets animés, brief et prompt de motion, export 1080 × 1920 | charlie947/motion-graphics-skills @ 229022e (MIT) |
| HyperFrames | `hyperframes` (point d'entrée), `hyperframes-core`, `-animation`, `-creative`, `-audio`, `-keyframes`, `-cli`, `-studio`, `-registry`, `general-video`, `product-launch-video`, `talking-head-recut`, `embedded-captions`, `music-to-video`, `slideshow`, `faceless-explainer`, `motion-graphics`, `media-use`, `figma`, `pr-to-video` | Montage automatique des rushes, sous-titres, vidéos HTML rendues en MP4 | heygen-com/hyperframes @ cea0bad (Apache 2.0) |
| Motion Graphics | `object-separation`, `motion-broll`, `sound-effects`, `explainer-default`, `explainer-engaging`, `explainer-high-energy` | Détourage vidéo (SAM 2), B-roll animé, bruitages, explainers | Barty-Bart/motion-graphics @ 3d83d98 (MIT) |
| Animate | `animate` | Storyboards et petites vidéos explicatives dans tous les styles | cth9191/animate @ 7e5eb56 (MIT) |
| Claude Motion | `claude-motion-design`, `claude-motion-sound`, `claude-motion-review-loop`, `claude-motion-web-sims` | Goût du motion sous Remotion, sound design, relecture image par image | whaleyxbt/claude-motion @ e627941 (MIT) |
| Motion | aucune (voir ci-dessous) | Animations de sites web (bibliothèque `motion`, ex-Framer Motion) | motiondivision/motion @ ce1d082 (MIT) |
| Motion Design Skill | `motion-design-principles` | Les 12 principes de l'animation | LottieFiles/motion-design-skill @ f9a8a04 (MIT) |

Notes (19/10/2026) :
- Renommages pour éviter deux skills `motion-design` : celle de LottieFiles devient `motion-design-principles`, celles de Claude Motion prennent le préfixe `claude-motion-`.
- Claude Motion travaille sur un projet Remotion : il est copié dans `video/claude-motion/` (sans le dossier `media/` de 15 Mo). Lancer `npm install` dans ce dossier avant le premier rendu.
- HyperFrames : `remotion-to-hyperframes` n'est pas copiée (elle sert seulement à convertir du Remotion et dépend du dépôt d'origine). Les skills utilisent l'outil `npx hyperframes`, téléchargé au premier usage.
- Product Launch Motion : les dossiers `examples/` (21 Mo) et `legacy/` ne sont pas copiés ; le fichier NOTICE précise que les marques et visuels tiers cités ne sont pas sous licence MIT.
- Motion (motiondivision) est une bibliothèque JavaScript, pas un pack de skills : ses deux skills internes servent à maintenir la bibliothèque elle-même. Pour animer kalo.yt, l'agent l'installe avec `npm install motion` (documentation : motion.dev).
