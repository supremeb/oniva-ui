# Loop 6 fix brief (3 parallel fix workers, disjoint file ownership)

Inputs: docs/reviews/loop6-{a11y,type-color,ui-layout,writing}.md. Skills (bar): ~/code/jakubkrehel-skills/skills/*.
Apply every P0 and P1 in YOUR files; apply P2 when cheap and safe. Record each finding as fixed/deferred(+why)
in docs/reviews/loop6-fixes-<worker>.md.

SAFETY RULES (non-negotiable)
- Public API frozen: no renamed/removed props, exports, or token NAMES. Additive optional props are OK
  (e.g. `labels`, `locale`, `currency`) with backwards-compatible defaults.
- Token VALUE changes allowed (contrast fixes). Do NOT convert px size/line-height tokens to rem/unitless this loop
  (consumers may calc() with them) — fix leading/tracking values in px/em only; mark unit migration P2-deferred.
- Stay inside your owned paths. Re-read a file right before editing it. Surgical edits only.
- Shared helper already exists: packages/oniva-ui/src/internal/format.ts (pluralize, useFormatters, createFormatters).
  Use it for plurals, numbers, currency, dates. Don't create competing helpers.
- NEVER npm install; export NAPI_RS_FORCE_WASI=1; don't run gen:index/format on the whole repo.
- A docs-platform agent is editing apps/docs/** concurrently — never touch apps/docs.
- Verify after each batch: npx tsc --noEmit -p packages/oniva-ui/tsconfig.json (your files clean),
  npx eslint <your paths>, npx vitest run <your paths>. Update tests only when behaviour intentionally changed.
