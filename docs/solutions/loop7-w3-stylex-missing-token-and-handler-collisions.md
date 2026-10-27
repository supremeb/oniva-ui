---
title: StyleX token typos are silent in tests; DOM handler names collide with callback props
date: 2026-10-26
area: ai
tags: [stylex, tokens, typescript, loop7]
---

- A misspelled token key (`colors['--oniva-color-accent-solid']`) renders as `undefined` in Vitest and compiles fine in the dev server;
  only `tsc` catches it. Accent solid lives in `accent['--oniva-accent-solid']` (`tokens/accent.stylex`), radii top out at `--oniva-radius-xxl`,
  there is no `border-strong` / `warning-soft` / `accent-subtle`. Always run `tsc` after adding styles, not just vitest.
- Props named `onCopy` / `onPause` collide with `HTMLAttributes` handlers; `Omit` them when extending `HTMLAttributes<HTMLDivElement>`.
- `vite ... | head` kills the dev server when head exits; start it detached (`nohup ... &`) and write the log to a file.
- An Aside `page.screenshot({path})` must stay in the session dir; take the buffer and `fs.writeFile` it elsewhere.
- Hash-route navigation in the docs: set `location.hash`, `page.goto` on same-document URLs times out.
