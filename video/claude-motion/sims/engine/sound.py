#!/usr/bin/env python3
"""Ambient soundtrack for the engine explorer, built on the same timeline.json.

No music: air rush and a steady muffled roar, louder and brighter on the
fly-through, turbopump whine in the SPIN chapter, servo + clunk when the
skirt opens and closes, whooshes for the exploded view, a relight boom.

    python3 sims/engine/sound.py [-o out/sims/engine/ambient.wav]

Mux it with capture.mjs: --music <wav> --music-start 0 --no-sync --lufs -24
"""

import argparse
import json
import math
import os
import random
import sys
import wave

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", ".."))
from sfx.dsp import SR, biquad, hp, lp, svf  # noqa: E402

TL = json.load(open(os.path.join(HERE, "timeline.json")))
DUR = TL["duration"]
N = int(DUR * SR)
T_OPEN, T_SPIN, T_BURN, T_FIN, T_FOUT = TL["open"], TL["spin"], TL["burn"], TL["flyIn"], TL["flyOut"]
T_THR, T_EXP, T_ASM, T_REL, T_CLOSE = TL["throttle"], TL["explode"], TL["assemble"], TL["relight"], TL["close"]


def smooth(x):
    x = 0.0 if x < 0 else 1.0 if x > 1 else x
    return x * x * (3 - 2 * x)


def env(fn):
    """Per-sample envelope from a function of time, evaluated every 64 samples."""
    out = [0.0] * N
    for s in range(0, N, 64):
        v = fn(s / SR)
        e = min(N, s + 64)
        out[s:e] = [v] * (e - s)
    return out


def mul(a, b):
    return [x * y for x, y in zip(a, b)]


def white(seed):
    r = random.Random(seed).random
    return [2.0 * r() - 1.0 for _ in range(N)]


def brown(seed, leak=0.997):
    x = white(seed)
    out = [0.0] * N
    y = 0.0
    for i, v in enumerate(x):
        y = leak * y + 0.06 * v
        out[i] = y
    return out


def norm(x, peak=1.0):
    m = max(1e-9, max(abs(v) for v in x))
    return [v * peak / m for v in x]


def stereo(fn):
    """Same layer from two seeds: decorrelated left/right."""
    return fn(1), fn(2)


L = [0.0] * N
Rch = [0.0] * N


def add(pair_or_mono, gain=1.0, pan=0.0):
    if isinstance(pair_or_mono, tuple):
        l, r = pair_or_mono
    else:
        l = r = pair_or_mono
    gl, gr = gain * math.sqrt(0.5 * (1 - pan)), gain * math.sqrt(0.5 * (1 + pan))
    for i in range(N):
        L[i] += l[i] * gl
        Rch[i] += r[i] * gr


def power(t):
    p = 1 - smooth((t - T_THR) / 0.6) + smooth((t - T_REL) / 0.25)
    return max(0.0, min(1.0, p))


def fly(t):
    return smooth((t - T_FIN + 0.3) / 0.8) * (1 - smooth((t - T_FOUT) / 0.8))


def thump(at, f0=75, f1=38, dur=0.45):
    out = [0.0] * N
    s0 = int(at * SR)
    ph = 0.0
    for i in range(int(dur * SR)):
        if s0 + i >= N:
            break
        k = i / (dur * SR)
        ph += 2 * math.pi * (f0 + (f1 - f0) * k) / SR
        out[s0 + i] = math.sin(ph) * math.exp(-k * 4.5)
    return out


def clicks(at, n=3, gap=0.05, seed=1):
    out = [0.0] * N
    rr = random.Random(seed)
    for c in range(n):
        s0 = int((at + c * gap) * SR)
        for i in range(int(0.012 * SR)):
            if s0 + i < N:
                out[s0 + i] += (2 * rr.random() - 1) * math.exp(-i / (0.002 * SR))
    return biquad(out, hp(1800))


def burst_env(at, dur):
    return env(lambda t: math.sin(math.pi * min(1.0, max(0.0, (t - at) / dur))) ** 2 if at <= t <= at + dur else 0.0)


# 1. air rush, always
add(stereo(lambda k: mul(norm(svf(white(10 + k), 900, 0.5)), env(lambda t: 0.8 + 0.2 * math.sin(t * 0.9)))), 0.16)

# 2. the roar: steady, swells and brightens on the fly-through
def roar_fc(s):
    t = s / SR
    return 700 + 2000 * fly(t)
