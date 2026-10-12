---
title: Spinners must rotate a square, line-height-free box (or they orbit / drift)
date: 2026-10-12
area: motion
tags: [spinner, rotate, transform-origin, inline-svg, flex, e2e]
---

**Symptom (reported by Bala):** spinners "go out of place" — the arc wobbles/orbits instead of spinning in place,
most visibly inside TaskList / AgentProgress rows and the Spinner docs page.

**Root cause:** `Spinner` rotated an `inline-block` `<span>` that wrapped an inline `<svg>`. The span's box was not the
icon's box: inline SVG sits on the text baseline, so the span picked up line-height/descender space (taller than the
icon), and inside flex rows it could be shrunk narrower than the icon. Measured in Chromium: a 20px icon inside a
16×21 box → `transform-origin: 8px 10.5px`, i.e. the pivot sat ~2.5px off the arc's centre, so `rotate()` swept the
arc in a small circle. jsdom tests can't see this (no layout).

**Fix (Spinner.tsx):** rotate an exactly-sized square: `display: inline-flex`, `width/height/min-*` = icon size (StyleX
dynamic style), `lineHeight: 0`, `transformOrigin: 50% 50%`, `flexShrink: 0`, and the `<svg>` itself `display: block`.

**Rule for future work:** whatever element carries a `rotate()` animation must be a square box whose size equals the
visual it spins; never rotate a wrapper whose size comes from text layout. Rotating rings that are positioned with
`translate(-50%,-50%) rotate()` (ComposerLoader, n3-ring) are fine because they centre explicitly.

**Guard:** `e2e/docs.spec.ts` (per-page loop) now fails any page where an element animated with a rotate keyframe has a
non-square box or an off-centre `transform-origin` (±1px). Runs in CI on real Chromium.
