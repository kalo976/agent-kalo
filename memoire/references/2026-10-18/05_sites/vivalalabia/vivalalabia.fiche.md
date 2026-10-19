# Viva La Labia (vivalalabia.com) : décortiqué

Boutique d'une seule bague-sculpture (7 000 €) : un moule de muffin aux myrtilles taché de violet, figé dans la résine et serti d'or 18 carats par l'atelier Georg Hornemann, pour l'artiste Murray Gaylard. Site fait par le studio **ROCANI** (rocani.studio), Awwwards Site of the Day (oct. 2024). Vu dans la vidéo @w.wearebrand de 9 à 14 s. Capturé le 18/10/2026.

## Ce qu'on voit (c'est une mise en scène de théâtre, pas une page qui défile)
1. **Rideau rouge de théâtre** en velours qui ondule, texte serif « MURRAY GAYLARD & GEORG HORNEMANN ATELIER PRESENTS » et bouton « COME INSIDE ».
2. Le rideau s'ouvre : **la nuit sur la mer**, une **coquille Saint-Jacques fermée** posée sur l'eau qui reflète, étoiles, énorme titre « VIVA LA LABIA » en serif fin translucide derrière, phrase qui défile en bandeau. Bouton « BIRTH YOUR VENUS ».
3. Clic : **le jour se lève** (ciel rose pêche et lavande, nuages), la coquille **s'ouvre** et la bague-éventail **monte** au-dessus, comme la Naissance de Vénus de Botticelli.
4. Bloc produit : « 7'000 € · Muffin Mould, Berry Juice, Epoxy Resin · 750/ooo Yellow Gold Ring », « CHOOSE SIZE AND BUY », « TRY IN AR » (essayer la bague en réalité augmentée), « CLICK AND DRAG » pour tourner la bague.
5. Pages Inspiration / The Process avec **deux vidéos** du making-of (le moule de muffin écrasé à la main, la résine coulée sur le moule violet).

## Comment c'est fabriqué (vérifié dans le code)
| Brique | Outil |
|---|---|
| Site | **Next.js** (React) |
| 3D | **Three.js r156** via **React Three Fiber** (+ helpers type drei) |
| Animation | **GSAP** (+ ScrollTrigger) pour les ouvertures, **Lenis** pour le scroll doux des pages texte |
| Modèles | GLB compressés **Draco** : `muffin-ring.glb` (bague, matériaux verre/résine `KHR_materials_transmission` + `ior` + `specular`), `shell-single.glb` (coquille), `blueberry-single.glb`, `VVL_logo.glb` |
| Lumière | HDRI `potsdamer_platz_1k.hdr` pour les reflets sur l'or et la résine |
| Eau | shader de **reflet d'eau** (type `Water` de Three.js) avec carte de normales `water-normal.jpg` et flou |
| Ciel | dégradé (`colorTop` / `colorBottom`) + 6 **sprites de nuages** PNG animés par bruit |
| Son | ambiance sonore (Howler / AudioContext) |
| Polices | **PP Hatton** (serif fin de luxe, titres) + **PP Pangram Sans** (boutons, textes) |

### Les 4 astuces qui font l'effet
1. **Le rideau en shader** (`analyse/shaders/026_vert.glsl`) : un simple plan découpé finement ; on pousse ses sommets en profondeur avec des sinus superposés (`sin(10*(uv.x*3 - temps))`) pour faire les plis, et à l'ouverture on **cisaille** le bas (`skew`) pour qu'il s'écarte comme un vrai rideau.
2. **Nuages = images PNG + bruit qui grignote l'alpha** (`029_frag.glsl`) : 4 lectures d'une texture de bruit qui glissent à des vitesses différentes, multipliées par l'alpha du nuage : les bords se défont et se reforment sans arrêt.
3. **Changement nuit → aube** : mêmes objets, on anime seulement les couleurs du ciel, de l'eau et de la lumière avec GSAP. Peu coûteux et très spectaculaire.
4. **Matériau « transmission »** sur la bague : la résine laisse voir à travers avec réfraction, l'or reflète l'HDRI. C'est ce qui rend la bague crédible sans photo.

## Fichiers archivés ici
- `scroll-vivalalabia-accelere.mp4` (1 min, à regarder en premier) et `scroll-vivalalabia.mp4` (17 min, rendu logiciel lent).
- `captures/` : la nuit, puis l'ouverture image par image.
- `videos-site/idea.mp4` (6,7 s) et `process.mp4` (14,9 s) : les deux vidéos making-of du site.
- `analyse/` : librairies, modèles 3D, 29 shaders (021 à 029 = ceux du studio).
- `code-source/` : HTML, JS, CSS, polices, modèles 3D, textures, HDRI, images du menu.

## Pour Kalo / Meubles & Déco
- La recette « **un seul produit = une mise en scène** » est parfaite pour un lancement : rideau (ou carton d'emballage) qui s'ouvre, le produit qui apparaît, prix et bouton d'achat.
- Idée Kalo : un carton Kalo qui s'ouvre au clic et révèle la nouvelle machine à laver qui tourne en 3D, sur le lagon de Mayotte au lever du soleil. Idée Meubles & Déco : un rideau de salon qui s'ouvre sur un meuble Gautier, avec « essayer chez vous en AR ».
- Étude seulement : modèles, code et vidéos appartiennent à ROCANI et Murray Gaylard.
