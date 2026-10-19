# Fiche de style : « Websites in 2026 » (vidéo de @w.wearebrand)

- **Source** : Reel Instagram de @w.wearebrand (19 s, 9:16), envoyé par yakesh le 18/10/2026. Sa demande : « Retrouve le site et enregistre les mêmes skills pour recréer le site ou ce style ».
- **Entreprise** : autre (style à réutiliser pour Kalo, et surtout pour Meubles & Déco).
- **Voix** : aucune, seulement de la musique. Rien à transcrire.
- **Démo faite** : https://claude.ai/artifact/7j3PPfsPE21YYvHb2zDyyV (modèle : `modele-site-esquisse/index.html`).

## Les deux sites montrés (retrouvés)
| Temps | Site | Adresse | Fait par |
|---|---|---|---|
| 0 à 9 s (iMac) | **Belgrade Arbor**, résidence à Belgrade | https://belgradearbor.rs/en | studio Square43 (Belgrade), arbor.square43.com |
| 9 à 15 s (MacBook) | **ICG Galleries**, showrooms d'Iris Ceramica Group | https://icggallery.irisceramicagroup.com/en/home/ | non affiché |
| 15 à 19 s | outro : logo Instagram + @W.WEAREBRAND sur image assombrie | | |

## Site 1 : Belgrade Arbor (le plus facile à reproduire)
**Technique (lue dans le code)** : Next.js + Tailwind, **GSAP + ScrollTrigger** (scrub), **Lenis** (défilement doux), **SplitText** (texte découpé en mots), Three.js pour la page « 3D Experience ». Le héros est une **vidéo pré-rendue** (`/home/hero.mp4`, mobile `hero-m.webm`) : l'esquisse au trait se transforme en rendu photo.
**Déroulé vu dans la vidéo** :
1. Préchargeur : logo doré centré sur fond clair, compteur 0 → 100 %.
2. Esquisse d'architecte au trait sur fond blanc, qui se « remplit » en blanc 3D, puis en photo réelle (arbres, ciel).
3. Section verte : texte serif clair qui s'allume au scroll, photos découpées en formes organiques inclinées, bouton pilule « Explore in 3D ».
- Images révélées en rideau : `clipPath: inset(0 100% 0 0)` → `inset(0 0 0 0)` + `scale 1.1 → 1`, 1,2 à 1,7 s, `power2.inOut`.
- Galerie horizontale épinglée (`pin`, `scrub`), barre de progression avec numéros 01 à 05.
- Menu en **pilule flottante** sombre : « ≡ MENU » / logo / « INQUIRE → ».

**Couleurs** : vert pin #2E3A26, vert mousse #60735C, vert dégradé #3E562E, vanille #FDFBEF, crème #FFF4D6 / #F4F0DB, sable #CCBF99, bronze #A68150, gris #3C3C3C.
**Polices** : titres **Editorial Old** (serif fin, payante, Pangram Pangram) ; texte **Work Sans**. Équivalent gratuit Google : Instrument Serif + Work Sans.

## Site 2 : ICG Galleries (niveau supérieur, 3D)
**Technique** : Nuxt (Vue) + **Three.js** (GLTFLoader, DRACO, KTX2) + GSAP + Lenis. Les salles du showroom sont modélisées en 3D (`gf_pov.glb`, `ff_pov.glb`…), et **le scroll fait avancer une caméra le long d'un chemin animé** dessiné dans Blender (`camera_paths.glb`). Des vidéos jouent sur les murs (VideoTexture), des ombres de feuillage bougent.
**Rendu vu** : visite filmée d'une galerie sombre (rideaux, étagères de carreaux, lumière chaude), puis salle claire.
**Couleurs** : anthracite #2D2D2D, crème #F6F1EC, gris #BFBBB7. **Polices** : Futura (Futura 100) + Scotch Display (Adobe Fonts). Gratuit : Jost + Playfair Display.
**Pour nous** : il faut un modèle 3D du magasin (scan ou Blender). Sans modèle, on l'imite avec une vidéo de visite filmée au téléphone, lue au rythme du scroll.

## Vidéo elle-même (format Reel)
- Écran filmé au téléphone, main sur la souris : effet « vraie personne qui découvre ».
- Titre fixe en haut « Websites in 2026 😮‍💨 », blanc gras sur pastille noire arrondie.
- Logo Instagram + pseudo en haut à droite pendant toute la vidéo.
- 2 plans (coupe à 9 s), outro assombri avec logo au centre (même recette que video3 du 17/10).

## À reprendre
- Pour un site Kalo ou Meubles & Déco : héros « esquisse → réel » (packshot transformé en dessin au trait, révélé au scroll), section couleur pleine avec texte serif qui s'allume, cartes à formes organiques, galerie horizontale 01 → 05, menu pilule.
- Pour Meubles & Déco (meubles Gautier), le style colle parfaitement : intérieurs, bois, ambiance chaude.
- Pour un Reel Kalo : filmer l'écran du site avec la main sur la souris + titre fixe sur pastille noire.

## À ne pas reprendre
- Pour Kalo, la charte reste rouge/jaune/bleu : le vert pin est le style de la référence, pas celui de Kalo. Garder le rouge Kalo pour l'appel à l'action et la classe énergie à côté de tout prix.
- Ne pas copier les textes, logos ou images de Belgrade Arbor ni d'ICG.
