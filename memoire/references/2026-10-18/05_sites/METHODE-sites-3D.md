# Méthode : refaire un site 3D « cinéma » (Montfort, Viva La Labia, Active Theory)

Synthèse tirée du code des 3 sites (18/10/2026). Fiches détaillées : `montfort/`, `vivalalabia/`, `activetheory/`. Complète le modèle `../modele-site-esquisse/` (scroll esquisse → réel) et le skill `site-immersif`.

## 1. La structure commune aux 3 sites
```
<body>
  <canvas id="gl">  ← un seul canvas WebGL plein écran, position:fixed, derrière tout
  <main>            ← le HTML (textes, boutons) par-dessus, fond transparent
</body>
```
- **Un seul monde 3D** pour tout le site. On ne recharge pas de scène : la caméra se déplace et un nombre `chapitre` (0, 1, 2…) pilote les fondus dans les shaders.
- **Le scroll ou les clics pilotent le temps de l'animation** : Montfort = scroll (Lenis + ScrollTrigger), Viva La Labia = clics (rideau → aube → coquille), Active Theory = scroll + glisser.
- Les **textes HTML** restent du vrai HTML (lisible, référencement) et apparaissent avec SplitText (lettres/lignes).

## 2. La boîte à outils (libre et gratuite)
| Besoin | Outil | Vu chez |
|---|---|---|
| 3D | Three.js (ou React Three Fiber si site React) | Montfort r169, Viva r156 |
| Scroll doux | Lenis | Montfort, Viva |
| Animations au scroll | GSAP + ScrollTrigger (+ SplitText, gratuit depuis 2025) | Montfort, Viva |
| Modèles 3D légers | GLB + Draco ou Meshopt, textures KTX2 | les 3 |
| Lumière réaliste pas chère | éclairage **cuit dans Blender** (lightmap) + HDRI | Montfort, Active Theory, Viva |
| Effets « film » | EffectComposer : bloom, grain, contraste, reflets d'objectif | Active Theory |
| Site | Astro (simple, rapide) ou Next.js | Montfort / Viva |

## 3. Les 8 recettes de shaders à savoir refaire
1. **Nuages pas chers** : plan + texture de bruit qui glisse, `smoothstep` sur le bord (Montfort `021_frag`). Variante : sprite PNG dont l'alpha est rongé par 4 bruits (Viva `029_frag`).
2. **Défilement infini au scroll** : `z = fract(z + scroll * vitesse) * profondeur` dans le vertex shader (Montfort `042_vert`).
3. **Trace de souris** : deux textures qu'on alterne (« ping-pong ») ; à chaque image on dessine un cercle à la souris et on recopie 99 % de l'image d'avant décalée par du bruit. Tous les shaders lisent cette texture pour réagir (Montfort `060_frag`).
4. **Fluide à la souris** (niveau au-dessus) : simulation advection/divergence/pression (Active Theory `curlShader`, `pressureShader`…). Base libre : le « WebGL Fluid Simulation » de Pavel Dobryakov (licence MIT).
5. **Rideau / tissu** : plan très découpé, sommets poussés par des sinus superposés, cisaillement pour l'ouverture (Viva `026_vert`).
6. **Verre et résine** : `MeshPhysicalMaterial({ transmission: 1, ior: 1.5, roughness: 0.05, thickness: 0.5 })` + HDRI (bague Viva, logo Active Theory).
7. **Carte de verre qui joue une vidéo** : `VideoTexture` sur un plan qui ondule et penche vers la souris, mélange avec la réfraction + Fresnel sur les bords (Active Theory `WorkItemShader`).
8. **Particules en forme d'objet** : on échantillonne des points sur un modèle (`MeshSurfaceSampler`), on les dessine en `Points` et on les anime sur GPU (fleurs/arbre Active Theory).

## 4. Squelette de départ (à adapter)
```html
<canvas id="gl"></canvas>
<main>
  <section data-chapitre="0"><h1>Titre</h1></section>
  <section data-chapitre="1">…</section>
</main>
<script type="module">
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/+esm';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
gsap.registerPlugin(ScrollTrigger);

const renderer = new THREE.WebGLRenderer({ canvas: gl, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
const etat = { chapitre: 0, scroll: 0 };          // ce que les shaders lisent

const lenis = new Lenis();                         // scroll doux
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));

document.querySelectorAll('[data-chapitre]').forEach(s => {
  ScrollTrigger.create({ trigger: s, start: 'top center', end: 'bottom center',
    onUpdate: st => { etat.chapitre = +s.dataset.chapitre + st.progress; } });
});

function resize() { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
renderer.setAnimationLoop(t => { /* uniforms.uChapitre.value = etat.chapitre; */ renderer.render(scene, camera); });
</script>
```

## 5. Ordre de travail pour un site Kalo / Meubles & Déco
1. **Écrire l'histoire en 4–5 chapitres** (ex. Kalo : lagon de nuit → aube → le produit sort de son carton → caractéristiques → magasin et horaires).
2. **Modéliser ou récupérer le produit en 3D** (GLB du fabricant, ou photogrammétrie, ou Blender) ; cuire l'éclairage ; compresser (gltf-transform : Draco + KTX2). Viser moins de 5 Mo au total.
3. Squelette ci-dessus, puis une recette de shader par chapitre (nuages, eau, verre…).
4. **Mobile d'abord** : moins de particules, `pixelRatio` 1,5 max, une version sans 3D si le téléphone est trop faible (Active Theory renvoie vers une page « non supporté »).
5. Filmer le résultat en vrai sur un écran pour le Reel (comme @w.wearebrand).

## 6. Règle
On reprend les **méthodes**, jamais les fichiers : les modèles 3D, vidéos, polices payantes (Century Gothic, PP Hatton, NB Architekt) et le code de ces studios restent de l'étude. Pour Kalo, utiliser la charte Kalo (bleu #009BDE, violet #752F8A, rouge #E2231A, jaune #FFD700) et des polices libres.
