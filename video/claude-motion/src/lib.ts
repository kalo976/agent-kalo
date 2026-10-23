import {Easing, spring, SpringConfig} from 'remotion';
import timeline from '../timeline.json';

export const TL = timeline;
export const FPS = TL.fps;
export const W = 1080;
export const H = 1080;

export const C = {
  bg: '#141413',
  panel: '#1F1E1C',
  panelHi: '#282724',
  line: 'rgba(240,238,230,0.10)',
  lineHi: 'rgba(240,238,230,0.18)',
  cream: '#F0EEE6',
  creamDim: 'rgba(240,238,230,0.64)',
  muted: 'rgba(240,238,230,0.38)',
  faint: 'rgba(240,238,230,0.16)',
  coral: '#D97757',
  coralHi: '#EE9B79',
  ink: '#141413',
};

export const F = {
  serif: '"Instrument Serif", Georgia, serif',
  sans: '"Inter Variable", Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

export const LEVELS = ['low', 'medium', 'high', 'xhigh', 'max'] as const;

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const smooth = (x: number) => {
  const k = clamp01(x);
  return k * k * (3 - 2 * k);
};
/** Linear 0..1 ramp of `x` between a and b, smoothstepped. */
export const band = (x: number, a: number, b: number) => smooth((x - a) / (b - a));

export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.6, 0, 0.9, 0.35);

export const prog = (
  t: number,
  t0: number,
  t1: number,
  ease: (x: number) => number = easeInOut,
) => ease(clamp01((t - t0) / (t1 - t0)));

export const sp = (
  frame: number,
  startSec: number,
  config: Partial<SpringConfig> = {},
  fps: number = FPS,
) => {
  const fr = frame - startSec * fps;
  if (fr <= 0) return 0;
  return spring({
    frame: fr,
    fps,
    config: {damping: 14, mass: 0.8, stiffness: 140, ...config},
  });
};

const KNOB: Partial<SpringConfig> = {damping: 12, stiffness: 190, mass: 0.75};

/**
 * Effort 0..1 (low..max) as the slider moves across the whole piece.
 * Scene 2 notches through every level, scene 3 rewinds to low and climbs to xhigh.
 */
export const effortAt = (frame: number) => {
  const t = frame / FPS;
  const steps = TL.s2.steps.reduce((acc, s) => acc + 0.25 * sp(frame, s, KNOB), 0);
  const rewind = sp(frame, TL.s3.rewind, {damping: 20, stiffness: 240, mass: 0.6});
  const climb = prog(t, TL.s3.climb, TL.s3.arrive, Easing.bezier(0.55, 0, 0.2, 1.12));
  return steps * (1 - rewind) + 0.75 * climb;
};

/** Deterministic pseudo-random in [0,1). */
export const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
