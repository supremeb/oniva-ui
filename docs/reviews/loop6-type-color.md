# Loop 6 review: typography + color (report only)

Scope: `packages/oniva-ui/src/tokens/*`, `themes/themes.ts`, component usage (742 non-test files). Skills applied: `better-typography`, `better-colors` (all reference files). Contrast measured by a node script (`/tmp/cr/c.mjs`, WCAG 2.x relative luminance; translucent tokens composited over the actual bg/surface; accent = default blue unless in the accent table). Token NAMES are public, nothing below renames; every fix is a value change or an additive token.

Counts: **P0 = 6, P1 = 12, P2 = 11**. Verdict: **Block** (HIGH items remain: text pairs below their required ratio, color-only/invisible states).

Not verified: real browser rendering (font loaded? Inter/JetBrains Mono are named in the stack but no `@font-face`/loading found in the package, consumer must load; `slashed-zero` support depends on the face), 320px/200% zoom clipping, APCA Lc values (WCAG only), `color-mix()` accent-tint contrast (resolved value not computed), per-accent-theme dark mode beyond the accent table.

## What is good (don't regress)
- Two-tier model exists (neutral/hue primitives in `tokens/primitives.ts`, semantic `--oniva-color-*` vars); components are almost fully tokenized: zero hex/rgb/hsl color literals in non-demo component code (only `#000` in `maskImage` gradients, which is alpha-only and fine: LogoCloud.tsx:46,73; Marquee.tsx:17-22; Loaders.tsx:81-82; SpotlightCard.tsx:35-37; n3-ring.tsx:25-27).
- One switching mechanism for dark (ThemeProvider + createTheme; the only `prefers-color-scheme` read is JS, ThemeProvider.tsx:61). Accent ramp in its own var group so dark x accent compose.
- Previous axe loop already fixed text-muted/subtle/placeholder to AA on inset/selected rows; verified still passing below.
- 330 of 342 non-demo `fontSize` declarations use the size tokens; `tabular-nums` present in 50 component files; `textWrap: pretty|balance` used in 6 places; `from-font` n/a.

---

## P0 (HIGH: text/control pair fails its required ratio, or state invisible)

### P0-1 Primary button label fails 4.5:1 on 5 of 8 accents (and on hover for all)
- `internal/feedback-control.ts:50-58` (gradient `accent-500 -> accent-600`, hover `400 -> 500`, white `accent-fg`), `tokens/colors.stylex.ts:41` (`accent-fg: #fff`).
- Measured (white on step): blue 500 = 3.76, 600 = 5.25; hover 400 ~2.9. Amber 500 = 2.13 (600 = 3.20), emerald 2.47/3.65, cyan 2.37/3.62, pink 3.58/4.54, red 3.81/4.77. See accent table. Label is 13-14px semibold, so 4.5:1 applies.
- Rule: better-colors "`text-white` on a Tailwind 500 fill ... move the fill to 600" and "Never quietly darken the brand".
- Fix (no API change): make the solid fill gradient `accent-600 -> accent-700` (hover `500 -> 600`, active `700 -> 800`). For amber/cyan/emerald (600 still <4.5) add an additive token `--oniva-color-accent-fg` per-accent override: set `accent-fg` to `#0a0a0a` in `accentAmber`/`accentCyan`/`accentEmerald` contexts (black on amber-500 = 9.27, cyan-500 = 8.37, emerald-500 = 8.00; measured). Because `accent-fg` lives in `colors`, not `accent`, add a new var in the `accent` group: `--oniva-accent-on-solid` (additive) with `#fff` for blue/violet/pink/red/indigo and `#0a0a0a` for amber/emerald/cyan, and point `accent-fg` at it (`accent['--oniva-accent-on-solid']`). Same consumers: checkbox-box.tsx:19, forms-calendar.tsx:89, forms-date.tsx:25, charts-styles.ts:118 (selected states on 500/600 fills).
- API impact: none (new accent var; `--oniva-color-accent-fg` name/semantics unchanged, default value same for blue).

### P0-2 Danger/status solid fills with white text fail
- `colors.stylex.ts:68-72` (`danger-from #fb2c36 -> danger-to #e7000b`), `:45` (`on-solid #fff`). White on `#fb2c36` = 3.81, hover-from `#ff6467` = 2.89, success-solid `#00c950` = 2.22, warning-solid `#f0b100` = 1.91, info-solid ok-ish. Dark theme does not override (same values).
- Fix: danger gradient `#e7000b -> #c10007` (hover `#fb2c36 -> #e7000b`, active `#c10007 -> #9f0712`): white on #e7000b = 4.77, #c10007 = 6.42, #9f0712 = 8.36 (same in light and dark). Do not use `on-solid` white on success/warning-solid: set a new additive token `--oniva-color-on-solid-light` = `#0a0a0a` (black on #00c950 = 8.93, on #f0b100 = 10.36) for solid status fills, or restrict `on-solid` to danger.
- Rule: better-colors contrast.md AA 4.5:1 for text; "Measure it".
- API impact: none (values change; one additive token).

### P0-3 `text-error` fails on inset/tertiary/error-bg (light)
- `colors.stylex.ts:36` (`#e7000b`): 4.45 on `surface-inset #f7f7f7`, 4.00 on `surface-tertiary`, **3.91 on `error-bg #ffe2e2`**, i.e. the inline error message on its own error field bg. The comment "AA on white" is true (4.83) but the token is used on tinted surfaces.
- Fix: `--oniva-color-text-error: #c10007` (6.42 on white, 5.99 inset, 5.27 error-bg, 5.39 tertiary; measured). Dark `#ff6467` passes (checked on bg/surface/inset/tertiary and error-bg).
- API impact: none.

