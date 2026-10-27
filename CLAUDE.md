# CLAUDE.md — oniva-ui

Read `AGENTS.md` first (stack, hard rules, API conventions, motion and color rules, commands). This file adds release,
versioning and content rules.

## Versioning (Semantic Versioning)

- The version lives in three files and must always match: `package.json`, `packages/oniva-ui/package.json`,
  `apps/docs/package.json` (and their entries in `package-lock.json`).
- While the major is 0:
  - **Minor** (0.x.0): new components, new groups, or new opt-in props/variants. Existing defaults and APIs unchanged.
  - **Patch** (0.x.y): bug fixes, styling fixes, docs only. No API changes.
  - A breaking change (renamed/removed export or prop, changed default) needs a minor bump AND a "Breaking" section in the
    changelog with the migration.
- Every release that ships to `main` gets a version bump, a `CHANGELOG.md` entry and a git tag. Never push an unversioned
  release.
- Docs page `version` (`apps/docs/src/content/components/*.tsx`) means "available since". New pages use the release they
  ship in; never rewrite older pages' versions on a bump.

## Release checklist

1. `npm run gen:index && npm run typecheck && npm run lint && npm test && npm run build` (export `NAPI_RS_FORCE_WASI=1`
   on the locked-down Mac). All green.
2. Bump the version in all three `package.json` files and `package-lock.json`.
3. Add a `CHANGELOG.md` entry at the top: `## x.y.z — YYYY-MM-DD` with Added / Changed / Fixed / Removed (and Breaking).
4. Commit `chore(release): vX.Y.Z`, then tag it: `git tag -a vX.Y.Z -m "oniva-ui vX.Y.Z"`.
5. Push the commit and the tag together: `git push origin main --follow-tags`. Pushing `main` deploys design.oniva.ai
   (Vercel project `oniva-design`); CI runs the Playwright e2e suite.
6. After a release, re-pack the tarball consumed by oniva.ai (`npm pack -w oniva-ui`, copy into `oniva-site/vendor/`)
   when the site needs the new version. Nothing is published to npm yet.

## Content rules

- Demo data is fictional: no real company or product brands (use names like Northwind Labs, `*.example` domains, neutral
  monogram tiles or lucide icons) and no real AI model vendors (use Atlas 2, Nova Pro, Lumen Fast, Quill Reasoner).
  Oniva copy says "model-agnostic".
- Do not reference other UI libraries or their sites anywhere in the repo (code, comments, docs, plans, commit messages).
  Write original code only.
- The Illustrations group is disabled: excluded in `packages/oniva-ui/scripts/gen-index.mjs` and `apps/docs/src/demos.ts`.
  Re-enable in both places when it is ready.
