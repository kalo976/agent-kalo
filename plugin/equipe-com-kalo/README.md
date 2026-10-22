# Équipe com Kalo

Les agents de l'équipe communication de Kalo (électroménager, Mayotte), réunis dans un seul plugin : les 19 agents d'origine, plus 10 sous-agents de l'île **Atelier**, le tribunal (`kalo-tribunal`) et ses 10 jurés experts (`kalo-jure-*`), soit 40 skills. Ils travaillent sous la direction de Chimène (`chimene-chef-com`, installée à part), qui est aussi juge du tribunal.

## Les agents

| Agent | Prénom | Rôle |
| --- | --- | --- |
| kalo-marque | Gamil | Charte, voix, règles légales |
| kalo-calendrier | Chanisse | Calendrier mensuel des posts, superviseur de l'atelier calendrier |
| kalo-post-facebook | Zaïna | Textes des posts, superviseur de l'atelier posts |
| kalo-visuel-produit | Sahel | Affiches « Nouvel arrivage » (format validé du 16/10), superviseur de l'atelier affiches |
| kalo-video-courte | Kamil | Reels, TikTok, statuts vidéo, superviseur de l'atelier vidéos |
| kalo-whatsapp-sms | Anli | WhatsApp Business et SMS |
| kalo-community-manager | Charza | Réponses aux commentaires et messages |
| kalo-avis-clients | Nasser | Réponses aux avis Google et Facebook |
| kalo-fiches-produits | Thomas | Fiches produits kalo.yt |
| kalo-operations-commerciales | Zayeb | Black Friday, soldes, fêtes, superviseur de l'atelier opérations |
| kalo-statistiques | Nahim | Bilans Facebook, Instagram, WhatsApp |
| kalo-veille-concurrence | Chloé | Veille prix et concurrence |
| kalo-critique | Ousséni | Avocat du diable, relit chaque livrable (un seul tour, seuil 8/10 pour les créatifs, tribunal automatique en dessous) |
| kalo-challenger-affiches | Roukia | Challenger de Sahel |
| kalo-challenger-posts | Faïza | Challenger de Zaïna |
| kalo-challenger-videos | Bacar | Challenger de Kamil |
| kalo-challenger-calendrier | Mariama | Challenger de Chanisse |
| kalo-challenger-operations | Fahardine | Challenger de Zayeb |
| kalo-cerveau | David | Tient le cerveau Kalo (mémoire commune), greffier du tribunal |
| kalo-tribunal | Chimène (juge) | Tribunal : superviseur en défense, Ousséni à l'accusation, 12 jurés extérieurs, verdict de Chimène |
| kalo-atelier-affiches-image | Soilihi | Atelier affiches (sous Sahel) : packshot, détourage, ombre, couleurs, résolution, prépresse |
| kalo-atelier-affiches-mise-en-page | Anrifa | Atelier affiches (sous Sahel) : format « Nouvel arrivage », prix, cartouche classe énergie, typographie |
| kalo-atelier-videos-montage | Djamal | Atelier vidéos (sous Kamil) : idée, accroche, découpage, rythme, fin |
| kalo-atelier-videos-finition | Moinécha | Atelier vidéos (sous Kamil) : textes à l'écran, sous-titres, image, son, export |
| kalo-atelier-posts-accroche | Hadidja | Atelier posts (sous Zaïna) : angle, accroche, structure, appel à l'action, variantes |
| kalo-atelier-posts-relecture | Abdou | Atelier posts (sous Zaïna) : orthographe, typographie, mentions obligatoires, signature |
| kalo-atelier-operations-mecanique | Saïd | Atelier opérations (sous Zayeb) : offre, prix de référence des 30 jours, conditions, mentions |
| kalo-atelier-operations-deploiement | Ambdi | Atelier opérations (sous Zayeb) : rétroplanning, contenus par canal, briefs, bilan |
| kalo-atelier-calendrier-planning | Hachimia | Atelier calendrier (sous Chanisse) : rythme, jours et heures, temps forts |
| kalo-atelier-calendrier-briefs | Faouzia | Atelier calendrier (sous Chanisse) : produit, format, brief et texte de base de chaque date |

## La chaîne qualité

Toute demande passe par Chimène. Chaîne qualité des créatifs (consigne du 21/10/2026, `cerveau/Marque/Chaine-qualite.md`) : atelier de 2 sous-agents → superviseur (plus de 7/10, 2 contrôles au plus, l'atelier corrige en 1 tour à chaque renvoi) → duo avec le challenger → Ousséni (1 seul tour, seuil 8/10) → tribunal automatique si la note reste en dessous → Chimène, puis yakesh. Les autres livrables passent par Ousséni, puis Chimène et yakesh. Rien n'est publié sans validation.

## Le cerveau

Le cerveau Kalo (notes Markdown, état du dépôt au 20/10/2026) est inclus dans le skill `kalo-cerveau`, dossier `cerveau/`. Les autres agents le lisent avant chaque tâche. Pour le mettre à jour, reconstruire le plugin à partir du dépôt `yakesh14/agent-kalo`.

## Source

Dépôt GitHub `yakesh14/agent-kalo`, dossier `.claude/skills/`. Les chemins locaux de l'ancien environnement ont été remplacés par le cerveau inclus et le projet COM KALO.
