---
title: Container-query roots need an explicit width
date: 2026-10-26
area: ai / loop 7 (w2)
tags: [stylex, container-queries, layout, a11y]
---

# Container-query roots need an explicit `width: '100%'`

`containerType: 'inline-size'` makes an element size-contained on the inline axis. When its parent is shrink-to-fit
(the docs demo stage, flex/inline-flex wrappers), the root collapses to ~0 width and every `@container` rule then
evaluates against that sliver. Always pair `containerType: 'inline-size'` with `width: '100%'` (plus a `maxWidth` if the
component is meant to be narrow).

Other things learned while building the w2 agent components:

- **Dimming rows with `opacity` breaks contrast.** `opacity: 0.7` on a row with muted text failed axe (3.4:1). Dim the
  decorative parts (bars, tiles) instead and leave text at full opacity.
- **Chart tokens are not text-safe.** `on-chart` on chart-4/5/8 is below 4.5:1 for 12px text; only chart-1/3/6/7/9/10 pass.
  Use a soft surface (`accent-soft` + `accent-soft-fg`) for the extra tile kind.
- **Treemaps must squarify in real pixels.** Laying out in a 100x100 box then stretching gives tall slivers; pass the
  measured width/height (ResizeObserver) to `internal/w2-treemap.ts` and convert to percent for rendering.
- **Comma-expression statements fail lint** (`no-unused-expressions`): write `if (x) { e.preventDefault(); do(); }`.
- **A new live region can collide with existing tests** that use `getByRole('status')`; for improved components use a
  `VisuallyHidden` `aria-live="polite"` span without `role="status"` when the component already has one status.