### P0-4 Accent focus ring fails 3:1 on light for amber, emerald, cyan (and is borderline for blue/pink)
- `colors.stylex.ts:28` `focus-ring = accent-500`. On white: amber 2.13, emerald 2.47, cyan 2.37, pink 3.58, blue 3.76 (ok), red 3.81, violet 4.40, indigo 4.58. Inset `#f7f7f7` is ~5% lower again (blue 3.5).
- Rule: focus ring is a UI component, 3:1 (contrast.md); "a role with no token -> add the token".
- Fix: `--oniva-color-focus-ring` -> `accent['--oniva-accent-600']` in light (blue 5.25, amber 3.20, emerald 3.65, cyan 3.62, pink 4.54), keep 500 in dark via darkTheme override `accent['--oniva-accent-400']` (blue-400 = 5.97 on #121212; other accents not individually measured). Add the dark override in `themes.ts` darkTheme block (it currently has none for focus-ring).
- API impact: none (value only).

### P0-5 Disabled / invisible states: `text-disabled` and chart-track equal their surface in dark
- `themes.ts:42` `text-disabled: #262626` = surface `#262626`: ratio **1.00** (text literally invisible) and 1.18 on inset. Light `#d4d4d4` on white = 1.48. `themes.ts:80` `chart-track: #262626` on surface `#262626` = 1.00, track invisible in dark cards; `surface-active` (themes.ts:14) and `surface-tertiary` also `#262626` = surface so pressed/badge fills have no change. Disabled exemption covers legibility, but better-colors says "Aim for Lc 30 so they stay legible" and a hidden label hides what the control is.
- Fix: dark `text-disabled: #737373` (3.19 on surface #262626, 3.95 on bg #121212; `#6b6b6b` only reaches 2.84), light `text-disabled: #a1a1a1` (2.58 on white, matches disabled-fg and the Lc30 target). dark `chart-track: #404040` (1.5 on #262626) and `chart-cursor` stays `#404040` -> set `#525252`; dark `surface-active: #333333`, dark `surface-tertiary: #303030`. (`#333` is not in the neutral ramp; add `neutral[750]` primitive, additive.)
- API impact: none (values).

### P0-6 Kbd text fails; dark `text-subtle` fails on hover surface
- `colors.stylex.ts:44-45` kbd `#d4d4d4` bg + `kbd-fg #737373` = 3.20 (light), dark `#404040`/`#a1a1a1` = 4.01. (Component Kbd.tsx:12 actually uses `text-on-tertiary` on `kbd-bg`: `#525252` on `#d4d4d4` = 5.27 OK light; dark `#d4d4d4` on `#404040` passes. So `kbd-fg` is an orphaned public token that fails if a consumer uses the pair.) Dark `text-subtle #909090` on `surface-hover` (rgba(64,64,64,.6) over surface) = **3.81** (themes.ts:11,43): hovered list rows/menu items show subtle text below AA.
- Fix: light `kbd-fg: #525252` (5.27), dark `kbd-fg: #d4d4d4`; dark `text-subtle: #a1a1a1` (4.68 on surface-hover #363636, 5.86 on surface, 6.94 on inset; `#9a9a9a` only reaches 4.29; current `#909090` = 3.79). Keep Kbd on `text-on-tertiary` (fine).
- API impact: none.

---

## P1

### P1-1 Line-heights are px tokens, not unitless
- `tokens/font.stylex.ts:25-38` (`--oniva-font-lh-*: '15px'...'84px'`), also `Avatar.tsx:27-31` (`'12px'..'22px'`), `Textarea.tsx:23` (`'20px'`).
- Rule: "`line-height` in `px` or `rem` -> a unitless value": a px lh does not follow user font-size/`em` overrides and breaks when a consumer sets `fontSize: 0.9em` (Markdown.tsx:73).
- Fix: keep the names, change values to unitless equivalents: lh-11 `1.36`, lh-12 `1.35`, lh-13 `1.4`, lh-14 `1.45`, lh-16 `1.4`, lh-18 `1.35`, lh-20 `1.3`, lh-24 `1.25`, lh-32 `1.2`, lh-40 `1.15`, lh-48 `1.1`, lh-56 `1.1`, lh-64 `1.1`, lh-72 `1.1` (see P1-2 for why). Consumer `calc(var(--lh) * ...)` check needed (not verified; stable-vars test only checks names).
- API impact: value change on public tokens (px -> unitless); anyone doing `calc(var(--oniva-font-lh-14) + 2px)` breaks. Flag in changelog, otherwise additive alternative: add `--oniva-font-leading-{display,heading,body,caption}` unitless and migrate Text.tsx to them.

### P1-2 Display/heading line-heights are body-loose; caption/label can wrap at <1.4
- Current ratios: 24/34 = 1.42, 32/44 = 1.375, 40/54 = 1.35, 48/64 = 1.33, 56/72 = 1.29, 64/80 = 1.25, 72/84 = 1.17. Skill: display 1.1, headings 1.2-1.3. Text `title` (24, Text.tsx:30-35) and `display` (40) use 1.42/1.35. Conversely 11px/15px = 1.36 and 12px/16px = 1.33 (caption, Text.tsx:10-15) are under 1.4 and caption is used for wrapping helper text (DescriptionList, Dialog description, Tooltip) -> "Anything that wraps to three or more lines needs at least 1.4".
- Fix: `title` 24/1.25 (30px), `display` 40/1.15 (46px); `font-lh-12` -> 1.4 (17px), `font-lh-11` -> 1.4. Size ratio stays visually the same at one-line use.
- API impact: none to names; Text/Heading metrics shift a few px (visual snapshot churn).

### P1-3 Letter-spacing in px for caption/label; label tracking too small for uppercase
- `font.stylex.ts:44-45` `track-caption 0.15px`, `track-label 0.3px`. Rule: "`letter-spacing` in `px` -> `em`"; uppercase labels at <=14px take `0.05em`. Uppercase usages (Sidebar.tsx:193-198, Timeline.tsx:36-37, CodeBlock.tsx:47-49, ToolCallCard.tsx:49-51, ConversationList.tsx:15, Sources.tsx:32, SourceChip.tsx:55, data-list-styles.ts:81, blocks-styles.ts:29): 11-12px at 0.3px = 0.025-0.027em. Caption 12px medium at 0.15px = 0.0125em is non-zero tracking on sentence-case text; skill says body 0.
- Fix: `--oniva-font-track-label: 0.05em`; `--oniva-font-track-caption: 0em` (Text caption is sentence case); `track-hero` already `-0.02em` (good, applies only at >=24: check ChartCard.tsx:21/DonutChart.tsx:29 stat sizes are >=24 - not verified).
- API impact: none (value).

### P1-4 Hierarchy gaps / near-duplicate steps in the size scale
- 14 sizes (11,12,13,14,16,18,20,24,32,40,48,56,64,72) plus **off-scale literals**: 9px (Sources.tsx:27), 10px (Avatar.tsx:27-28), 0.9em (Markdown.tsx:73), 13 numeric (ModelCompare.tsx:15), 11/12 numeric (charts-styles.ts:107,120), 15 (ShineBorder demo). Text only exposes 5 roles (12/14/16/24/40), so 13/18/20/32 are only reachable by raw tokens. 11/12/13 are 1px apart (adjacent < 0.03 OKLCH-L equivalents of size, "more steps than decisions").
- Rule: "Define a small set of sizes and deviate as little as possible"; "rarely go below 12px" (9px, 10px, 11px are findings; 9px uppercase initials in a 18px avatar is decorative but 10px avatar initials are read by users).
- Fix: Sources.tsx:27 -> `font-size-11`; Avatar xs/sm -> `font-size-11` (lh `1.2`); charts-styles.ts:107,120 -> tokens; ModelCompare.tsx:15 -> `font-size-13`; consider deprecating 13 (document 12/14 as UI pair) but do not remove.
- API impact: none.

### P1-5 Sizes are px, not rem
- `font.stylex.ts:7-20`. Rule: "Set font-size in rem so the reader's browser font size still applies".
- Fix: values `0.6875rem, 0.75rem, 0.8125rem, 0.875rem, 1rem, 1.125rem, 1.25rem, 1.5rem, 2rem, 2.5rem, 3rem, 3.5rem, 4rem, 4.5rem`. Fixed-height controls (Avatar, Kbd `height: 18/20/24`, buttons) must switch to `min-height`/em or they clip at 200% text zoom (not verified).
- API impact: value change on public tokens (px -> rem; computed size identical at default 16px root). Risk for consumers who set `html{font-size:62.5%}`.

### P1-6 `tabular-nums` missing on numeric surfaces
- `components/Table` (no tabular; `Table.tsx` has no `fontVariantNumeric`), `components/Calendar` (only forms-calendar.tsx:68 covers its internal grid), `components/Meter`, and SVG chart text in BarChart.tsx:165-192, ComboChart, FunnelChart, Heatmap, RadarChart, SankeyChart, ScatterChart, StageBars (they render `<text>` axis/value labels; axis labels are in `svgText` in charts-styles.ts:107-121 which does set tabular, but those files draw `<text>` with their own style - verify each uses `svgText`). Also `widgets-parts.tsx:16,30,77`, `widgets-ring.tsx:14`, MostActiveDays.tsx:45, SleepScoreWidget.tsx:36, ContributorProfile.tsx:39, ActivityWidget.tsx:28, MeetingSchedule.tsx:26, EventCalendar.tsx:37 use `fontFeatureSettings: "'tnum'"` (raw tag).
- Rule: "`font-feature-settings: "tnum"` -> `font-variant-numeric: tabular-nums`"; properties survive fallback fonts. Table numeric columns: "numeric table columns" must be tabular.
- Fix: replace each `fontFeatureSettings: "'tnum'"` with `fontVariantNumeric: 'tabular-nums'` (widgets-parts.tsx:30 has both: delete the tag). Add `fontVariantNumeric: 'tabular-nums'` to the Table `td` cell style when `align="end"`/numeric and to Meter value; make every chart `<text>` use `svgText`.
- API impact: none.

### P1-7 No `slashed-zero` / `case-sensitive` anywhere; mono for IDs lacks it
- grep: no `slashed-zero`, `font-feature-settings` for `case`/`zero`. Mono is used in 21 places (CodeBlock, FileDiff, PromptLibrary tmpl, IDs, keys). JetBrains Mono has a dotted-slashed zero by default, but the fallback `ui-monospace, SF Mono, Menlo` zero is plain, ambiguous with O in IDs/hashes.
- Rule: `slashed-zero` for `.id` like values. Fix: add `fontVariantNumeric: 'slashed-zero'` to the mono token consumers (CodeBlock.tsx, FileDiff.tsx, ToolCallCard ids, Kbd none). Optional `font-feature-settings: "case" 1` (no property exists) on uppercase labels with punctuation (Sidebar.tsx:198, Timeline.tsx:36, SourceChip.tsx:55, Sources.tsx:32): `⌘`/`-`/`/` in all-caps labels sit low; low priority.
- API impact: none.

### P1-8 Truncation has no way back
- 18 files truncate with `textOverflow: 'ellipsis'` (Text.tsx:41 `truncate`, Artifact, CodeBlock, ComposerAttachments, FileDiff, SourceChip, Sources, ToolCallCard, BarList, DataGrid, FileUpload, Sidebar, aib-styles, dash-styles, forms-popover, overlays-menu, EventCalendar, MeetingSchedule); only 12 `title=` in the whole package and 0 `WebkitLineClamp`. Truncated text in Text/Sidebar/ComposerAttachments/DataGrid has no `title`/tooltip fallback.
- Rule: "A truncated value needs a way back to the full text" (HIGH if content only exists truncated).
- Fix: in `Text` when `truncate`, if `children` is a string and no `title` passed, set `title={children}`; same for Sidebar item label, FileUpload filename, ComposerAttachments name, DataGrid cell. Document multi-line `lineClamp` prop (display:-webkit-box + boxOrient + overflow hidden) as an additive Text prop.
- API impact: none (additive default `title`); optional new prop `lines`.

### P1-9 `text-wrap` essentially unused for headings
- `Heading.tsx`/`Text.tsx` set no `textWrap`; only 6 usages package-wide (Testimonials.tsx:26 pretty, a couple balance in blocks). Rule: balance for headings/short descriptions, pretty for paragraphs; never balance on long paragraphs.
- Fix: `textStyles.title`, `textStyles.display`, `textStyles.headline`: `textWrap: 'balance'`; `textStyles.body`: `textWrap: 'pretty'`. Dialog/Alert/Card description via Text inherit pretty.
- API impact: none.

### P1-10 Primary `accent-soft-active` fails; selected-soft fg pair
- `colors.stylex.ts:51,54` `accent-soft-active = accent-300`, `accent-soft-fg = accent-700`: 3.77 in both themes (dark `accent-700` bg + `accent-300` fg also 3.77). This is the same pair the earlier axe note calls out ("use -200 step"). Press state drops below AA while held.
- Fix: light `accent-soft-active: accent-200` and hover `accent-100`... currently hover=200 so active would equal hover; instead set hover=`accent-100`->`accent-50`? Simplest: light soft `accent-50`... that collapses to bg. Recommended: keep soft 100, hover 200, active 200 plus `box-shadow inset` (pressed) in the component, or darken fg only in active state to `accent-800` (`#193cb8` on `#8ec5ff` = 4.87, measured). Dark: active `accent-700` -> `accent-800` (`#193cb8` bg; fg 300 = 4.6; hover then `accent-900`/`800` swap). Verify per accent.
- API impact: none.

### P1-11 Status chips: light `purple` / dark `warning` equivalence and one-color-two-meanings
- `colors.stylex.ts:96-99` purple chip (`#f3e8ff` bg, `#9810fa` fg): fg on bg 5.6 (pass) but the accent "violet" ramp `#8e51ff` and `purple #9810fa` are within ~15 deg OKLCH of each other, so a purple chip next to the violet accent reads as accent/selection (Rule: one color one meaning, 15deg). `info` chip `#bedbff/#193cb8` equals the *blue accent* `accent-200`/`800` (identical values) so info status and "selected" can't be told apart by hue. `info-solid #615fff` is the indigo accent-500.
- Fix: no value change required for contrast; document that `info` and `accent` coincide for blue, and move `info-solid` to `#00bcff`-family sky (chart-4) if accent should stay free. Medium priority, design call.
- API impact: none.

### P1-12 Border/control and icon tokens below 3:1 where they identify a control
- `border-control #d4d4d4` (checkbox/radio edge) = 1.48 on white, 1.38 on inset; dark `#404040` = 1.81 on bg / 1.46 on surface. Unchecked checkbox/radio/switch boundary is the only visual identifier. `icon-subtle #a1a1a1` = 2.58 (light), dark `#525252` 1.94 on surface; `border-active #a1a1a1` 2.58, dark `#525252` 1.94 (and dark `border-hover #737373` is *lighter* than `border-active #525252`: inverted hover->active order, themes.ts:25-26). Plain `border`/`separator` at 1.1-1.2 is decorative, ok.
- Rule: UI components need 3:1 (contrast.md); "separator and border are separate roles".
- Fix: light `border-control: #8a8a8a` (3.4 on white, 3.1 on inset `#f7f7f7`) - add if you want to preserve look: new additive `--oniva-color-border-input` = `#8a8a8a`/dark `#8a8a8a` (5.43 on #121212, 4.38 on #262626) and migrate checkbox/radio/switch; set dark `border-active: #a1a1a1` (> hover). `icon-subtle` light `#8a8a8a`, dark `#8a8a8a`.
- API impact: none (additive token + value).

---

## P2

1. **Dark `surface-tertiary` = `surface` = `surface-active` = `#262626`** (themes.ts:10,14,16 equals `surface`) - badges, pills and pressed buttons are indistinguishable from cards. Fix as P0-5 (`#303030`).
2. **Naming completeness** vs token-naming role inventory: present: bg/surface/inset/tertiary/overlay, text/muted/subtle/disabled/placeholder, border/hover/active/control/separator/focus-ring, status bg/fg/solid/halo, accent-soft-*. Missing roles: `text-inverse`, `accent-solid`/`accent-solid-hover`/`accent-text` (components reach into the ramp: 29 direct `accent['--oniva-accent-500|600']` reads outside tokens/themes, e.g. feedback-control.ts:52-55, bypassing the semantic seam), `accent-border`, per-status `border` and `text` for cyan/orange/purple (they have only bg/fg), `surface-raised` (menus/popovers re-use `surface` + shadow), `surface-sunken`. Add (additive): `--oniva-color-accent-solid` (=accent-600), `-solid-hover` (=accent-700), `-text` (=accent-700 light / accent-300 dark), `-border` (=accent-300/700), `--oniva-color-text-inverse`. Components can migrate incrementally; ramp-direct access also prevents increased-contrast variants.
2b. Naming grammar: tokens lead mixed ways (`text-on-tertiary` vs `accent-fg` vs `on-solid` vs `on-chart`): foreground is `text` in some, `fg` in others (`kbd-fg`, `success-fg`, `accent-soft-fg`, `disabled-fg`, `accent-fg`) - skill: "one word per concept". Can't rename; add aliases `--oniva-color-success-text` etc. in docs only, and prefer `text-*` for any new token.
3. **No `prefers-contrast: more` variants** (grep: none in tokens/themes). Add a `[data-oniva-contrast="more"]`/media block lowering muted text to `#404040` (light) / `#d4d4d4` (dark) and borders to `#8a8a8a`. (The three-way `prefers-contrast` + dark requires separate per-appearance values.) API impact: none (additive).
4. **Charts palette (10 colors, light)**: marks vs white: 1: 1.86, 2: 1.53, 3: 2.76, 4: 2.18, 5: 2.79, 7: 1.94, 8: 1.57, 10: 2.58 fail (8 of 10); 6 and 9 pass. Eight of ten fail the 3:1 graphical-object rule on white (dark passes all). Filled bars/areas need adjacent labels or direct values; lines/dots rely on color alone.
   - Normal-vision min pair distance (OKLab dE*100): 1-7 teal vs green 6.1 (close), 6-9 blue vs periwinkle 7.0.
   - CVD simulation (Machado matrices, dE*100): protan 5-9 (violet vs periwinkle) = **0.4**, 5-6 = 1.2, 6-9 = 1.6, 2-8 (lime vs yellow) 4.4; deutan 6-9 = 1.3, 2-8 = 1.9, 3-10 (pink vs gray) 2.4, 4-5 4.2; tritan 1-7 1.9, 4-7 3.4, 1-4 3.5, 6-9 3.6. Rule: color alone must not carry meaning; with 10 series and hue-only encoding, series 5/6/9 and 2/8 merge for color-blind users.
   - Fix: reorder/replace slots so the first 5 series are mutually distinct under CVD (light proposal): 1 `#3392ff` blue, 2 `#fdc700`-> darker `#e6a800`, 3 `#fb64b6` pink, 4 `#00b8a0` teal, 5 `#9333ea`-ish violet `#a855f7`, then lime/orange/gray; and make light marks >= 3:1 on white with these candidates (measured on white): `#0e9f8e` 3.30, `#5fa300` 3.12, `#e0489d` 3.76, `#0092c9` 3.53, `#9a4dff` 4.30, `#2f7ff0` 3.88, `#00a574` 3.17, `#5b66f5` 4.50, `#737373` 4.74; amber `#c99600` is only 2.68, use a darker `#b07d00` (re-measure). CVD distinctness of the new set is NOT yet re-simulated. Add per-series pattern/marker support in charts (dash, marker shape) - documented a11y alternative, `charts-a11y-roles.md` doesn't cover color-blind.
   - API impact: none (values) - but visual change to every chart; keep old values in a `chart-N-legacy`? not needed.
5. **Status-solid dots on light** (`success-solid 2.22`, `warning-solid 1.91` vs white) - status dot is color-only unless a label sits next to it. Ensure `AgentStatusPill`/Badge always pair a text label (they do; pass the "not color alone" rule). Fix if used alone: `success-solid #00a63e` (3.22 on white), `warning-solid #b87300` (3.82).
6. **`accent-tint`** uses `color-mix(in srgb, accent-500 12%, transparent)` (colors.stylex.ts:58, themes.ts:62): text on it is not measurable statically (skill: alpha/color-mix). Used as a wash only; if any text sits on it, measure per-surface. Not verified.
7. **Disabled solid** gradient `disabled-fg #a1a1a1` on `#ebebeb -> #d4d4d4` = 2.17/1.74 (light) - exempt but below Lc 30 target; raise fg to `#737373` (light) for readable disabled labels (3.98 on #ebebeb / 3.20 on #d4d4d4). Dark `#737373` on `#404040`-`#262626` = 2.19+ ok.
8. **Hard-coded fallback with non-existent var**: `internal/ai-demo-chat.tsx:120` `var(--oniva-border, #ebebeb)` - `--oniva-border` is not a token (`--oniva-color-border`), so dark mode silently uses `#ebebeb` (exact failure mode described in docs/solutions/a11y-contrast-and-ci-e2e.md). Fix: `var(--oniva-color-border)`. Also `charts/Sparkline/Sparkline.demo.tsx:33` `rgba(128,128,128,0.2)` (demo, ok but not themable) and `Stack.demo.tsx` (6 literals), `ImageGenGrid.demo`, `ToolApproval.demo` etc. (demo-only; `#482`/`#48213` hits are issue numbers, not colors).
9. **Shadow/inset literals** `shadow.stylex.ts:14-15` embed `#fb2c36` and `#ffffff40` instead of tokens (`shadow-danger-inset` ignores danger token changes; if P0-2 changes danger-to, update this to `#e7000b`... `#c10007` too). Move to `colors` danger-from via template like line 14 does for accent.
10. **Punctuation**: no `...` in rendered strings (good), 40 `…` uses; **0 `&nbsp;`/U+00A0** anywhere - units/currency/shortcuts ("12 GB", "⌘ K", "5 min") can break across lines; no en dashes found for numeric ranges (e.g. date-range, pagination "1-10 of 50" - search `of` strings); curly quotes: demo copy uses straight quotes in code samples only (fine). Fix: format via `Intl.NumberFormat`/`formatToParts` joined with `\u00A0` between value and unit in Pagination, FileUpload (size), StatsBand, Meter; en dash `\u2013` in range labels (DateRange, Slider range, Pagination). `Kbd` groups already `inline-flex` (no wrap risk).
11. **Mono usage**: JetBrains Mono is in the stack but font is not bundled/loaded by the package; keep. `Markdown.tsx:73` inline code `fontSize: 0.9em` is a sound relative choice. Do not use mono for numeric columns (tabular-nums on sans instead): spot check passed (mono only in code/ids/templates).

---

## Type scale summary (tokens/font.stylex.ts vs Text.tsx)
| Role | Size / LH today | Ratio | Skill target | Weight | Tracking |
|---|---|---|---|---|---|
| caption | 12 / 16 | 1.33 | >=1.4 if wraps | 500 | 0.15px (should be 0) |
| body | 14 / 20 | 1.43 | ok (UI) | 400 | 0 |
| headline | 16 / 22 | 1.375 | 1.2-1.3 heading (ok for 1 line) | 600 | 0 |
| title | 24 / 34 | 1.42 | 1.2-1.3 | 600 | -0.02em (ok) |
| display | 40 / 54 | 1.35 | 1.1-1.2 | 600 | -0.02em (ok) |
Heading mapping: h1 display 40, h2 title 24, h3/h4 headline 16, h5 body 14 (weight 400, **same weight as body, so h5 is visually indistinguishable from paragraph**; set `body` heading variant weight 500+ in `Heading` for level 5; Heading.tsx:6-13), h6 caption 12 (fine as overline). Weights used: 400/500/600/700, no <=300 anywhere (good). One size jump 16 -> 24 skips 18/20 for Text roles.

## Contrast table
Pass = meets the stated requirement. Text 4.5:1, non-text 3:1. "light/dark" use default blue accent; translucent tokens composited over the underlying bg/surface.

### Failing pairs (75 rows; measured)
| theme | fg | bg | ratio | req | result | note |
|---|---|---|---|---|---|---|
| light | text-error | surface-inset | 4.45 | 4.5 | FAIL |  |
| light | text-error | surface-tertiary | 4.00 | 4.5 | FAIL |  |
| light | text-error | error-bg | 3.91 | 4.5 | FAIL |  |
| light | text-disabled | surface | 1.48 | 3 | FAIL | disabled exempt; aim Lc30/3:1 |
| light | text-disabled | surface-inset | 1.38 | 3 | FAIL | disabled exempt |
| light | disabled-fg | disabled-from | 2.17 | 3 | FAIL | disabled exempt |
| light | disabled-fg | disabled-to | 1.74 | 3 | FAIL | disabled exempt |
| light | accent-fg | accent-500 | 3.76 | 4.5 | FAIL |  |
| light | on-solid | danger-from | 3.81 | 4.5 | FAIL |  |
| light | on-solid | danger-hover-from | 2.89 | 4.5 | FAIL |  |
| light | on-solid | success-solid | 2.22 | 4.5 | FAIL |  |
| light | on-solid | warning-solid | 1.91 | 4.5 | FAIL |  |
| light | on-solid | danger-solid | 3.81 | 4.5 | FAIL |  |
| light | accent-soft-fg | accent-soft-active | 3.77 | 4.5 | FAIL |  |
| light | accent-soft-disabled-fg | accent-soft-disabled | 1.67 | 3 | FAIL | disabled exempt |
| light | kbd-fg | kbd-bg | 3.20 | 4.5 | FAIL |  |
| light | border-control (non-text) | bg | 1.48 | 3 | FAIL | checkbox/radio edge |
| light | border (non-text) | bg | 1.19 | 3 | FAIL | decor; input border would need 3:1 |
| light | border-active (non-text) | bg | 2.58 | 3 | FAIL |  |
| light | icon-subtle (non-text) | bg | 2.58 | 3 | FAIL | icon |
| light | border-control (non-text) | surface | 1.48 | 3 | FAIL | checkbox/radio edge |
| light | border (non-text) | surface | 1.19 | 3 | FAIL | decor; input border would need 3:1 |
| light | border-active (non-text) | surface | 2.58 | 3 | FAIL |  |
| light | icon-subtle (non-text) | surface | 2.58 | 3 | FAIL | icon |
| light | border-control (non-text) | surface-inset | 1.38 | 3 | FAIL | checkbox/radio edge |
| light | border (non-text) | surface-inset | 1.11 | 3 | FAIL | decor; input border would need 3:1 |
| light | border-active (non-text) | surface-inset | 2.41 | 3 | FAIL |  |
| light | icon-subtle (non-text) | surface-inset | 2.41 | 3 | FAIL | icon |
| light | success-solid (non-text) | bg | 2.22 | 3 | FAIL | status dot |
| light | success-solid (non-text) | surface | 2.22 | 3 | FAIL | status dot |
| light | warning-solid (non-text) | bg | 1.91 | 3 | FAIL | status dot |
| light | warning-solid (non-text) | surface | 1.91 | 3 | FAIL | status dot |
| light | chart-1 (non-text) | bg | 1.86 | 3 | FAIL | chart mark |
| light | chart-1 (non-text) | surface | 1.86 | 3 | FAIL | chart mark |
| light | chart-2 (non-text) | bg | 1.53 | 3 | FAIL | chart mark |
| light | chart-2 (non-text) | surface | 1.53 | 3 | FAIL | chart mark |
| light | chart-3 (non-text) | bg | 2.76 | 3 | FAIL | chart mark |
| light | chart-3 (non-text) | surface | 2.76 | 3 | FAIL | chart mark |
| light | chart-4 (non-text) | bg | 2.18 | 3 | FAIL | chart mark |
| light | chart-4 (non-text) | surface | 2.18 | 3 | FAIL | chart mark |
| light | chart-5 (non-text) | bg | 2.79 | 3 | FAIL | chart mark |
| light | chart-5 (non-text) | surface | 2.79 | 3 | FAIL | chart mark |
| light | chart-7 (non-text) | bg | 1.94 | 3 | FAIL | chart mark |
| light | chart-7 (non-text) | surface | 1.94 | 3 | FAIL | chart mark |
| light | chart-8 (non-text) | bg | 1.57 | 3 | FAIL | chart mark |
| light | chart-8 (non-text) | surface | 1.57 | 3 | FAIL | chart mark |
| light | chart-10 (non-text) | bg | 2.58 | 3 | FAIL | chart mark |
| light | chart-10 (non-text) | surface | 2.58 | 3 | FAIL | chart mark |
| light | chart-track (non-text) | surface | 1.19 | 1.5 | FAIL | track |
| dark | text-subtle | surface-hover | 3.81 | 4.5 | FAIL |  |
| dark | text-disabled | surface | 1.00 | 3 | FAIL | disabled exempt; aim Lc30/3:1 |
| dark | text-disabled | surface-inset | 1.18 | 3 | FAIL | disabled exempt |
| dark | disabled-fg | disabled-from | 2.19 | 3 | FAIL | disabled exempt |
| dark | accent-fg | accent-500 | 3.76 | 4.5 | FAIL |  |
| dark | on-solid | danger-from | 3.81 | 4.5 | FAIL |  |
| dark | on-solid | danger-hover-from | 2.89 | 4.5 | FAIL |  |
| dark | on-solid | success-solid | 2.22 | 4.5 | FAIL |  |
| dark | on-solid | warning-solid | 1.91 | 4.5 | FAIL |  |
| dark | on-solid | danger-solid | 3.81 | 4.5 | FAIL |  |
| dark | accent-soft-fg | accent-soft-active | 3.77 | 4.5 | FAIL |  |
| dark | accent-soft-disabled-fg | accent-soft-disabled | 2.14 | 3 | FAIL | disabled exempt |
| dark | kbd-fg | kbd-bg | 4.01 | 4.5 | FAIL |  |
| dark | border-control (non-text) | bg | 1.81 | 3 | FAIL | checkbox/radio edge |
| dark | border (non-text) | bg | 1.81 | 3 | FAIL | decor; input border would need 3:1 |
| dark | border-active (non-text) | bg | 2.40 | 3 | FAIL |  |
| dark | icon-subtle (non-text) | bg | 2.40 | 3 | FAIL | icon |
| dark | border-control (non-text) | surface | 1.46 | 3 | FAIL | checkbox/radio edge |
| dark | border (non-text) | surface | 1.46 | 3 | FAIL | decor; input border would need 3:1 |
| dark | border-active (non-text) | surface | 1.94 | 3 | FAIL |  |
| dark | icon-subtle (non-text) | surface | 1.94 | 3 | FAIL | icon |
| dark | border-control (non-text) | surface-inset | 1.73 | 3 | FAIL | checkbox/radio edge |
| dark | border (non-text) | surface-inset | 1.73 | 3 | FAIL | decor; input border would need 3:1 |
| dark | border-active (non-text) | surface-inset | 2.29 | 3 | FAIL |  |
| dark | icon-subtle (non-text) | surface-inset | 2.29 | 3 | FAIL | icon |
| dark | chart-track (non-text) | surface | 1.00 | 1.5 | FAIL | track |

### Accent ramp contrast (all 8 accents)
Columns are ratios. 500-on-white drives focus ring + button gradient top; white/600 and white/500 are the primary-button label; 700-on-100 and 300-on-900 are `accent-soft-fg` on `accent-soft` (light/dark); 500/400/300 on dark bg are dark-mode accent text/ring.

| accent | white/600 | white/500 | 500 on white | 500 on dark bg | 400 on dark bg | 700 on 100 (soft fg light) | 300 on 900 (soft fg dark) | 700 on white | 600 on white | 300 on dark bg |
|---|---|---|---|---|---|---|---|---|---|---|
| blue | 5.25 | 3.76 | 3.76 | 4.98 | 5.97 | 5.60 | 5.72 | 6.83 | 5.25 | 10.33 |
| violet | 5.89 | 4.40 | 4.40 | 4.26 | 6.57 | 6.15 | 5.94 | 7.30 | 5.89 | 10.10 |
| pink | 4.54 | 3.58 | 3.58 | 5.23 | 6.78 | 5.02 | 5.31 | 5.91 | 4.54 | 10.28 |
| red | 4.77 | 3.81 | 3.81 | 4.92 | 6.49 | 5.27 | 5.22 | 6.42 | 4.77 | 9.76 |
| amber | 3.20 | 2.13 | 2.13 | 8.77 | 10.88 | 4.52 | 6.26 | 5.03 | 3.20 | 12.95 |
| emerald | 3.65 | 2.47 | 2.47 | 7.57 | 9.66 | 4.72 | 6.33 | 5.36 | 3.65 | 12.31 |
| cyan | 3.62 | 2.37 | 2.37 | 7.92 | 10.35 | 4.71 | 6.34 | 5.28 | 3.62 | 12.98 |
| indigo | 6.46 | 4.58 | 4.58 | 4.09 | 5.99 | 6.57 | 5.71 | 8.09 | 6.46 | 9.32 |

### Full measured table (all 226 pairs, both themes)

| theme | fg | bg | ratio | req | result | note |
|---|---|---|---|---|---|---|
| light | text | bg | 19.80 | 4.5 | pass |  |
| light | text | surface | 19.80 | 4.5 | pass |  |
| light | text | surface-inset | 18.48 | 4.5 | pass |  |
| light | text | surface-tertiary | 16.61 | 4.5 | pass |  |
| light | text-muted | bg | 7.00 | 4.5 | pass |  |
| light | text-muted | surface | 7.00 | 4.5 | pass |  |
| light | text-muted | surface-inset | 6.54 | 4.5 | pass |  |
| light | text-muted | surface-tertiary | 5.88 | 4.5 | pass |  |
| light | text-subtle | bg | 5.74 | 4.5 | pass |  |
| light | text-subtle | surface | 5.74 | 4.5 | pass |  |
| light | text-subtle | surface-inset | 5.36 | 4.5 | pass |  |
| light | text-subtle | surface-tertiary | 4.82 | 4.5 | pass |  |
| light | text-placeholder | bg | 5.74 | 4.5 | pass |  |
| light | text-placeholder | surface | 5.74 | 4.5 | pass |  |
| light | text-placeholder | surface-inset | 5.36 | 4.5 | pass |  |
| light | text-placeholder | surface-tertiary | 4.82 | 4.5 | pass |  |
| light | text-error | bg | 4.77 | 4.5 | pass |  |
| light | text-error | surface | 4.77 | 4.5 | pass |  |
| light | text-error | surface-inset | 4.45 | 4.5 | FAIL |  |
| light | text-error | surface-tertiary | 4.00 | 4.5 | FAIL |  |
| light | text-on-tertiary | surface-tertiary | 6.55 | 4.5 | pass |  |
| light | text-muted | accent-soft(selected) | 5.74 | 4.5 | pass |  |
| light | text | accent-soft(selected) | 16.23 | 4.5 | pass |  |
| light | text-subtle | surface-hover | 5.36 | 4.5 | pass |  |
| light | text-muted | surface-hover | 6.54 | 4.5 | pass |  |
| light | text-subtle | surface-tertiary | 4.82 | 4.5 | pass |  |
| light | text-error | error-bg | 3.91 | 4.5 | FAIL |  |
| light | text-subtle | error-bg | 4.71 | 4.5 | pass |  |
| light | text-disabled | surface | 1.48 | 3 | FAIL | disabled exempt; aim Lc30/3:1 |
| light | text-disabled | surface-inset | 1.38 | 3 | FAIL | disabled exempt |
| light | disabled-fg | disabled-from | 2.17 | 3 | FAIL | disabled exempt |
| light | disabled-fg | disabled-to | 1.74 | 3 | FAIL | disabled exempt |
| light | accent-fg | accent-600 | 5.25 | 4.5 | pass |  |
| light | accent-fg | accent-500 | 3.76 | 4.5 | FAIL |  |
| light | on-solid | danger-from | 3.81 | 4.5 | FAIL |  |
| light | on-solid | danger-to | 4.77 | 4.5 | pass |  |
| light | on-solid | danger-hover-from | 2.89 | 4.5 | FAIL |  |
| light | on-solid | success-solid | 2.22 | 4.5 | FAIL |  |
| light | on-solid | warning-solid | 1.91 | 4.5 | FAIL |  |
| light | on-solid | info-solid | 4.58 | 4.5 | pass |  |
| light | on-solid | danger-solid | 3.81 | 4.5 | FAIL |  |
| light | accent-soft-fg | accent-soft | 5.60 | 4.5 | pass |  |
| light | accent-soft-fg | accent-soft-hover | 4.80 | 4.5 | pass |  |
| light | accent-soft-fg | accent-soft-active | 3.77 | 4.5 | FAIL |  |
| light | accent-soft-disabled-fg | accent-soft-disabled | 1.67 | 3 | FAIL | disabled exempt |
| light | success-fg | success-bg on bg | 6.02 | 4.5 | pass |  |
| light | success-fg | success-bg on surface | 6.02 | 4.5 | pass |  |
| light | warning-fg | warning-bg on bg | 5.88 | 4.5 | pass |  |
| light | warning-fg | warning-bg on surface | 5.88 | 4.5 | pass |  |
| light | danger-fg | danger-bg on bg | 5.59 | 4.5 | pass |  |
| light | danger-fg | danger-bg on surface | 5.59 | 4.5 | pass |  |
| light | info-fg | info-bg on bg | 6.20 | 4.5 | pass |  |
| light | info-fg | info-bg on surface | 6.20 | 4.5 | pass |  |
| light | cyan-fg | cyan-bg on bg | 5.81 | 4.5 | pass |  |
| light | cyan-fg | cyan-bg on surface | 5.81 | 4.5 | pass |  |
| light | orange-fg | orange-bg on bg | 5.41 | 4.5 | pass |  |
| light | orange-fg | orange-bg on surface | 5.41 | 4.5 | pass |  |
| light | purple-fg | purple-bg on bg | 4.70 | 4.5 | pass |  |
| light | purple-fg | purple-bg on surface | 4.70 | 4.5 | pass |  |
| light | kbd-fg | kbd-bg | 3.20 | 4.5 | FAIL |  |
| light | on-chart | chart-1 | 10.62 | 4.5 | pass |  |
| light | on-chart | chart-8 | 12.58 | 4.5 | pass |  |
| light | on-chart | chart-3 | 7.17 | 4.5 | pass |  |
| light | on-chart | chart-6 | 6.31 | 4.5 | pass |  |
| light | on-chart | chart-5 | 7.09 | 4.5 | pass |  |
| light | on-chart | chart-9 | 6.33 | 4.5 | pass |  |
| light | focus-ring (non-text) | bg | 3.76 | 3 | pass |  |
| light | border-control (non-text) | bg | 1.48 | 3 | FAIL | checkbox/radio edge |
| light | border (non-text) | bg | 1.19 | 3 | FAIL | decor; input border would need 3:1 |
| light | border-active (non-text) | bg | 2.58 | 3 | FAIL |  |
| light | icon-muted (non-text) | bg | 4.74 | 3 | pass |  |
| light | icon-subtle (non-text) | bg | 2.58 | 3 | FAIL | icon |
| light | focus-ring (non-text) | surface | 3.76 | 3 | pass |  |
| light | border-control (non-text) | surface | 1.48 | 3 | FAIL | checkbox/radio edge |
| light | border (non-text) | surface | 1.19 | 3 | FAIL | decor; input border would need 3:1 |
| light | border-active (non-text) | surface | 2.58 | 3 | FAIL |  |
| light | icon-muted (non-text) | surface | 4.74 | 3 | pass |  |
| light | icon-subtle (non-text) | surface | 2.58 | 3 | FAIL | icon |
| light | focus-ring (non-text) | surface-inset | 3.51 | 3 | pass |  |
| light | border-control (non-text) | surface-inset | 1.38 | 3 | FAIL | checkbox/radio edge |
| light | border (non-text) | surface-inset | 1.11 | 3 | FAIL | decor; input border would need 3:1 |
| light | border-active (non-text) | surface-inset | 2.41 | 3 | FAIL |  |
| light | icon-muted (non-text) | surface-inset | 4.43 | 3 | pass |  |
| light | icon-subtle (non-text) | surface-inset | 2.41 | 3 | FAIL | icon |
| light | success-solid (non-text) | bg | 2.22 | 3 | FAIL | status dot |
| light | success-solid (non-text) | surface | 2.22 | 3 | FAIL | status dot |
| light | warning-solid (non-text) | bg | 1.91 | 3 | FAIL | status dot |
| light | warning-solid (non-text) | surface | 1.91 | 3 | FAIL | status dot |
| light | danger-solid (non-text) | bg | 3.81 | 3 | pass | status dot |
| light | danger-solid (non-text) | surface | 3.81 | 3 | pass | status dot |
| light | info-solid (non-text) | bg | 4.58 | 3 | pass | status dot |
| light | info-solid (non-text) | surface | 4.58 | 3 | pass | status dot |
| light | chart-1 (non-text) | bg | 1.86 | 3 | FAIL | chart mark |
| light | chart-1 (non-text) | surface | 1.86 | 3 | FAIL | chart mark |
| light | chart-2 (non-text) | bg | 1.53 | 3 | FAIL | chart mark |
| light | chart-2 (non-text) | surface | 1.53 | 3 | FAIL | chart mark |
| light | chart-3 (non-text) | bg | 2.76 | 3 | FAIL | chart mark |
| light | chart-3 (non-text) | surface | 2.76 | 3 | FAIL | chart mark |
| light | chart-4 (non-text) | bg | 2.18 | 3 | FAIL | chart mark |
| light | chart-4 (non-text) | surface | 2.18 | 3 | FAIL | chart mark |
| light | chart-5 (non-text) | bg | 2.79 | 3 | FAIL | chart mark |
| light | chart-5 (non-text) | surface | 2.79 | 3 | FAIL | chart mark |
| light | chart-6 (non-text) | bg | 3.14 | 3 | pass | chart mark |
| light | chart-6 (non-text) | surface | 3.14 | 3 | pass | chart mark |
| light | chart-7 (non-text) | bg | 1.94 | 3 | FAIL | chart mark |
| light | chart-7 (non-text) | surface | 1.94 | 3 | FAIL | chart mark |
| light | chart-8 (non-text) | bg | 1.57 | 3 | FAIL | chart mark |
| light | chart-8 (non-text) | surface | 1.57 | 3 | FAIL | chart mark |
| light | chart-9 (non-text) | bg | 3.13 | 3 | pass | chart mark |
| light | chart-9 (non-text) | surface | 3.13 | 3 | pass | chart mark |
| light | chart-10 (non-text) | bg | 2.58 | 3 | FAIL | chart mark |
| light | chart-10 (non-text) | surface | 2.58 | 3 | FAIL | chart mark |
| light | chart-track (non-text) | surface | 1.19 | 1.5 | FAIL | track |
| dark | text | bg | 17.95 | 4.5 | pass |  |
| dark | text | surface | 14.50 | 4.5 | pass |  |
| dark | text | surface-inset | 17.18 | 4.5 | pass |  |
| dark | text | surface-tertiary | 14.50 | 4.5 | pass |  |
| dark | text-muted | bg | 8.64 | 4.5 | pass |  |
| dark | text-muted | surface | 6.98 | 4.5 | pass |  |
| dark | text-muted | surface-inset | 8.27 | 4.5 | pass |  |
| dark | text-muted | surface-tertiary | 6.98 | 4.5 | pass |  |
| dark | text-subtle | bg | 5.87 | 4.5 | pass |  |
| dark | text-subtle | surface | 4.74 | 4.5 | pass |  |
| dark | text-subtle | surface-inset | 5.62 | 4.5 | pass |  |
| dark | text-subtle | surface-tertiary | 4.74 | 4.5 | pass |  |
| dark | text-placeholder | bg | 7.25 | 4.5 | pass |  |
| dark | text-placeholder | surface | 5.86 | 4.5 | pass |  |
| dark | text-placeholder | surface-inset | 6.94 | 4.5 | pass |  |
| dark | text-placeholder | surface-tertiary | 5.86 | 4.5 | pass |  |
| dark | text-error | bg | 6.49 | 4.5 | pass |  |
| dark | text-error | surface | 5.24 | 4.5 | pass |  |
| dark | text-error | surface-inset | 6.21 | 4.5 | pass |  |
| dark | text-error | surface-tertiary | 5.24 | 4.5 | pass |  |
| dark | text-on-tertiary | surface-tertiary | 10.21 | 4.5 | pass |  |
| dark | text-muted | accent-soft(selected) | 4.78 | 4.5 | pass |  |
| dark | text | accent-soft(selected) | 9.93 | 4.5 | pass |  |
| dark | text-subtle | surface-hover | 3.81 | 4.5 | FAIL |  |
| dark | text-muted | surface-hover | 5.61 | 4.5 | pass |  |
| dark | text-subtle | surface-tertiary | 4.74 | 4.5 | pass |  |
| dark | text-error | error-bg | 6.11 | 4.5 | pass |  |
| dark | text-subtle | error-bg | 5.53 | 4.5 | pass |  |
| dark | text-disabled | surface | 1.00 | 3 | FAIL | disabled exempt; aim Lc30/3:1 |
| dark | text-disabled | surface-inset | 1.18 | 3 | FAIL | disabled exempt |
| dark | disabled-fg | disabled-from | 2.19 | 3 | FAIL | disabled exempt |
| dark | disabled-fg | disabled-to | 3.19 | 3 | pass | disabled exempt |
| dark | accent-fg | accent-600 | 5.25 | 4.5 | pass |  |
| dark | accent-fg | accent-500 | 3.76 | 4.5 | FAIL |  |
| dark | on-solid | danger-from | 3.81 | 4.5 | FAIL |  |
| dark | on-solid | danger-to | 4.77 | 4.5 | pass |  |
| dark | on-solid | danger-hover-from | 2.89 | 4.5 | FAIL |  |
| dark | on-solid | success-solid | 2.22 | 4.5 | FAIL |  |
| dark | on-solid | warning-solid | 1.91 | 4.5 | FAIL |  |
| dark | on-solid | info-solid | 4.58 | 4.5 | pass |  |
| dark | on-solid | danger-solid | 3.81 | 4.5 | FAIL |  |
| dark | accent-soft-fg | accent-soft | 5.72 | 4.5 | pass |  |
| dark | accent-soft-fg | accent-soft-hover | 4.87 | 4.5 | pass |  |
| dark | accent-soft-fg | accent-soft-active | 3.77 | 4.5 | FAIL |  |
| dark | accent-soft-disabled-fg | accent-soft-disabled | 2.14 | 3 | FAIL | disabled exempt |
| dark | success-fg | success-bg on bg | 8.45 | 4.5 | pass |  |
| dark | success-fg | success-bg on surface | 7.67 | 4.5 | pass |  |
| dark | warning-fg | warning-bg on bg | 8.60 | 4.5 | pass |  |
| dark | warning-fg | warning-bg on surface | 7.82 | 4.5 | pass |  |
| dark | danger-fg | danger-bg on bg | 6.05 | 4.5 | pass |  |
| dark | danger-fg | danger-bg on surface | 5.61 | 4.5 | pass |  |
| dark | info-fg | info-bg on bg | 9.10 | 4.5 | pass |  |
| dark | info-fg | info-bg on surface | 8.27 | 4.5 | pass |  |
| dark | cyan-fg | cyan-bg on bg | 8.71 | 4.5 | pass |  |
| dark | cyan-fg | cyan-bg on surface | 7.88 | 4.5 | pass |  |
| dark | orange-fg | orange-bg on bg | 5.96 | 4.5 | pass |  |
| dark | orange-fg | orange-bg on surface | 5.47 | 4.5 | pass |  |
| dark | purple-fg | purple-bg on bg | 8.64 | 4.5 | pass |  |
| dark | purple-fg | purple-bg on surface | 7.64 | 4.5 | pass |  |
| dark | kbd-fg | kbd-bg | 4.01 | 4.5 | FAIL |  |
| dark | on-chart | chart-1 | 10.62 | 4.5 | pass |  |
| dark | on-chart | chart-8 | 12.58 | 4.5 | pass |  |
| dark | on-chart | chart-3 | 7.17 | 4.5 | pass |  |
| dark | on-chart | chart-6 | 6.31 | 4.5 | pass |  |
| dark | on-chart | chart-5 | 7.09 | 4.5 | pass |  |
| dark | on-chart | chart-9 | 6.33 | 4.5 | pass |  |
| dark | focus-ring (non-text) | bg | 4.98 | 3 | pass |  |
| dark | border-control (non-text) | bg | 1.81 | 3 | FAIL | checkbox/radio edge |
| dark | border (non-text) | bg | 1.81 | 3 | FAIL | decor; input border would need 3:1 |
| dark | border-active (non-text) | bg | 2.40 | 3 | FAIL |  |
| dark | icon-muted (non-text) | bg | 3.95 | 3 | pass |  |
| dark | icon-subtle (non-text) | bg | 2.40 | 3 | FAIL | icon |
| dark | focus-ring (non-text) | surface | 4.02 | 3 | pass |  |
| dark | border-control (non-text) | surface | 1.46 | 3 | FAIL | checkbox/radio edge |
| dark | border (non-text) | surface | 1.46 | 3 | FAIL | decor; input border would need 3:1 |
| dark | border-active (non-text) | surface | 1.94 | 3 | FAIL |  |
| dark | icon-muted (non-text) | surface | 3.19 | 3 | pass |  |
| dark | icon-subtle (non-text) | surface | 1.94 | 3 | FAIL | icon |
| dark | focus-ring (non-text) | surface-inset | 4.77 | 3 | pass |  |
| dark | border-control (non-text) | surface-inset | 1.73 | 3 | FAIL | checkbox/radio edge |
| dark | border (non-text) | surface-inset | 1.73 | 3 | FAIL | decor; input border would need 3:1 |
| dark | border-active (non-text) | surface-inset | 2.29 | 3 | FAIL |  |
| dark | icon-muted (non-text) | surface-inset | 3.78 | 3 | pass |  |
| dark | icon-subtle (non-text) | surface-inset | 2.29 | 3 | FAIL | icon |
| dark | success-solid (non-text) | bg | 8.45 | 3 | pass | status dot |
| dark | success-solid (non-text) | surface | 6.82 | 3 | pass | status dot |
| dark | warning-solid (non-text) | bg | 9.81 | 3 | pass | status dot |
| dark | warning-solid (non-text) | surface | 7.92 | 3 | pass | status dot |
| dark | danger-solid (non-text) | bg | 4.92 | 3 | pass | status dot |
| dark | danger-solid (non-text) | surface | 3.97 | 3 | pass | status dot |
| dark | info-solid (non-text) | bg | 4.09 | 3 | pass | status dot |
| dark | info-solid (non-text) | surface | 3.31 | 3 | pass | status dot |
| dark | chart-1 (non-text) | bg | 10.05 | 3 | pass | chart mark |
| dark | chart-1 (non-text) | surface | 8.12 | 3 | pass | chart mark |
| dark | chart-2 (non-text) | bg | 12.22 | 3 | pass | chart mark |
| dark | chart-2 (non-text) | surface | 9.87 | 3 | pass | chart mark |
| dark | chart-3 (non-text) | bg | 6.78 | 3 | pass | chart mark |
| dark | chart-3 (non-text) | surface | 5.48 | 3 | pass | chart mark |
| dark | chart-4 (non-text) | bg | 8.60 | 3 | pass | chart mark |
| dark | chart-4 (non-text) | surface | 6.95 | 3 | pass | chart mark |
| dark | chart-5 (non-text) | bg | 6.71 | 3 | pass | chart mark |
| dark | chart-5 (non-text) | surface | 5.42 | 3 | pass | chart mark |
| dark | chart-6 (non-text) | bg | 5.97 | 3 | pass | chart mark |
| dark | chart-6 (non-text) | surface | 4.83 | 3 | pass | chart mark |
| dark | chart-7 (non-text) | bg | 9.66 | 3 | pass | chart mark |
| dark | chart-7 (non-text) | surface | 7.81 | 3 | pass | chart mark |
| dark | chart-8 (non-text) | bg | 11.91 | 3 | pass | chart mark |
| dark | chart-8 (non-text) | surface | 9.62 | 3 | pass | chart mark |
| dark | chart-9 (non-text) | bg | 5.99 | 3 | pass | chart mark |
| dark | chart-9 (non-text) | surface | 4.84 | 3 | pass | chart mark |
| dark | chart-10 (non-text) | bg | 7.25 | 3 | pass | chart mark |
| dark | chart-10 (non-text) | surface | 5.86 | 3 | pass | chart mark |
| dark | chart-track (non-text) | surface | 1.00 | 1.5 | FAIL | track |

Script: `/tmp/cr/c.mjs` (kept outside the repo; reads colors.stylex.ts + themes.ts, alpha-composites, WCAG 2.x). CVD: Machado 2009 severity-1.0 matrices, OKLab dE x100.
