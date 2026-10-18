# Vidéos Kalo (Remotion)

## Modèle « Nouvel arrivage cinéma » (20 s, par défaut)

Repris des 4 vidéos de référence de la direction : comète et étincelles, texte qui sort du flou avec une lueur, mur d'images traversé par la caméra, plateau studio avec projecteur et reflet au sol, montage rapide de détails avec flashs de lumière et interface caméra (REC), écran partagé, cartes cochées « POINTS FORTS », prix qui claque avec onde de choc et classe énergie en même temps, fin sur le logo. Grain de film, vignettage et bruitages maison libres de droits (`public/sons/`).

| Temps | Scène |
| --- | --- |
| 0 à 2,3 s | Comète, étincelles, « NOUVEL ARRIVAGE » lumineux |
| 2,3 à 4,3 s | Mur d'images en profondeur, la caméra plonge vers le produit |
| 4,3 à 7,7 s | Studio : produit sous projecteur, reflet, nom du produit |
| 7,7 à 10,7 s | Montage rapide de détails, flashs, écran partagé |
| 10,7 à 14 s | Points forts en cartes cochées |
| 14 à 17,3 s | Prix et classe énergie |
| 17,3 à 20 s | Logo, magasin, Kalo.976, kalo.yt |

Champ en plus dans le JSON : `galerie` (liste de packshots pour le mur d'images, facultatif).

## Démo « Le cerveau Kalo » (22 s)

Composition `CerveauKalo`, au style des vidéos de référence du 17/10/2026 (@zeyneb_madi) : accroche plein cadre qui sort du flou, écran partagé (graphe du cerveau en haut, post écrit par l'agent en bas), sous-titres serif mot à mot (Instrument Serif, romain et italique, lettres pixelisées Silkscreen qui se décodent), liste en escalier, une seule couleur d'accent, fin sur voile sombre et logo. Sans voix ni musique.

```bash
npx remotion render src/index.ts CerveauKalo out/kalo-cerveau-demo.mp4
```

## Modèle « Nouvel arrivage » simple (15 s)

Modèle animé « Nouvel arrivage », vertical 1080 × 1920, 30 i/s, 15 s, aux couleurs de la charte Kalo.

| Temps | Ce qu'on voit |
| --- | --- |
| 0 à 2 s | « NOUVEL ARRIVAGE » mot par mot, soulignement jaune |
| 2 à 3 s | Le titre monte, le produit arrive et flotte |
| 3 à 8,5 s | Nom du produit, puis les points forts en cases cochées |
| 9 à 12,5 s | Prix et classe énergie ensemble (cartouche validé des affiches) |
| 12,5 à 15 s | Fond blanc, logo, « Disponible en magasin », adresse, kalo.yt |

Zones de sécurité Reels/TikTok respectées : rien d'important dans les 250 px du haut ni les 400 px du bas.

## Rendre une vidéo

```bash
npm install
./rendu.sh /mnt/project-files/kalo/visuels/produits/hisense-7kg-blanc.json out/hisense-7kg-blanc.mp4            # version cinéma
./rendu.sh <produit.json> <sortie.mp4> NouvelArrivage                        # version simple
```

Le JSON produit est le même que pour les affiches. Le packshot doit être copié dans `public/packshots/`.
Prévisualiser et ajuster dans le navigateur : `npx remotion studio src/index.ts`.

Pas de musique dans le fichier : l'ajouter dans Facebook, Instagram ou TikTok depuis leur bibliothèque libre de droits.

## Modèle « Vitrine écran » (15 s)

Inspiré du Reel @textura.eu / Getlayers (#enregistre du 18/10/2026, fiche `references/2026-10-18/03_video.style.md`) :
un ordinateur portable devant un mur crépi dont la lumière passe du bleu au violet puis au rouge Kalo,
une page sombre « La qualité *pour votre maison.* », une page claire « NOS FAVORIS DU MOMENT » (4 lave-linge numérotés avec prix),
puis un mur flou d'affiches et la pastille jaune « Kalo.976 ».

```bash
npx remotion render src/index.ts VitrineEcran out/kalo-vitrine-ecran.mp4 --codec=h264 --crf=18
```

Produits et affiches se changent en haut de `src/VitrineEcran.tsx` (`PRODUITS`, `AFFICHES`, fichiers dans `public/`).
Polices locales : Instrument Serif italique et JetBrains Mono (`public/*.woff2`, licence OFL).
