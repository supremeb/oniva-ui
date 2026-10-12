---
title: Compiling StyleX in Vitest; theme/portal/accent composition
date: 2026-10-12
area: testing-theming
tags: [stylex, vitest, jsdom, themes, react-aria, portals]
---

## StyleX in Vitest

Uncompiled `stylex.create/defineVars` throw at runtime ("must be compiled by @stylexjs/babel-plugin"). Fix: use the same
unplugin in `vitest.config.ts`: `plugins: [stylex.vite({ runtimeInjection: true }), react()]`.

- **Do not set `devMode: 'off'`**: Vitest runs Vite in `serve` mode and the plugin's `apply()` returns false for `off`+serve,
  silently disabling the transform (symptom: the uncompiled error above).
- `runtimeInjection: true` makes compiled styles inject `<style>` into jsdom, so no CSS pipeline is needed (`css: false`).
- Tests assert behavior and class-name differences (variants) rather than computed styles (jsdom has no layout).
- `setup.ts` polyfills `matchMedia` and `ResizeObserver` (ThemeProvider + React Aria use them).
- One root `vitest.config.ts` covers all workspaces; run a folder with `npx vitest run packages/oniva-ui/src/components/Button`.

## Themes

- Groups: `colors` (neutral/status/chart + accent-derived), `accent` (ramp only), `shadow`, plus space/radius/font/motion.
  `darkTheme` (colors) + `darkShadowTheme` (shadow) are applied together by `ThemeProvider`; accent themes only touch `accent`.
- `ThemeProvider` puts theme classes on a wrapper div (`data-oniva-theme`, `data-oniva-accent` for tests) and wraps children in
  react-aria's `UNSAFE_PortalProvider` with the wrapper as container, so popovers/modals/tooltips (normally portaled to `<body>`,
  outside the theme classes) inherit the tokens. Overlay components in later loops should not set their own container.
- "system" mode resolves via `matchMedia` in state (SSR-safe default light).
- Accessibility adjustments vs. measured BoardUI values (axe serious violations otherwise): light `textMuted` #737373 -> #6b6b6b,
  dark `textMuted` n500 -> n400, `textError` red-500 -> red-600 (light), dark `dangerFg` rose-500 -> red-400, neutral badge/avatar
  text uses `textOnTertiary`. `textSubtle`/`textDisabled` are decoration only.

## Pitfalls hit

- An effect arrow that implicitly returns a value (`useEffect(() => window.scrollTo(0, 0))`) crashed the app on route change in
  one browser ("l is not a function" in destroy). Always use block bodies in effects.
- Loading buttons: hide content with `opacity: 0`, not `visibility: hidden` (the latter removes the accessible name; axe
  `button-name` critical).
- Hash-only `page.goto` can hang in some automation; navigate with `location.hash = ...` instead.
