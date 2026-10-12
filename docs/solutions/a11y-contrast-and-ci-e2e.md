---
title: What axe in real Chromium caught that jsdom did not
date: 2026-10-12
area: a11y / ci
tags: [axe, color-contrast, tokens, e2e, playwright, dark-mode]
---

First real CI run (ubuntu + Chromium + axe) failed on ~20 component pages. jsdom/vitest-axe passes
because jsdom has no layout or computed colour, so `color-contrast`, `scrollable-region-focusable`
and strict-mode locator collisions are invisible there.

## Lessons

- **Fix contrast at the token, not per component.** `text-subtle`/`text-placeholder` were `#a1a1a1`
  (2.6:1). Light is now `#666`, dark `#909090`. `text-muted` was 4.47 on `#ebebeb` and 4.36 on selected
  `blue-100` rows, so light is `#595959`. Dark muted is `#b0b0b0` (4.0 on selected `blue-900` rows).
  Check tokens against the *worst* surface they sit on: inset, hover, selected, error-bg.
- **`opacity` kills contrast.** `opacity: .45/.85` on text (outside-month days, meeting meta, disabled
  controls) is computed by axe. Use a colour token instead. For truly disabled widgets put
  `aria-disabled="true"` on an ancestor (axe skips those); RAC `DropZone` does not forward it, so it
  went on the wrapper.
- **Selected-soft fill must pair with `accent-soft-fg`:** `accent-300` bg + `accent-700` fg is 3.76:1.
  Use the `-200` step.
- **Text on mixed chart fills** (`color-mix` teal 70%) needs `on-chart` (dark) in both themes.
- **Demo files must use real token names.** `var(--textMuted, #6b6b6b)` silently fell back to a hard-coded
  grey in dark mode (3:1 on `#202020`). Always `var(--oniva-color-*)`.
- **`<dl>` children:** only `dt`/`dd` or `div > dt+dd`. A wrapping `<span>` around dt/dd fails
  `definition-list`/`dlitem`. Use grid on the `div` instead (icon spans two rows).
- **Scrollable regions need keyboard focus:** `tabIndex={0}` + role/label on any `overflow:auto` panel
  with no focusable content (ResizablePanels panels, InView demo).
- **Locators collide with the docs chrome:** the docs header palette and the CommandPalette demo both
  bound ⌘K (2 dialogs); a Heading demo with `<h1>` made `getByRole('heading', {level: 1})` ambiguous so
  the page "did not render". Header hotkey is disabled on the demo page; demos use h2+ with
  `variant="display"`.
- **Rotating hero text:** keep the h1 accessible name stable (visually-hidden full sentence + `aria-hidden`
  animated copy) so screen readers and tests don't see words flicker.
- **Deploy gating:** the Pages `deploy` job also carries the `workflow_run.conclusion == 'success'` guard.

## Local repro without Chromium

`vite build` in `apps/docs`, `vite preview`, open each `#/components/<slug>` in a browser tab, inject
`node_modules/axe-core/axe.min.js`, run `axe.run(document, {runOnly: ['wcag2a','wcag2aa']})`, filter
serious/critical; repeat after toggling `[data-testid=theme-toggle]` for dark. Wait ~250ms (transitions
mid-flight give false contrast values).
