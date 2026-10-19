import * as THREE from 'three';
import {Sky} from 'three/addons/objects/Sky.js';
import {runSim} from '../kit/runtime.js';
import {createStage} from '../kit/stage3d.js';
import {clamp01, easeInOutCubic, easeOutCubic, lerp, rng, smooth} from '../kit/util.js';
import TL from './timeline.json';

// "Engine": explorer-style film of one methane rocket engine running under its
// stage, high above a sunset cloud deck (format after the turbofan explorer
// videos). The cowling splits open, chapters FEED / SPIN / BURN / BLAST light
// up the flows they talk about, the camera flies down through the injector,
// the chamber and the throat into the plume, then the engine throttles down,
// comes apart into labelled parts, goes back together, relights, and the
// cowling closes on the opening shot (loops).
//
// Generic engine, no names or logos. Caption figures are textbook values for
// methane/LOX full-flow engines, rounded. Sound: sims/engine/sound.py on the
// same timeline.json.

const DEFAULTS = {
  duration: TL.duration,
  fps: 60,
  theme: 'dark',
  hud: {enabled: false, title: 'engine', subtitle: ''},
  director: {enabled: false},
  watermark: 'X: @whaleyxbt',
  seed: 21,
  title: 'ROCKET ENGINE · EXPLORER',
  chapters: [['FEED', TL.feed], ['SPIN', TL.spin], ['BURN', TL.burn], ['BLAST', TL.blast]],
  captions: [
    [0.3, 'A methane rocket engine at full thrust. Cold liquid in, a 3 km/s jet out.'],
    [TL.feed, 'Feed: liquid oxygen at −183 °C and methane at −162 °C pour in from the tanks.'],
    [TL.spin, 'Spin: two turbopumps, each driven by its own preburner. All the propellant goes through them.'],
    [TL.burn, 'Burn: the two hot gas streams meet in the chamber at about 3,500 K and 300 bar.'],
    [TL.flyIn + 0.9, 'The walls survive because cold methane runs through them first.'],
    [TL.blast, 'Blast: the bell turns heat into speed. The exhaust leaves at over 3 km/s.'],
    [TL.blast + 1.6, 'Shock diamonds: the jet overshoots, recompresses, and does it again.'],
    [TL.explode + 0.2, 'Taken apart: inlets, turbopumps, preburners, injector, chamber, nozzle.'],
    [TL.relight - 0.1, 'Feed, spin, burn, blast: all at once, the whole way up.'],
  ],
};

const C = {
  lox: new THREE.Color('#3fd0ff'),
  ch4: new THREE.Color('#ff9a3d'),
  oxg: new THREE.Color('#ff63d8'),
  fug: new THREE.Color('#ffc94d'),
  hot: new THREE.Color('#d8deff'),
};

// chamber + nozzle profile (y = 0 at the throat)
const R_CH = 0.36, R_TH = 0.17, R_EX = 0.84, Y_TOP = 1.0, Y_CV = 0.36, Y_EX = -2.1, Y_JOINT = -0.25;
const wallR = (y) => {
  if (y >= Y_CV) return R_CH;
  if (y >= 0) return R_TH + (R_CH - R_TH) * (0.5 - 0.5 * Math.cos(Math.PI * (y / Y_CV)));
  const s = clamp01(y / Y_EX);
  return R_TH + (R_EX - R_TH) * (1 - Math.pow(1 - s, 2.1));
};
const STAGE_Y = 4.6;
const PX = 1.3; // turbopump offset from the axis

// cutaway wedge around the axis facing +z, below yTop
const CLIP = [new THREE.Plane(), new THREE.Plane(), new THREE.Plane()];
const setCut = (h, yTop) => {
  CLIP[0].set(new THREE.Vector3(-Math.cos(h), 0, -Math.sin(h)), 0);
  CLIP[1].set(new THREE.Vector3(Math.cos(h), 0, -Math.sin(h)), 0);
  CLIP[2].set(new THREE.Vector3(0, 1, 0), -yTop);
};
setCut(0, 0);
const std = (color, metal = 0.6, rough = 0.5, o = {}) =>
  new THREE.MeshStandardMaterial({
    color,
    metalness: metal,
    roughness: rough,
    side: THREE.DoubleSide,
    clippingPlanes: o.clip ? CLIP : null,
    clipIntersection: true,
    transparent: (o.opacity ?? 1) < 1,
    opacity: o.opacity ?? 1,
    depthWrite: (o.opacity ?? 1) >= 1,
    envMapIntensity: o.env ?? 0.6,
    ...(o.extra || {}),
  });

