# Vidéos Kalo (Remotion)

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
./rendu.sh /mnt/project-files/kalo/visuels/produits/hisense-7kg-blanc.json out/hisense-7kg-blanc.mp4
```

Le JSON produit est le même que pour les affiches. Le packshot doit être copié dans `public/packshots/`.
Prévisualiser et ajuster dans le navigateur : `npx remotion studio src/index.ts`.

Pas de musique dans le fichier : l'ajouter dans Facebook, Instagram ou TikTok depuis leur bibliothèque libre de droits.
