# Depth system study

Owner feedback: "the toggle is so ugly improve composition, the need for raise or depth needs to be studied across including buttons".

## Diagnosis

Measured on the old Switch (44x24 md): the "on" track stacked a vertical accent gradient, a 1.75px white inner top highlight and a 0.875px dark inner ring (`--oniva-shadow-accent-inset`). On a control this small that reads as a glassy bevel. The knob, the one part you grab, had a faint `0 1px 2px` shadow and barely separated. Depth was spent on the wrong element. The legacy scale (`card, xs, sm, md, lg, xl, dropdown, float`) is sized, not semantic, so ~40 components pick a size ad hoc. Gradients cannot transition, so the fill snapped on frame 1 instead of easing.

## The system (depth means exactly one thing per level)

| Level | Meaning | Treatment | Token |
|---|---|---|---|
| flat | surfaces, cards, tiles inside trays | hairline border only, no shadow | none |
| recessed | a channel/well that holds something | inner top shadow only, no outer shadow | `--oniva-elevation-recessed` |
| raised | an object you grab or press, sitting ON a surface | hairline + tight contact + soft ambient; hover lifts a touch; press flattens (never more shadow) | `-raised`, `-raised-hover`, `-pressed` |
| floating | a separate layer (menu, popover, tooltip, toast, select list) | hairline + key + ambient | `--oniva-elevation-floating` |
| overlay | modal layer (dialog, sheet) | largest shadow, always with a scrim | `--oniva-elevation-overlay` |

Rules:
1. One light source, from the top (shadow y-offset positive, inner shadows at the top edge).
2. Coloured solid fills on small controls (<32px: switch track on, checkbox/radio checked, badges) are FLAT colour. No gradient, no inner highlight. State changes animate `background-color`/`border-color`, so they ease.
3. Press never adds shadow. Raised -> pressed removes ambient. Hover may lift (`raised-hover`), gated by `media.hover`.
4. Dark mode: shadows do not read on dark surfaces, so elevation = lighter surface + a 1px top rim (`inset 0 1px 0 #ffffff14`) + a hairline ring (`0 0 0 1px #ffffff1a`). Defined per theme in `darkShadowTheme` (themes/themes.ts).
5. Never stack two levels on one element (no raised + recessed, no ring + bevel).
6. Cards sitting in trays are flat (they differ by surface colour + hairline). Only things you can pick up are raised.

Compatibility: every legacy token name still exists. `--oniva-shadow-sm` is now an alias of raised, `--oniva-shadow-dropdown` of floating, `--oniva-shadow-xl` of overlay (same literal values, light and dark). `card, xs, md, lg, float, accent-inset, danger-inset` are unchanged and deprecated for new code (see audit).

### Primary button decision (study)

Recommendation: **flat accent fill + the raised hairline-only contact shadow**, no gradient, no inner white highlight. Why: (a) the solid already carries identity by colour, a top gradient + 1.75px highlight is the exact bevel the owner rejected on the switch; (b) at 36px it is still small enough that the highlight reads as a rim glow, not light; (c) a gradient cannot animate hover/disabled so those states currently jump (see `feedback-control.ts` which swaps `backgroundImage` per state); (d) press then flattens cleanly (pressed token) instead of fighting an inset. If the product wants a touch of polish: ONE `inset 0 1px 0 rgb(255 255 255 / 0.12)` max, in light mode only, never a dark ring. Default = flat.

## Audit (packages/oniva-ui/src)

Illustrations, motion/glow effects, mask gradients, skeleton/shimmer sweeps and chart fills are decorative and out of scope; they keep their own treatment. Rows below are UI chrome.

