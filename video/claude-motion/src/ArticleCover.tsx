import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, easeOut, F, TL} from './lib';
import {Background} from './components/Background';
import {Grain, Spark} from './components/primitives';
import {useFonts} from './components/useFonts';

// A 16:9 centre crop of the 5:2 card keeps x 289–1711, so everything stays inside 340–1700.
const LEFT = 340;
const RIGHT = 1660;
const LINE_Y = 615;

const beats = (v: unknown, key?: string): number[] => {
  if (key === 'fps' || key === 'duration') return [];
  if (typeof v === 'number') return [v];
  if (Array.isArray(v)) return v.flatMap((x) => beats(x));
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => beats(x, k));
  return [];
};
const BEATS = beats(TL);
const HERO = TL.s4.irisOut;

const CURVE = {x: 1370, y: 222, w: 270, h: 220};
const SPACING = Array.from({length: 11}, (_, i) => i / 10);

export const ArticleCover: React.FC = () => {
  useFonts();
  const {x, y, w, h} = CURVE;
  const at = (k: number) => ({cx: x + k * w, cy: y + (1 - easeOut(k)) * h});

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <Background t={0} glow={0.7} glowX={71} glowY={46} />

      <div
        style={{
          position: 'absolute',
          left: LEFT,
          top: 151,
          fontFamily: F.mono,
          fontSize: 19,
          letterSpacing: '0.24em',
          color: C.muted,
        }}
      >
        OPEN-SOURCE PIPELINE · REMOTION · SOUND · SELF-REVIEW
      </div>

      <div
        style={{
          position: 'absolute',
          left: LEFT - 6,
          top: 207,
          fontFamily: F.serif,
          fontSize: 122,
          lineHeight: 1.02,
          letterSpacing: '-0.02em',
          color: C.cream,
        }}
      >
        <div>Claude is a</div>
        <div>
          <span style={{fontStyle: 'italic', color: C.coral}}>motion designer</span> now.
        </div>
      </div>

      <svg width={2000} height={800} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={C.faint} strokeWidth={2} />
        <line x1={x} y1={y} x2={x} y2={y + h} stroke={C.faint} strokeWidth={2} />
        <path
          d={`M ${x} ${y + h} C ${x + 0.16 * w} ${y}, ${x + 0.3 * w} ${y}, ${x + w} ${y}`}
          fill="none"
          stroke={C.creamDim}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {SPACING.slice(0, -1).map((k) => (
          <circle key={k} {...at(k)} r={5.5} fill={C.cream} />
        ))}

        <line x1={LEFT} y1={LINE_Y} x2={RIGHT} y2={LINE_Y} stroke={C.line} strokeWidth={2} />
        {BEATS.map((b, i) => {
          const bx = LEFT + (b / TL.duration) * (RIGHT - LEFT);
          const hero = b === HERO;
          return (
            <line
              key={i}
              x1={bx}
              y1={LINE_Y - (hero ? 30 : 12)}
              x2={bx}
              y2={LINE_Y + (hero ? 30 : 12)}
              stroke={hero ? C.coral : C.creamDim}
              strokeWidth={hero ? 3 : 2}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: x + w - 34,
          top: y - 34,
          filter: 'drop-shadow(0 0 22px rgba(217,119,87,0.6))',
        }}
      >
        <Spark size={68} rotate={12} weight={9} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: x,
          top: y + h + 22,
          fontFamily: F.mono,
          fontSize: 15,
          letterSpacing: '0.06em',
          color: C.muted,
        }}
      >
        easeOut · bezier(0.16, 1, 0.3, 1)
      </div>

      <div
        style={{
          position: 'absolute',
          left: LEFT,
          right: 2000 - RIGHT,
          top: LINE_Y + 46,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: F.mono,
          fontSize: 16,
          letterSpacing: '0.2em',
          color: C.muted,
        }}
      >
        <span>TIMELINE.JSON · {BEATS.length} BEATS</span>
        <span>{TL.duration} S</span>
      </div>

      <Grain frame={0} />
    </AbsoluteFill>
  );
};
