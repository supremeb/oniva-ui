# Loop 1 review (report-only, commit 20f4134)

Sequential personas: correctness, StyleX/theming, a11y, packaging, CI. Not run: npm install/build/e2e. Findings come from reading source and inspecting `@stylexjs/babel-plugin` 0.19.1 in node_modules.

## P0 must-fix

1. **Consumer CSS variable names are hashed and not overridable (`tokens/*.stylex.ts`, all `defineVars`).**
   - Output looks like `--x1d7fosw`. The hash depends on file path and export name, so it is not a public API.
   - Consumers cannot write `--oniva-accent-500: ...` in plain CSS.
   - Research: in `@stylexjs/babel-plugin` 0.19.1 (`lib/index.js:5424`), `nameHash = key.startsWith('--') ? key.slice(2) : classNamePrefix + hash(exportId.key)`. A `defineVars` key that starts with `--` is therefore emitted **verbatim** and unhashed. This is the same mechanism as StyleX's `defineVars` custom-property support; the official defineVars API page is https://stylexjs.com/docs/api/javascript/defineVars. The 0.19 docs wording was not checked, so verify the claim there.
   - Fix: write keys as `'--oniva-accent-500': '#2b7fff'` and access them as `accent['--oniva-accent-500']`.
   - To keep ergonomic names, wrap the keys in a small typed alias file that is not a `.stylex` file.
   - Caveat: `createTheme` must use the same keys, and keys must be unique across groups because they are global.
   - Do not rely on `classNamePrefix`. It only prefixes the hash and is still not stable.
   - Check that `@property` typed vars (`stylex.types.*`) also keep the name.
   - Document the public variable list in the README.
   - Add a test that asserts `dist/oniva-ui.css` contains `--oniva-accent-500:`.

2. **Package cannot be used as a library without extra work (`packages/oniva-ui/package.json`, `vite.config.ts`).**
   - Check against the "consume without the compiler" claim: `dist/index.js` still calls `stylex.props` against hashed class names that live in `oniva-ui.css`. That works only if the consumer imports `oniva-ui/styles.css`.
   - Nothing enforces or documents this, and there is no `types` condition for `./styles.css`.
   - `xstyle?: stylex.StyleXStyles` needs the consumer's compiler to produce usable styles. Without a compiler it is unusable and silently wrong. The README must say so.
   - Fix: add `"./package.json"` to exports, add `"style"` and `"default"` conditions, and document the CSS import. Add a smoke test that `npm pack`s the package and imports it into a bare Vite app (no StyleX plugin) and into one with the StyleX plugin.
   - With the compiler, consumers of `xstyle` need to import tokens from `oniva-ui/tokens`. The exports map lacks `./tokens/*.stylex`, and a barrel re-export breaks compile-time var resolution (see the docs/solutions note). Either ship the `.stylex.js` files via exports or tell consumers to use only the `--oniva-*` CSS variables (see finding 1).

3. **The CSS file has no `@layer` (`dist/oniva-ui.css`).**
   - Atomic classes then compete with the app's global CSS and with other StyleX bundles by specificity and source order.
   - Fix: set `useLayers: true` in the unplugin options, or wrap the output in `@layer oniva` in `finalize-css.mjs`.
   - Also confirm that the `:root,.xdtwif2` default-var block is not clobbered by a consumer's `:root`.

## P1 should-fix

4. **CI e2e path is fragile (`.github/workflows/ci.yml`, `playwright.config.ts`).**
   - The `webServer` rebuilds docs, and `npm run build` already did so. This wastes time and may produce a different `BASE_PATH`.
   - `playwright install --with-deps` needs sudo, which is fine on ubuntu-latest.
   - Pages and CI both run `gen:index`. `typecheck` also runs it, which is redundant.
   - Fix: drop the redundant `gen:index`. Have the e2e job reuse the build. Add `fail-on-diff` for `src/index.ts` after `gen:index`, because it is generated yet committed.
   - Docs e2e runs at base `/`, not `/oniva-ui/`, so base-path bugs are not exercised. Add one e2e run with `BASE_PATH=/oniva-ui/` and `preview`.

5. **`pages.yml` is mostly correct but has gaps.**
   - Permissions (`pages: write`, `id-token: write`) and the `github-pages` environment are right.
   - Missing `actions/configure-pages` (optional), and the repo must have Pages source set to "GitHub Actions" or the deploy fails.
   - It builds without running tests, so a broken main deploys. Add `needs`/`if` gating or `workflow_run` on CI success.
   - `public/404.html` needs a base-aware redirect. Verify that deep links work, since the router is hash-based and so is fine.
   - `concurrency: cancel-in-progress: true` for Pages can cancel a deploy mid-flight. Set it to false.

