import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  band,
  C,
  clamp01,
  easeIn,
  easeInOut,
  easeOut,
  effortAt,
  F,
  FPS,
  lerp,
  prog,
  sp,
  TL,
} from './lib';
import {Background} from './components/Background';
import {Grain, Mask, Spark, WobbleFilter} from './components/primitives';
import {BAR_SLOT, BarGeom, PromptBar} from './components/PromptBar';
import {EffortSlider} from './components/EffortSlider';
import {CARD, ConfigMockup} from './components/ConfigMockup';
import {CIRCLE_Y, Sanitizer} from './scenes/Sanitizer';
import {Finale} from './scenes/Finale';
import {useFonts} from './components/useFonts';

const PROMPT_1 = 'redesign the /config menu';
const PROMPT_2 = 'build an HTML sanitizer';

const barGeom = (t: number, frame: number): BarGeom => {
  const s1 = TL.s1;
  const rise = sp(frame, s1.bar, {damping: 15, stiffness: 140});
  const flip = prog(t, s1.flipStart, s1.flipEnd, easeInOut);
  return {
    x: lerp(230, 150, flip),
    y: lerp(706 + (1 - rise) * 40, 60, flip),
    w: lerp(620, 780, flip),
    h: lerp(78, 68, flip),
  };
};

const promptState = (t: number) => {
  const s1 = TL.s1;
  const s3 = TL.s3;
  if (t < s3.rewind) {
    const k = clamp01((t - s1.typeStart) / (s1.typeEnd - s1.typeStart));
    return {text: PROMPT_1, chars: k * PROMPT_1.length, typing: k > 0 && k < 1};
  }
  if (t < s3.retypeStart) {
    const k = clamp01((t - s3.rewind) / (s3.retypeStart - s3.rewind - 0.04));
    return {text: PROMPT_1, chars: (1 - k) * PROMPT_1.length, typing: true};
  }
  const k = clamp01((t - s3.retypeStart) / (s3.retypeEnd - s3.retypeStart));
  return {text: PROMPT_2, chars: k * PROMPT_2.length, typing: k < 1};
};

