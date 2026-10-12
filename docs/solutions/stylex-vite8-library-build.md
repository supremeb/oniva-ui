---
title: StyleX unplugin + Vite 8 library build (CSS output, token imports)
date: 2026-10-12
area: build
tags: [stylex, vite-8, unplugin, library-mode, css]
---

## What works (`packages/oniva-ui/vite.config.ts`)

- `stylex.vite({ runtimeInjection: false, lightningcssOptions: { minify: true } })` + `@vitejs/plugin-react` 6.
- `build.lib` with `formats: ['es']`, `fileName: () => 'index.js'`, `cssCodeSplit: false`, externals: react, react-dom,
  react/jsx-runtime, react-aria, react-aria-components, lucide-react, `@stylexjs/stylex`, d3-_, @tanstack/_.
- The lib never imports a `.css` file, so the unplugin has no CSS asset to append to and **emits `dist/assets/stylex.css`**.
  `scripts/finalize-css.mjs` renames it to `dist/oniva-ui.css` (and fails the build if empty). Don't rely on Vite's `cssFileName`.
- `.d.ts` come from `tsc -p tsconfig.build.json` (`emitDeclarationOnly`, excludes tests/demos). No dts plugin needed.
- `@stylexjs/stylex` must stay a **runtime dependency**: compiled output still calls `stylex.props()` (tiny merge helper).
  Consumers don't need the compiler, only the CSS file.
- `react-aria` is imported directly (for `UNSAFE_PortalProvider`, not re-exported by react-aria-components) so it is a dependency.

## Gotchas

- **`defineVars` only in `*.stylex.ts` files, and consumers of vars must import from that file directly.** Re-exporting through a
  barrel (`tokens/index.ts`) works at runtime but StyleX cannot resolve the var names at compile time through it. Inside the lib
  always `import { colors } from '../../tokens/colors.stylex'`. The docs app uses an alias `@oniva-tokens/*` and must ALSO pass
  `aliases: { '@oniva-tokens/*': [path] }` to the StyleX plugin (the Babel plugin does not read Vite aliases).
- **`createTheme` args must be statically evaluable**: no imported constants or helper functions (error: "Only static values are
  allowed inside of a createTheme() call"). References to other `defineVars` (e.g. `accent.accent900`) are fine. Accent themes are
  therefore written out as literals in `themes/themes.ts`.
- `defineVars` values can reference another group's vars (`accentSoft: accent.accent100`), so a theme that only swaps the accent
  ramp still re-colors derived tokens. Put the ramp in its own group so `darkTheme` and an accent theme never write the same vars.
- Set `unstable_moduleResolution.rootDir` to the repo root in the docs so hashes are stable across `npm -w` cwd differences.
- Dev server (docs): `import('virtual:stylex:runtime')` from `main.tsx` when `import.meta.env.DEV` serves the CSS + HMR.
  In prod the CSS lands in the app's own CSS asset because `global.css` exists (the unplugin appends to an existing asset).
- Vite 8 uses rolldown; `npm install` with a stale lockfile can drop optional native bindings. Regenerate the lock from scratch if
  you see "Cannot find native binding".
