import React from 'react';
import {C, clamp01, F, LEVELS} from '../lib';

export const EffortSlider: React.FC<{
  x: number;
  y: number;
  w: number;
  e: number;
  trail: number[];
  vel: number;
  opacity: number;
  headerOpacity?: number;
  labels?: readonly string[];
}> = ({x, y, w, e, trail, vel, opacity, headerOpacity = 1, labels = LEVELS}) => {
  const ec = clamp01(e);
  const n = labels.length - 1;
  const nearest = Math.round(ec * n);
  const stretch = Math.min(0.55, Math.abs(vel) * 16);
  const knob = 36;
  const knobX = e * w;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: 0, opacity}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: -58,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontFamily: F.mono,
          opacity: headerOpacity,
        }}
      >
        <span style={{fontSize: 15, letterSpacing: '0.26em', color: C.muted}}>EFFORT</span>
        <span style={{fontSize: 18, color: C.creamDim}}>
          /effort <span style={{color: C.coral}}>{labels[nearest]}</span>
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          width: w,
          top: -3,
          height: 6,
          borderRadius: 3,
          background: 'rgba(240,238,230,0.10)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: Math.max(0, knobX),
          top: -3,
          height: 6,
          borderRadius: 3,
          background: `linear-gradient(90deg, rgba(217,119,87,0.35), ${C.coral})`,
          boxShadow: `0 0 ${10 + 24 * ec}px rgba(217,119,87,${0.25 + 0.45 * ec})`,
        }}
      />

      {labels.map((label, i) => {
        const px = (i / n) * w;
        const passed = ec >= i / n - 0.02;
        const active = i === nearest;
        return (
          <React.Fragment key={label}>
            <div
              style={{
                position: 'absolute',
                left: px - 5,
                top: -5,
                width: 10,
                height: 10,
                borderRadius: 5,
                background: passed ? C.coral : 'rgba(240,238,230,0.22)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: px,
                top: 30,
                transform: `translateX(-50%) scale(${active ? 1.08 : 1})`,
                fontFamily: F.mono,
                fontSize: 19,
                color: active ? C.cream : C.muted,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </div>
          </React.Fragment>
        );
      })}

      {trail.map((te, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: te * w - knob / 2,
            top: -knob / 2,
            width: knob,
            height: knob,
            borderRadius: knob,
            background: C.coral,
            opacity: Math.min(0.28, Math.abs(te - e) * 6) * (1 - i / trail.length),
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          left: knobX - knob / 2,
          top: -knob / 2,
          width: knob,
          height: knob,
          borderRadius: knob,
          background: C.cream,
          border: `4px solid ${C.coral}`,
          boxSizing: 'border-box',
          transform: `scale(${1 + stretch}, ${1 - stretch * 0.45})`,
          boxShadow: `0 0 0 ${6 + 8 * ec}px rgba(217,119,87,${0.1 + 0.12 * ec}), 0 0 ${
            20 + 40 * ec
          }px rgba(217,119,87,${0.35 + 0.4 * ec}), 0 6px 18px rgba(0,0,0,0.5)`,
        }}
      />
    </div>
  );
};
