# Blueprint poster worker brief

Repo /Users/balachander/.aside/runtime/home/code/oniva-ui. Up to 4 workers run at once. Read, in order:
1. CLAUDE.md, AGENTS.md, docs/plans/WORKER-BRIEF.md (sandbox: never npm install; export NAPI_RS_FORCE_WASI=1; run tsc/eslint/vitest
   from the repo root; no commits).
2. .claude/skills/interface-bts/SKILL.md (the whole workflow is binding), references/drafting.md, references/drivers.md.
3. docs/solutions/blueprints-setup.md (how posters plug into the docs) and the working example
   apps/docs/src/specs/_example/CopyButtonSpec.tsx.

Your poster: one interaction of one oniva-ui component, built at apps/docs/src/specs/<slug>/<Name>Spec.tsx with the accent already
assigned in apps/docs/src/specs/registry.ts. The headline and moments were agreed with the owner (below each assignment); refine the
wording to what you actually measure. If the component behaves differently from the agreed headline, report what you measured
and make the poster tell the truth.

Rules:
- Figure 1 is the REAL oniva-ui component, imported from 'oniva-ui', driven by its own handlers and frozen by pausing its real
  animations (getAnimations/pause/currentTime). Every number comes from the running component or a named constant with its source.
  StyleX tokens resolve to CSS variables: read computed styles, never type values.
- Don't change the library component. If it fights the poster (portals, floating positioning, focus), follow references/drivers.md.
- registry.ts is shared: re-read it right before editing and only add your own entry (one import + one object). Don't touch the kit.
- Verify per SKILL.md step 5 as far as possible in a real browser on YOUR port: start the docs dev server
  (cd apps/docs && NAPI_RS_FORCE_WASI=1 npx vite --port <PORT> --strictPort, with yield), open http://localhost:<PORT>/#/specs/<slug>,
  pick each moment, paste .claude/skills/interface-bts/scripts/overlaps.js into the page (read the file, page.evaluate its source)
  and run btsPosterOverlaps() → must return []. Check portrait at 1280x800 at least; check landscape via
  http://localhost:<PORT>/?layout=landscape#/specs/<slug> and dark theme. Screenshot the poster and save it with fs.writeFile to
  /Users/balachander/.aside/runtime/home/code/_ref/blueprints/<slug>.png. Close tabs and stop the server.
- npx tsc --noEmit -p apps/docs (or npm run typecheck -w @oniva-ui/docs) and npx eslint apps/docs/src/specs/<slug> must be clean.
Report (<= 20 lines): headline as built, what was measured (with values), anything estimated, checks run / not run, screenshot path.