const VERT = /* glsl */ `
varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec2 vUv; varying vec3 vW;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0);
  vec4 mv = viewMatrix * w;
  vV = -mv.xyz; vN = normalize(normalMatrix * normal); vP = position; vUv = uv; vW = w.xyz;
  gl_Position = projectionMatrix * mv;
}`;
const NOISE = /* glsl */ `
float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * vnoise(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
`;
// flowing stream inside a pipe: pulses travel along the tube
const STREAM_FRAG = /* glsl */ `
uniform vec3 uCol; uniform float uT; uniform float uSpeed; uniform float uLen; uniform float uI;
varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec2 vUv; varying vec3 vW;
void main(){
  float p = fract(vUv.x * uLen * 2.4 - uT * uSpeed);
  float pulse = smoothstep(0.0, 0.12, p) * smoothstep(1.0, 0.35, p);
  float face = pow(abs(dot(normalize(vN), normalize(vV))), 0.7);
  vec3 c = uCol * (0.3 + 1.2 * pulse) * (0.35 + 0.65 * face) * uI;
  gl_FragColor = vec4(c, 1.0);
}`;
const FLAME_FRAG = /* glsl */ `
uniform float uI; uniform float uT;
varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec2 vUv; varying vec3 vW;
${NOISE}
void main(){
  vec3 n = normalize(vN); vec3 v = normalize(vV);
  float face = pow(abs(dot(n, v)), 1.3);
  float y = vP.y;
  float core = y > 0.0 ? 1.0 : exp(y * 0.8);
  float fl = 0.75 + 0.5 * fbm(vec2(vUv.x * 18.0, y * 5.0 + uT * 14.0));
  vec3 c = mix(vec3(0.45, 0.38, 1.0), vec3(1.0, 0.94, 1.0), face * core);
  gl_FragColor = vec4(c * uI * (0.2 + 1.4 * face) * core * fl, 1.0);
}`;
// plume as a volume shell (reads from any angle, including from inside)
const PLUME_FRAG = /* glsl */ `
uniform float uI; uniform float uT; uniform float uLen;
varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec2 vUv; varying vec3 vW;
${NOISE}
void main(){
  float s = clamp((${Y_EX.toFixed(2)} - vP.y) / uLen, 0.0, 1.0);
  vec3 n = normalize(vN); vec3 v = normalize(vV);
  float face = pow(abs(dot(n, v)), 1.6);
  float tur = fbm(vec2(vUv.x * 10.0, s * 14.0 - uT * 6.0));
  float fall = pow(1.0 - s, 1.3) * smoothstep(0.0, 0.03, s + 0.01);
  vec3 body = mix(vec3(0.42, 0.3, 1.0), vec3(0.95, 0.55, 0.9), smoothstep(0.35, 1.0, s));
  vec3 c = body * (0.12 + 1.1 * face) * (0.6 + 0.8 * tur) * fall;
  c += vec3(1.0, 0.95, 1.0) * pow(face, 6.0) * exp(-s * 9.0) * 0.6;
  gl_FragColor = vec4(c * uI, 1.0);
}`;
const DIAMOND_FRAG = /* glsl */ `
uniform float uI;
varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec2 vUv; varying vec3 vW;
void main(){
  float face = pow(abs(dot(normalize(vN), normalize(vV))), 2.0);
  gl_FragColor = vec4(vec3(1.0, 0.86, 0.97) * face * uI, 1.0);
}`;
const CLOUD_FRAG = /* glsl */ `
uniform float uT; uniform vec3 uHaze; uniform vec3 uLit; uniform vec3 uShade; uniform vec3 uBase; uniform vec3 uCam;
varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec2 vUv; varying vec3 vW;
${NOISE}
void main(){
  vec2 p = vW.xz * 0.0045 + vec2(0.0, uT * 0.035);
  float n = fbm(p) * 0.75 + fbm(p * 3.1 + 4.0) * 0.25;
  float cov = smoothstep(0.38, 0.6, n);
  float lit = smoothstep(0.45, 0.78, n);
  vec3 c = mix(uBase, mix(uShade, uLit, lit), cov);
  float d = length(vW.xz - uCam.xz);
  c = mix(c, uHaze, smoothstep(300.0, 2600.0, d));
  gl_FragColor = vec4(c, 1.0);
}`;
const POINT_VERT = /* glsl */ `
attribute float aSize; attribute vec3 aColor; varying vec3 vC; uniform float uScale;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vC = aColor;
  gl_PointSize = min(aSize * uScale / max(0.05, -mv.z), 120.0);
  gl_Position = projectionMatrix * mv;
}`;
const POINT_FRAG = /* glsl */ `
varying vec3 vC;
void main(){
  vec2 p = gl_PointCoord - 0.5; float d = dot(p, p) * 4.0;
  if (d > 1.0) discard;
  gl_FragColor = vec4(vC * pow(1.0 - d, 1.6), 1.0);
}`;

function path(points, n = 160) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'centripetal');
  const pts = curve.getSpacedPoints(n);
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += pts[i].distanceTo(pts[i - 1]);
  return {curve, pts, len};
}
const at = (P, u, out) => {
  const f = clamp01(u) * (P.pts.length - 1);
  const i = Math.min(P.pts.length - 2, Math.floor(f));
  return out.lerpVectors(P.pts[i], P.pts[i + 1], f - i);
};
const lathePts = (pts) => pts.map(([r, y]) => new THREE.Vector2(r, y));

