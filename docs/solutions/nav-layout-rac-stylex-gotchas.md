---
title: Navigation/layout components - RAC render props, media queries and jsdom visibility
date: 2026-10-12
area: components
tags: [stylex, react-aria-components, vitest, layout]
---

- RAC `className` callbacks only get state (isSelected, isFocusVisible...). Orientation is NOT on `TabRenderProps`; pass it down
  via context from `Tabs`. Join `stylex.props(...)` with the user className using `internal/nav-cx.ts` (dynamic `style` is dropped there,
  so keep dynamic StyleX styles out of RAC className callbacks).
- Media queries and `:focus-within` must be nested per property (`display: { default, '@media (max-width: 767px)': ... }`),
  never top-level keys. Dynamic styles (`styles.cols(n)`) work for grid columns/panel sizes and emit CSS variables.
- With `runtimeInjection` in Vitest, responsive `display: none` really applies in jsdom, so mobile-only controls are
  inaccessible to `getByRole`; use `getByLabelText` for them.
- `container.firstElementChild` in tests is the injected `<style>` element; query by role and use `parentElement` instead.
- Rerendering without the original `ref` prop calls the old ref with `null`; assert refs before rerender.