6. **Accessibility gaps.**
   - No `prefers-reduced-motion` handling anywhere (the grep found nothing). Transitions use `motion.dur*`.
   - Fix: add a media query in the `motion` tokens (a duration of 0 or `0.01ms` under `@media (prefers-reduced-motion: reduce)` in `defineVars`).
   - Input uses `outline: 'none'` plus a `:focus-within` box-shadow ring (`Input.tsx:87`). The 25% `color-mix` ring is below the 3:1 non-text contrast guideline, and the border colour change must carry it. Verify it, or use a solid 2px outline.
   - Switch is `aria-hidden` on the track, which is OK. Disabled opacity 0.5 can fail contrast for label text, but disabled controls are exempt.
   - Forced-colors mode is not handled. Switch and Button backgrounds rely on gradients, which vanish under `forced-colors`. Add `@media (forced-colors: active)` borders.
   - Unit tests are not enough; axe e2e covers only docs pages.

7. **Theming composition (`themes.ts`, `ThemeProvider.tsx`).**
   - Accent themes are literals, which is forced by the static-eval restriction. They duplicate the ramp across files, so add a test asserting each accent theme sets all 11 keys.
   - Dark/system mode: initial state is light, so there is a flash for SSR and system-dark users.
   - Fix: write `data-theme` before hydration (an inline script option) or use CSS `@media (prefers-color-scheme)` via defineVars at-rule values.
   - The `UNSAFE_PortalProvider` container is the wrapper div. Portals therefore live inside it, which is OK. Nested providers or multiple roots should be tested.
   - A hard-coded `#ffffff`/`#f7f7f7` in the Switch track and knob gradients ignores dark theme. Use tokens (`Switch.tsx:25,45`).

8. **API design.**
   - `mergeSx` merges `sx.style` but Switch (and probably other components) build `className` by hand and drop `style`. Be consistent.
   - `xstyle` plus `className` is a dual escape hatch. Pick one as the primary and document the rule that `xstyle` only accepts StyleX styles.
   - Peer range `react >=18.3` conflicts with `ref` as a prop (React 19 only). On React 18 `ref` would silently not forward.
   - Fix: peer `^19`, or use `forwardRef`.
   - `react-aria-components ~1.22.1` is pinned as a dependency. React Aria is a singleton-ish context, so duplicate copies break the RAC context. Make `react-aria-components` and `react-aria` peerDependencies, not dependencies.

## P2 nice

- `sideEffects: ["**/*.css"]` is right. Add `"./styles.css"` explicitly and verify the d.ts output (`tsc -p tsconfig.build.json`) does not reference unexported internals.
- Heavy runtime dependencies (d3, tanstack, marked, lucide) are in `dependencies` for every consumer, so tree-shaking depends on the single-entry ESM build. Add subpath exports (`oniva-ui/charts`, `/ai`, `/widgets`) for splitting.
- `finalize-css` sanity check (`length < 5000`) is OK. Also assert that no `.css` import exists in `dist/index.js`.
- Sourcemap: `sourcemap: true` ships maps without sources. Include `src` in `files`, or drop them.
- Vitest `runtimeInjection: true` covers tests only. Add one built-CSS visual or computed-style e2e for the library bundle itself, because e2e currently exercises docs-from-source and never the published `dist`.
- eslint: confirm that `@stylexjs/eslint-plugin` rules (valid-styles, no-unused) are enabled for `packages/**`.

Not verified: `npx tsc --noEmit` was not run (read-only pass). The exact StyleX 0.19 docs text on `--` keys was not fetched. The conclusion comes from the plugin source at `node_modules/@stylexjs/babel-plugin/lib/index.js:5424`.

## Loop 1 fixes applied

- P0-1 hashed var names: **deferred** (Loop 4 codemod, token keys untouched).
- P0-2 packaging: **fixed** `./package.json` export, `sideEffects: ["*.css"]`, README documents `styles.css` + compiler/no-compiler (xstyle needs compiler). Pack smoke test + `./tokens` exports: **deferred**.
- P0-3 `@layer`: **fixed** `useCSSLayers: true` in the unplugin (StyleX `priorityN` layers) and `finalize-css.mjs` nests all of it under `@layer oniva{}` (verified on a temp build).
- P1-4 CI: **fixed** no redundant docs gen:index, `git diff --exit-code` drift check, second e2e run with `BASE_PATH=/oniva-ui/`. **Caveat:** playwright.config.ts (not in scope) still hard-codes base `/` and rebuilds docs; it must read `BASE_PATH`/`E2E_REUSE_BUILD` for that step to be meaningful.
- P1-5 pages: **fixed** `workflow_run` on CI success (+ manual dispatch), `cancel-in-progress: false`, checkout of the tested sha. configure-pages: deferred.
- P1-6 a11y: **fixed** reduced motion on Button/Input/Switch (component-level, motion tokens untouched); Input 2px solid focus outline; forced-colors borders on Button gradient variants and Switch. Badge/Card/Avatar had no transitions. axe e2e on library: deferred.
- P1-7 theming: **fixed** system theme resolved synchronously via `useSyncExternalStore` (SSR still renders light; inline script deferred); Switch uses tokens. Accent-theme 11-key test: deferred.
- P1-8 API: **fixed** Switch merges `style` via `mergeSx`; peers `react`/`react-dom` `^19`; `react-aria`/`react-aria-components` moved to peers (kept in devDependencies). Lockfile refreshed with `--package-lock-only`.
- P2: deferred.