runSim(DEFAULTS, async ({cfg, canvas, hud, capture}) => {
  await Promise.all([document.fonts.load('600 20px "JetBrains Mono"'), document.fonts.load('700 20px "JetBrains Mono"'), document.fonts.load('500 20px Inter'), document.fonts.load('600 20px Inter')]).catch(() => {});
  const st = createStage(canvas, hud, {bg: '#7a6a8a', capture, fov: 38, exposure: 0.55, bloom: {strength: 0.34, radius: 0.5, threshold: 0.92}});
  const {scene, camera, renderer} = st;
  renderer.localClippingEnabled = true;
  camera.near = 0.02;
  camera.far = 12000;
  camera.updateProjectionMatrix();
  const R = rng(cfg.seed);

  // ---- sky above a cloud deck at sunset
  const sky = new Sky();
  sky.scale.setScalar(6000);
  const su = sky.material.uniforms;
  su.turbidity.value = 6;
  su.rayleigh.value = 2.2;
  su.mieCoefficient.value = 0.006;
  su.mieDirectionalG.value = 0.85;
  const sunDir = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(85.5), Math.PI / 2 + 0.55);
  su.sunPosition.value.copy(sunDir);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.add(sky);
  scene.environment = pmrem.fromScene(envScene, 0.03).texture;
  scene.add(sky);
  const sun = new THREE.DirectionalLight('#ffbb88', 2.0);
  sun.position.copy(sunDir).multiplyScalar(100);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight('#a9b8e8', '#4a3a48', 0.6));
  const cloudMat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: CLOUD_FRAG,
    uniforms: {uT: {value: 0}, uHaze: {value: new THREE.Color('#e3a891')}, uLit: {value: new THREE.Color('#ffc9a6')}, uShade: {value: new THREE.Color('#8a77a6')}, uBase: {value: new THREE.Color('#4a4366')}, uCam: {value: new THREE.Vector3()}},
  });
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000, 1, 1), cloudMat);
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = -160;
  scene.add(deck);

  // ---- the stage above the engine
  const stageG = new THREE.Group();
  scene.add(stageG);
  const paint = std('#e9e6e0', 0.15, 0.55, {env: 0.5});
  const stageBody = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 60, 128, 1, true), paint);
  stageBody.position.y = STAGE_Y + 30;
  stageG.add(stageBody);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(2.52, 2.52, 1.2, 128, 1, true), std('#23252b', 0.3, 0.6));
  band.position.y = STAGE_Y + 2.2;
  stageG.add(band);
  const shield = new THREE.Mesh(new THREE.CircleGeometry(2.5, 96), std('#2b2d33', 0.3, 0.8));
  shield.rotation.x = Math.PI / 2;
  shield.position.y = STAGE_Y;
  stageG.add(shield);

  // ---- engine parts (each group can move in the exploded view)
  const engine = new THREE.Group();
  scene.add(engine);
  const parts = {};
  for (const k of ['inlets', 'pre', 'pumpL', 'pumpR', 'inj', 'chamber', 'nozzle', 'ducts']) {
    parts[k] = new THREE.Group();
    engine.add(parts[k]);
  }
  // chamber and nozzle: copper with coolant-tube ridges, cut open by the wedge
  const ridged = (y0, y1, seg = 420) => {
    const pts = [];
    for (let k = 0; k <= 60; k++) {
      const y = lerp(y0, y1, k / 60);
      pts.push(new THREE.Vector2(wallR(y), y));
    }
    const g = new THREE.LatheGeometry(pts, seg);
    const pa = g.attributes.position;
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
      if (Math.hypot(x, z) < 1e-4) continue;
      const k = 1 + 0.02 * Math.pow(0.5 + 0.5 * Math.cos(Math.atan2(x, z) * 84), 0.6) * smooth((Y_TOP - 0.04 - y) / 0.08);
      pa.setX(i, x * k);
      pa.setZ(i, z * k);
    }
    g.computeVertexNormals();
    return g;
  };
  const heatTex = (() => {
    const c = document.createElement('canvas');
    c.width = 4;
    c.height = 256;
    const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, '#000000');
    gr.addColorStop(0.55, '#3a0c00');
    gr.addColorStop(1, '#ff6a1c');
    g.fillStyle = gr;
    g.fillRect(0, 0, 4, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const copper = std('#a8714f', 0.7, 0.42, {clip: true, env: 0.7});
  const copperHot = std('#a8714f', 0.7, 0.42, {clip: true, env: 0.7, extra: {emissive: new THREE.Color('#ffffff'), emissiveMap: heatTex, emissiveIntensity: 0.9}});
  parts.chamber.add(new THREE.Mesh(ridged(Y_TOP, Y_JOINT), copperHot));
  parts.nozzle.add(new THREE.Mesh(ridged(Y_JOINT, Y_EX), copper));
  const steelRing = std('#c4c9d0', 0.85, 0.3, {clip: true});
  const ring = (grp, r, y, tube) => {
    const g = new THREE.TorusGeometry(r, tube, 10, 128);
    g.rotateX(Math.PI / 2);
    const m = new THREE.Mesh(g, steelRing);
    m.position.y = y;
    grp.add(m);
  };
  ring(parts.chamber, R_CH + 0.035, Y_TOP, 0.045);
  ring(parts.chamber, R_CH + 0.035, Y_CV, 0.035);
  ring(parts.chamber, wallR(Y_JOINT) + 0.04, Y_JOINT, 0.04);
  ring(parts.nozzle, wallR(Y_JOINT) + 0.04, Y_JOINT - 0.03, 0.035);
  ring(parts.nozzle, wallR(-0.9) + 0.03, -0.9, 0.022);
  ring(parts.nozzle, wallR(-1.5) + 0.035, -1.5, 0.045); // regen manifold
  ring(parts.nozzle, R_EX + 0.02, Y_EX, 0.04);
  // injector dome + gimbal block
  const domeMat = std('#b9bfc7', 0.85, 0.32, {clip: true});
  parts.inj.add(new THREE.Mesh(new THREE.LatheGeometry(lathePts([[0.001, 1.5], [0.14, 1.48], [0.27, 1.4], [0.36, 1.24], [0.39, 1.1], [0.4, 1.02]]), 96), domeMat));
  const puck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.22, 0.42, 32), std('#444a53', 0.7, 0.5));
  puck.position.y = 1.71;
  parts.inj.add(puck);
  const bolts = [];
  for (let i = 0; i < 52; i++) {
    const a = (i / 52) * Math.PI * 2;
    bolts.push([0.44 * Math.sin(a), Y_TOP + 0.05, 0.44 * Math.cos(a)]);
  }
  const boltMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.026, 6), std('#dfe3e8', 0.9, 0.25, {clip: true}), bolts.length);
  const mtx = new THREE.Matrix4();
  bolts.forEach((b, i) => boltMesh.setMatrixAt(i, mtx.makeTranslation(...b)));
  parts.chamber.add(boltMesh);

  // turbopumps: big housings with an open window toward the camera, impeller + turbine inside
  const graphite = std('#3c424b', 0.65, 0.48);
  const pumps = [-1, 1].map((side) => {
    const g = side < 0 ? parts.pumpL : parts.pumpR;
    const P = new THREE.Group();
    P.position.set(side * PX, 0, 0);
    g.add(P);
    const win = 1.9;
    P.add(new THREE.Mesh(new THREE.LatheGeometry(lathePts([[0.001, 1.25], [0.22, 1.25], [0.36, 1.36], [0.42, 1.55], [0.42, 2.25], [0.47, 2.36], [0.47, 2.62], [0.3, 2.72], [0.12, 2.76]]), 96, win / 2, Math.PI * 2 - win), graphite));
    for (const y of [1.55, 2.25, 2.62]) {
      const tg = new THREE.TorusGeometry(y > 2.3 ? 0.48 : 0.43, 0.025, 8, 96, Math.PI * 2 - win);
      tg.rotateX(Math.PI / 2);
      tg.rotateY(-Math.PI / 2 - win / 2);
      const m = new THREE.Mesh(tg, std('#9ea6b0', 0.85, 0.3));
      m.position.y = y;
      P.add(m);
    }
    const rotor = new THREE.Group();
    rotor.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.45, 16), std('#d7dce2', 0.9, 0.22)));
    const bladeMat = std('#e2c48a', 0.85, 0.3);
    const turbMat = std('#c9cfd6', 0.9, 0.25);
    // inducer spiral + impeller (pump end, low) and a turbine disk (top)
    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < 10; k++) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.012, 0.09), bladeMat);
        const a = (k / 10) * Math.PI * 2 + i * 0.4;
        b.position.set(Math.cos(a) * 0.19, -0.42 + i * 0.12 + k * 0.004, Math.sin(a) * 0.19);
        b.rotation.set(0.0, -a, 0.55);
        rotor.add(b);
      }
    }
    const impeller = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.04, 48), bladeMat);
    impeller.position.y = -0.06;
    rotor.add(impeller);
    for (let k = 0; k < 14; k++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.13, 0.016), bladeMat);
      const a = (k / 14) * Math.PI * 2;
      b.position.set(Math.cos(a) * 0.2, 0.02, Math.sin(a) * 0.2);
      b.rotation.y = -a - 0.45;
      rotor.add(b);
    }
    const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 48), turbMat);
    disk.position.y = 0.62;
    rotor.add(disk);
    for (let k = 0; k < 36; k++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.12, 0.014), turbMat);
      const a = (k / 36) * Math.PI * 2;
      b.position.set(Math.cos(a) * 0.42, 0.62, Math.sin(a) * 0.42);
      b.rotation.set(0, -a, 0.5);
      rotor.add(b);
    }
    rotor.position.y = 1.85;
    P.add(rotor);
    // preburner above the turbine
    const preG = new THREE.Group();
    preG.position.set(side * PX, 0, 0);
    parts.pre.add(preG);
    preG.add(new THREE.Mesh(new THREE.LatheGeometry(lathePts([[0.001, 3.62], [0.1, 3.6], [0.18, 3.52], [0.2, 3.38], [0.2, 2.92], [0.15, 2.8]]), 64, 0.8, Math.PI * 2 - 1.6), std('#59606a', 0.75, 0.42)));
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 16), new THREE.MeshBasicMaterial({color: side < 0 ? C.oxg : C.fug, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false}));
    glow.position.y = 3.2;
    glow.scale.set(1, 1.9, 1);
    preG.add(glow);
    return {rotor, glow};
  });

  // pipes (faint glass) with glowing streams inside
  const glass = std('#c8d3e0', 0.0, 0.35, {opacity: 0.1, env: 0.4});
  const streams = [];
  const pipe = (grp, pts, r, col, speed, chapter) => {
    const P = path(pts);
    grp.add(new THREE.Mesh(new THREE.TubeGeometry(P.curve, 140, r, 16, false), glass));
    const mat = new THREE.ShaderMaterial({vertexShader: VERT, fragmentShader: STREAM_FRAG, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, uniforms: {uCol: {value: col}, uT: {value: 0}, uSpeed: {value: speed}, uLen: {value: P.len}, uI: {value: 1}}});
    grp.add(new THREE.Mesh(new THREE.TubeGeometry(P.curve, 140, r * 0.62, 12, false), mat));
    streams.push({mat, chapter});
    return P;
  };
  const mir = (pts) => pts.map(([x, y, z]) => [-x, y, z]);
  const loxIn = [[-0.8, STAGE_Y + 0.4, 0.2], [-0.9, 3.9, 0.5], [-1.55, 2.5, 0.55], [-1.6, 1.4, 0.3], [-PX, 1.2, 0.05]];
  pipe(parts.inlets, loxIn, 0.13, C.lox, 1.6, 'feed');
  pipe(parts.inlets, mir(loxIn), 0.13, C.ch4, 1.6, 'feed');
  // pump discharge: LOX to the injector, methane down to the regen manifold
  pipe(parts.ducts, [[-PX + 0.3, 1.36, 0.3], [-0.95, 1.05, 0.6], [-0.45, 1.25, 0.55], [-0.22, 1.42, 0.3]], 0.08, C.lox, 1.9, 'spin');
  pipe(parts.ducts, [[PX - 0.3, 1.36, 0.3], [1.2, 0.4, 0.62], [1.05, -0.8, 0.75], [0.62, -1.5, 0.62]], 0.075, C.ch4, 1.9, 'spin');
  // hot gas: turbine exhaust to the injector
  pipe(parts.ducts, [[-PX, 2.75, 0.0], [-PX + 0.15, 2.95, 0.4], [-0.6, 2.2, 0.5], [-0.25, 1.6, 0.35]], 0.1, C.oxg, 2.2, 'burn');
  pipe(parts.ducts, mir([[-PX, 2.75, 0.0], [-PX + 0.15, 2.95, 0.4], [-0.6, 2.2, 0.5], [-0.25, 1.6, 0.35]]), 0.1, C.fug, 2.2, 'burn');
  // preburner feeds
  pipe(parts.ducts, [[-PX - 0.35, 1.5, 0.15], [-PX - 0.5, 2.4, 0.25], [-PX - 0.2, 3.3, 0.18]], 0.045, C.lox, 1.6, 'spin');
  pipe(parts.ducts, [[0.42, 1.02, 0.25], [0.95, 1.9, 0.62], [PX + 0.45, 2.6, 0.3], [PX + 0.2, 3.3, 0.18]], 0.05, C.ch4, 1.6, 'spin');
  // regen: streams on the outside of the bell and chamber
  const regenMat = new THREE.ShaderMaterial({vertexShader: VERT, fragmentShader: STREAM_FRAG, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, uniforms: {uCol: {value: C.ch4}, uT: {value: 0}, uSpeed: {value: 1.3}, uLen: {value: 3}, uI: {value: 1}}});
  streams.push({mat: regenMat, chapter: 'burn'});
  for (const phi of [1.05, 1.5, 1.95, 2.5, -1.05, -1.5, -1.95, -2.5]) {
    const pts = [];
    for (let k = 0; k <= 14; k++) {
      const y = lerp(-1.5, 0.95, k / 14);
      const r = wallR(y) + 0.04;
      pts.push([r * Math.sin(phi), y, r * Math.cos(phi)]);
    }
    parts.nozzle.add(new THREE.Mesh(new THREE.TubeGeometry(path(pts).curve, 80, 0.018, 8, false), regenMat));
  }

  // flame in the chamber, plume shell, shock diamonds
  const flameMat = new THREE.ShaderMaterial({vertexShader: VERT, fragmentShader: FLAME_FRAG, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, uniforms: {uI: {value: 1}, uT: {value: 0}}});
  const fpts = [];
  for (let k = 0; k <= 50; k++) {
    const y = lerp(Y_TOP - 0.02, Y_EX, k / 50);
    fpts.push(new THREE.Vector2(wallR(y) * 0.9, y));
  }
  parts.chamber.add(new THREE.Mesh(new THREE.LatheGeometry(fpts, 64), flameMat));
  const PL = 16;
  const plumeMat = new THREE.ShaderMaterial({vertexShader: VERT, fragmentShader: PLUME_FRAG, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, uniforms: {uI: {value: 1}, uT: {value: 0}, uLen: {value: PL}}});
  const ppts = [];
  for (let k = 0; k <= 60; k++) {
    const s = k / 60;
    ppts.push(new THREE.Vector2(R_EX * 0.92 * (1 + 1.4 * s) * (1 - 0.07 * Math.sin(s * 40) ** 2 * (1 - s)), Y_EX - s * PL));
  }
  const plume = new THREE.Mesh(new THREE.LatheGeometry(ppts, 64), plumeMat);
  parts.nozzle.add(plume);
  const diaMat = new THREE.ShaderMaterial({vertexShader: VERT, fragmentShader: DIAMOND_FRAG, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, uniforms: {uI: {value: 1}}});
  for (let k = 0; k < 9; k++) {
    const d = new THREE.Mesh(new THREE.LatheGeometry(lathePts([[0.001, 0.5], [0.5, 0.0], [0.001, -0.5]]), 32), diaMat);
    d.position.y = Y_EX - 0.75 - k * 1.05;
    d.scale.set(0.62 - k * 0.03, 0.42, 0.62 - k * 0.03);
    parts.nozzle.add(d);
  }
  const plumeLight = new THREE.PointLight('#c8b6ff', 0, 0, 2);
  plumeLight.position.set(0, Y_EX - 2.5, 0);
  parts.nozzle.add(plumeLight);

  // hot streaks through the chamber and throat
  const comb = [];
  for (let i = 0; i < 90; i++) {
    const phi = R() * Math.PI * 2, q = Math.sqrt(R()) * 0.82;
    comb.push(path([0.98, 0.6, 0.25, 0.0, -0.7, -1.4, -2.1, -3.2].map((y) => [(y > Y_EX ? wallR(y) : R_EX * (1 + 0.3 * (Y_EX - y))) * q * Math.sin(phi), y, (y > Y_EX ? wallR(y) : R_EX * (1 + 0.3 * (Y_EX - y))) * q * Math.cos(phi)]), 60));
  }
  const PER = 7;
  const nP = comb.length * PER;
  const pPos = new Float32Array(nP * 3), pCol = new Float32Array(nP * 3), pSize = new Float32Array(nP);
  const ph = Array.from({length: nP}, () => R());
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pg.setAttribute('aColor', new THREE.BufferAttribute(pCol, 3));
  pg.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
  const pMat = new THREE.ShaderMaterial({vertexShader: POINT_VERT, fragmentShader: POINT_FRAG, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, uniforms: {uScale: {value: 30}}});
  const pts = new THREE.Points(pg, pMat);
  pts.frustumCulled = false;
  parts.chamber.add(pts);

  // aft skirt of the stage: two white half-cylinders with the heat-shield floor; they slide apart
  const SK0 = 0.85;
  const cowl = [];
  for (const side of [-1, 1]) {
    const grp = new THREE.Group();
    const shellMat = std('#ebe8e2', 0.12, 0.5, {env: 0.5, extra: {transparent: true}});
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, STAGE_Y - SK0, 128, 1, true, side < 0 ? Math.PI : 0, Math.PI), shellMat);
    shell.position.y = (STAGE_Y + SK0) / 2;
    grp.add(shell);
    const fg = new THREE.RingGeometry(0.62, 2.5, 96, 1, side < 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI);
    fg.rotateX(-Math.PI / 2);
    const floor = new THREE.Mesh(fg, std('#2a2c31', 0.35, 0.75));
    floor.position.y = SK0;
    grp.add(floor);
    for (const y of [SK0 + 0.04, (STAGE_Y + SK0) / 2]) {
      const tg = new THREE.TorusGeometry(2.515, 0.03, 6, 96, Math.PI);
      tg.rotateX(Math.PI / 2);
      tg.rotateY(side < 0 ? 0 : Math.PI);
      const r = new THREE.Mesh(tg, std('#9ea3aa', 0.6, 0.4));
      r.position.y = y;
      grp.add(r);
    }
    scene.add(grp);
    cowl.push({grp, side, mat: shellMat});
  }

  // ---- overlay
  const ov = document.createElement('div');
  ov.className = 'e-ov';
  ov.innerHTML = `<div class="e-top"><div class="e-title">${cfg.title}</div><div class="e-ch">${cfg.chapters.map(([c]) => `<span>${c}</span>`).join('')}</div></div>
    <div class="e-cap"><span></span></div>
    <div class="e-bar"><i></i>${cfg.chapters.map(([, t]) => `<em style="left:${((t / cfg.duration) * 100).toFixed(2)}%"></em>`).join('')}</div>
    <div class="e-time"></div><div class="e-wm">${cfg.watermark}</div><canvas class="e-lines"></canvas>`;
  document.getElementById('app').appendChild(ov);
  const lineCv = ov.querySelector('.e-lines');
  const lctx = lineCv.getContext('2d');
  const chEls = [...ov.querySelectorAll('.e-ch span')];
  const capEl = ov.querySelector('.e-cap'), capSpan = ov.querySelector('.e-cap span');
  const barFill = ov.querySelector('.e-bar i'), timeEl = ov.querySelector('.e-time');
  const X0 = TL.explode + 1.3, X1 = TL.assemble - 0.2;
  const LABELS = [
    {text: 'LOX INLET', sub: '−183 °C', part: 'inlets', a: [-1.58, 2.3, 0.56], side: -1, t0: TL.feed + 0.3, t1: TL.spin - 0.1, c: C.lox},
    {text: 'METHANE INLET', sub: '−162 °C', part: 'inlets', a: [1.58, 2.3, 0.56], side: 1, t0: TL.feed + 0.5, t1: TL.spin - 0.1, c: C.ch4},
    {text: 'LOX TURBOPUMP', sub: 'driven by the ox-rich preburner', part: 'pumpL', a: [-PX, 1.85, 0.3], side: -1, t0: TL.spin + 0.2, t1: TL.burn - 0.1, c: C.lox},
    {text: 'OX-RICH PREBURNER', sub: 'burns a little methane in all the oxygen', part: 'pre', a: [-PX, 3.25, 0.2], side: -1, t0: TL.spin + 0.9, t1: TL.burn - 0.1, c: C.oxg},
    {text: 'METHANE TURBOPUMP', sub: 'driven by the fuel-rich preburner', part: 'pumpR', a: [PX, 1.85, 0.3], side: 1, t0: TL.spin + 0.6, t1: TL.burn - 0.1, c: C.ch4},
    {text: 'FUEL-RICH PREBURNER', sub: 'burns a little oxygen in all the methane', part: 'pre', a: [PX, 3.25, 0.2], side: 1, t0: TL.spin + 1.2, t1: TL.burn - 0.1, c: C.fug},
    {text: 'MAIN INJECTOR', sub: 'the two hot gas streams meet', part: 'inj', a: [0.0, 1.35, 0.4], side: -1, t0: TL.burn + 0.2, t1: TL.flyIn + 0.3, c: C.hot},
    {text: 'COMBUSTION CHAMBER', sub: '~300 bar · ~3,500 K', part: 'chamber', a: [0.3, 0.65, 0.2], side: 1, t0: TL.burn + 0.4, t1: TL.flyIn + 0.3, c: C.hot},
    {text: 'NOZZLE', sub: 'regen-cooled by methane', part: 'nozzle', a: [0.72, -1.4, 0.35], side: 1, t0: TL.blast + 0.3, t1: TL.throttle, c: C.ch4},
    {text: 'SHOCK DIAMONDS', sub: '', part: 'nozzle', a: [0, Y_EX - 1.8, 0], side: -1, t0: TL.blast + 1.6, t1: TL.throttle, c: C.hot},
    {text: 'INLETS', sub: '', part: 'inlets', a: [-1.58, 2.6, 0.56], side: -1, t0: X0, t1: X1, c: C.lox},
    {text: 'PREBURNERS', sub: '', part: 'pre', a: [PX, 3.4, 0.2], side: 1, t0: X0 + 0.1, t1: X1, c: C.oxg},
    {text: 'TURBOPUMPS', sub: '', part: 'pumpL', a: [-PX - 0.4, 1.9, 0], side: -1, t0: X0 + 0.2, t1: X1, c: C.lox},
    {text: 'INJECTOR', sub: '', part: 'inj', a: [0.38, 1.25, 0.1], side: 1, t0: X0 + 0.3, t1: X1, c: C.hot},
    {text: 'CHAMBER', sub: '', part: 'chamber', a: [0.36, 0.5, 0.1], side: 1, t0: X0 + 0.4, t1: X1, c: C.hot},
    {text: 'NOZZLE', sub: '', part: 'nozzle', a: [-0.7, -1.3, 0.3], side: -1, t0: X0 + 0.5, t1: X1, c: C.ch4},
  ].map((L) => {
    const el = document.createElement('div');
    el.className = `e-lab ${L.side < 0 ? 'l' : 'r'}`;
    el.innerHTML = `<b><i style="background:#${L.c.getHexString()}"></i>${L.text}</b>${L.sub ? `<span>${L.sub}</span>` : ''}`;
    ov.appendChild(el);
    return {...L, el};
  });
  let s = 1, OW = 1080, OH = 1350;
  const layoutOv = () => {
    const iw = innerWidth, ih = innerHeight;
    s = iw / ih <= 1080 / 1350 ? iw / 1080 : ih / 1350;
    OW = iw / s;
    OH = ih / s;
    ov.style.width = `${OW}px`;
    ov.style.height = `${OH}px`;
    ov.style.transform = `scale(${s})`;
    const dpr = devicePixelRatio || 1;
    lineCv.width = Math.round(iw * dpr);
    lineCv.height = Math.round(ih * dpr);
    lineCv.style.width = `${OW}px`;
    lineCv.style.height = `${OH}px`;
  };
  layoutOv();
  st.resize();

  // ---- state over time
  const openAt = (t) => smooth((t - TL.open) / 1.3) * (1 - smooth((t - TL.close) / 1.4));
  const explAt = (t) => easeInOutCubic((t - TL.explode) / 1.4) * (1 - easeInOutCubic((t - TL.assemble) / 1.3));
  const powerAt = (t) => 1 - smooth((t - TL.throttle) / 0.6) + smooth((t - TL.relight) / 0.25);
  const OFF = {inlets: [0, 1.2, 0], pre: [0, 1.6, 0], pumpL: [-1.0, 0.25, 0], pumpR: [1.0, 0.25, 0], inj: [0, 0.75, 0], chamber: [0, 0, 0], nozzle: [0, -1.4, 0], ducts: [0, 0.45, 0]};
  const omega = (t) => 40 * (0.15 + 0.85 * clamp01(powerAt(t)));
  const rotorAngle = (t) => {
    let a = 0;
    for (let x = 0; x < t; x += 1 / 120) a += omega(x) / 120;
    return a;
  };
  const K = [
    {t: 0, c: [5.2, -4.6, 13.5], l: [0, 0.3, 0]},
    {t: TL.open - 0.1, c: [4.4, 1.0, 9.2], l: [0, 1.7, 0]},
    {t: TL.feed + 1.3, c: [2.4, 2.6, 6.4], l: [0, 2.1, 0]},
    {t: TL.spin + 0.5, c: [-4.4, 2.4, 4.8], l: [-PX, 2.1, 0]},
    {t: TL.burn - 0.3, c: [4.4, 2.9, 4.8], l: [PX * 0.6, 2.3, 0]},
    {t: TL.flyIn, c: [0.35, 3.3, 1.5], l: [0, 1.0, 0]},
    {t: TL.flyIn + 0.9, c: [0.02, 1.25, 0.06], l: [0, -0.75, -0.08], ease: 'in'},
    {t: TL.flyIn + 1.7, c: [0.0, -0.2, 0.04], l: [0, -2.2, -0.06], ease: 'lin'},
    {t: TL.flyOut, c: [0.0, -3.4, 0.05], l: [0, -5.4, -0.06], ease: 'lin'},
    {t: TL.blast + 1.4, c: [5.2, -6.8, 10.5], l: [0, -3.8, 0], ease: 'out'},
    {t: TL.throttle, c: [6.2, -2.6, 11.5], l: [0, -0.8, 0]},
    {t: TL.explode + 1.8, c: [5.0, 1.5, 11.2], l: [0, 1.0, 0]},
    {t: TL.assemble, c: [-5.2, 1.4, 10.8], l: [0, 0.9, 0]},
    {t: TL.close + 0.3, c: [-4.4, -1.6, 11], l: [0, 0.3, 0]},
    {t: TL.duration, c: [5.2, -4.6, 13.5], l: [0, 0.3, 0]},
  ];
  const camAt = (t) => {
    let i = 0;
    while (i < K.length - 2 && t > K[i + 1].t) i++;
    const a = K[i], b = K[i + 1];
    const k = clamp01((t - a.t) / (b.t - a.t));
    const q = b.ease === 'out' ? easeOutCubic(k) : b.ease === 'in' ? k ** 2 : b.ease === 'lin' ? k : easeInOutCubic(k);
    return {c: a.c.map((v, j) => lerp(v, b.c[j], q)), l: a.l.map((v, j) => lerp(v, b.l[j], q))};
  };
  const chapterOf = (t) => (t >= TL.blast ? 'blast' : t >= TL.burn ? 'burn' : t >= TL.spin ? 'spin' : t >= TL.feed ? 'feed' : '');
  const v3 = new THREE.Vector3();

  return {
    resize() {
      st.resize();
      layoutOv();
    },
    render(t) {
      const open = openAt(t), ex = explAt(t), pw = clamp01(powerAt(t));
      const relit = t > TL.relight ? Math.exp(-(t - TL.relight) / 0.3) : 0;

      // parts and cowling
      for (const [k, g] of Object.entries(parts)) g.position.set(OFF[k][0] * ex, OFF[k][1] * ex, OFF[k][2] * ex);
      stageG.position.y = 2.0 * ex;
      for (const c of cowl) {
        c.grp.position.set(c.side * 4.6 * open, 2.0 * ex + 0.8 * open, -1.2 * open);
        c.grp.rotation.y = -c.side * 0.55 * open;
        const vis = 1 - smooth((open - 0.3) / 0.45);
        c.grp.visible = vis > 0.01;
        c.grp.traverse((m) => m.material && ((m.material.transparent = true), (m.material.opacity = vis), (m.material.depthWrite = vis > 0.98)));
      }
      setCut(0.95 * open, 1.75 + 0.75 * ex);

      // camera (+ light vibration from the engine)
      const cam = camAt(t);
      const buzz = 0.006 * pw + 0.05 * relit;
      camera.position.set(cam.c[0] + buzz * Math.sin(t * 91), cam.c[1] + buzz * Math.sin(t * 127 + 1), cam.c[2] + buzz * Math.sin(t * 73 + 2));
      camera.lookAt(cam.l[0], cam.l[1], cam.l[2]);
      camera.updateMatrixWorld();

      // running engine
      pumps.forEach((p, k) => {
        p.rotor.rotation.y = (k ? -1 : 1) * rotorAngle(t);
        p.glow.material.opacity = pw * (0.85 + 0.15 * Math.sin(t * 47 + k * 2));
      });
      const chap = chapterOf(t);
      for (const S of streams) {
        S.mat.uniforms.uT.value = t;
        const focus = !chap || chap === 'blast' ? 0.7 : S.chapter === chap ? 1.2 : 0.3;
        S.mat.uniforms.uI.value = focus * (0.25 + 0.75 * pw) * (1 - 0.85 * ex);
      }
      flameMat.uniforms.uI.value = (0.85 + 0.6 * relit) * pw;
      flameMat.uniforms.uT.value = t;
      plumeMat.uniforms.uI.value = (0.5 + 0.8 * relit) * pw;
      plumeMat.uniforms.uT.value = t;
      diaMat.uniforms.uI.value = (1.15 + 0.15 * Math.sin(t * 37)) * pw;
      plumeLight.intensity = 110 * pw * (0.9 + 0.1 * Math.sin(t * 57));
      copperHot.emissiveIntensity = 0.9 * pw;
      cloudMat.uniforms.uT.value = t;
      cloudMat.uniforms.uCam.value.copy(camera.position);
      // hot streaks
      let o = 0;
      for (const P of comb) {
        for (let k = 0; k < PER; k++, o++) {
          const u = Math.pow((ph[o] + t * 0.9) % 1, 1.4);
          at(P, u, v3);
          pPos[o * 3] = v3.x;
          pPos[o * 3 + 1] = v3.y;
          pPos[o * 3 + 2] = v3.z;
          const b = 0.55 * pw * (1 - ex);
          pCol[o * 3] = C.hot.r * b;
          pCol[o * 3 + 1] = C.hot.g * b;
          pCol[o * 3 + 2] = C.hot.b * b;
          pSize[o] = 0.6 + 0.9 * u;
        }
      }
      pg.attributes.position.needsUpdate = true;
      pg.attributes.aColor.needsUpdate = true;
      pg.attributes.aSize.needsUpdate = true;
      pMat.uniforms.uScale.value = 30 * (st.size.h / 1350) * (window.devicePixelRatio || 1);

      st.render();

      // overlay
      chEls.forEach((el, i) => el.classList.toggle('on', chap === ['feed', 'spin', 'burn', 'blast'][i]));
      let ci = -1;
      cfg.captions.forEach(([ct], i) => (t >= ct ? (ci = i) : 0));
      if (ci >= 0) {
        const [ct, text] = cfg.captions[ci];
        const next = cfg.captions[ci + 1]?.[0] ?? cfg.duration + 1;
        if (capSpan.textContent !== text) capSpan.textContent = text;
        capEl.style.opacity = (smooth((t - ct) / 0.25) * (1 - smooth((t - next + 0.2) / 0.2))).toFixed(3);
      } else capEl.style.opacity = '0';
      barFill.style.width = `${((t / cfg.duration) * 100).toFixed(2)}%`;
      timeEl.textContent = `${t.toFixed(1)} / ${cfg.duration.toFixed(1)} s`;

      const dpr = lineCv.width / (OW * s);
      lctx.setTransform(s * dpr, 0, 0, s * dpr, 0, 0);
      lctx.clearRect(0, 0, OW, OH);
      const used = {'-1': [], 1: []};
      for (const L of LABELS) {
        const a = smooth((t - L.t0) / 0.3) * (1 - smooth((t - L.t1) / 0.3));
        const off = OFF[L.part];
        const p = st.project([L.a[0] + off[0] * ex, L.a[1] + off[1] * ex, L.a[2] + off[2] * ex]);
        const onScreen = p.visible && p.x > 20 && p.x < st.size.w - 20 && p.y > 20 && p.y < st.size.h - 20;
        if (a <= 0.001 || !onScreen) {
          L.el.style.opacity = '0';
          continue;
        }
        L.el.style.opacity = a.toFixed(3);
        const ax = p.x / s, ay = p.y / s;
        let ly = Math.min(OH - 340, Math.max(190, ay));
        for (const u of used[L.side]) if (Math.abs(u - ly) < 70) ly = u + 70 * Math.sign(ly - u || 1);
        used[L.side].push(ly);
        L.el.style.top = `${ly - (L.sub ? 26 : 18)}px`;
        const w = L.el.offsetWidth;
        const ex2 = L.side < 0 ? 40 + w + 10 : OW - 40 - w - 10;
        lctx.globalAlpha = a;
        lctx.strokeStyle = 'rgba(255,255,255,0.85)';
        lctx.lineWidth = 1.6;
        lctx.beginPath();
        lctx.moveTo(ex2, ly);
        lctx.lineTo(lerp(ex2, ax, 0.35), ly);
        lctx.lineTo(ax, ay);
        lctx.stroke();
        lctx.fillStyle = '#fff';
        lctx.beginPath();
        lctx.arc(ax, ay, 4.5, 0, Math.PI * 2);
        lctx.fill();
        lctx.globalAlpha = 1;
      }
      return {};
    },
  };
});
