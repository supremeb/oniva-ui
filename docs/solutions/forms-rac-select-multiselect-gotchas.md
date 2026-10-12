---
title: Forms group gotchas (RAC 1.22 Select/MultiSelect, StyleX shared styles, popover tests)
date: 2026-10-12
area: forms
tags: [react-aria-components, stylex, select, tests, calendar]
---

- **Shared StyleX styles across files**: `export const ff = stylex.create({...})` in `src/internal/forms-*.ts` and `stylex.props(ff.control, ff.md)` elsewhere compiles and works. A later style that redefines a conditional property (`borderColor: {default, ':hover', ':focus-within'}`) REPLACES the whole map, so re-declare every condition (see Select `trigger`, which needs `:focus-visible` because a `<button>` has no `:focus-within`).
- **MultiSelect**: RAC 1.22 `Select selectionMode="multiple"` uses `value/onChange` (Key[]); `SelectState` has `value`/`setValue`, not `selectedKeys`. `SelectValue` render props give `selectedItems` as the `items` objects only when you pass `items` (not static children), so MultiSelect takes an `options` array. Chip remove buttons must be plain `<button>` (RAC `Button` inside Select consumes the trigger context) and the real trigger is an absolutely positioned transparent Button under the chips.
- **Tests**: while a RAC popover is open the rest of the page is `aria-hidden`, so `getByRole` on the trigger/chips fails; press Escape first. In DatePicker tests scope calendar queries with `within(dialog)` because the date segments also contain the text "10"/"12".
- No `OTPField` in RAC 1.22: InputOTP is one transparent native input over visual slots. Component props must not reuse `pattern` (conflicts with TextFieldProps `pattern: string`).
- `calendar cell` range mid-days: don't apply the solid `selected` gradient (backgroundImage wins over backgroundColor); use tint only for the middle, gradient for start/end.
- `stylex` lint: `borderInlineEnd` shorthand is invalid; use `borderInlineEndWidth/Style/Color`.
