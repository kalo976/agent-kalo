import React from 'react';
import {band, C, clamp01, F, LEVELS, lerp} from '../lib';

export const CARD = {x: 150, y: 168, w: 780, h: 560};

type Piece = {
  x: number;
  y: number;
  w: number;
  h: number;
  sketch: React.ReactNode;
  real: React.ReactNode;
};

const Scribble: React.FC<{w: number; h?: number; o?: number; style?: React.CSSProperties}> = ({
  w,
  h = 10,
  o = 0.26,
  style,
}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: h / 2,
      background: `rgba(240,238,230,${o})`,
      ...style,
    }}
  />
);

const dashed = (radius: number, o = 0.42): React.CSSProperties => ({
  position: 'absolute',
  inset: 0,
  border: `2px dashed rgba(240,238,230,${o})`,
  borderRadius: radius,
});

const Toggle: React.FC<{on: boolean}> = ({on}) => (
  <div
    style={{
      width: 50,
      height: 28,
      borderRadius: 14,
      background: on ? C.coral : 'rgba(240,238,230,0.16)',
      position: 'relative',
      boxShadow: on ? '0 0 18px rgba(217,119,87,0.45)' : 'none',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 3,
        left: on ? 25 : 3,
        width: 22,
        height: 22,
        borderRadius: 11,
        background: C.cream,
      }}
    />
  </div>
);

const Row: React.FC<{label: string; children: React.ReactNode; last?: boolean}> = ({
  label,
  children,
  last,
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: last ? 'none' : `1px solid ${C.line}`,
      fontFamily: F.sans,
      fontSize: 20,
      color: C.cream,
      padding: '0 6px',
    }}
  >
    <span>{label}</span>
    <span style={{display: 'flex', alignItems: 'center', gap: 12, color: C.creamDim}}>
      {children}
    </span>
  </div>
);

const SketchRow: React.FC<{w: number; value: 'box' | 'toggle' | 'bars'}> = ({w, value}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 6px',
    }}
  >
    <Scribble w={w} />
    {value === 'toggle' ? (
      <div style={{width: 46, height: 26, borderRadius: 13, border: '2px dashed rgba(240,238,230,0.42)'}} />
    ) : value === 'bars' ? (
      <div style={{width: 110, height: 20, border: '2px dashed rgba(240,238,230,0.42)', borderRadius: 4}} />
    ) : (
      <Scribble w={84} o={0.18} />
    )}
  </div>
);

const MENU = ['General', 'Model', 'Permissions', 'Hooks', 'Appearance', 'Advanced'];
const MENU_W = [96, 74, 128, 70, 120, 106];

const CALLOUTS = [
  {n: 1, label: 'Search flow', x: 610, y: 91},
  {n: 2, label: 'Submenus', x: 118, y: 470},
  {n: 3, label: 'Quick edit', x: 590, y: 341},
];

