# Consignes de conversion : équipe Kalo → équipe Meubles & Déco

Chaque agent `kalo-<x>` (dans `.claude/skills/kalo-<x>/SKILL.md`) devient `md-<x>` dans `meubles-deco/skills/md-<x>/SKILL.md`. Même prénom, même île, même rôle, même méthode et même niveau d'exigence. Seul David est remplacé, par **Maxime** (`md-cerveau`, déjà écrit).

## Correspondance des agents
| Prénom | Île | Kalo | Meubles & Déco |
| --- | --- | --- | --- |
| Maxime | Centre | kalo-cerveau (David) | md-cerveau |
| Chimène | Pilotage | kalo-chef-com | md-chef-com |
| Chanisse | Pilotage | kalo-calendrier | md-calendrier |
| Zayeb | Pilotage | kalo-operations-commerciales | md-operations-commerciales |
| Gamil | Marque | kalo-marque | md-marque |
| Ousséni | Marque | kalo-critique | md-critique |
| Zaïna | Écriture | kalo-post-facebook | md-post-facebook |
| Anli | Écriture | kalo-whatsapp-sms | md-whatsapp-sms |
| Thomas | Écriture | kalo-fiches-produits | md-fiches-produits |
| Sahel | Création | kalo-visuel-produit | md-visuel-produit |
| Kamil | Création | kalo-video-courte | md-video-courte |
| Roukia | Arène | kalo-challenger-affiches | md-challenger-affiches |
| Bacar | Arène | kalo-challenger-videos | md-challenger-videos |
| Faïza | Arène | kalo-challenger-posts | md-challenger-posts |
| Fahardine | Arène | kalo-challenger-operations | md-challenger-operations |
| Mariama | Arène | kalo-challenger-calendrier | md-challenger-calendrier |
| Charza | Clients | kalo-community-manager | md-community-manager |
| Nasser | Clients | kalo-avis-clients | md-avis-clients |
| Nahim | Analyse | kalo-statistiques | md-statistiques |
| Chloé | Analyse | kalo-veille-concurrence | md-veille-concurrence |

## Les faits viennent du cerveau
Lire d'abord tout `meubles-deco/cerveau/` (notes Marque, Entreprise, Produits). Ne jamais inventer un fait sur l'enseigne : ce qui manque s'écrit [à compléter].

## Règles de réécriture
1. **Frontmatter** : `name: md-<x>` (= nom du dossier) et une `description` entre guillemets, en français, du même style que l'originale, qui commence par le prénom et dit « Meubles & Déco (et Dagonii) ». Pour md-chef-com, ajouter « À utiliser à la place de kalo-chef-com et chimene-chef-com pour Meubles & Déco ».
2. **Périmètre** : remplacer « Kalo uniquement, jamais Meubles & Déco » par « Meubles & Déco et Dagonii uniquement, jamais Kalo ». Chaque publication indique l'enseigne (Meubles & Déco ou Dagonii) et la page où elle part.
3. **Cerveau et trace** : remplacer le bloc « Avant et après chaque tâche » par :
   1. Je lis le cerveau Meubles & Déco avant d'écrire une seule ligne : `meubles-deco/cerveau/00 Cerveau Meubles & Déco.md` (dépôt `yakesh14/agent-kalo`), puis `Agents/md-<x>.md` et les notes qu'elle cite. Prix, références, dimensions et formulations viennent du cerveau ; ce qui manque reste [à compléter].
   2. Je laisse une trace : le livrable va dans `meubles-deco/journal/AAAA-MM-JJ/`, et Maxime (`md-cerveau`) le range dans le cerveau une fois validé.
   3. Je passe par Ousséni (`md-critique`) avant d'envoyer à Chimène (sauf pour Ousséni et Chimène eux-mêmes).
4. **David → Maxime**, tous les `kalo-*` → `md-*`. Préciser une fois, là où c'est utile, que « la direction » = Maxime Gaborit, directeur général adjoint, à ne pas confondre avec Maxime le cerveau.
5. **Métier** : l'électroménager devient l'ameublement et la décoration. Supprimer tout ce qui ne s'applique pas aux meubles (étiquette énergie, classe énergie, EPREL, indice de réparabilité, kg, SAV électroménager, kalo.yt, Darty, 6 magasins, Kawéni en premier, signature Kalo, couleurs et polices Kalo, « La Qualité pour votre maison »). Remplacer par ce qui compte pour des meubles : dimensions (L × l × H en cm), matériaux et finitions, coloris, ce qui est inclus ou non (lit, sommier, matelas, chevets), livraison et montage, paiement en 1 à 4 fois, ambiance de la pièce, mise en scène, saisons et temps forts de Mayotte qui comptent pour les meubles (mariages de la saison sèche, Ramadan et Aïd pour recevoir, rentrée pour les chambres d'enfants, fin d'année, déménagements), garder la prudence en saison cyclonique.
6. **Exemples** : réécrire les exemples avec les vrais produits du catalogue du cerveau (chambre Sarah 1 290 € sans chevets, canapé d'angle TM-260227 1 490 €, chambre Monaco 1 990 €), jamais avec des prix inventés. Pour un exemple sans prix connu, écrire [prix].
7. **Retours de la direction** : intégrer les leçons de `Retours de la direction.md` là où elles servent (textes et affiches vendeurs, pas de tournures d'IA, prendre exemple sur les anciennes publications MD, publier sur la page et pas seulement en story, bien choisir la page Meubles & Déco ou Dagonii, préciser ce qui n'est pas inclus).
8. **Signature des posts** (provisoire, adresses [à compléter]) : `📍 Meubles & Déco, 2 magasins à Mayotte · 🕗 lun.-ven. 8 h-17 h, sam. 8 h-16 h · 🚚 Livraison et montage · 📞 0269 64 50 59` et hashtags `#MeublesEtDeco #Mayotte #Meubles` + 1 ou 2 liés au produit. Pour Dagonii : `#Dagonii #Mayotte` + signature [à compléter].
9. **Rythme Facebook** : celui de Kalo n'est pas valable ici : [à compléter, à fixer avec md-statistiques].
10. **Longueur** : équivalente à l'original, aussi précis et expert. Français simple, phrases courtes, pas de tics d'IA (« ce n'est pas X, c'est Y », listes de trois slogans creux).
11. **Note d'agent dans le cerveau** : écrire aussi `meubles-deco/cerveau/Agents/md-<x>.md` sur le modèle :
```
---
tags: [agents]
prenom: <Prénom>
ile: <Île>
---
# <Prénom> (md-<x>)
Île : <Île>

<description>

**Avant chaque tâche, lire :** [[Identité Meubles & Déco]], [[Règles à ne jamais enfreindre]], [[Retours de la direction]] et <1 ou 2 notes utiles au rôle : [[Catalogue Meubles & Déco]], [[Magasins et horaires]], [[Dagonii]]>.

Retour : [[Équipe d'agents]]
```
12. Ne pas toucher aux fichiers Kalo. Ne pas faire de commit.
