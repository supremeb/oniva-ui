---
title: AppShell inside docs frames - container queries, not viewport
date: 2026-10-26
area: screens
tags: [stylex, container-query, layout]
---
- Screens render inside a ~785px docs card on a 1440px viewport, so viewport media queries would always show the mobile layout. AppShell sets `containerType: 'inline-size'` on its root and switches to drawers with `@container (max-width: 719px)` on children. Anything that needs the width in JS reads `rootRef.clientWidth`.
- Column widths are runtime state passed as CSS vars (`--oniva-as-sw/pw`) in `style`, capped with `cqw` (`min(var(--oniva-as-sw), 28cqw)`) so default 272/360px columns never starve the page in narrow frames.
- `@stylexjs/valid-styles` rejects a shared const object as a property value (`backgroundColor: hoverBg`); inline the conditional object each time.
- `useMove` also handles arrow keys (stopPropagation); drop its `onKeyDown` when you want Shift-steps and Home/End on a separator.
