---
title: Hand-built SVG charts with StyleX tokens (tone classes, frame, a11y)
date: 2026-10-12
area: charts
tags: [stylex, svg, d3, charts, a11y, vitest]
---

- **Series colour = `color` + `currentColor`.** StyleX vars can't be picked dynamically, so `internal/charts-styles.ts` defines `tones.c1..c10`
  (`color: colors.chartN`) and shapes use `fill/stroke="currentColor"`. Gradients work by putting the tone class on the `<linearGradient>`
  (stops use `stopColor="currentColor"`). Per-series colours then stay token-driven and dark-mode safe.
- **StyleX lint (`valid-styles`)**: pseudo-classes must be nested inside a property (`outline: { default: 'none', ':focus-visible': ... }`),
  never top-level; `animationDuration` conditions need literal keys (`'@media (prefers-reduced-motion: reduce)'`), not computed ones.
- **Draw-in animations**: `stylex.keyframes` + `animationFillMode: 'backwards'`; lines use `pathLength={1}` + `strokeDasharray: 1`; bars use
  `transformBox: 'fill-box'` so `scaleY/X` origin is the bar itself. Reduced motion zeroes the duration. Stagger via inline `animationDelay`.
- **Demo previews are shrink-to-fit flex children**: a `width:100%` chart (ResizeObserver) collapses to the 480px fallback. Demo wrappers
  must set `width: '100%'` plus a `maxWidth`.
- `ChartFrame` (charts/_shared) owns sizing, `role="img"` summary, hidden data table and the pointer/focus tooltip (`bind(content, ariaLabel)` spread
  on any SVG node). Known trade-off: focusable points inside `role="img"` may trip axe `nested-interactive`; check in e2e.
- jsdom: `ResizeObserver` is stubbed so the frame falls back to a default width; query points with `getByLabelText(/^Mon:/)` and beware the
  chart's own `role=img` label matching broad regexes.
