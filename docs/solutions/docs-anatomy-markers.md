---
title: Anatomy markers anchored to the DOM
date: 2026-10-12
area: docs
tags: [docs, anatomy, resizeobserver, selectors]
---

- Markers are not hand-placed. `AnatomyStage` queries each part's CSS selector inside the live instance, measures `getBoundingClientRect` relative to the stage, and places a numbered marker on the nearest horizontal side, 36px outside the component, joined by a rotated 1px leader. Same-side markers are spaced 26px apart.
- Re-measure on `ResizeObserver` (stage + instance), `MutationObserver` (subtree) and once after 300ms (theme transitions). That is what keeps markers correct across light/dark/accent and resize.
- A part that covers >=95% x 90% of the instance is a container; its marker goes top-left so it does not stack on inner parts.
- The instance is wrapped in `inert`: it is real but locked, so hovering the legend is the only interaction.
- Gotcha: calling `onEvent` (a state setter) inside `playground.render` loops forever and hangs the tab (navigation never becomes interactive). Only call it from handlers.
- Overlay components (CommandPalette) cannot be inlined: the stage composes the same structure from real `Kbd` and tokens. The library does not export the panel.
- Playground controls are plain native controls styled with tokens (not oniva-ui) to keep them simple; revisit if the library gets a stable SegmentedControl onChange API for them.
