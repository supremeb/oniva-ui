---
title: Chart SVG roles vs focusable data points (axe nested-interactive)
date: 2026-10-12
area: charts
tags: [a11y, axe, svg, charts]
---

## Problem
`charts/_shared/ChartFrame.tsx` renders `<svg role="img" aria-label=...>` and `bind()` (TipBind) spreads `tabIndex: 0`
(+ `aria-label`, focus/pointer handlers) onto child SVG elements (bars, points, slices).
`img` has presentational children, so focusable descendants trigger axe `nested-interactive` (serious, wcag2a 4.1.2),
and screen readers drop the child labels entirely, so keyboard users land on unnamed/ignored nodes.
Not run in a browser here (Chromium blocked); this is from reading ChartFrame + axe rule semantics.
Existing chart tests do not run axe; the new `internal/test-a11y.ts` can confirm (see below).

## Minimal fix (ChartFrame.tsx + TipBind only; per-chart files unchanged)
1. svg: `role="group"` (not `img`), keep `aria-label={label}`, add `aria-roledescription="chart"`.
   `group` allows interactive children. The visually-hidden data table stays as the SR fallback.
2. `bind()` return adds `role: 'graphics-symbol'` and `'aria-roledescription': 'data point'`, and requires a label
   (make `aria-label` mandatory when the point is focusable: axe `aria-command-name`/focusable-name).
   If a point has click behaviour use `role="button"` instead.
3. Decorative layers (grid, axes) keep `aria-hidden="true"` (already done in several charts).
4. Non-interactive charts (Sparkline, CategoryBar: no focusable children) can keep `role="img"`.
5. Optional: a roving tabindex (one tab stop per chart, arrows between points) to avoid N tab stops; not needed for axe.

## Verify
Add per chart (once ChartFrame is changed):
```ts
const { container } = render(<BarChart ... />);
await expectNoA11yViolations(container); // rules: nested-interactive, svg-img-alt, aria-allowed-role
```
Check `aria-allowed-role` for `graphics-symbol` on `<rect>/<circle>`: allowed on SVG graphics elements per ARIA graphics module; if axe version flags it, fall back to `role="img"` with label on points plus `tabIndex` kept on a wrapping `<g role="group">`.
