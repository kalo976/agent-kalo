---
name: kalo-video-courte
description: Réalisateur expert des vidéos courtes de Kalo (Reels Facebook et Instagram, TikTok, statuts WhatsApp) : concept, accroche, script plan par plan, texte à l'écran, rythme, sous-titres, zones de sécurité, musique, légende et consignes de tournage au téléphone.
---

# Vidéos courtes Kalo

Applique `kalo-marque`. Pour aller plus loin : `video`. Pour le motion design : skills `remotion-*` (officielles Remotion).

## Modèles animés Kalo (Remotion, dossier `video/` du dépôt agent-kalo)
- **Nouvel arrivage** (15 s, en attente de validation par la direction) : titre mot par mot avec soulignement jaune, produit qui arrive et flotte, nom du produit, points forts en cases cochées jaunes, prix et cartouche énergie ensemble, fin sur fond blanc avec logo, adresse et kalo.yt.
- Rendu : `video/rendu.sh <produit.json> <sortie.mp4>`, avec le même JSON que les affiches (`fond, produit, specs, prix, classe, photo`) ; le packshot va dans `video/public/packshots/`.
- Style des vidéos de référence de la direction : animations d'interface (cartes, cases qui se cochent), sous-titres 2 à 3 mots dans un cartouche coloré, personne filmée en bas et animation en haut. Réutiliser ces codes pour les nouveaux modèles.
- Relire chaque rendu image par image (planche de vignettes toutes les 0,5 s) et corriger soi-même avant de livrer.

## Format technique
- Vertical 9:16, 1080 × 1920, 30 images/s. Durée : 7-15 s pour un arrivage, 20-30 s pour une démo ou un conseil, 45 s maximum.
- **Zones de sécurité** : aucun texte important dans les 250 px du haut, les 400 px du bas, ni la bande de droite (boutons j'aime, commentaires).
- Texte à l'écran sur chaque plan (beaucoup regardent sans le son), gros et contrasté, 6 mots maximum par écran, au moins 1,5 s à l'écran.
- Sous-titres si quelqu'un parle. Logo Kalo et « kalo.yt » sur le dernier plan.
- Prix d'un appareil concerné à l'écran : classe énergie à l'écran au même moment.

## Structure qui retient
1. **Accroche (0-2 s)** : mouvement + texte fort. Exemples : la porte du frigo s'ouvre sur « 500 L pour toute la famille » ; « Votre clim consomme trop ? » ; le prix qui tombe.
2. **Preuve (2-12 s)** : 3 plans qui montrent, pas qui racontent (fonction, détail, en situation).
3. **Valeur (12-20 s)** : prix, classe énergie, pour qui c'est fait.
4. **Appel à l'action (dernières 2-3 s)** : « En magasin au 53 rue du Commerce », logo.
Changer de plan toutes les 1,5 à 3 s. Boucler si possible (la fin renvoie au début).

## Concepts qui marchent pour un magasin
Démonstration « 3 choses que fait… » · Avant / après · Comparatif de tailles « lequel pour votre famille ? » · Déballage d'arrivage · Conseil d'usage (clim à 26 °C, dégivrage) · Coulisses (conteneur, livraison, SAV) · Question de client en réponse vidéo · Série récurrente (« Le conseil du vendredi »).

## Tournage au téléphone (consignes à donner à l'équipe)
Téléphone vertical, objectif nettoyé, lumière du jour ou magasin bien éclairé, fond rangé, plans fixes de 3 à 5 s (on coupera), quelques gros plans de détails, son ambiant propre. Une personne reconnaissable : son accord avant.

## Livrable pour chaque vidéo
| Plan | Durée | Ce qu'on filme | Texte à l'écran | Son / voix | Transition |
| --- | --- | --- | --- | --- | --- |
Puis : la liste des plans à tourner, la légende du post (avec `kalo-post-facebook`), 3 accroches alternatives à tester, et la musique (bibliothèque libre de droits de Facebook, Instagram ou TikTok, jamais un morceau protégé ajouté soi-même).

## Contrôle qualité
- [ ] On comprend le sujet en coupant le son
- [ ] L'accroche tient dans les 2 premières secondes
- [ ] Aucun texte dans les zones masquées par l'interface
- [ ] Prix et classe énergie ensemble, dates si promo
- [ ] Logo et appel à l'action à la fin
Aucune vidéo n'est publiée sans validation de la direction.
