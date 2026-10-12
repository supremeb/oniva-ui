# Loop 6 doc-writer brief (applies to every writer)

Repo: /Users/balachander/.aside/runtime/home/code/oniva-ui. You write ONLY new files
apps/docs/src/content/components/<slug>.tsx (one per assigned slug). Never edit other files: the platform agent owns
apps/docs/** otherwise; fix workers own packages/oniva-ui/**. If the DocPage contract lacks something, use a
`sections: [{ kind: 'custom', ... }]` block and note it in your report. NEVER npm install; NAPI_RS_FORCE_WASI=1.

Read first: docs/plans/docs-authoring-guide.md, apps/docs/src/content/types.ts, the 3 exemplars
(content/components/{command-palette,button,select}.tsx), the component's source + index.ts + .demo.tsx + .test.tsx,
tokens (packages/oniva-ui/src/tokens/*.stylex.ts) for exact measurements, the owner's reference screenshots
(/Users/balachander/.aside/u/0/sessions/2026-10-12_9lsnky5MndhDNdN8/attachments/*.png — open them with read_file),
and the writing bar: /Users/balachander/.aside/runtime/home/code/jakubkrehel-skills/skills/better-writing/SKILL.md.

DEPTH BAR (the exemplars are a MINIMUM; the reference screenshots are the target):
1. lede: one or two sentences: what it is + the moments it handles.
2. Anatomy: real live instance in a meaningful state; 4–8 numbered parts, each anchored by a CSS selector you
   VERIFIED against the rendered DOM (role/aria/data attrs/tag; avoid hashed StyleX classes); each part = name +
   1–2 lines with exact specs from tokens (height, radius, padding, font size/weight, color token, behaviour).
   Intro line counts the parts and says which are optional ("Five parts. The label and field are always present…").
3. Usage: 3–4 "Use it for" + 3–4 "Don't use it for", every "don't" names the alternative component (linked slug).
4. Playground: ≥3 meaningful controls (variant/size/state/text with preset chips/toggles), initial values defined
   for every control (no `undefined`), onEvent wiring for callbacks so LAST EVENT shows real events, code(props)
   generates minimal correct JSX (omit defaults).
5. All states: ≥4 locked live instances (default, hover/focus-visible or pressed where meaningful, disabled,
   invalid/error, loading, empty, long content, RTL if layout-sensitive), each with a one-line caption.
6. Guidance: at least TWO of: numbered rules (1/2/3 cards like "Can't find it"), rule cards, Do/Don't pairs (prefer
   live mini examples), item types/variants matrix, composition recipes (how it combines with other components).
7. Content: 3–6 writing rules specific to this component (labels, errors, empty text, casing, length limits).
8. Accessibility: keyboard table (every key the component handles), roles/ARIA, screen-reader output, focus
   behaviour, reduced motion, touch target notes. Facts must match the actual implementation (RAC docs if needed).
9. API: complete props table from the source types (name, type, default, description); sub-components get their own
   table rows or a separate block.
10. Related: 3–5 slugs.
Voice: short, specific, numbers from tokens, no filler ("simply", "easily", "seamless"), no em dashes, sentence case.
Realistic data consistent with the demos (no lorem). Never mention Claude/Anthropic.

VERIFY each page: `npx tsc --noEmit -p apps/docs` (your files clean), `npx eslint apps/docs/src/content/components/<your files>`.
Every ~6 pages: `cd apps/docs && npx vite build` then preview on YOUR port and open the pages in a browser tab:
markers land on the right parts, playground works, no console/page errors, inject axe-core
(node_modules/axe-core/axe.min.js) → zero serious/critical. Close tabs at the end.
Report (<=12 lines): pages written, any selectors that needed fallbacks, contract gaps, library bugs noticed.
