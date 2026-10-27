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

## Buttons, segmented, tabs, switch: as built (DEPTH-B1)

Decisions
- **Primary top-light: none.** A/B at 4x (`_ref/depth/b1-primary-toplight-AB.png`): `inset 0 1px 0 rgb(255 255 255 / .14)` follows the corner radius and reads as a bevel stripe on a 36px button, the thing the owner rejected on the switch. Primary and danger are a flat accent / danger fill + contact shadow. No gradient, no inset.
- **Dark solids carry no rim and no ring** (`elevation-solid`: a soft contact drop only). The generic dark `raised` ring + rim doubled up as two lines on a coloured fill and on a bordered button (a transparent 1px border leaves a gap between ring and rim).
- **Bordered controls (secondary, icon, toggle) use `elevation-control`**: the 1px border IS the hairline, so the token has no ring. Light = contact + ambient, dark = a soft drop (lighter surface already reads as raised).
- **Press timing:** transform rides `--oniva-motion-dur-press` (120ms); colour and shadow stay on `dur-base`. Press scale is unchanged (`--oniva-motion-press-scale`). Ghost and soft never carry a shadow; disabled solids and secondary are flat.
- **Loading shimmer fix:** the label used `color: transparent` + a `currentColor` gradient clipped to text, so every stop computed to rgba(0,0,0,0). The sweep is now an alpha `mask-image` on the label (band at 50% alpha), the label keeps its own colour, so contrast at rest is the variant's normal AA pair.
- **Segmented / Tabs pill / ToggleButtonGroup:** track = `surface-tertiary` + `elevation-recessed` (no border), selected pill = `--oniva-color-segment-selected` (white in light, #4a4a4a in dark so it is lighter than the #303030 track) + `elevation-raised`. SlidingIndicator geometry contract and the stretch glide are untouched.
- **Keyboard moves snap, pointer moves glide** (`internal/depth-b1-modality.ts`, same input-modality idea as `GlideSurface`): a keydown inside the control sets `data-instant` and an inline `transition-duration: 0s` on the indicator (Tabs, ToggleButtonGroup via SlidingIndicator) or skips the WAAPI stretch (SegmentedControl); pointerdown/move restores gliding. Measured: ArrowRight lands on the final x in the first 40ms sample, a click takes ~250ms.
- **Switch off state:** solid `--oniva-color-control-off` track, no ring, no inner shadow. Light `#8c8c8c` (3.1:1 vs inset #f7f7f7, 3.4:1 vs white), dark `#757575` (3.3:1 vs surface #262626). The 3:1 floor is why the off track is a mid grey: any lighter neutral fails non-text contrast without an edge. Knob insets grew by the old 1px border so the gaps stay 3px (lg 4px). Dark knob uses `elevation-knob*` (no halo ring). Off to on eases `background-color` only.

New tokens: `--oniva-color-control-off`, `--oniva-color-segment-selected`, `--oniva-elevation-solid[-hover|-pressed]`, `--oniva-elevation-control[-hover|-pressed]`, `--oniva-elevation-knob[-hover|-pressed]` (light + dark in `themes.ts`). Contrast pairs added in `scripts/check-contrast.mjs` (control-off on bg/surface/inset, knob on control-off, text on segment-selected).

Known pre-existing issue (not fixed here): in light mode the `colors` group derives tokens from the accent ramp at `:root`, so `--oniva-color-accent-fg`, `accent-soft*`, `accent-text` and `focus-ring` stay blue/white under non-blue accents (dark re-declares them on the theme wrapper, so dark is fine). Primary now reads `--oniva-accent-on-solid` directly; `soft` buttons still show blue under amber in light mode. Fix belongs in ThemeProvider/themes (re-declare the derived group for light).

Screenshots: `_ref/depth/b1-*.png` (states light/dark, buttons/controls/switch for light/dark x blue/amber/emerald, primary top-light A/B).

## Open questions

- Primary button: decided flat (see DEPTH-B1 section). Off-state switch: ring removed, solid `control-off` fill (see DEPTH-B1).
- Inputs went recessed. Text inputs on white in light mode show a faint inner top edge; if it reads as noise, set `ff.control` back to hairline only (one line).
- Legacy `shadow-card`/`xs` flat-card cleanup touches ~25 files outside this worker's scope.
- `dist/oniva-ui.css` must be rebuilt before `stable-vars.test.ts` "defines every documented name" passes (it checks the stale dist for the 6 new `--oniva-elevation-*` names).

## DEPTH-B2 sweep (everything except the B1 button family)

| Group | Change |
|---|---|
| Inputs | Input, InputOTP, Select trigger moved `shadow-xs` to `elevation-recessed` (matches `forms-field.ts`). |
| Flat cards/tiles | `shadow-xs`/`shadow-card` removed (hairline only): Card (both variants), KpiStrip, DataGrid, DataSheet, FileUpload, IntegrationPicker/Settings, Alert, Accordion, DescriptionList, Toolbar, StepperForm, TipsPanel, DateRangePresets, EmptyState, ChartCard (+selected tab), widgets (UsageOverview, ChangeSummary, InvoiceCard, widgets-parts), blocks (InvoiceCredit, AiWorkspace, blocks-styles), internal dash/data-table/data-list/w4/w8/s3/w1 cards, ai cards (CodeBlock, SpeechInput, WritingAssistant, ThinkingLoader, Suggestions, SourceChip, ComposerAttachments, Artifact), s1-files, w7 tiles/pills (ring kept, shadow dropped), calendar frame. |
| Docked chrome | Navbar and Sidebar frame `shadow-float` replaced by none. |
| Selected/active | Pagination current (accent), Stepper complete, Sidebar active pill, Calendar/RangeCalendar selected: flat `accent-solid`, gradient and `accent-inset` removed. Pagination default current and numbered items now hairline only. |
| Floating | Tooltip, NotificationStack, Toast, Popover, HoverCard, NavigationMenu, forms-popover (Select/Combobox lists), overlays-menu (Dropdown/Context menu, CommandPalette), data-table popups, w1 popups, ChartTooltip, SiteHeader menu, ChatContainer jump button, SettingsBilling popup: `elevation-floating`. |
| Overlay | Dialog, Drawer, BottomSheet, AppShell/AgentRun narrow drawers: `elevation-overlay` (AlertDialog uses Dialog styles). |
| Ad-hoc rgba | TaskBoard settle keyframe and DelegateBoard active chip now use `elevation-floating`. |

Exceptions kept (raised on purpose): Kanban cards while `data-dragging` and the drop "settle" keyframe, TaskBoard drop settle, DelegateBoard chip while `:active` (all grabbed objects, `elevation-floating`, rest state flat). r6-switcher pill uses `elevation-raised` (a pressable pill).
Kept as is: Hero (marketing, overlay alias), LogoCluster (illustration), TiltCard hover shadows and GlowCard/Spotlight/BorderBeam/Shimmer/GradientFloor (motion), ProgressTracker/ContextMap/ParallelAttempts/ConflictRadar/FanOutGrid sheen sweeps (shimmer), ParallelAttempts running glow, VoiceOrb (illustration), AgentAvatar/AgentGallery/ImageGenerationLoader gradients (decorative thumbnails), chart fills, mask gradients, InvoiceCredit `backgroundImage` (paint-layer trick for the translucent dark surface, not decoration), focus halos and ring shadows (state rings, not depth).
Not done: Stepper/Pagination docs text still says "xs shadow" in specs (off limits). Select `ff.control` anatomy copy likewise.
