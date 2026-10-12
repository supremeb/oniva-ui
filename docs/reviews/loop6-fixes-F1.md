# Loop 6 fixes: F1 (tokens, color, typography, shared control styles)

Guard: `packages/oniva-ui/scripts/check-contrast.mjs` (+ `src/tokens/contrast.test.ts`) reads token source values for light/dark x 8 accents and asserts 1692 pairs (text 4.5, UI 3, chart CVD). All pass. Public token names unchanged; all additions are additive.

## Fixed

| Finding | Fix | Before -> after |
|---|---|---|
| TC P0-1 primary label on accent | New accent vars `--oniva-accent-on-solid`, `-solid`, `-solid-end`, `-solid-hover(-end)`, `-solid-active(-end)` per accent (white on 600/700/800/900 steps; near-black on amber/emerald/cyan 500/600). `accent-fg` -> `accent-on-solid`. feedback-control, Switch, Radio, checkbox-box use them | amber white/500 2.13 -> #0a0a0a 9.27 (6.19 at end stop); blue 3.76 -> 5.25+; hover blue 2.9 -> 6.8+ |
| TC P0-2 danger/status solids | danger gradient `#e7000b->#c10007`, hover `#c10007->#9f0712`, active `#9f0712->#82181a`; success/warning/danger-solid darkened in light (dark keeps bright); new `--oniva-color-{success,warning,danger,info}-on-solid`, `on-solid-light` | danger 3.81 -> 4.77 (hover 2.89 -> 6.42); success dot 2.22 -> 3.2; warning 1.91 -> 3.8 |
| TC P0-3 text-error | `#c10007` | on error-bg 3.91 -> 5.27; on inset 4.45 -> 5.99 |
| TC P0-4 focus ring | `focus-ring` -> `--oniva-accent-focus` (accent-600; amber-700); dark -> accent-400 | amber 2.13 -> 5.03 (on inset >= 3); pink 3.58 -> 4.54 |
| TC P0-5 disabled / track / surfaces (dark) | text-disabled `#737373`, chart-track `#404040`, chart-cursor `#525252`, surface-active `#333333` (new `neutral[750]`), surface-tertiary `#303030`; light text-disabled `#a1a1a1`, disabled-fg `#737373` | dark text-disabled 1.00 -> 3.19; chart-track 1.00 -> 1.5 |
| TC P0-6 kbd-fg / dark text-subtle | kbd-fg `#525252` / `#d4d4d4`; dark text-subtle `#a1a1a1` | kbd 3.20 -> 5.27 (dark 4.01 -> 8+); dark subtle on hover row 3.81 -> ~5.2 |
| TC P1-3 tracking | `track-label` `0.05em`, `track-caption` `0em` | |
| TC P1-2 leading (values, px kept) | lh-11 16, lh-12 17, lh-24 30, lh-32 38, lh-40 46, lh-48 54, lh-56 62, lh-64 70, lh-72 78 | title 1.42 -> 1.25, display 1.35 -> 1.15, caption 1.33 -> 1.42 |
| TC P1-10 soft-fg / active | light `accent-soft-fg` -> accent-900, dark -> accent-50 (new `--oniva-color-accent-text` for text on neutrals; Link uses it) | blue 3.77 -> 5.7+; amber hover 4.04 -> 7.3 |
| TC P1-12 control edges / icons | border-control `#8a8a8a` both themes, icon-subtle `#8a8a8a`, light border-active `#737373`, dark border-active `#a1a1a1` (> hover `#737373`) | border-control 1.48 -> 3.4 (dark 1.46 -> 4.4) |
| TC P2-4 chart palette | light: `#0b8579 #6a9a00 #d12c84 #0092c9 #c026d3 #2563eb #166534 #b45309 #4338ca #525252` (white on-chart labels). Dark overrides restore the original bright set; `on-chart` dark `#0a0a0a` | marks vs white 1.5-2.8 -> 3.4-9.9 (all >= 3); light CVD min dE: protan 5/9 0.4 -> 4.4, deutan 4.0, tritan 4.8, normal 10.4 |
| UI P2/6 hover | `media.hover` key added (+ `media.contrast`); applied in feedback-control, ToggleButton, CloseButton, Link | no sticky hover on touch |
| A11y focus helper | `focus.ts`: width 3 under `prefers-contrast: more`, `Highlight` in forced colors | |
| UI #17 press scale | checkbox-box + RadioGroup use `--oniva-motion-press-scale` instead of 0.94 | |
| Tabular nums | Kbd/Badge already had `tabular-nums` (verified) | |
| Docs | README token list (+7 colors, +8 accent) and custom-accent note; AGENTS.md "Color & type rules (loop 6)" | |
| Extra tokens | `--oniva-color-accent-text`, `text-inverse` | |

## Deferred / notes
- Dark chart palette keeps legacy bright colors: its CVD separation (protan 5/9 0.4) is not fixed; the contrast script asserts CVD for light only. P2, needs a marker/pattern strategy.
- px->rem/unitless for font size/line-height (TC P1-1, P1-5): deferred per brief.
- Non-owned consumers of `accent-fg` that paint it on `accent-500` gradients (Sidebar, Pagination, Stepper, forms-calendar/date, charts-styles) now get the right text color per accent but still use 500/600 fills; other workers' files, should switch to `--oniva-accent-solid*`.
- Not done: `info`/accent hue overlap (design call, TC P1-11), shadow-danger-inset literal, Link/Button bare `:hover` outside owned files (78 total; central feedback-control done), `accent-ring` for custom accents is documented in README.
- `stable-vars.test.ts` reads `dist/oniva-ui.css`; I refreshed the (git-ignored) dist CSS from the /tmp build so it matches the new tokens.

## Verification
- `tsc`: clean in owned files (one unrelated error in Timeline.tsx from another worker). eslint: clean on owned paths.
- `vitest` tokens + themes + 12 component folders: 16 files / 40 tests pass.
- `vite build --outDir /tmp/f1-check`: succeeds; CSS contains `--oniva-accent-on-solid:#0a0a0a|#fff`, `-solid-end`, `-accent-focus`, `--oniva-color-accent-text`, `-danger-on-solid`, `-on-solid-light`, `@media (hover:hover)` rules and `prefers-contrast:more`.
