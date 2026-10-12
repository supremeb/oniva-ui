---
title: Docs authoring guide (loop 6)
status: active
---

Follow this verbatim. Exemplars: `apps/docs/src/content/components/{command-palette,button,select}.tsx`.

## The contract
- One file per component: `apps/docs/src/content/components/<slug>.tsx`, `export default` a `DocPage` (`content/types.ts`). The contract is frozen except additive optional fields. Latest additive field: `ControlDef.group` (optional playground panel section label).
- `slug` must equal the demo `meta.slug`. Discovery is `import.meta.glob`; nothing to register.
- Edit only `apps/docs/**` and `docs/`. Never edit `packages/oniva-ui/**`; if a library bug blocks you, note it in your report.
- Routes are hash routes: `/#/components/<slug>`. Docs routes (getting-started, foundations, components, patterns) use the docs shell: one sidebar brand, a sticky search, a tick rail between nav and content, and a compact top-right utility cluster (quick search, accents, GitHub, theme). `/`, `/charts` and `/templates/*` keep the marketing header.
- The page renders: breadcrumb, h1 (demo title), lede, meta strip (status dot, version, `<Import>` chip, Source, Copy link), then h2 sections with stable ids: `anatomy, usage, playground, states, <your sections>, content, accessibility, api, examples, related`. Existing demos render last as "Examples" (`data-testid="demo"`); do not remove them.
- Content column is 880px max. Do not set your own widths wider than that; stage content must fit about 540px (anatomy) or 380px (state cell).

## Depth bar (reference quality, every page)
The three exemplars (`command-palette`, `button`, `select`) are the minimum, not the target. Match the owner's reference: four moments, exact specs, real guidance.
1. **lede**: one or two sentences. What it is, plus the moments it handles ("It handles four moments: before you type, while you type, after you choose, and when nothing matches.").
2. **anatomy**: a real instance, 6 to 8 numbered parts with exact token specs (height, radius, padding, size/weight, color token, behaviour). Intro counts the parts and names the optional ones. Marker leaders are drawn automatically from your selectors.
3. **usage**: 3 to 4 "Use it for" and 3 to 4 "Don't use it for". Every "don't" links its alternative.
4. **playground**: 3 or more controls. Every control needs a value in `initial` (a dev console error names the page and key if not). Controls render as real oniva-ui components in a right panel under uppercase labels: State (segmented, select), Content (text, number), Options (toggle). Use `group: 'Query'` or any label to override. Wire `onEvent` so LAST EVENT shows real events. `code(props)` emits minimal JSX, omitting defaults.
5. **states**: 4 or more locked instances, each with a one-line caption. Prefer real states (disabled, invalid, loading, empty, long content) over variants.
6. **guidance**: two or more of: `numbered` (1/2/3 cards, like "Can't find it"), `rules` (cards), `dodont` (live mini examples), `itemTypes` (variants matrix), composition recipes. For input components include a "Can't find it" or error-recovery numbered section with 3 rules and 3 rule cards.
7. **content**: 3 to 6 writing rules specific to the component.
8. **accessibility**: the full keyboard table (every key handled), roles and ARIA, screen reader behaviour, focus, reduced motion, touch target size. Facts must match the implementation.
9. **props**: complete, from the source types: name, type, default, description. Sub-components get rows prefixed `Name: prop`.
10. **related**: 3 to 5 slugs that exist.

## Voice
- Short, specific, numbers from tokens ("36px tall, 10px radius"), no filler ("simply", "easily", "seamless"), no hedging, no em dashes in copy.
- Sentence case. Verb-first labels. "Don't use it for" always names the alternative (`instead: {slug, label}`).
- Measurements come from the code (`stylex.create` values and tokens), never from memory. Check them. (Examples: Select md is 38px, Button lg is 40px, Button default variant is primary.)
- Realistic data consistent with the demos. No lorem.

## Section types
- `rules`: unnumbered cards. `numbered`: cards with a number tile. Three items lay out in one row.
- `dodont`: pairs of cards with check / x icon. Prefer `example` (a live mini component) over `text`.
- `itemTypes`: captioned live instances (variants, sizes, row types).
- `custom`: your own `Render`. Use only when none of the above fit, and note it in your report.
- Foundations and patterns are `StaticPage`s in `content/static.tsx`; shared building blocks (hue ramps, live semantic tokens, side-by-side light/dark contrast ratios, type scale) live in `content/foundations.tsx`. Pattern pages need at least 4 sections of real guidance.

## Required sections by type
- Interactive control (Forms, Actions): anatomy, usage, playground, states (default, disabled, invalid, loading, selected), rules or do/dont, content, keyboard table, props.
- Overlay (Dialog, Popover, Menu): anatomy with a locked composed stage if the real overlay cannot be inlined (say so in a code comment), usage, playground (mount the real overlay behind a button), keyboard incl. Esc + focus return, reduced-motion note.
- Display (Data display, Charts, Widgets): anatomy of the real instance, states (empty, loading, populated, error), a11y notes (roles, table fallback).
- Layout and typography: anatomy, usage, variants (`itemTypes`), props.

## Anatomy selectors
1. Render the real component in the stage (wrapped in `inert` automatically). Open the page, inspect the DOM.
2. Prefer, in order: ARIA role (`[role="option"][aria-selected="true"]`), data attribute (`[data-selected]`, `[slot="description"]`), element + structural pseudo (`button svg:last-of-type`), last resort a class from `stylex` (hashed, avoid). Overlay stages compose roles and `data-part` attributes themselves.
3. Every part needs one selector that matches exactly one visible element inside the stage. Add `fallback: {x,y}` (% of stage) for parts that sometimes do not render.
4. A part whose box covers the whole component is treated as the container: its marker sits top-left.
5. The measure re-runs on resize and DOM change; do not hard-code pixels. Hovering a legend row rings the part and lights its leader and marker.

## Verify a page
1. `export NAPI_RS_FORCE_WASI=1; cd apps/docs && npx tsc --noEmit && npx eslint . && npx vite build` (never `npm install`).
2. `npx vite preview --port 4400 --strictPort`, open `/#/components/<slug>` at 1440 dark and light, and in a 390px iframe. Hover each legend row.
3. Inject `node_modules/axe-core/axe.min.js`, run wcag2a/wcag2aa, zero serious/critical, in both themes (wait 300ms).
4. No console/page errors. Do not call state setters during render (`onEvent` is for handlers only).
5. `npx tsc --noEmit -p e2e`. Keep e2e hooks valid: one `h1`, `[data-testid=demo]` examples, `theme-toggle`, `home-component-grid`, `/components` index links.

## Checklist
- [ ] slug matches demo; status/version/importName/sourcePath correct
- [ ] 6 to 8 anatomy parts, every selector resolves, descriptions carry measurements
- [ ] usage has 3 to 4 each, every "don't" links
- [ ] playground: 3+ controls, all in `initial`, events wired, code compiles
- [ ] 4+ states, locked, captioned
- [ ] 2+ guidance sections (numbered / rules / dodont / itemTypes)
- [ ] 3 to 6 content rules
- [ ] keyboard table complete; notes cover roles, SR, focus, touch, reduced motion
- [ ] props complete and match the source
- [ ] related slugs exist
- [ ] typecheck, lint, build clean; axe clean; no em dashes
