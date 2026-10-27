---
title: Loop 7 W5 input gotchas (OTP paste, ComboBox empty state, DateRangePicker presets)
date: 2026-10-26
area: forms
tags: [input-otp, combobox, date-range-picker, react-aria]
---

- **OTP paste:** never put `maxLength` on the hidden input. A pasted "482-916" is truncated by the browser to "482-91" before `onChange` runs, so sanitising can't recover it. Strip disallowed characters per character in `onChange`, then slice to `length`.
- **ComboBox empty state:** RAC does not open the popover for an empty collection, so `renderEmptyState` never shows. Pass `allowsEmptyCollection` on the `ComboBox`.
- **Create row in ComboBox:** the row's `textValue` must contain the typed text (the default filter is `contains`), and selecting it must not change `selectedKey` (keep a controlled key and ignore the create id).
- **DateRangePicker presets inside the dialog:** use `DateRangePickerStateContext` (`state.setValue(range)`) from a child inside the `Dialog`, and keep a local value when the consumer is uncontrolled so presets can show `aria-pressed`. `DateRangePresets` imports `DateRangePicker`, so the picker must define its own preset type (no import back) to avoid a cycle.
- **Screenshots from the browser REPL:** `page.screenshot({ path })` must stay under the session dir; take the buffer and `fs.writeFile` it elsewhere.
