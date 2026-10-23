import React from 'react';
import {band, C, clamp01, easeIn, easeInOut, easeOut, F, lerp, prog, sp, TL} from '../lib';
import {Mask, Roll} from '../components/primitives';

export const CIRCLE_Y = 590;
const CIRCLE_D = 100;
const GAP = 132;

const CHIPS = ['adversarial self-review', 'read parser source', 'XSS test suite', 'fuzzer'];

const Check: React.FC<{k: number; color: string; size?: number}> = ({k, color, size = 1}) => (
  <path
    d="M -17 1 L -6 12 L 18 -13"
    fill="none"
    stroke={color}
    strokeWidth={8 * size}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray={56}
    strokeDashoffset={56 * (1 - k)}
  />
);

export const Sanitizer: React.FC<{frame: number; t: number}> = ({frame, t}) => {
  const s3 = TL.s3;
  const enter = prog(t, s3.enter, s3.enter + 0.7, easeOut);
  if (t < s3.enter - 0.05 || t > TL.s4.irisIn + 0.5) return null;

  const out = prog(t, s3.exit, s3.exit + 0.4, easeIn);
  const merge = prog(t, TL.s4.merge, TL.s4.irisIn + 0.02, easeIn);

  const lowPass = sp(frame, s3.lowResult, {damping: 10, stiffness: 200});
  const pops = s3.pops.map((p) => sp(frame, p, {damping: 9, stiffness: 230, mass: 0.7}));
  const count = 1 + pops.reduce((a, b) => a + b, 0);
  const allIn = pops[3];

  const counterIn = sp(frame, s3.lowResult - 0.05, {damping: 16, stiffness: 150});

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 190,
          textAlign: 'center',
          fontFamily: F.mono,
          fontSize: 17,
          letterSpacing: '0.2em',
          color: C.muted,
          opacity: 1 - out,
          transform: `translateY(${-30 * out}px)`,
        }}
      >
        <Mask k={enter} out={out} tilt={0}>
          TERMINAL-BENCH 3.0 · <span style={{color: C.creamDim}}>HTML-JS-FILTER</span>
        </Mask>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 222,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          fontFamily: F.serif,
          fontSize: 230,
          lineHeight: '230px',
          height: 236,
          color: C.cream,
          opacity: counterIn * (1 - out),
          transform: `translateY(${(1 - counterIn) * 40 - 40 * out}px) scale(${0.94 + 0.06 * counterIn})`,
          letterSpacing: '-0.02em',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            height: 236,
            overflow: 'hidden',
            color: allIn > 0.5 ? C.coral : C.cream,
            textShadow: allIn > 0.5 ? `0 0 ${60 * allIn}px rgba(217,119,87,0.55)` : 'none',
          }}
        >
          <span
            style={{
              display: 'flex',
              flexDirection: 'column',
              transform: `translateY(${-(count - 1) * 236}px)`,
            }}
          >
            {[1, 2, 3, 4, 5].map((d) => (
              <span key={d} style={{height: 236, display: 'block', textAlign: 'center'}}>
                {d}
              </span>
            ))}
          </span>
        </span>
        <span style={{color: C.muted}}>/5</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 468,
          textAlign: 'center',
          fontFamily: F.mono,
          fontSize: 19,
          color: C.creamDim,
          opacity: counterIn * (1 - out),
        }}
      >
        attempts passed at{' '}
        <Roll
          a={<span style={{color: C.coral}}>low</span>}
          b={<span style={{color: C.coral}}>xhigh</span>}
          k={prog(t, s3.pops[0] - 0.12, s3.pops[0] + 0.18, easeInOut)}
          style={{minWidth: 58, textAlign: 'left'}}
        />
      </div>

      <svg
        width={1080}
        height={200}
        style={{position: 'absolute', left: 0, top: CIRCLE_Y - 100, overflow: 'visible'}}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const baseX = 540 + (i - 2) * GAP;
          const cx = lerp(baseX, 540, merge);
          const ringK = prog(t, s3.enter + 0.15 + i * 0.06, s3.enter + 0.6 + i * 0.06, easeOut);
          const failK = i === 0 ? 0 : prog(t, s3.lowResult + 0.1 + i * 0.05, s3.lowResult + 0.35 + i * 0.05, easeOut);
          const pass = i === 0 ? lowPass : pops[i - 1];
          const r = CIRCLE_D / 2;
          const scale = lerp(1, 0.55, merge);
          const pulse = i === 0 ? 0 : clamp01(prog(t, s3.pops[i - 1], s3.pops[i - 1] + 0.55, easeOut));
          return (
            <g key={i} transform={`translate(${cx} 100) scale(${scale})`}>
              {pulse > 0 && pulse < 1 && (
                <circle
                  r={r * (1 + pulse * 0.9)}
                  fill="none"
                  stroke={C.coral}
                  strokeWidth={3}
                  opacity={(1 - pulse) * 0.7}
                />
              )}
              <circle
                r={r - 2}
                fill="rgba(255,255,255,0.02)"
                stroke={C.faint}
                strokeWidth={3}
                strokeDasharray={2 * Math.PI * (r - 2)}
                strokeDashoffset={2 * Math.PI * (r - 2) * (1 - ringK)}
                transform="rotate(-90)"
                opacity={1 - band(merge, 0, 0.6)}
              />
              <g opacity={failK * (1 - clamp01(pass * 2))} stroke={C.muted} strokeWidth={5} strokeLinecap="round">
                <line x1={-13} y1={-13} x2={-13 + 26 * clamp01(failK * 2)} y2={-13 + 26 * clamp01(failK * 2)} />
                <line x1={13} y1={-13} x2={13 - 26 * clamp01(failK * 2 - 1)} y2={-13 + 26 * clamp01(failK * 2 - 1)} />
              </g>
              <circle
                r={(r - 2) * Math.max(0, pass)}
                fill={C.coral}
                style={{filter: `drop-shadow(0 0 ${14 + 16 * merge}px rgba(217,119,87,0.6))`}}
              />
              <g opacity={1 - band(merge, 0, 0.5)}>
                <Check k={clamp01(pass * 1.4 - 0.25)} color={C.ink} />
              </g>
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 700,
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          opacity: 1 - out,
        }}
      >
        {CHIPS.map((label, i) => {
          const k = sp(frame, s3.chips[i], {damping: 13, stiffness: 190});
          return (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '9px 15px 9px 11px',
                borderRadius: 999,
                border: `1px solid ${C.lineHi}`,
                background: 'rgba(40,39,36,0.85)',
                fontFamily: F.mono,
                fontSize: 16,
                color: C.creamDim,
                whiteSpace: 'nowrap',
                opacity: clamp01(k * 1.5),
                transform: `translateY(${(1 - k) * 22}px) scale(${0.85 + 0.15 * k})`,
              }}
            >
              <svg width="18" height="18" viewBox="-25 -25 50 50">
                <circle r={23} fill="rgba(217,119,87,0.2)" />
                <Check k={clamp01(k * 1.3 - 0.2)} color={C.coral} size={0.8} />
              </svg>
              {label}
            </div>
          );
        })}
      </div>
    </>
  );
};
