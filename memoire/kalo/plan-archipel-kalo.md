# Recréer « l'entreprise d'agents » de @zeyneb_madi pour Kalo

## Ce qu'elle a (vu dans ses 4 vidéos)
1. Des agents avec un prénom et un métier (Léa la créatrice de contenu, Clément le gardien…).
2. Des îles par métier sur une carte isométrique en pixel art, chacune avec sa pièce (bureaux, étagères, déco).
3. Un cerveau au centre (coffre Obsidian) que chaque agent lit avant d'écrire, avec les données qui partent vers l'agent.
4. Un gardien qui range le cerveau.
5. Une fenêtre « Parle à Léa » pour discuter avec un agent.

## Où on en est
| Brique | Statut | Qui |
|---|---|---|
| Cerveau (coffre Obsidian, 43 notes) | ✓ fait (`kalo/cerveau/`) | Claude |
| Un prénom et une île par agent | ✓ choisis par yakesh le 18/10 | yakesh |
| 14 skills à jour (prénom, « je lis le cerveau d'abord », « j'écris dans le journal après ») + David au cerveau | ✓ fait, sur la PR #1 | Claude |
| Installer l'équipe | `kalo/equipe-kalo.plugin` (tout en un) ou `kalo/agents-zip/` (un par agent) ; désactiver les 13 anciennes skills Kalo | yakesh accepte |
| L'archipel : une pièce par île, le cerveau dans un cristal, les données qui circulent, « Parle à … », onglet Cerveau | ✓ artifact https://claude.ai/artifact/Y1oSpU6Lt4Xv5V3LCdThxj | Claude |
| Obsidian sur ton ordinateur (gratuit) pour voir le graphe | facultatif | yakesh installe, Claude copie le dossier |
| Remplir le cerveau : anciens posts Facebook, horaires, zones de livraison, lien Google | à fournir | yakesh |
| Personnages générés par IA (Higgsfield) | facultatif, coûte des crédits | sur accord de yakesh |

## L'équipe
| Île | Agent (skill) | Prénom | En une phrase |
|---|---|---|---|
| Centre | kalo-cerveau | **David** | Garde le cerveau : range et relie les notes. |
| Pilotage | kalo-chef-com | **Chimène** | Direction com : brief, répartition, contrôle final. |
| Pilotage | kalo-calendrier | **Chanisse** | Le planning du mois et les saisons de Mayotte. |
| Pilotage | kalo-operations-commerciales | **Zayeb** | Black Friday, soldes, Ramadan, fêtes. |
| Marque | kalo-marque | **Gamil** | La voix de Kalo et les règles légales. |
| Écriture | kalo-post-facebook | **Zaïna** | Les posts Facebook et Instagram. |
| Écriture | kalo-whatsapp-sms | **Anli** | Les statuts WhatsApp et les SMS. |
| Écriture | kalo-fiches-produits | **Thomas** | Les fiches du site kalo.yt. |
| Création | kalo-visuel-produit | **Sahel** | Les affiches au format validé. |
| Création | kalo-video-courte | **Kamil** | Les Reels, TikTok et vidéos Remotion. |
| Clients | kalo-community-manager | **Charza** | Les réponses aux commentaires et messages. |
| Clients | kalo-avis-clients | **Nasser** | Les avis Google et Facebook. |
| Analyse | kalo-statistiques | **Nahim** | Les bilans de performance. |
| Analyse | kalo-veille-concurrence | **Chloé** | Les prix et promos des concurrents. |

## Changer un prénom
Table `PRENOMS` de `cerveau/construire.py`, section « Qui je suis » et description du SKILL.md, table de `kalo-chef-com`, puis `python3 cerveau/construire_ville.py` (l'archipel est devenu la ville Kalo le 20/10/2026), republier l'artifact et refaire le paquet (`paquets.sh`).