export const ConfigMockup: React.FC<{
  e: number;
  t: number;
  enter: number;
  exit: number;
  callouts: number[];
  calloutsOut: number;
}> = ({e, t, enter, exit, callouts, calloutsOut}) => {
  const ec = clamp01(e);
  const colorAmt = band(ec, 0.55, 0.82);
  const depth = band(ec, 0.78, 1);
  const cardReal = band(ec, 0.22, 0.34);
  const tilt = lerp(-2.4, 0, band(ec, 0, 0.5));
  const levelIdx = Math.round(ec * 4);

  const bars = (
    <span style={{display: 'flex', gap: 5, alignItems: 'center'}}>
      {[0, 1, 2, 3, 4].map((k) => {
        const fill = k === 0 ? 1 : band(ec, k / 4 - 0.14, k / 4 - 0.01);
        return (
          <span
            key={k}
            style={{
              width: 15,
              height: 20,
              borderRadius: 3,
              background: `rgba(217,119,87,${0.18 + 0.82 * fill})`,
              boxShadow: fill > 0.5 ? '0 0 10px rgba(217,119,87,0.5)' : 'none',
            }}
          />
        );
      })}
      <span style={{fontFamily: F.mono, fontSize: 17, color: C.coral, width: 62, textAlign: 'right'}}>
        {LEVELS[levelIdx]}
      </span>
    </span>
  );

  const pieces: Piece[] = [
    {
      x: 0,
      y: 0,
      w: CARD.w,
      h: 46,
      sketch: (
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 12, height: 12, borderRadius: 6, border: '2px dashed rgba(240,238,230,0.42)'}} />
          ))}
          <div style={{flex: 1, display: 'flex', justifyContent: 'center', paddingRight: 60}}>
            <Scribble w={210} h={8} />
          </div>
        </div>
      ),
      real: (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 9,
            borderBottom: `1px solid ${C.line}`,
          }}
        >
          {[C.coral, 'rgba(240,238,230,0.28)', 'rgba(240,238,230,0.16)'].map((c, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                background: i === 0 ? `rgba(217,119,87,${0.3 + 0.7 * depth})` : c,
              }}
            />
          ))}
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              paddingRight: 60,
              fontFamily: F.mono,
              fontSize: 15,
              color: C.muted,
            }}
          >
            ~/app — claude /config
          </div>
        </div>
      ),
    },
    {
      x: 20,
      y: 66,
      w: 740,
      h: 50,
      sketch: (
        <>
          <div style={dashed(12)} />
          <div style={{position: 'absolute', left: 18, top: 20, display: 'flex', gap: 12}}>
            <div style={{width: 12, height: 12, borderRadius: 6, border: '2px dashed rgba(240,238,230,0.42)', marginTop: -2}} />
            <Scribble w={170} h={9} />
          </div>
        </>
      ),
      real: (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            background: C.panelHi,
            border: `1px solid ${C.lineHi}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            gap: 12,
            fontFamily: F.sans,
            fontSize: 19,
            color: C.muted,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.creamDim} strokeWidth="2.4" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <line x1="15.5" y1="15.5" x2="21" y2="21" />
          </svg>
          Search settings…
        </div>
      ),
    },
    ...MENU.map((label, i): Piece => ({
      x: 20,
      y: 136 + i * 50,
      w: 200,
      h: 44,
      sketch: (
        <>
          {i === 1 && <div style={dashed(10, 0.5)} />}
          <div style={{position: 'absolute', left: 16, top: 17}}>
            <Scribble w={MENU_W[i]} o={i === 1 ? 0.4 : 0.24} />
          </div>
        </>
      ),
      real: (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 10,
            background: i === 1 ? 'rgba(217,119,87,0.16)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 16,
            fontFamily: F.sans,
            fontSize: 19,
            fontWeight: i === 1 ? 560 : 420,
            color: i === 1 ? C.cream : C.creamDim,
          }}
        >
          {i === 1 && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 10,
                bottom: 10,
                width: 3,
                borderRadius: 2,
                background: C.coral,
              }}
            />
          )}
          {label}
          <span style={{flex: 1}} />
          <span style={{paddingRight: 14, color: C.muted}}>›</span>
        </div>
      ),
    })),
    {
      x: 256,
      y: 136,
      w: 504,
      h: 50,
      sketch: (
        <div style={{position: 'absolute', left: 6, top: 16}}>
          <Scribble w={250} h={16} o={0.34} />
        </div>
      ),
      real: (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 6,
            fontFamily: F.serif,
            fontSize: 34,
            color: C.cream,
          }}
        >
          Model &amp; reasoning
        </div>
      ),
    },
    {
      x: 256,
      y: 196,
      w: 504,
      h: 58,
      sketch: <SketchRow w={90} value="box" />,
      real: (
        <Row label="Model">
          Opus 5.5 <span style={{color: C.muted}}>›</span>
        </Row>
      ),
    },
    {
      x: 256,
      y: 254,
      w: 504,
      h: 58,
      sketch: <SketchRow w={80} value="bars" />,
      real: <Row label="Effort">{bars}</Row>,
    },
    {
      x: 256,
      y: 312,
      w: 504,
      h: 58,
      sketch: <SketchRow w={170} value="toggle" />,
      real: (
        <Row label="Extended thinking">
          <Toggle on />
        </Row>
      ),
    },
    {
      x: 256,
      y: 370,
      w: 504,
      h: 58,
      sketch: <SketchRow w={130} value="toggle" />,
      real: (
        <Row label="Auto-compact">
          <Toggle on />
        </Row>
      ),
    },
    {
      x: 256,
      y: 428,
      w: 504,
      h: 58,
      sketch: <SketchRow w={80} value="box" />,
      real: (
        <Row label="Theme" last>
          Dark <span style={{color: C.muted}}>›</span>
        </Row>
      ),
    },
    {
      x: 20,
      y: 508,
      w: 740,
      h: 32,
      sketch: (
        <div style={{position: 'absolute', left: 4, top: 12, display: 'flex', gap: 18}}>
          <Scribble w={110} h={7} o={0.18} />
          <Scribble w={90} h={7} o={0.18} />
          <Scribble w={80} h={7} o={0.18} />
        </div>
      ),
      real: (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            paddingLeft: 4,
            fontFamily: F.mono,
            fontSize: 14,
            color: C.muted,
            borderTop: `1px solid ${C.line}`,
          }}
        >
          <span>↑↓ navigate</span>
          <span>⏎ select</span>
          <span>/ search</span>
          <span>esc close</span>
        </div>
      ),
    },
  ];

  const resolveOf = (p: Piece) => band(ec, 0.27 + (p.y / CARD.h) * 0.3 + (p.x > 240 ? 0.025 : 0), 0.45 + (p.y / CARD.h) * 0.3 + (p.x > 240 ? 0.025 : 0));
  const drawOf = (p: Piece) => clamp01(enter * 1.7 - (p.y / CARD.h) * 0.55 - (p.x / CARD.w) * 0.15);

  const float = Math.sin(t * 2.1) * 3 * depth;

  return (
    <div
      style={{
        position: 'absolute',
        left: CARD.x,
        top: CARD.y,
        width: CARD.w,
        height: CARD.h,
        perspective: 1400,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '50% 60%',
          transform: `translateY(${float - 36 * exit}px) rotateX(${16 * exit}deg) rotate(${tilt}deg) scale(${
            (0.965 + 0.035 * enter) * (1 - 0.14 * exit)
          })`,
          opacity: 1 - exit,
          filter: exit > 0 ? `blur(${exit * 10}px)` : undefined,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 18,
            background: `rgba(31,30,28,${0.96 * cardReal})`,
            border: `1px solid rgba(240,238,230,${0.13 * cardReal})`,
            boxShadow: `0 ${50 * depth}px ${130 * depth}px rgba(0,0,0,${0.6 * depth}), 0 0 ${
              90 * depth
            }px rgba(217,119,87,${0.2 * depth}), inset 0 1px 0 rgba(255,255,255,${0.06 * depth})`,
          }}
        />
        <div
          style={{
            ...dashed(18, 0.4 * (1 - cardReal)),
            clipPath: `inset(0 ${100 - clamp01(enter * 1.4) * 100}% 0 0)`,
            filter: 'url(#wobble)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 236,
            top: 136,
            width: 0,
            height: 350,
            borderLeft: cardReal > 0.5 ? `1px solid ${C.line}` : '2px dashed rgba(240,238,230,0.3)',
            opacity: clamp01(enter * 1.5 - 0.3),
          }}
        />

        <div style={{position: 'absolute', inset: 0, filter: 'url(#wobble)'}}>
          {pieces.map((p, i) => {
            const d = drawOf(p);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: p.x,
                  top: p.y,
                  width: p.w,
                  height: p.h,
                  opacity: 1 - resolveOf(p),
                  clipPath: `inset(-4px ${100 - d * 100}% -4px -4px)`,
                }}
              >
                {p.sketch}
              </div>
            );
          })}
        </div>

        <div style={{position: 'absolute', inset: 0, filter: `grayscale(${1 - colorAmt})`}}>
          {pieces.map((p, i) => {
            const r = resolveOf(p);
            if (r <= 0.001) return null;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: p.x,
                  top: p.y,
                  width: p.w,
                  height: p.h,
                  opacity: r,
                  transform: `translateY(${(1 - r) * 10}px)`,
                  filter: r < 1 ? `blur(${(1 - r) * 5}px)` : undefined,
                }}
              >
                {p.real}
              </div>
            );
          })}
        </div>

        {CALLOUTS.map((c, i) => {
          const k = callouts[i] * (1 - calloutsOut);
          if (k <= 0.001) return null;
          const ring = clamp01(callouts[i] * 1.2);
          return (
            <div
              key={c.n}
              style={{
                position: 'absolute',
                left: c.x,
                top: c.y,
                transform: `translate(-50%, -50%) scale(${0.4 + 0.6 * k}) rotate(${(1 - k) * -8}deg)`,
                opacity: clamp01(k * 1.4),
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 60,
                  height: 60,
                  marginLeft: -30,
                  marginTop: -30,
                  borderRadius: 30,
                  border: `2px solid ${C.coral}`,
                  transform: `scale(${1 + ring * 2.2})`,
                  opacity: (1 - ring) * 0.8,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 16px 8px 8px',
                  borderRadius: 999,
                  background: C.coral,
                  color: C.ink,
                  fontFamily: F.mono,
                  fontSize: 17,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.45), 0 0 30px rgba(217,119,87,0.4)',
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    background: C.ink,
                    color: C.coral,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                  }}
                >
                  {c.n}
                </span>
                {c.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
