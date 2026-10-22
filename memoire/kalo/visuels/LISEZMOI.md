# Affiches Kalo « Nouvel arrivage »

Format validé par yakesh le 16/10/2026 : `modele-nouvel-arrivage.html`. Une copie figée est dans `modele-nouvel-arrivage_valide-2026-10-16.html`.

Corrections validées :
- Les cartouches blancs (prix et classe énergie) sont à l'intérieur de la carte de couleur, avec une marge.
- Cartouche énergie : « CLASSE », grande lettre, « A à G », trait vertical, échelle A à G en flèches de couleur, flèche noire sur la classe.
- Texte noir sur fond jaune.
- Logo rouge de la charte.
- Rendu en haute définition (x2).
- Relire chaque affiche plusieurs fois et corriger soi-même.

Rendu : `NODE_PATH=$(npm root -g) node rendu.js produits/<produit>.json sorties/<produit>.png`

## Octobre Rose (octobre 2026)
- Pendant tout le mois d'octobre, utiliser `logo-kalo-octobre-rose.png` (logo fourni par yakesh, à poser tel quel, sans retouche).
- À partir du 1er novembre, revenir au logo de base `logo-kalo.png`.

## Affiches P06 et P07 (22/10/2026)
- `affiches/P06/` : 4 affiches (3468×1814) et 4 stories (1080×1920), déjà publiées le 21/10.
- `affiches/P07/` : 6 affiches et 6 stories individuelles (poêles 24 et 28 cm, wok, sauteuse, set 2 casseroles, poignée), à publier le 23/10. Pas de classe énergie (ustensiles). Fiches kalo.yt pas encore en ligne le 22/10 : pas de lien produit.
- `produits/P06`, `produits/P07` : fiches JSON des affiches. `story/` : modèle story (`modele-story.html`), rendu (`rendu-story.js`), fiches story `fiches-P07/`.
- Police Open Sans condensée en local (`story/fonts/`) et logo Octobre Rose recadré (`story/logo-octobre-rose-rogne.png`). Les stories : rien dans les 250 px du haut ni les 380 px du bas.
- Rendu story : `NODE_PATH=$(npm root -g) node rendu-story.js fiche.json sortie.png` (lancé depuis `story/`, packshots en `../packshots/`).
- Photos P07 : 5 sur 6 viennent de revendeurs (qualité C) ; la photo des poêles 24 et 28 cm est identique.
