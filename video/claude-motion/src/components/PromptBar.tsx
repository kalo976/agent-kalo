import React from 'react';
import {C, F} from '../lib';
import {Roll} from './primitives';

export type BarGeom = {x: number; y: number; w: number; h: number};

/** Left inset reserved for the docked spark. */
export const BAR_SLOT = 58;

export const PromptBar: React.FC<{
  g: BarGeom;
  text: string;
  chars: number;
  caretOn: boolean;
  tagA: string;
  tagB: string;
  tagK: number;
  tagOpacity: number;
  opacity: number;
  lift: number;
}> = ({g, text, chars, caretOn, tagA, tagB, tagK, tagOpacity, opacity, lift}) => {
  const shown = text.slice(0, Math.max(0, Math.floor(chars)));
  const tag = (label: string) => (
    <span style={{display: 'inline-flex', alignItems: 'center', gap: 10}}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          background: C.coral,
          boxShadow: `0 0 12px ${C.coral}`,
        }}
      />
      {label}
    </span>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: g.x,
        top: g.y,
        width: g.w,
        height: g.h,
        borderRadius: g.h * 0.28,
        background: 'linear-gradient(180deg, rgba(40,39,36,0.92), rgba(28,27,25,0.92))',
        border: `1px solid ${C.lineHi}`,
        boxShadow: `0 ${18 * lift}px ${50 * lift}px rgba(0,0,0,${0.45 * lift}), inset 0 1px 0 rgba(255,255,255,0.05)`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: BAR_SLOT,
        paddingRight: 22,
        boxSizing: 'border-box',
        fontFamily: F.mono,
        fontSize: 25,
        color: C.cream,
        letterSpacing: '-0.01em',
        overflow: 'hidden',
      }}
    >
      <span style={{whiteSpace: 'pre'}}>{shown}</span>
      <span
        style={{
          width: 13,
          height: 30,
          marginLeft: 3,
          background: C.coral,
          borderRadius: 2,
          opacity: caretOn ? 0.95 : 0,
        }}
      />
      <span style={{flex: 1}} />
      <span
        style={{
          fontSize: 17,
          color: C.creamDim,
          opacity: tagOpacity,
          padding: '6px 14px',
          borderRadius: 999,
          border: `1px solid ${C.line}`,
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        <Roll a={tag(tagA)} b={tag(tagB)} k={tagK} />
      </span>
    </div>
  );
};