roar_env = env(lambda t: power(t) * (0.75 + 0.55 * fly(t)) * (1 + 0.6 * (math.exp(-(t - T_REL) / 0.5) if t > T_REL else 0)))
add(stereo(lambda k: mul(norm(svf(brown(60 + k, 0.995), roar_fc, 0.6)), roar_env)), 0.4)
sub = [math.sin(2 * math.pi * 36 * i / SR) + 0.5 * math.sin(2 * math.pi * 51 * i / SR + 1.1) for i in range(N)]
add(mul(sub, env(lambda t: power(t) * (0.8 + 0.2 * math.sin(t * 2.7)))), 0.14)

# 3. turbopump whine, loud while we look at the pumps
whine = [0.0] * N
ph = 0.0
for i in range(N):
    t = i / SR
    f = 1500 * (0.2 + 0.8 * power(t))
    ph += 2 * math.pi * f / SR
    whine[i] = math.sin(ph) + 0.35 * math.sin(2.01 * ph) + 0.12 * math.sin(3.03 * ph)
add(mul(norm(whine), env(lambda t: power(t) * (0.25 + 0.75 * smooth((t - T_SPIN + 0.4) / 0.6) * (1 - smooth((t - T_BURN) / 0.8))))), 0.06)

# 4. skirt opens / closes: servo whir + clunks
for at in (T_OPEN, T_CLOSE):
    add(mul(norm(svf(white(70), 950, 2.0, "bp")), burst_env(at, 1.3)), 0.12)
    add(thump(at + 1.25, 140, 70, 0.25), 0.35)
    add(clicks(at + 1.22, 2, 0.06, int(at * 10)), 0.25)

# 5. fly-through: rising air sweep
def sweep_fc(s):
    t = s / SR
    return 300 + 3200 * smooth((t - T_FIN) / (T_FOUT - T_FIN))
add(stereo(lambda k: mul(norm(svf(white(80 + k), sweep_fc, 1.4, "bp")), env(fly))), 0.16)

# 6. exploded view: whoosh out, whoosh back, parts lock
for at in (T_EXP, T_ASM):
    def wfc(s, at=at):
        t = s / SR
        return 400 + 2200 * smooth((t - at) / 1.4)
    add(stereo(lambda k, at=at: mul(norm(svf(white(90 + k + int(at)), wfc, 1.1, "bp")), burst_env(at, 1.5))), 0.14)
add(clicks(T_ASM + 1.25, 4, 0.07, 4), 0.3)
add(thump(T_ASM + 1.3, 120, 60, 0.2), 0.3)

# 7. relight
add(thump(T_REL, 95, 30, 1.4), 0.8)

# 8. crackle while running
crk_l, crk_r = [0.0] * N, [0.0] * N
rr = random.Random(9)
t = 0.0
while t < DUR:
    t += -math.log(1 - rr.random()) / 22.0
    if power(t) < 0.2:
        continue
    s0 = int(t * SR)
    amp = (0.3 + 0.7 * rr.random()) * power(t) * (1 + fly(t))
    pan = rr.random()
    for i in range(int(0.005 * SR)):
        if s0 + i >= N:
            break
        v = amp * (2 * rr.random() - 1) * math.exp(-i / (0.001 * SR))
        crk_l[s0 + i] += v * (1 - pan)
        crk_r[s0 + i] += v * pan
add((biquad(crk_l, hp(1400)), biquad(crk_r, hp(1400))), 0.12)
# master: gentle soft clip, normalise, write 16-bit stereo
peak = max(max(abs(v) for v in L), max(abs(v) for v in Rch))
g = 0.92 / peak
def sc(v):
    return math.tanh(1.2 * v) / math.tanh(1.2)
ap = argparse.ArgumentParser()
ap.add_argument("-o", "--out", default=os.path.join(HERE, "..", "..", "out", "sims", "engine", "ambient.wav"))
out = os.path.abspath(ap.parse_args().out)
os.makedirs(os.path.dirname(out), exist_ok=True)
frames = bytearray()
for l, r in zip(L, Rch):
    for v in (sc(l * g), sc(r * g)):
        frames += int(max(-1.0, min(1.0, v)) * 32767).to_bytes(2, "little", signed=True)
with wave.open(out, "wb") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    wf.writeframes(bytes(frames))
print(f"→ {os.path.relpath(out)}  ({DUR} s)")
