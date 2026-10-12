# Landing shaders (shaders.com / WebGPU) in the docs app

Docs-only (`apps/docs/src/landing/`); nothing in `packages/oniva-ui` imports `shaders`.

- **Lazy**: `ShaderLayer` dynamic-imports `HeroShader` / `StageShader` (the `shaders` engine is its own chunk). First paint is a CSS-gradient poster built from `--oniva-accent-*`; the canvas fades in over it on `onReady`.
- **Gate** (`gate.ts`): live canvas only if `'gpu' in navigator`, no `?noshader`, no `prefers-reduced-motion`, layer in view (IntersectionObserver, unmounts offscreen), and init did not fail (`onUnavailable` + error boundary -> poster). Headless CI has no WebGPU, so it always gets the poster with zero console errors.
- **Tokens -> shader**: `usePalette` resolves CSS vars through a hidden probe element + canvas `fillStyle` -> hex (the lib wants hex), re-read when `useTheme().accent/resolvedTheme` change. That is why the header accent switcher and light/dark recolor the shader live.
- **DPR cap ~1.5**: render the canvas at `k x` size and `transform: scale(1/k)` back (`k = min(1, 1.5/dpr)`).
- **Max 2 canvases**: hero + showcase stage; each unmounts when far offscreen.
- **StyleX lint**: `backgroundImage` with interpolated token vars needs `eslint-disable-next-line @stylexjs/valid-styles`; `:hover` must be nested per-property, not top-level.
- Shader layers are `aria-hidden`; h1 keeps a stable accessible name via a visually hidden span while the visible editorial headline is `aria-hidden`.
- Text over shaders sits on a token-colored scrim so contrast stays >= 4.5:1 in both themes (axe clean light+dark, with and without `?noshader`).
- Env: Playwright's bundled chromium is missing and headless Chrome aborts in the agent sandbox, so e2e could not be run there; verify with a real browser tab + injected axe-core (`node_modules/axe-core/axe.min.js` via `page.evaluate`).
