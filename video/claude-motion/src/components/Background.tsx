import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {C} from '../lib';

export const Background: React.FC<{t: number; glow: number; glowX?: number; glowY?: number}> = ({
  t,
  glow,
  glowX = 50,
  glowY = 56,
}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 62% 55% at ${glowX}% ${glowY}%, rgba(217,119,87,${
            0.04 + 0.16 * glow
          }) 0%, rgba(217,119,87,0) 70%)`,
        }}
      />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern
            id="dots"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${-t * 4} ${-t * 7})`}
          >
            <circle cx="18" cy="18" r="1.15" fill="rgba(240,238,230,0.13)" />
          </pattern>
          <radialGradient id="gridFade" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="75%" stopColor="#fff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="gridMask">
            <rect width={width} height={height} fill="url(#gridFade)" />
          </mask>
        </defs>
        <rect width={width} height={height} fill="url(#dots)" mask="url(#gridMask)" />
      </svg>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 85% 85% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
