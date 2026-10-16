---
name: kalo-visuel-produit
description: Fabrique une affiche Kalo « Nouvel arrivage » (1734×907, haute définition) pour un produit, au format validé par la direction : carte couleur, gros titre, prix rouge, cartouche classe énergie, packshot, logo.
---

# Affiche produit Kalo (format validé le 16/10/2026)

Tout est dans le dossier `modele/` à côté de ce fichier :
- `modele-nouvel-arrivage.html` : la mise en page validée (ne pas la modifier sans accord)
- `rendu.js` : produit le PNG en 3468 × 1814 (rendu x2), avec Playwright
- `logo-kalo.png`, `packshots/` (photos produit détourées, PNG transparent), `produits/` (fiches JSON)

Exemple de résultat : `exemple.png`.

## Format validé (à respecter à l'identique)
- Fond blanc, grande carte arrondie de couleur charte : bleu #009BDE, violet #752F8A, rouge #E2231A ou jaune #FFD700. Alterner d'une affiche à l'autre.
- Texte blanc ; sur fond jaune, texte noir #0E0F0E.
- À gauche : « NOUVEL ARRIVAGE » sur 2 lignes, le produit en capitales sur 2 lignes (ex. LAVE-LINGE HISENSE / 7 KG), 2 à 3 lignes de caractéristiques, la dernière = « Réf. : … ».
- En bas à gauche, À L'INTÉRIEUR de la carte avec une marge : cartouche blanc du prix (rouge #E2231A), puis cartouche blanc de la classe énergie.
- Cartouche énergie : « CLASSE » / grande lettre noire / « A à G », trait vertical, puis l'échelle A à G en flèches de couleur (lettres blanches) avec une flèche noire sur la classe.
- À droite : packshot détouré avec une ombre douce.
- Sous la carte : « kalo.yt » en gris à gauche, logo Kalo rouge en bas à droite.
- Produit sans étiquette énergie (petit électroménager, micro-ondes) : omettre `classe`.

## Étapes
1. Récupère désignation, caractéristiques, référence, prix TTC, classe énergie et une photo constructeur. Classe inconnue sur un appareil concerné : arrête-toi et demande-la.
2. Détoure la photo (PNG transparent, sans reste de fond coloré ni ombre teintée) et place-la dans `modele/packshots/`.
3. Écris la fiche `modele/produits/<produit>.json` :
```json
{"fond":"#009BDE","produit":"Lave-linge Hisense<br>7 kg","specs":["1200 tr/min · Inverter · Vapeur","Blanc","Réf. : WF1I7022BWJ"],"prix":"379","classe":"E","photo":"packshots/hisense-WF1I7022BWJ.png"}
```
4. Lance depuis `modele/` : `node rendu.js produits/<produit>.json sorties/<produit>.png` (Playwright requis : `npm i playwright`, ou `NODE_PATH=$(npm root -g)` s'il est installé globalement).
5. Relis l'affiche plusieurs fois avant de la livrer et corrige toi-même :
   - rien ne dépasse de la carte, les cartouches sont à l'intérieur avec une marge ;
   - les caractéristiques ne touchent pas les cartouches (sinon moins de lignes) ;
   - packshot propre : pas de liseré, de trait blanc ou d'ombre de l'ancien fond ;
   - prix, classe et référence identiques à la fiche produit ;
   - texte lisible sur le fond.
6. Livre le PNG.

Le titre peut changer selon l'opération (« PRIX CHOC », « BLACK FRIDAY ») en gardant la même mise en page.
