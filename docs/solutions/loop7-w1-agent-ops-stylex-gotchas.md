---
title: Agent-ops components (loop 7 w1): StyleX + RAC gotchas
date: 2026-10-26
area: ai
tags: [stylex, keyframes, react-aria, popover, dnd]
---

- `stylex.keyframes` constants must live in the same file as the `stylex.create` that uses them. Importing one from a shared helper compiles in neither Babel nor the eslint rule ("Could not resolve the path to the imported file"). Shared helpers (`internal/w1-agent-ui.tsx`) expose finished style objects (`w1.sheen`, `w1.pulseRing`, `w1.spin`, `w1.rise`) instead of keyframes.
- RAC `<Dialog className>` takes a string, not a render function (unlike Button/Radio). `<Button className={() => ...}>` is fine.
- Never name a local `X`/`Y` helper in a file that imports lucide `X`: JSX silently binds to the local function and tsc reports a confusing size/props error.
- StyleX values must be literals or tokens: no template-string `color-mix(...)` for `backgroundColor`/`borderColor` (lint `valid-styles`). Put `color-mix` in `backgroundImage` or use a token.
- Never use `opacity` to "mute" text on cards (queued/undone/dimmed): axe color-contrast fails on the blended color. Use a muted text token, dashed border or background change.
- Solid primary fills: `accent['--oniva-accent-solid']` + `colors['--oniva-color-accent-fg']`. `--oniva-color-accent-tint` is not an AA pair with accent-fg in dark mode.
- Dynamic geometry (positions, widths, progress) goes through inline CSS variables (`--x`, `--p`) consumed by a static StyleX rule; transitions on `transform` then glide without animating layout properties.
- `useFlip` (internal/w1-flip.ts) is a ~25-line WAAPI FLIP over `[data-flip-id]` children; it no-ops in jsdom and under reduced motion.
- react-aria `useDrag`/`useDrop` give pointer, touch and keyboard (Enter to pick up, Esc to cancel) drag for free; DelegateBoard only adds number keys and Auto on top. jsdom cannot simulate the drag itself, so tests cover the keyboard shortcut and Auto path.
