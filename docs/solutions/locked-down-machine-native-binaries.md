---
title: Running the toolchain when native binaries are blocked (macOS policy)
date: 2026-10-12
area: tooling
tags: [rolldown, lightningcss, playwright, macos, sandbox]
---

Symptom: `Cannot find native binding` from rolldown/vite 8/vitest 5 even after a clean `npm install`. Root cause on the agent
machine: macOS policy ("library load disallowed by system policy") rejects, and a scanner deletes, unsigned `.node` addons
(`@rolldown/binding-darwin-arm64`, `lightningcss-darwin-arm64`) and the Playwright headless-shell executable. CI (ubuntu) is unaffected.

Local workaround that works (nothing committed; node_modules only):

1. `npm i --no-save --force @rolldown/binding-wasm32-wasi@<rolldown version> lightningcss-wasm@<lightningcss version>`
2. Shim lightningcss (the StyleX unplugin hard-requires it, and Vite 8 uses it for CSS minify):
   `node_modules/lightningcss/node/index.js` -> `module.exports = require('lightningcss-wasm')`,
   `node_modules/lightningcss/node/index.mjs` -> `export * from 'lightningcss-wasm'`.
3. `export NAPI_RS_FORCE_WASI=1` for every vite/vitest/playwright command.
4. A `.browserslistrc` at the repo root stops Babel/browserslist from walking up into unreadable parent directories (EPERM).
5. Re-run steps 1-2 after every `npm install` (it prunes `--no-save` packages and restores the real lightningcss files).

Vitest may print "Cannot find dependency 'jsdom'" (EPERM resolving a parent package.json) and hang ~10s on exit; tests still run
and pass. If the Playwright browser is killed on launch, e2e cannot run on that machine: run axe against `vite preview`
through any other browser, and rely on CI for `npm run e2e`.
