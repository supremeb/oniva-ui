---
title: Illustration scenes (loop 7, W7): shared frame, pausing loops, SVG strokes
date: 2026-10-26
area: illustrations
tags: [stylex, svg, motion, container-queries, a11y]
---

## Pattern

`internal/w7-scene.tsx` `Scene` is a `container-type: inline-size` box with an `aspect-ratio`. Everything inside is sized in `cqw`
(so illustrations scale with their container, no JS). It uses `useInView({ once: false })` and sets `--w7-play: running|paused` on the
root; CSS loops use `loop.run` (`animation-play-state: var(--w7-play)`), JS loops read `useScene().live`.

## Gotchas

- **Hooks that read the scene (`useScene`, `useSteps`, `useTicker`, `useCycle`) only work in a child of `<Scene>`**, not in the component
  that renders it (context is not yet provided). Split into `Foo` (renders Scene) and `FooBody`, or use `useReducedMotion()` when only reduced motion is needed.
- **`vector-effect: non-scaling-stroke` breaks `stroke-dasharray` with `pathLength`** (dashes are measured in screen px). Draw-in lines and
  travelling pulses use viewBox-unit strokes instead (viewBox ratio == scene ratio, so scaling is uniform).
- Moving a DOM node (re-parenting) restarts its CSS animations; wait for the loop before screenshotting.
- `sxClass()` drops dynamic StyleX values (they live in `style`); for RAC `className` strings that also need `stylex.props(fn())`, spread
  `mergeSx(...)` (`className` + `style`) instead.
- Explicit icon sizes and the shared `fillSvg.svg` (100% x 100%) fight each other: use one or the other.
- Axe `color-contrast` counts element `opacity`; fade drum rows with a `mask-image` on the container, not per-row opacity.
- `animation-play-state: var(...)` and `mix-blend-mode: plus-lighter` are rejected by `@stylexjs/valid-styles` (one scoped eslint-disable in `w7-scene.tsx`).
- Antimeridian-crossing rings (Fiji) draw a horizontal chord across the whole map: unwrap longitudes (+360) and clamp to 180 before projecting.
- Public-domain geometry: world shapes were built from Natural Earth 1:110m via `world-atlas`, merged per continent by dropping arcs shared by two
  members of the group (topojson-style), Natural Earth projection, RDP-simplified (~60 KB).
