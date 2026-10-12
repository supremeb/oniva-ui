# oniva-ui

React design system for dashboards and agent interfaces. Original, MIT-licensed, styled with
[StyleX](https://stylexjs.com) and built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html).
Inspired by the look of BoardUI (nested inset cards, gradient primary buttons, soft shadows); no BoardUI code or assets are used.

- StyleX only: atomic CSS, design tokens as CSS variables, no runtime CSS-in-JS
- Accessible by default (React Aria): keyboard, focus, ARIA
- Light, dark and 8 accent themes (blue, violet, pink, red, amber, emerald, cyan, indigo)
- Consumers need **no StyleX compiler** to use the components: import `oniva-ui/styles.css` once (the `xstyle` prop does need one, see below)

## Install

```bash
npm i oniva-ui
```

Peer deps: `react` and `react-dom` (^19; components take `ref` as a prop), plus `react-aria` and `react-aria-components`
(install them yourself so there is a single copy of the React Aria context):

```bash
npm i oniva-ui react-aria react-aria-components
```

### Styles and cascade layer

```ts
import 'oniva-ui/styles.css'; // required, once, at your app entry
```

The stylesheet wraps everything in `@layer oniva { ... }`, so unlayered app CSS always wins over it. To order it against
other layers, declare the order first: `@layer reset, oniva, app;`.

### With vs without the StyleX compiler

- **Without** the compiler: use components and their props (`variant`, `size`, `className`, `style`). Done.
- **With** the compiler in your app: you may also pass `xstyle={stylex.create(...).x}` to override styles. `xstyle` accepts
  StyleX styles only and **requires** the compiler; without it the value is silently ignored or invalid. Use `className`/`style` otherwise.

## Usage

```tsx
import 'oniva-ui/styles.css';
import { ThemeProvider, Button, Card, CardHeader, CardTitle, CardContent, Tile } from 'oniva-ui';

export function App() {
  return (
    <ThemeProvider theme="system" accent="violet">
      <Card>
        <CardHeader>
          <CardTitle>Total steps</CardTitle>
        </CardHeader>
        <CardContent>
          <Tile>12,480</Tile>
        </CardContent>
      </Card>
      <Button onPress={() => console.log('hi')}>Save</Button>
    </ThemeProvider>
  );
}
```

`ThemeProvider` applies the theme classes to a wrapper `div` and routes React Aria portals (popovers, modals) into it, so
overlays inherit the same tokens. `useTheme()` returns `{ theme, resolvedTheme, accent, setTheme, setAccent }`.

## Theming

Built in: `theme="light|dark|system"` and `accent="blue|violet|pink|red|amber|emerald|cyan|indigo"` on `ThemeProvider`.

Custom brand colors use StyleX `createTheme` against the token groups (`accent`, `colors`, `shadow`); token keys are the stable `--oniva-*` names (e.g. `{ "--oniva-accent-500": "#7c3aed" }`). This needs the StyleX
compiler in _your_ app and the `*.stylex.ts` token sources (monorepo / source consumption; see `apps/docs`):

```ts
import * as stylex from '@stylexjs/stylex';
import { accent } from '@oniva-tokens/accent.stylex';

// values must be literals; any file may call createTheme, only defineVars needs *.stylex.ts
export const brand = stylex.createTheme(accent, {
  '--oniva-accent-500': '#7c3aed',
  '--oniva-accent-600': '#6d28d9',
});
// <ThemeProvider xstyle={brand}> ... </ThemeProvider>
```

The accent ramp (`--oniva-accent-50`..`--oniva-accent-950`) lives in its **own** var group, so an accent theme composes with `dark`.

### Theming with CSS variables

Every design token is a plain CSS custom property with a **stable public name** (`--oniva-*`). You can override them in ordinary CSS, with no StyleX compiler. Light values are set on `:root`; dark and accent themes override the same names on the ThemeProvider wrapper, and the library CSS lives in a cascade layer, so unlayered consumer CSS always wins on specificity ties. Scope your overrides at least as specifically (e.g. `[data-oniva-theme]`).

```css
:root {
  --oniva-accent-500: #e11d48;
  --oniva-radius-md: 4px;
}
[data-oniva-theme='dark'] {
  --oniva-color-bg: #000;
}
```

Groups: Colors (`--oniva-color-*`), Accent ramp (`--oniva-accent-*`), Radius, Shadow, Space, Font, Motion.

<details><summary>Colors (`--oniva-color-*`) (83)</summary>

`--oniva-color-bg`, `--oniva-color-surface`, `--oniva-color-surface-hover`, `--oniva-color-surface-active`, `--oniva-color-surface-inner`, `--oniva-color-surface-inset`, `--oniva-color-surface-inset-hover`, `--oniva-color-surface-tertiary`, `--oniva-color-surface-tertiary-hover`, `--oniva-color-overlay`, `--oniva-color-border`, `--oniva-color-border-hover`, `--oniva-color-border-active`, `--oniva-color-border-control`, `--oniva-color-separator`, `--oniva-color-focus-ring`, `--oniva-color-text`, `--oniva-color-text-muted`, `--oniva-color-text-on-tertiary`, `--oniva-color-text-subtle`, `--oniva-color-text-disabled`, `--oniva-color-text-placeholder`, `--oniva-color-text-error`, `--oniva-color-icon-muted`, `--oniva-color-icon-subtle`, `--oniva-color-kbd-bg`, `--oniva-color-kbd-fg`, `--oniva-color-accent-fg`, `--oniva-color-on-solid`, `--oniva-color-on-chart`, `--oniva-color-overlay-hover`, `--oniva-color-accent-soft`, `--oniva-color-accent-soft-hover`, `--oniva-color-accent-soft-active`, `--oniva-color-accent-soft-fg`, `--oniva-color-accent-soft-disabled`, `--oniva-color-accent-soft-disabled-fg`, `--oniva-color-accent-tint`, `--oniva-color-disabled-from`, `--oniva-color-disabled-to`, `--oniva-color-disabled-fg`, `--oniva-color-danger-from`, `--oniva-color-danger-to`, `--oniva-color-danger-hover-from`, `--oniva-color-danger-hover-to`, `--oniva-color-danger-active-from`, `--oniva-color-danger-active-to`, `--oniva-color-error-bg`, `--oniva-color-error-border`, `--oniva-color-success-bg`, `--oniva-color-success-fg`, `--oniva-color-success-solid`, `--oniva-color-success-halo`, `--oniva-color-warning-bg`, `--oniva-color-warning-fg`, `--oniva-color-warning-solid`, `--oniva-color-warning-halo`, `--oniva-color-danger-bg`, `--oniva-color-danger-fg`, `--oniva-color-danger-solid`, `--oniva-color-danger-halo`, `--oniva-color-info-bg`, `--oniva-color-info-fg`, `--oniva-color-info-solid`, `--oniva-color-info-halo`, `--oniva-color-cyan-bg`, `--oniva-color-cyan-fg`, `--oniva-color-orange-bg`, `--oniva-color-orange-fg`, `--oniva-color-purple-bg`, `--oniva-color-purple-fg`, `--oniva-color-chart-1`, `--oniva-color-chart-2`, `--oniva-color-chart-3`, `--oniva-color-chart-4`, `--oniva-color-chart-5`, `--oniva-color-chart-6`, `--oniva-color-chart-7`, `--oniva-color-chart-8`, `--oniva-color-chart-9`, `--oniva-color-chart-10`, `--oniva-color-chart-track`, `--oniva-color-chart-cursor`

</details>

<details><summary>Accent ramp (`--oniva-accent-*`) (11)</summary>

`--oniva-accent-50`, `--oniva-accent-100`, `--oniva-accent-200`, `--oniva-accent-300`, `--oniva-accent-400`, `--oniva-accent-500`, `--oniva-accent-600`, `--oniva-accent-700`, `--oniva-accent-800`, `--oniva-accent-900`, `--oniva-accent-950`

</details>

<details><summary>Radius (9)</summary>

`--oniva-radius-xs`, `--oniva-radius-sm`, `--oniva-radius-md`, `--oniva-radius-lg`, `--oniva-radius-xl`, `--oniva-radius-card`, `--oniva-radius-xxl`, `--oniva-radius-xxxl`, `--oniva-radius-full`

</details>

<details><summary>Shadow (10)</summary>

`--oniva-shadow-card`, `--oniva-shadow-xs`, `--oniva-shadow-sm`, `--oniva-shadow-md`, `--oniva-shadow-lg`, `--oniva-shadow-xl`, `--oniva-shadow-dropdown`, `--oniva-shadow-float`, `--oniva-shadow-accent-inset`, `--oniva-shadow-danger-inset`

</details>

<details><summary>Space (16)</summary>

`--oniva-space-0`, `--oniva-space-1`, `--oniva-space-2`, `--oniva-space-4`, `--oniva-space-6`, `--oniva-space-8`, `--oniva-space-10`, `--oniva-space-12`, `--oniva-space-16`, `--oniva-space-20`, `--oniva-space-24`, `--oniva-space-32`, `--oniva-space-40`, `--oniva-space-48`, `--oniva-space-64`, `--oniva-space-96`

</details>

<details><summary>Font (37)</summary>

`--oniva-font-sans`, `--oniva-font-mono`, `--oniva-font-size-11`, `--oniva-font-size-12`, `--oniva-font-size-13`, `--oniva-font-size-14`, `--oniva-font-size-16`, `--oniva-font-size-18`, `--oniva-font-size-20`, `--oniva-font-size-24`, `--oniva-font-size-32`, `--oniva-font-size-40`, `--oniva-font-size-48`, `--oniva-font-size-56`, `--oniva-font-size-64`, `--oniva-font-size-72`, `--oniva-font-lh-11`, `--oniva-font-lh-12`, `--oniva-font-lh-13`, `--oniva-font-lh-14`, `--oniva-font-lh-16`, `--oniva-font-lh-18`, `--oniva-font-lh-20`, `--oniva-font-lh-24`, `--oniva-font-lh-32`, `--oniva-font-lh-40`, `--oniva-font-lh-48`, `--oniva-font-lh-56`, `--oniva-font-lh-64`, `--oniva-font-lh-72`, `--oniva-font-weight-regular`, `--oniva-font-weight-medium`, `--oniva-font-weight-semibold`, `--oniva-font-weight-bold`, `--oniva-font-track-caption`, `--oniva-font-track-label`, `--oniva-font-track-hero`

</details>

<details><summary>Motion (6)</summary>

`--oniva-motion-dur-fast`, `--oniva-motion-dur-base`, `--oniva-motion-dur-slow`, `--oniva-motion-ease-standard`, `--oniva-motion-ease-in`, `--oniva-motion-ease-out`

</details>

The list is enforced by `packages/oniva-ui/src/tokens/stable-vars.test.ts` against `dist/oniva-ui.css`. Renaming a variable is a breaking change.

## Development

```bash
npm install
npm run dev        # docs site at http://localhost:5173
npm run gen:index  # regenerate packages/oniva-ui/src/index.ts
npm run typecheck && npm run lint && npm run test
npm run build      # library (dist/index.js, dist/oniva-ui.css, .d.ts) then docs
npm run e2e        # Playwright + axe against the built docs
npm run ci         # everything
```

## Structure

```
packages/oniva-ui/   the library (src/tokens, src/themes, src/components|charts|ai|widgets/<Name>/…)
apps/docs/           Vite + React showcase; demos auto-discovered from *.demo.tsx
e2e/                 Playwright + axe tests
docs/                plans, research, and docs/solutions (compound learnings)
```

## Contributing

This repo follows the compound-engineering loop: **plan → work → review → compound**. Read `AGENTS.md` first, then the latest
plan in `docs/plans/` and the relevant notes in `docs/solutions/`. Add a component by copying `components/Button/`
(see the recipe in `AGENTS.md`). When you learn something non-obvious, write it down in `docs/solutions/`.

## License

[MIT](./LICENSE) © 2026 Bala Chander Rallabandi
