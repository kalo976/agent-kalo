# Fiche de style : horizonx.so (DA et catalogue de styles)

- **Source** : https://horizonx.so, envoyé par yakesh le 18/10/2026 avec « #enregistre tous les styles et la DA du site pour créer un portfolio et recréer un site à Kalo ».
- **Ce que c'est** : une bibliothèque payante (24,99 $/mois) de 610 modèles pour « vibe coders » : sites complets, composants, textures d'image et fonds animés, livrés en code ou Figma. Auteur : Marcelo (ex-Gumroad).
- **Entreprise** : autre → Kalo (et Meubles & Déco).
- **Règle** : modèles sous licence payante. On reprend les idées et les techniques, on réécrit le code nous-mêmes. Rien n'est copié.
- **Fait pour Kalo** : portfolio « Kalo Labo » https://claude.ai/artifact/Pjb7PCGjaeQcZTke5M1dn6 (source `modele-kalo-labo/`), 4 photos et une vidéo dans `/mnt/project-files/kalo/labo/`.
- Catalogue complet : `02_catalogue.md`. Captures : `captures/`.

## La DA du site lui-même
- Fond blanc #FFFFFF, cartes gris chaud #F5F4F2 / #F8F8F8, filets #E9E9E9, encre #171717, accent ambre #FFB300 (badges, étoiles), crème #FAEDE3.
- Police unique **Inter** (titres 600, interlettrage serré -0,035 em ; texte 400) ; mono pour les petites étiquettes.
- Cartes : rayon 20 px, padding 6 px autour d'une image à rayon 15 px, titre 16 px gras, description grise, ligne « auteur · catégorie ».
- Boutons pilule noirs, pastilles « New » / « Premium » blanches avec point de couleur.
- Héros : titre centré 2 lignes, **éventail de 5 cartes inclinées** au-dessus des boutons.
- Grilles de 4 colonnes, barre latérale de filtres en pastilles, bandeau promo noir en haut.

## Les familles de styles (ce qu'on peut refaire)
| Famille | Exemples HorizonX | Idée | Pour Kalo |
|---|---|---|---|
| Héros WebGL cinématiques | Crest Water, Emberline Fire, Orvane Particle, Sorvine | Objet 3D ou dashboard qui sort d'un décor vivant (mer, feu, particules) qui réagit au curseur | Haut de page du futur site, produit phare |
| Scroll cinéma | ARQ-01 (séquence d'images 24 i/s), NOLITH, Alder & Stone, Vigil | Le scroll fait jouer une séquence d'images ou une scène 3D | Frigo qui s'ouvre, visite du magasin |
| Carrousels 3D | Tunnel Fold, Spiral Flux, Orbit Deck, Glass Exit, Pulse Orbit | Cartes photos en tunnel, spirale, orbite | Nouveautés de la semaine |
| Survols (« Pointer Physics ») | 43 effets : fan, cascade, shutter, swarm… | Les cartes réagissent au curseur | Grille produits du site |
| Textures d'image | Riso Glow, Dither Text, ASCII, Contour, Holo, CRT, Halftone | Transforme une photo en trame, caractères, lignes | Posts de marque, teasers, affiches de gamme |
| Shaders | Silk Current, Iridescent Flow, Stripe Gradient, Siri Wave | Fonds animés en dégradés, lignes, particules | Bannières de temps forts, statuts WhatsApp |
| UI kits | Liquid Glass, Studio Kit, Bento Grids (15), dashboards | Verre dépoli, grilles bento, cartes | Page d'accueil (infos magasin en bento) |
| Objets 3D | Cobalt Sphere, Crystal Cube, Plasma Orb, Glass Ball | Un objet brillant isolé qui tourne | Logo Kalo en verre pour intro vidéo |
| Loaders et micro-interactions | 40 loaders, sliders, boutons | Détails d'interface | Site Kalo (chargement, filtres) |

## Recettes réécrites dans Kalo Labo (code dans `modele-kalo-labo/index.html`)
- **Riso** : fond jaune #FFE45C, deux trames de points (bleu #009BDE puis rouge #E2231A) en mode « multiply », la seconde décalée de 2 px.
- **Trame 1 bit** : matrice de Bayer 8×8, pixels de 3 px, noir #0E0F0E sur #F5F4F2.
- **Glyphes** : caractères « .:-=+*#%@ » selon la densité, bleu Kalo sur noir, contraste ×2,4.
- **Gravure** : lignes horizontales violettes #752F8A dont l'épaisseur suit l'ombre.
- **Shader soie** : distorsion sinusoïdale en 4 passes, 4 couleurs (palettes Kalo, Black Friday, Froid).
- **Éventail** : 5 cartes, rotation ±9° (±12° au survol), origine sous la carte.

## À reprendre
- Futur site Kalo : DA blanche HorizonX + rouge Kalo à la place de l'ambre, éventail en héros, bento d'infos magasin, textures pour les rubriques.
- Réseaux : textures en posts de marque, shader en fond de statut, carrousel tunnel en Reel.

## À ne pas reprendre
- Pas de texture sur une affiche à prix : la photo réelle et la classe énergie restent lisibles (format d'affiche validé).
- Pas l'ambre HorizonX : chez Kalo, l'accent est le rouge de la charte.
- Ne jamais télécharger ni copier les fichiers payants HorizonX.
