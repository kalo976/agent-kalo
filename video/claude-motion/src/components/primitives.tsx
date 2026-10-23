import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {C, clamp01} from '../lib';

/**
 * Masked line/word reveal. `k` 0→1 slides the content up into view,
 * `out` 0→1 slides it further up and out of the mask.
 */
export const Mask: React.FC<{
  k: number;
  out?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  tilt?: number;
}> = ({k, out = 0, children, style, tilt = 5}) => (
  <span
    style={{
      display: 'inline-block',
      overflow: 'hidden',
      verticalAlign: 'bottom',
      padding: '0.06em 0.06em 0.16em',
      margin: '-0.06em -0.06em -0.16em',
    }}
  >
    <span
      style={{
        display: 'inline-block',
        transform: `translateY(${((1 - k) - out) * 118}%) rotate(${(1 - k) * tilt}deg)`,
        transformOrigin: '0% 100%',
        ...style,
      }}
    >
      {children}
    </span>
  </span>
);

/** Vertical roll between two values; k=0 shows `a`, k=1 shows `b`. */
export const Roll: React.FC<{
  a: React.ReactNode;
  b: React.ReactNode;
  k: number;
  style?: React.CSSProperties;
}> = ({a, b, k, style}) => (
  <span
    style={{
      position: 'relative',
      display: 'inline-grid',
      overflow: 'hidden',
      verticalAlign: 'bottom',
      ...style,
    }}
  >
    <span
      style={{
        gridArea: '1 / 1',
        transform: `translateY(${-k * 100}%)`,
        opacity: 1 - k,
      }}
    >
      {a}
    </span>
    <span
      style={{
        gridArea: '1 / 1',
        transform: `translateY(${(1 - k) * 100}%)`,
        opacity: k,
      }}
    >
      {b}
    </span>
  </span>
);

const RAYS = [1, 0.74, 0.93, 0.68, 0.98, 0.8, 0.9, 0.7, 1, 0.78, 0.88, 0.72];

/** Warm asterisk mark. `k` grows the rays in with a stagger. */
export const Spark: React.FC<{
  size: number;
  k?: number;
  rotate?: number;
  color?: string;
  weight?: number;
}> = ({size, k = 1, rotate = 0, color = C.coral, weight = 8}) => (
  <svg
    width={size}
    height={size}
    viewBox="-50 -50 100 100"
    style={{overflow: 'visible', display: 'block'}}
  >
    <g transform={`rotate(${rotate})`}>
      {RAYS.map((len, i) => {
        const p = clamp01(k * 1.7 - i * 0.055);
        if (p <= 0.001) return null;
        const a = (i / RAYS.length) * 360;
        return (
          <line
            key={i}
            x1={0}
            y1={-4}
            x2={0}
            y2={-4 - 42 * len * p}
            transform={`rotate(${a})`}
            stroke={color}
            strokeWidth={weight}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  </svg>
);

/** Animated film grain; reseeds on twos so it shimmers like real grain. */
export const Grain: React.FC<{frame: number; opacity?: number}> = ({
  frame,
  opacity = 0.09,
}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
      <svg width={width} height={height}>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={Math.floor(frame / 2) % 97}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={width} height={height} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Hand-drawn "line boil": displacement noise reseeded at 12fps. */
export const WobbleFilter: React.FC<{frame: number; amount: number}> = ({
  frame,
  amount,
}) => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <filter id="wobble" x="-4%" y="-4%" width="108%" height="108%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.022"
        numOctaves={2}
        seed={Math.floor(frame / 5) % 53}
        result="noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale={amount * 9}
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);
