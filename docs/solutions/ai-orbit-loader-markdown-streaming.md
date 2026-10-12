---
title: AI components - orbiting border loader, safe Markdown, auto-scroll chat
date: 2026-10-12
area: ai
tags: [stylex, keyframes, conic-gradient, marked, scroll, reduced-motion]
---

- **Orbiting border without `@property`**: StyleX can't register custom properties, so don't animate a `--angle`. Instead rotate an oversized square (`width: 240%`, `aspect-ratio: 1`, centered with `translate(-50%,-50%) rotate()`) holding a `conic-gradient`, clipped by an `overflow: hidden` ring layer, with the real surface inset on top (`ComposerLoader`). A blurred duplicate layer gives the glow. Set `animationName: { default: kf, '@media (prefers-reduced-motion: reduce)': 'none' }`.
- **Markdown**: `marked.lexer()` tokens -> React elements; `html` tokens render as literal text, links/images pass `safeUrl()` (http/https/mailto/#//). Tight list items contain `text` tokens whose nested `tokens` hold inline markup, so handle `text` in both block and inline walkers. Streaming partial markdown just works because the lexer tolerates incomplete tables/fences.
- **Auto-scroll chat**: never set CSS `scroll-behavior: smooth` on the log; programmatic scroll during streaming lags behind growth, `onScroll` then sees "not at bottom" and un-sticks (jump button appears, new content stops following). Keep it `auto` and pass `behavior: 'smooth'` only for the explicit jump button. Follow growth with a `ResizeObserver` on the inner content.
- **Fake timers + chained effects**: a streaming hook that re-schedules a timeout each render needs one `act(advanceTimersByTime)` per tick in tests; a single large advance only fires the first timer.
