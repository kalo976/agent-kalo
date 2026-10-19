# 01 · Spending your effort

![preview](../../media/preview.gif)

22 s · 1080×1080 · 60 fps · stereo, −14 LUFS · source: [`src/EffortVideo.tsx`](../../src/EffortVideo.tsx)

A motion graphic explaining Claude Code's `/effort` levels: same prompt, low vs max, a sketch that turns into a polished mockup, and an HTML-sanitizer benchmark climbing from 1/5 to 5/5.

## Prompt

The agent first got the full text of the "Spending your effort" post, then:

> make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are

One revision afterwards:

> can you slow down the scene transitions a bit? stretch the video to 20–25 seconds so it's more readable

## Process

| Step                                       | Time            |
| ------------------------------------------ | --------------- |
| Prompt → first cut (15 s, sound included) | ~30 min        |
| Revision → final cut (22 s)               | ~8 min          |
| Model                                      | Claude Opus 5.5 |

What the agent did on its own: storyboard into `timeline.json`, scene components, procedural sound from the same timeline, contact-sheet review of every beat, a loudness pass to −14 LUFS, and a re-check of the transition that started colliding after the retime (the prompt bar hitting the outgoing title at 3.7 s).

## Data

Numbers on screen (1 min vs 28 min, 1/5 at low vs 5/5 at xhigh on Terminal-Bench's HTML filter task) come from the "Spending your effort" post on claude.dev.
