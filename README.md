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

Custom brand colors use StyleX `createTheme` against the token groups (`accent`, `colors`, `shadow`). This needs the StyleX
compiler in _your_ app and the `*.stylex.ts` token sources (monorepo / source consumption; see `apps/docs`):

```ts
import * as stylex from '@stylexjs/stylex';
import { accent } from '@oniva-tokens/accent.stylex';

// values must be literals; any file may call createTheme, only defineVars needs *.stylex.ts
export const brand = stylex.createTheme(accent, { accent500: '#7c3aed', accent600: '#6d28d9' });
// <ThemeProvider xstyle={brand}> ... </ThemeProvider>
```

The accent ramp (`accent50`..`accent950`) lives in its **own** var group, so an accent theme composes with `dark`.
Stable, documented CSS variable names for compiler-free overrides are planned (see `docs/solutions/`).

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
