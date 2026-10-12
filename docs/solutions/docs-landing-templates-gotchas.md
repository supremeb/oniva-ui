# Docs landing + templates: gotchas (loop 3, group I)

- **Reuse the demo registry for previews.** `apps/docs/src/components/Preview.tsx` renders `getDemo(slug).demos[0].Component` inside an `inert` + `pointer-events:none` box. Counts on the landing (`lib/site.ts`) are computed from `demoModules`, never hard-coded in JSX (meta/OG text is static, update by hand).
- **Chart datasets are not exported from `oniva-ui`.** Docs import them by relative path (`packages/oniva-ui/src/charts/_data/datasets`), same as `demos.ts` does for types.
- **ChartFrame sr-only table caused page-level horizontal scroll.** A `position:absolute; width:1px` `<table>` still lays out at its caption width and can extend the document. Fixed by putting the `srOnly` style on a wrapper `<div>` (table inside). Any new visually-hidden table needs the wrapper.
- **Templates need a height-bound parent.** `LayoutShell` is `height:100%`; `TemplatePage` gives it `calc(100vh - 57px)` (header height). Non-template routes keep the 1120px container, so `App` renders `<main>` per route.
- **No lucide brand icons** (GitHub was removed): `components/GithubIcon.tsx` inlines the mark.
- **Accent token is `accent['--oniva-accent-500']`** (from `accent.stylex`), not in `colors`.
- **Browser verification at a width**: the REPL cannot resize the window; load the route in an `<iframe style="width:390px">` on the same origin (media queries follow the iframe). Hash router: `src=/#/route`.
- `LinkButton` defaults to `secondary`; set `variant="primary"` for the main CTA.
