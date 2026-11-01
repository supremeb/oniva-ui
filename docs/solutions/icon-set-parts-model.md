---
title: In-house icon set — one drawing, three styles, and the mask-id trap
date: 2026-11-01
area: icons
tags: [icons, svg, mask, useId, duo, fill, review-sheet]
---

The library draws its own glyphs (`packages/oniva-ui/src/icons/IconSet`, spec in its README.md). Lessons from building it:

## One drawing per glyph, styles derived

Each glyph is a list of parts on the 18-unit grid: `body` (closed shape), `stroke`, `cut` (detail inside a body), `dot`,
`hole`. `render.ts` derives outline, duo (30% tint on `tint` bodies, 45% on `soft` strokes) and fill (bodies solid,
cuts/holes knocked out through an SVG `<mask>` at the stroke width). Drawing fill by hand for every glyph would double the
work and drift from the outline; `only: SOLID | LINED` covers the few glyphs whose solid needs different geometry.
Stroke width, caps and joins live on the root `<svg>`, and mask content inherits from its own `<svg>` ancestor, so a
`strokeWidth` prop widens strokes and knock-outs together.

## Mask ids must not collide across React roots

`useId()` is unique inside one root only. Two roots (or two `renderToStaticMarkup` calls on one page) produce the same id,
and `url(#id)` then resolves to the first mask in the document, so every fill icon showed another glyph's knock-outs.
The mask id is now `oniva-<glyph>-<strokeWidth>-<useId>`: a repeat across roots points at an identical mask, which is
harmless.

## Review glyphs as pictures, not code

`node --experimental-strip-types packages/oniva-ui/scripts/icon-sheet.mjs --file <category> --png sheet.png` renders
each glyph large on the grid with keylines, in all three styles, plus 16/24px. It loads the TS sources straight from
Node (type stripping + `scripts/ts-resolve-hook.mjs` for extensionless imports); glyph modules avoid JSX and
`stylex.create` so that works. Playwright's Chromium makes the PNG.

## Migrating from a 24-unit set

Old call sites passed stroke widths in 24-unit grid terms. The same visual weight on the 18-unit grid is `old × 0.75`
(2 → 1.5). The default size stays 24px so call sites without `size` render as before.

## Dev server: "Invalid empty selector" on first load

The StyleX dev CSS is built from the rules of the modules Vite has compiled so far. If `/@stylex-dev.css` is requested
before `tokens/media.stylex.ts` (the `defineConsts` media queries) has been compiled, the `@media` placeholders stay as
`var(--x…){…}` and lightningcss throws "Invalid empty selector". It is a load-order race, not bad source: compiling every
file's rules together produces valid CSS, and the production build is unaffected. Reload once the server has warmed up.

## Growing the set with parallel agents

Each batch owns one new file in `glyphs/` (stub it and add it to `glyphs/index.ts` first, so agents never touch the
index). Name collisions across batches surface as TS2308 from `export *`; check with
`grep -ho "export const [A-Za-z0-9]*Icon" glyphs/*.ts | sort | uniq -d`. Keep subjects generic: no brand or standards
marks (wireless runes, connector logos), no recognisable characters or famous product shapes.

## Variant families and optical size

- `clear` parts erase a region from everything drawn before them (an SVG mask), so a modifier badge gets a real gap in
  every style without hand-splitting the base outline. `withModifier(name, base, mod)` = base parts + cleared disc
  (radius 5.25 at 13.75,13.75) + mark. `scripts/gen-icon-variants.mjs` writes `glyphs/variants.ts` from a curated base
  list (FULL bases take every mark, LIGHT bases only add/remove/favourite/find/status); hand-drawn names always win.
  Modifier bodies are tinted only in the stroked styles, so in fill-duo the mark stays primary, not the 40% layer.
- Compact drawings live in `compact/*.ts` on a 12-unit grid (stroke 1.25) and are picked at 14px and below. Variants
  inherit them: the cleared disc and mark go through `transformPaths(…, 2/3)`. If a compact drawing reads worse than
  the scaled 18-grid one, delete it; the glyph falls back automatically.
