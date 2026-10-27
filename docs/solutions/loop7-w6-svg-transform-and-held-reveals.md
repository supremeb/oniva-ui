---
title: SVG transform-driven bars need px units; held reveals trip axe contrast while hidden
date: 2026-10-26
area: charts, motion
tags: [svg, stylex, transform, axe, motion]
---

- **Stacked/gliding SVG bars (CompactBreakdown, UsageMeter, BreakdownChart)** draw one `<rect width=1 height=1>` per part and place it with
  `transform: translate(calc(var(--oniva-x) * 1px), 0) scale(var(--oniva-w), 1)` (custom props set inline). `translate(var(--x))` with a unitless
  number is INVALID CSS: the whole transform is dropped and every rect piles up at 0,0 (looked like one solid bar). Use `calc(x * 1px)`; `scale()` takes unitless.
  Use `vectorEffect: non-scaling-stroke` for the gap between parts, and `transformBox: view-box` for pixel-space charts. Transition `transform` only, so re-stacking is GPU-friendly and reduced motion sets `transitionProperty: none`.
- **`@stylexjs/valid-styles`** rejects: function-call values (`backgroundImage: pattern(...)`; inline the template string), comma lists in `animationFillMode` / `animationIterationCount`
  (use a transition for one-shot reveals such as the gradient-text sweep via `clip-path`), `mix-blend-mode: plus-lighter`, and at-rules at the top level of a style object
  (`'@container (...)': {…}` must be nested per property: `flexDirection: { default: 'row', '@container (max-width: 300px)': 'column' }`).
- **`<CrossFade>` swap mode is keyed by `contentKey`, not `id`**: `id` is the DOM attribute (`string`) on `HTMLAttributes`, and overloading it with `string | number` breaks the interface.
- **Reveals that hold text invisible until in view (`TextReveal onView`) fail axe `color-contrast` while hidden** (opacity 0 below the fold). Run the page axe check after scrolling and letting it settle; that is the user-visible state.
- **TextReveal delay base must not depend on re-renders.** `useInView` triggers an extra render after the ref attaches, so a `seen`-ref updated in an effect resets every delay to 0 mid-animation. Derive `base` from a ref that only changes when the piece count changes.
- Locator `page.screenshot({ path })` is confined to the session dir; take the buffer and `fs.writeFile` to `_ref/shots/<worker>/` instead.
