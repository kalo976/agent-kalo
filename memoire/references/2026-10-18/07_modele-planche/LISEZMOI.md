# Modèle Remotion « Planche atelier » (d'après 07_video)
Rendu : `kalo/videos/kalo-planche-atelier.mp4` (1080×1920, 18 s, sans musique : l'ajouter dans l'éditeur Facebook/Instagram, ~118 BPM).
- `src/Planche.jsx` : changer la liste PRODUITS (packshot détouré, nom, 2 couleurs d'ambiance, largeur) ; 7 segments de 2 s + outro logo.
- Lancer : `npm i remotion@4.0.300 @remotion/cli@4.0.300 react@18.3.1 react-dom@18.3.1`, copier les packshots et logo-kalo.png dans `public/`, puis
  `npx remotion render src/index.jsx Planche sortie.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
- Pour la vraie méthode Genjutsu, remplacer les ambiances dégradées par les clips Higgsfield (payant, accord de yakesh).
