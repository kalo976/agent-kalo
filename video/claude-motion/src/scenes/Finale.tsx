import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, clamp01, easeInOut, easeOut, F, lerp, prog, sp, TL} from '../lib';
import {Background} from '../components/Background';
import {Mask, Spark} from '../components/primitives';

const MINI = {x: 270, y: 800, w: 540};

export const Finale: React.FC<{frame: number; t: number}> = ({frame, t}) => {
  const s4 = TL.s4;
  if (t < s4.irisOut - 0.02) return null;

  const iris = prog(t, s4.irisOut, s4.irisOut + 0.65, easeInOut);
  const radius = lerp(0, 820, iris);

  const word = (start: number, i: number, step = 0.07) =>
    prog(t, start + i * step, start + i * step + 0.9, easeOut);

  const setup = ['Same', 'Claude.', 'Same', 'prompt.'];
  const travel = prog(t, s4.miniTravel, s4.miniArrive, easeInOut);
  const prevTravel = prog(t - 1 / 60, s4.miniTravel, s4.miniArrive, easeInOut);
  const stretch = Math.min(0.5, Math.abs(travel - prevTravel) * 16);
  const miniIn = prog(t, s4.mini, s4.mini + 0.6, easeOut);
  const arrive = sp(frame, s4.miniArrive, {damping: 8, stiffness: 180});
  const footer = prog(t, s4.footer, s4.footer + 0.7, easeOut);
  const zoom = lerp(1.035, 1, prog(t, s4.irisOut, TL.duration, easeOut));

  return (
    <AbsoluteFill style={{clipPath: `circle(${radius}px at 540px 590px)`}}>
      <Background t={t} glow={0.55 + 0.35 * clamp01(arrive)} glowY={62} />
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 228,
            textAlign: 'center',
            fontFamily: F.serif,
            fontSize: 68,
            color: C.creamDim,
            wordSpacing: '0.04em',
          }}
        >
          {setup.map((w, i) => (
            <React.Fragment key={i}>
              <Mask k={word(s4.setup, i)}>{w}</Mask>
              {i < setup.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 318,
            textAlign: 'center',
            fontFamily: F.serif,
            fontSize: 176,
            lineHeight: 1,
            color: C.cream,
            letterSpacing: '-0.025em',
          }}
        >
          <Mask k={word(s4.line1, 0)}>1</Mask> <Mask k={word(s4.line1, 1)}>minute</Mask>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 500,
            textAlign: 'center',
            fontFamily: F.serif,
            fontSize: 176,
            lineHeight: 1,
            color: C.cream,
            letterSpacing: '-0.025em',
          }}
        >
          <Mask k={word(s4.line2, 0)} style={{fontStyle: 'italic', color: C.coral}}>
            vs
          </Mask>{' '}
          <Mask k={word(s4.line2, 1)}>28</Mask> <Mask k={word(s4.line2, 2)}>minutes.</Mask>
        </div>

        <div
          style={{
            position: 'absolute',
            left: MINI.x,
            top: MINI.y,
            width: MINI.w,
            opacity: miniIn,
            transform: `translateY(${(1 - miniIn) * 24}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: -52,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: F.mono,
              fontSize: 19,
              color: C.muted,
            }}
          >
            <span>
              <span style={{color: travel < 0.5 ? C.cream : C.muted}}>low</span> · 1 min
            </span>
            <span>
              <span style={{color: travel > 0.98 ? C.coral : C.muted}}>max</span> · 28 min
            </span>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              width: MINI.w,
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
              width: MINI.w * travel,
              top: -3,
              height: 6,
              borderRadius: 3,
              background: `linear-gradient(90deg, rgba(217,119,87,0.35), ${C.coral})`,
              boxShadow: `0 0 24px rgba(217,119,87,${0.3 + 0.4 * travel})`,
            }}
          />
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: i * MINI.w - 5,
                top: -5,
                width: 10,
                height: 10,
                borderRadius: 5,
                background: travel >= i - 0.02 ? C.coral : 'rgba(240,238,230,0.22)',
              }}
            />
          ))}
          {arrive > 0 && arrive < 1.2 && (
            <div
              style={{
                position: 'absolute',
                left: MINI.w - 18,
                top: -18,
                width: 36,
                height: 36,
                borderRadius: 18,
                border: `2px solid ${C.coral}`,
                transform: `scale(${1 + clamp01(arrive) * 2.4})`,
                opacity: (1 - clamp01(arrive)) * 0.9,
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              left: MINI.w * travel - 17,
              top: -17,
              width: 34,
              height: 34,
              borderRadius: 17,
              background: C.cream,
              border: `4px solid ${C.coral}`,
              boxSizing: 'border-box',
              transform: `scale(${1 + stretch}, ${1 - stretch * 0.45})`,
              boxShadow: `0 0 0 10px rgba(217,119,87,0.14), 0 0 40px rgba(217,119,87,0.6)`,
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 90,
            right: 90,
            top: 948,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: footer,
            transform: `translateY(${(1 - footer) * 16}px)`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Spark size={30} rotate={t * 40} weight={9} />
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 20,
                color: C.coral,
                padding: '6px 12px',
                borderRadius: 8,
                background: 'rgba(217,119,87,0.14)',
                border: '1px solid rgba(217,119,87,0.3)',
              }}
            >
              /effort
            </span>
            <span style={{fontFamily: F.sans, fontSize: 19, color: C.creamDim}}>in Claude Code</span>
          </div>
          <span style={{fontFamily: F.mono, fontSize: 15, color: C.muted}}>
            data: “Spending your effort” · claude.dev
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
