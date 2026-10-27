---
title: Loop 7 W8 blocks gotchas
date: 2026-10-26
area: blocks
tags: [stylex, container-queries, motion, dark-mode]
---
- `Stagger` wraps every child in its own block `div`, so `gridColumn`/`gridArea` on the child does nothing. Use a plain grid + keyframe `rise` (delay via `--i`) when children must span tracks.
- `--oniva-color-surface-inner` is translucent in dark. Stacked/overlapping surfaces (InvoiceCredit sheets) must paint it over an opaque `--oniva-color-bg` (`backgroundImage: linear-gradient(inner, inner)`), or the sheet behind shows through.
- ToggleButton `variant="soft"` looks identical selected/unselected; use `secondary` for filter/pressed toggles.
- Endless loops (LogoCloud marquee, Testimonials wall) share `internal/w8-loop.ts`: one rAF eases velocity (tau 0.12s stop, 0.3-0.6s resume/fling), wraps by one copy, writes only `transform`; clone copy is `aria-hidden` + `inert`. Reduced motion renders one static copy (no hook listeners).
- Don't put `aria-expanded` on a `<textarea>` (axe aria-allowed-attr); `role="status"` on a heading removes its heading role.
- Docs preview can't resize the viewport; to test 360px, set `style.width` on the block root: blocks use `container-type: inline-size`.
