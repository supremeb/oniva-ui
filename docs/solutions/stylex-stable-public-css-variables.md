---
title: Stable public CSS variable names with StyleX defineVars
date: 2026-10-12
area: tokens
tags: [stylex, css-variables, theming, codemod]
---

## Problem

`defineVars({ bg: ... })` emits hashed names (`--x1d7fosw`) that change with the file path, so consumers can't override tokens in plain CSS.

## Mechanism (StyleX 0.19.1, no options needed)

`@stylexjs/babel-plugin` `styleXDefineVars` / `styleXCreateTheme` use `key.startsWith('--') ? key.slice(2) : hash(...)` as the variable name.
So keys written as `'--oniva-color-bg'` are emitted verbatim in `:root`, in every `createTheme` class (dark, accent) and in `var(...)` references.
Naming: `--oniva-color-*`, `--oniva-accent-<step>`, `--oniva-radius-*`, `--oniva-shadow-*`, `--oniva-space-<px>`, `--oniva-font-*`, `--oniva-motion-*`.

## Consequences

- Usage is `colors['--oniva-color-bg']` (bracket access). A typed short alias (`const bg = colors[...]`) is NOT possible: `stylex.create` must resolve the
  member access statically from the `.stylex.ts` export, so every use site spells the key.
- `createTheme` keys must be the same `--oniva-*` strings.
- Renaming a variable is a breaking change. `tokens/stable-vars.test.ts` asserts every key is `--oniva-*`, maps to `var(<same name>)`, and exists in `dist/oniva-ui.css`
  (that part is skipped until `npm run build` has run).
- Consumers override in unlayered CSS (library CSS is in a cascade layer); scope under `[data-oniva-theme]` to beat the dark/accent theme classes.
- Adding a token: add the `--oniva-…` key to the `.stylex.ts` file (and `themes.ts` when dark/accent differ), then regenerate the README list.
- `scripts/codemod-stable-vars.mjs` is the one-off rename (kept for reference; do not re-run).

## Also learned

- `stylex.defineConsts` in a `*.stylex.ts` file (`tokens/media.stylex.ts`) gives shared computed keys for media queries (`[media.reducedMotion]: ...`); a plain exported
  string constant from a non-stylex file is NOT statically resolvable.
- `defineVars` values accept condition objects, so `--oniva-motion-dur-*` collapse to 0.01ms under `prefers-reduced-motion` globally.