| Component / part | Uses now | Semantically | New treatment |
|---|---|---|---|
| Switch track off | surface gradient + border + `shadow-xs` | recessed | **done**: tertiary fill, border-control ring, `elevation-recessed` |
| Switch track on | accent gradient + `accent-inset` | flat colour | **done**: flat `accent-solid`, eased bg + border colour |
| Switch knob | surface gradient + `shadow-sm` | raised | **done**: white, `elevation-raised`, hover `raised-hover`, press `pressed` |
| Checkbox / table checkbox box | `shadow-xs`; on = gradient + `accent-inset` | flat (small) | **done**: no shadow, flat accent fill eased |
| Radio dot | same as checkbox | flat | **done** |
| Radio card variant | `shadow-xs` | flat (card) | **done**: hairline only |
| Slider rail | tertiary fill, no depth | recessed | **done**: `elevation-recessed` |
| Slider fill | accent gradient | flat | **done**: flat accent |
| Slider thumb | surface + border-control + `shadow-sm`/`md` on drag | raised | **done**: white, `raised`, hover lift, drag = `pressed` |
| ProgressBar / Meter / ProgressSegments track | chart-track fill | recessed | **done**: recessed via `::after` above the fill |
| ProgressBar fill (+ indeterminate) | gradient on pseudo layer | flat | **done**: flat `accent-solid`, tone crossfades via bg colour |
| Field controls (`ff.control`: Select, ComboBox, DatePicker, NumberField...) | `shadow-xs` | recessed (holds text) | **done**: `elevation-recessed`, focus halo replaces it |
| Input, InputOTP, TextArea (own styles) | `shadow-xs` | recessed | TODO next worker: swap `shadow-xs` for `elevation-recessed` |
| Button primary / danger (`feedback-control.ts`) | gradient + `accent-inset`/`danger-inset` | raised-ish | see Buttons section |
| Button secondary / outline | `shadow-xs` | raised | see Buttons section |
| ToggleButton, ToggleButtonGroup active | `shadow-sm` | raised | alias now gives `elevation-raised`; verify |
| Tabs / Segmented active pill | `shadow-sm` | raised | alias now gives `elevation-raised`; track should be recessed |
| Pagination current, Stepper active, Sidebar active nav, Calendar selected day | gradient + `accent-inset` | flat colour (small) | flat accent, drop gradient and inset (forms-calendar, Pagination, Stepper, Sidebar not touched yet) |
| Card, Accordion, DescriptionList, Toolbar, DataGrid, FileUpload, IntegrationPicker/Settings, StepperForm, Alert, TipsPanel, data-table/dash/w4/w8/blocks/ai-styles | `shadow-xs` / `shadow-card` | flat | drop the shadow, keep hairline border (follow-up, many files) |
| Popover, Select list, Menu (`overlays-menu`, `forms-popover`), NavigationMenu, Toast, ChartTooltip, w1 popups | `shadow-dropdown` | floating | automatic via alias; Tooltip + NotificationStack (`shadow-md`) should move to `elevation-floating` |
| Dialog, Drawer | `shadow-xl` | overlay | automatic via alias; scrim already present |
| Navbar, Sidebar frame (`shadow-float`) | float | flat (docked chrome) | should be hairline only; leave for follow-up |
| SettingsBilling, Hero, LogoCluster etc. (`shadow-lg/xl/md`) | ad hoc | marketing/illustration | out of scope |

## Switch redesign (before/after)

Geometry is concentric: gap is uniform on all sides (sm 2px, md 2px, lg 3px inside a 1px track border); knob is a full circle so its radius is always track radius minus gap. Sizes, API, a11y, RTL and the spring thumb slide are unchanged.

Screenshots (zoomed 4x, light and dark): `_ref/depth/before-switch-*.png` vs `after-switch-*.png`, plus `after-off-switch-*`, `after-amber-switch-light`.

## Buttons & segmented: recommendations (for the next worker)

Not edited by DEPTH-A. Apply the system:
1. **Primary / danger (`internal/feedback-control.ts`)**: flat `accent-solid` / danger solid. Remove the `backgroundImage` gradient per state and the `accent-inset` / `danger-inset` shadows; hover/active/disabled become `background-color` changes (they will ease). Keep `focus.ring`. Optional single top-light `inset 0 1px 0 rgb(255 255 255 / 0.12)` in light only. Add `background-color` to `transitionProperty`.
2. **Secondary / outline**: raised. `box-shadow: elevation-raised`; hover `raised-hover` (inside `media.hover`); active `elevation-pressed` + the existing press scale. Ghost: flat, no shadow.
3. **IconButton / ToggleButton**: same as secondary. Pressed (selected) toggle: use `elevation-pressed` or recessed fill, not a raised look.
4. **SegmentedControl / Tabs / ToggleButtonGroup**: track = recessed (`surface-tertiary` + `elevation-recessed`), active pill = raised (white/surface, `elevation-raised`). Same relationship as Switch track/knob. Sliding indicator keeps transform-only motion.
5. **Sidebar active, Pagination current, Stepper active, Calendar selected**: flat accent, no gradient or inset.
6. Never put `raised` and `recessed` on the same element, and never grow the shadow on press.

## Open questions

- Primary button: flat vs one faint top-light. Study recommends flat; owner call.
- Off-state switch keeps a `border-control` ring (needs >=3:1 non-text contrast). It is the heaviest remaining line; if the owner wants it softer, the off fill must reach 3:1 on its own.
- Inputs went recessed. Text inputs on white in light mode show a faint inner top edge; if it reads as noise, set `ff.control` back to hairline only (one line).
- Legacy `shadow-card`/`xs` flat-card cleanup touches ~25 files outside this worker's scope.
- `dist/oniva-ui.css` must be rebuilt before `stable-vars.test.ts` "defines every documented name" passes (it checks the stale dist for the 6 new `--oniva-elevation-*` names).
