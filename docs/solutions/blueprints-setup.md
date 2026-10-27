# Blueprints (spec posters): setup and how to add one

A blueprint is an A4 poster showing the real component frozen mid-motion with its measured durations, curves and sizes
(the `interface-bts` skill, `.claude/skills/interface-bts/`). All posters live in the docs app:

- `#/specs` shows every registered poster in one sideways strip (`SpecStrip`, with its toolbar: paper, accent,
  light/dark, portrait/landscape, Inter/handwritten).
- `#/specs/<slug>` shows one poster alone (use this while building). `#/specs/_example` is the pipeline proof (copy
  button driving `CopyButton`); it is route-only, not in the strip.
- Both routes skip the docs header (same as `/canvas`). The "Specs" link is in the main header nav.

## Layout

```
apps/docs/src/specs/
  kit/                 vendored interface-bts kit (MIT, kit/LICENSE travels with it). Do not edit.
  registry.ts          SPEC_ACCENTS + ordered `posters` list + route-only posters
  types.ts             SpecProps = { theme: 'light' | 'dark' }
  SpecsPage.tsx        the two routes
  _example/CopyButtonSpec.tsx
  <slug>/<Name>Spec.tsx     one folder per poster
```

Kit notes: the kit files carry `// @ts-nocheck` (it is not written against `noUncheckedIndexedAccess`) and are in the
ESLint ignores. Only changes vs the skill's copy: `process.env.NODE_ENV` became `import.meta.env.DEV`; `SPEC_ACCENTS`
in `spec-kit.tsx` starts empty and the accent evenness check is now the exported `checkAccentsEven()`, called by the
registry after it fills the kit's map. A `*.module.css` declaration is in `apps/docs/src/env.d.ts`.

## Theme

`App.tsx` owns the theme (`oniva-theme` in localStorage: light | dark | system). `SpecsPage` resolves it to light|dark
(system via `matchMedia`) and passes `theme` plus `onTheme={setTheme}` to `SpecStrip`, so the strip's toggle changes the
docs theme. Each poster receives `theme` as a prop, passes it to `SpecPage theme={theme}`, and is mounted with
`key={slug-theme}` so a change redraws it and re-captures the moments. The real components inside the subject follow the
docs `ThemeProvider`, so they match.

## Add a poster (steps)

1. Read `.claude/skills/interface-bts/SKILL.md`, `references/drafting.md`, `references/drivers.md`, and copy
   `_example/CopyButtonSpec.tsx` as the starting shape. Agree headline / hero moment / 3 moments / 2 to 4 callouts /
   figure 2 first (SKILL steps 1 and 2).
2. Create `apps/docs/src/specs/<slug>/<Name>Spec.tsx` exporting `function <Name>Spec({ theme }: SpecProps)`. Import from
   `../kit/spec-kit` and `../kit/spec.module.css`. Render the real component from `oniva-ui` (never a copy). Pass
   `accent="<slug>"` and `theme={theme}` to `SpecPage`.
3. Register it in `registry.ts`: import the component, and add `{ slug, name, accent, Component }` to `posters` (keep
   the order of the plan). `accent` must equal the colour already in `SPEC_ACCENTS[<slug>]`.
4. Open `http://localhost:<port>/#/specs/<slug>`, then `#/specs`.

## Accent rules

One of the kit's `SYSTEM` names (red, orange, yellow, green, mint, teal, cyan, blue, indigo, purple, pink, brown),
unique per poster. Pre-assigned: button=blue, switch=green, checkbox=mint, segmented-control=indigo, tabs=teal,
tooltip=orange, popover=purple, dialog=pink, accordion=cyan, toast=yellow. Free: red (used by `_example`, release it
when a real poster needs it), brown. After twelve, reuse the least-used one. The kit throws in dev if counts get uneven or
if a poster's `accent` key is missing from `SPEC_ACCENTS`.

## Gotchas

- Components placed by floating-ui (tooltip, popover, dialog, toast) or fixed to the window need the drivers.md
  treatment: transform scale in a sized box instead of `zoom`, render in place (no portal), non-modal, dispatch events on
  the subject only.
- If the component keeps state in React (like `CopyButton`), reset by remounting via a `key` in `setup` (see the example)
  and give it a huge auto-reset timer so it does not revert under the held frame.
- Use `pick` in `useTransitionSpec` to hold only the component's own animations, not hover or focus transitions.
- Do not write claims about reduced motion without reading them from the component.

## Verify

1. `npm run typecheck`, `npx eslint apps/docs/src/specs`.
2. Dev server on your port, open `#/specs/<slug>` and `#/specs` at 1280x800, 1000x760 and 1030x1044. Check the console
   is clean and the poster shows `data-settled="true"`.
3. Paste `.claude/skills/interface-bts/scripts/overlaps.js` into the page (browser console or `page.evaluate`) and run
   `await btsPosterOverlaps()`: it must return `[]`. Repeat for each moment, in landscape and with the handwritten type
   (`#/specs?layout=landscape&font=hand`, scroll each poster into view first).
4. Image capture: `node .claude/skills/interface-bts/scripts/capture.mjs http://localhost:<port>/#/specs --themes light,dark --scale 2 --out specs-out`
   needs Playwright Chromium, which is blocked on the locked-down Mac. Run it in CI or on a real machine; in the sandbox
   take a browser screenshot instead. The docs theme is stored in localStorage, so pass
   `--theme-init "localStorage.setItem('oniva-theme', THEME)"`. Note the strip's settings ride in the real query string
   (before the `#`), e.g. `http://localhost:5301/?layout=landscape#/specs`.
