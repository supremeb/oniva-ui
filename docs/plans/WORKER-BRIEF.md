# Worker brief (all parallel loops)

Repo: /Users/balachander/.aside/runtime/home/code/oniva-ui (5+ agents edit this tree concurrently)

Compound-engineering loop: follow the intent of ce-work in **Return-to-Caller Mode**
(/Users/balachander/.aside/runtime/home/code/compound-engineering-plugin/skills/ce-work/SKILL.md):
implement + verify locally; NO git commits/branches/pushes; no blocking questions — decide and note assumptions.

## Read first

AGENTS.md · docs/plans/ (v0.1 plan + your loop plan) · ALL of docs/solutions/ · docs/research/design-language.md ·
docs/research/coverage.md (your rows) · the exemplars: packages/oniva-ui/src/components/{Button,Card,Input,Badge}/ ·
screenshots in docs/research/boardui-shots/ (look at them).

## Sandbox rules (critical — this machine blocks native binaries)

- NEVER run `npm install`/`npm i`/`npm ci` (it breaks a WASM shim). All deps are installed: react-aria-components,
  react-aria, react-stately, @internationalized/date, lucide-react, @tanstack/react-table v8, d3-scale, d3-shape,
  d3-array, d3-sankey, marked. If you truly need another dep, stop and report it instead.
- `export NAPI_RS_FORCE_WASI=1` before any vite/vitest command.
- Do NOT run `npm run build`, `npm run gen:index`, `npm run format`, or prettier/eslint --fix on the whole repo
  (other agents are mid-edit). The orchestrator runs builds.
- Verify with: `npx tsc --noEmit -p packages/oniva-ui/tsconfig.json` (ignore errors in other groups' folders),
  `npx eslint <your folders>`, `npx vitest run <your folders>` (vitest may hang ~10s at exit; that's known).
- Visual check: the docs dev server can be started on YOUR assigned port only:
  `cd apps/docs && NAPI_RS_FORCE_WASI=1 npx vite --port <PORT> --strictPort` then open
  http://localhost:<PORT>/#/components/<slug> in a browser tab (openTab) and screenshot; close the tab and stop the server when done.
- Stay inside your assigned folders. Shared helpers: create NEW files in packages/oniva-ui/src/internal/ prefixed with your group.

## Quality bar

BoardUI-grade polish: nested surfaces (gray card #f7f7f7 → white tiles), 10px control radius, 36px md controls, gradient
accent primaries, subtle hairline shadows, Inter 500 UI labels, tabular numerals for numbers, 150ms transitions, visible
focus rings, full dark mode. Realistic dashboard demo content (names, dates, $ amounts, statuses), no lorem ipsum.
Each component: RAC-based where applicable, React 19 ref prop, `xstyle`, tokens only (no hard-coded colors except
inside tokens), `.demo.tsx` (2–4 demos with `code` strings), `.test.tsx`. Export public API from the folder `index.ts`.

## Compound

At the end, if you hit a NON-OBVIOUS lesson (StyleX/RAC gotcha, pattern decision), write ONE short doc to
docs/solutions/<group>-<topic>.md (frontmatter: title, date, area, tags). Skip if nothing qualifies.

## Report (<=20 lines)

Components built (by folder), helper files added, verification results, screenshots taken (paths), known issues.

## Loop 5 additions (motion + coverage)
- Read AGENTS.md "Motion rules", docs/solutions/motion-system-stylex.md, and use src/motion/ primitives (Presence, AnimatedHeight,
  SlidingIndicator, usePressScale/motionStyles.pressScale, AnimatedNumber, Stagger, useInView, TextReveal, Shimmer, CrossFade) and
  internal/motion-styles.ts (originAware, enterExit presets) + internal/motion-hooks.ts (useReducedMotion). No new dependencies.
- Bar = Emil Kowalski skills: /Users/balachander/.aside/runtime/home/code/emilkowalski-skills/skills/{emil-design-eng,animate,review-animations,animation-performance}/SKILL.md
  (+references). Before reporting, run a review-animations self-review over everything you animated and fix violations; include a 3–6 line
  summary of that review in your report.
- Up to 8 agents edit concurrently. Make surgical edits (re-read a file right before editing it; never rewrite whole files you didn't create).
- Real-browser a11y: on each page you touched, inject axe-core (fs read node_modules/axe-core/axe.min.js → page.evaluate) and run
  axe.run(document, {runOnly:['wcag2a','wcag2aa']}); zero serious/critical in light AND dark.
