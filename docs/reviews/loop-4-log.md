# Loop 4 log

## Stage 1: stable public CSS variables (done)

- Mechanism: StyleX 0.19.1 `defineVars`/`createTheme` emit keys starting with `--` verbatim (babel-plugin `styleXDefineVars`: `key.startsWith('--') ? key.slice(2) : hash`). All token keys renamed to `--oniva-<group>-<name>` via `scripts/codemod-stable-vars.mjs`; usages are `colors['--oniva-color-bg']`.
- Typed aliases are NOT possible: stylex.create must resolve token member access statically from the `.stylex.ts` export.
- Verified: dist/oniva-ui.css has `--oniva-color-bg:#fff` (:root) and dark/accent overrides under the same names; test `tokens/stable-vars.test.ts`; README "Theming with CSS variables".
- typecheck, lint, vitest (140 files / 326 tests), build green. Prettier was run on packages/apps (touched extra files).

## Stage 2: Loop 2 consolidation (done except noted)

- internal/types.ts (ControlSize, ButtonSize, Tone); Input/Switch/ProgressBar/ProgressSegments/Meter/SegmentedControl/CloseButton/Badge/FieldSize use it. RingProgress size -> diameter.
- internal/focus.ts (`focus.ring` / `focus.inset`) applied to 15 files (all standard offset-2 blocks).
- Button styles moved into internal/feedback-control.ts (`controlStyles`), mirror deleted; Button/ToggleButton/LinkButton share it.
- internal/checkbox-box.tsx = single checkbox visual; DataCheckbox + Checkbox use it; tableStyles.checkBox* deleted.
- nav-cx.ts deleted -> `sxClass` in sx.ts (class-only for RAC className callbacks); Skeleton/RingProgress use mergeSx.
- Tokens: on-solid, on-chart, overlay-hover replace '#ffffff', '#0a0a0a', '#00000014'.
- Textarea/Navbar/InputOTP inline styles -> stylex; xstyle declared on IconButton/Stack; CommandPalette/DataTable forward ref+className.
- Deferred: single popover/listbox style source (data-table-select keeps own `dots`/select styles), focus blocks with offset 1/-2 variants, ProgressBar/Meter `style as never`.

## Stage 3: motion (done)
- `--oniva-motion-dur-*` resolve to 0.01ms under prefers-reduced-motion (defineVars condition objects); `tokens/media.stylex.ts` (`media.reducedMotion`) replaces local NO_MOTION/literals in 20 files.

## Stage 4: charts a11y (done)
- ChartFrame svg role=group + aria-roledescription=chart; `bind()` adds role=graphics-symbol + aria-roledescription=data point. New `charts/charts-a11y.test.tsx` (axe on Bar/Line/Donut) failed before the fix, passes after. Existing tests updated to role group.

## Stage 5: docs polish (done)
- 85 demo meta titles to sentence case (Activity widget); RingProgress demo code uses diameter; ContributionHeatmap month labels keep later months on collision; AgentThinking panel trimmed (pre-line, smaller padding; not visually verified).

## Stage 6: compound (done)
- docs/solutions/stylex-stable-public-css-variables.md, loop-4-api-consolidation.md; AGENTS.md "API conventions".