const Caption: React.FC<{k: number; children: React.ReactNode; align?: 'left' | 'right'}> = ({
  k,
  children,
  align = 'left',
}) => (
  <div
    style={{
      gridArea: '1 / 1',
      opacity: k,
      transform: `translateY(${(1 - k) * 18}px)`,
      filter: k < 1 ? `blur(${(1 - k) * 4}px)` : undefined,
      textAlign: align,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

export const EffortVideo: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const {s1, s2, s3, s4} = TL;

  const e = effortAt(frame);
  const vel = e - effortAt(frame - 1);
  const trail = [2, 4, 6, 8].map((d) => effortAt(frame - d));

  // ---------- scene 1: title + prompt ----------
  const g = barGeom(t, frame);
  const barIn = clamp01(sp(frame, s1.bar, {damping: 15, stiffness: 140}) * 1.4);
  const barOut = prog(t, s3.exit, s3.exit + 0.35, easeIn);
  const p = promptState(t);
  const caretOn = p.typing || Math.floor(t * 2.4) % 2 === 0;

  const sparkGrow = prog(t, s1.spark, s1.spark + 0.9, easeOut);
  const dock = prog(t, s1.sparkDock, s1.sparkDock + 0.5, easeInOut);
  const sparkSize = lerp(92, 30, dock);
  const slotX = g.x + BAR_SLOT / 2 + 2;
  const slotY = g.y + g.h / 2;
  const sparkX = lerp(540, slotX, dock);
  const sparkY = lerp(262, slotY, dock) - Math.sin(dock * Math.PI) * 70;
  const sparkRot = t * 55 + (1 - sparkGrow) * -120 + dock * 180;

  const titleLines = [
    {words: ['Same', 'Claude.'], top: 350, start: s1.line1},
    {words: ['Same', 'prompt.'], top: 500, start: s1.line2},
  ];

  // ---------- scene 2: slider + mockup ----------
  const enter2 = prog(t, s2.drawOn, s2.drawOn + 1.25, easeOut);
  const exit2 = prog(t, s2.exit, s2.exit + 0.55, easeIn);
  const callouts = s2.callouts.map((c) => sp(frame, c, {damping: 11, stiffness: 200}));
  const calloutsOut = prog(t, s2.exit - 0.2, s2.exit + 0.05, easeIn);
  const rowIn =
    prog(t, s2.drawOn + 0.35, s2.drawOn + 1.0, easeOut) *
    (1 - prog(t, s2.exit - 0.05, s2.exit + 0.35, easeIn));
  const sliderIn = prog(t, s2.drawOn + 0.15, s2.drawOn + 0.85, easeOut);
  const sliderOut = prog(t, s3.exit, s3.exit + 0.4, easeIn);
  const inS2 = t < s3.rewind;
  const ec = clamp01(e);

  const capLow = inS2 ? 1 - band(ec, 0.02, 0.1) : 0;
  const capMid = inS2 ? band(ec, 0.06, 0.16) * (1 - band(ec, 0.86, 0.95)) : 0;
  const capMax = inS2 ? band(ec, 0.9, 0.99) : 0;
  const tLow = inS2 ? 1 - band(ec, 0.02, 0.08) : 0;
  const tMax = inS2 ? band(ec, 0.93, 0.995) : 0;
  const tMid = inS2 ? clamp01(1 - tLow - tMax) : 0;
  const maxPop = sp(frame, s2.steps[3] + 0.18, {damping: 8, stiffness: 200});

  // ---------- iris transition ----------
  const merge = prog(t, s4.merge, s4.irisIn + 0.02, easeIn);
  const irisK = prog(t, s4.irisIn, s4.irisOut + 0.02, (x) => easeIn(x) * 0.35 + easeInOut(x) * 0.65);
  const irisR = lerp(27 * band(merge, 0.55, 1), 860, irisK);

  const glow = t < s2.drawOn ? 0.15 * sparkGrow : ec;

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <WobbleFilter frame={frame} amount={1 - band(ec, 0, 0.25)} />
      <Background t={t} glow={glow} />

      {/* scene 1 title */}
      {t < s1.exit + 0.8 &&
        titleLines.map((line, li) => (
          <div
            key={li}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: line.top,
              textAlign: 'center',
              fontFamily: F.serif,
              fontSize: 138,
              lineHeight: 1,
              color: C.cream,
              letterSpacing: '-0.02em',
            }}
          >
            {line.words.map((w, wi) => {
              const k = prog(t, line.start + wi * 0.09, line.start + wi * 0.09 + 0.8, easeOut);
              const out = prog(t, s1.exit + li * 0.05 + wi * 0.03, s1.exit + 0.45 + li * 0.05 + wi * 0.03, easeIn);
              const accent = li === 1 && wi === 1;
              return (
                <React.Fragment key={wi}>
                  <Mask k={k} out={out} style={accent ? {fontStyle: 'italic', color: C.coral} : undefined}>
                    {w}
                  </Mask>
                  {wi === 0 ? ' ' : ''}
                </React.Fragment>
              );
            })}
          </div>
        ))}

      {/* scene 2 mockup */}
      {t > s2.drawOn - 0.05 && t < s2.exit + 0.5 && (
        <ConfigMockup
          e={inS2 ? e : 1}
          t={t}
          enter={enter2}
          exit={exit2}
          callouts={callouts}
          calloutsOut={calloutsOut}
        />
      )}

      {t > s2.drawOn + 0.3 && t < s2.exit + 0.45 && (
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            width: CARD.w,
            top: CARD.y + CARD.h + 26,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            opacity: rowIn,
            transform: `translateY(${(1 - rowIn) * 20}px)`,
          }}
        >
          <div
            style={{
              display: 'grid',
              fontFamily: F.serif,
              fontStyle: 'italic',
              fontSize: 38,
              color: C.cream,
              lineHeight: 1.1,
            }}
          >
            <Caption k={capLow}>a quick interactive sketch</Caption>
            <Caption k={capMid}>
              <span style={{color: C.creamDim}}>more judgment, more polish…</span>
            </Caption>
            <Caption k={capMax}>
              polished mockup <span style={{color: C.coral}}>+ walkthroughs</span>
            </Caption>
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 14, fontFamily: F.mono}}>
            <span style={{fontSize: 14, letterSpacing: '0.24em', color: C.muted}}>TIME</span>
            <div style={{display: 'grid', fontSize: 34, color: C.cream, minWidth: 150}}>
              <Caption k={tLow} align="right">
                1 min
              </Caption>
              <Caption k={tMid} align="right">
                <svg width="34" height="34" viewBox="-17 -17 34 34" style={{verticalAlign: '-4px'}}>
                  <circle r={14} fill="none" stroke={C.creamDim} strokeWidth={2.5} />
                  <line x1={0} y1={0} x2={0} y2={-10} stroke={C.coral} strokeWidth={2.5} strokeLinecap="round" transform={`rotate(${frame * 22})`} />
                  <line x1={0} y1={0} x2={0} y2={-6.5} stroke={C.cream} strokeWidth={2.5} strokeLinecap="round" transform={`rotate(${frame * 1.8})`} />
                </svg>
              </Caption>
              <Caption k={tMax} align="right">
                <span
                  style={{
                    display: 'inline-block',
                    color: C.coral,
                    transform: `scale(${1 + 0.18 * Math.max(0, 1 - maxPop) * (maxPop > 0 ? 1 : 0)})`,
                    textShadow: '0 0 24px rgba(217,119,87,0.6)',
                  }}
                >
                  28 min
                </span>
              </Caption>
            </div>
          </div>
        </div>
      )}

      {/* scene 3 */}
      <Sanitizer frame={frame} t={t} />

      {/* persistent effort slider */}
      {t > s2.drawOn + 0.1 && t < s3.exit + 0.45 && (
        <EffortSlider
          x={150}
          y={915}
          w={780}
          e={e}
          vel={vel}
          trail={trail}
          opacity={sliderIn * (1 - sliderOut)}
        />
      )}

      {/* prompt bar + spark */}
      {t > s1.bar - 0.05 && t < s3.exit + 0.4 && (
        <PromptBar
          g={g}
          text={p.text}
          chars={p.chars}
          caretOn={caretOn}
          tagA="Opus 5.5"
          tagB="Fable 5.1"
          tagK={prog(t, s3.retypeStart, s3.retypeStart + 0.4, easeInOut)}
          tagOpacity={prog(t, s1.flipEnd - 0.25, s1.flipEnd + 0.3, easeOut)}
          opacity={barIn * (1 - barOut)}
          lift={1}
        />
      )}
      {t < s3.exit + 0.4 && (
        <div
          style={{
            position: 'absolute',
            left: sparkX - sparkSize / 2,
            top: sparkY - sparkSize / 2,
            opacity: 1 - barOut,
            filter: `drop-shadow(0 0 ${lerp(26, 8, dock)}px rgba(217,119,87,0.55))`,
          }}
        >
          <Spark size={sparkSize} k={sparkGrow} rotate={sparkRot} weight={lerp(7.5, 10, dock)} />
        </div>
      )}

      {/* coral iris */}
      {t > s4.merge && t < s4.irisOut + 0.75 && (
        <div
          style={{
            position: 'absolute',
            left: 540 - irisR,
            top: CIRCLE_Y - irisR,
            width: irisR * 2,
            height: irisR * 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${C.coralHi} 0%, ${C.coral} 55%, #C4674A 100%)`,
            boxShadow: `0 0 ${40 + 60 * irisK}px rgba(217,119,87,0.6)`,
          }}
        />
      )}

      <Finale frame={frame} t={t} />

      <Grain frame={frame} />
    </AbsoluteFill>
  );
};
