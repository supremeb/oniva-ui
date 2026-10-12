---
title: Loop 4 consolidation notes (focus helper, control styles, checkbox, sx)
date: 2026-10-12
area: architecture
tags: [conventions, stylex, a11y, charts]
---

- Compose, don't copy: StyleX can't spread one `stylex.create` object into another, so shared pieces are exported style objects used in the SAME `stylex.props(...)`
  call: `stylex.props(controlStyles.base, focus.ring, controlStyles[variant], controlStyles[size], xstyle)`. `xstyle` stays last.
- `internal/focus.ts` (`focus.ring` offset 2, `focus.inset` offset -2) is the only focus outline. Custom offsets 1 / box-shadow rings remain in a few
  internal files (listed in loop-4-log.md); migrate when touched.
- `internal/feedback-control.ts` owns Button-family styles. Button no longer has private copies.
- `internal/checkbox-box.tsx` is the one checkbox box (`density="compact"` for tables).
- RAC `className` callbacks cannot return `style`; use `sxClass(sx, className)` there and `mergeSx` everywhere else (dynamic StyleX values live in `style`).
- Charts: SVG root is `role="group" aria-roledescription="chart"`; focusable points get `role="graphics-symbol"` + `aria-roledescription="data point"` via `bind()`.
  axe (jsdom) passes on BarChart/LineChart/DonutChart (`charts/charts-a11y.test.tsx`). Non-interactive Sparkline/CategoryBar keep `role="img"`.
- ContributionHeatmap month labels: when two month starts collide, drop the EARLIER one, never the later (previously Nov vanished between Oct and Dec).
- Prettier was run repo-wide in loop 4; expect a noisy diff outside the targeted files.
