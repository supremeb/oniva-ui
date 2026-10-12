# BoardUI design-language spec (for oniva-ui)

Source: live computed styles + stylesheet vars on boardui.com (Oct 2026). BoardUI = Tailwind v4 + React Aria. Values below are measured; hex was converted from the site's lab()/oklch values. Re-implement originally; do not copy BoardUI source/icons/assets.
Screenshots: `docs/research/boardui-shots/` (home-light, home-dark, button-page, sidebar-page, data-table).
REA (`rea-agents`) was skipped: computed-style inspection gave everything needed.

## 0. Architecture insight
Two tiers: (1) primitives = Tailwind default palette + overrides (neutral-100 `#f7f7f7`, neutral-200 `#ebebeb`, neutral-925 `#121212`, blue-400 `#3392ff`); (2) ~400 semantic tokens named like Figma paths (`--color-background-primary-default`). Components only consume semantic tokens; dark mode = `.dark` remaps the same semantic names. Accent = `--color-accent-50..950` ramp aliasing a hue (default blue). Charts/status colors do NOT follow accent.

## 1. Color

### Neutrals (primitives)
50 `#fafafa` · 100 `#f7f7f7` · 200 `#ebebeb` · 300 `#d4d4d4` · 400 `#a1a1a1` · 500 `#737373` · 600 `#525252` · 700 `#404040` · 800 `#262626` · 900 `#171717` · 950 `#0a0a0a` · 925 `#121212` (dark canvas)

### Semantic neutrals (light | dark)
| role | light | dark |
|---|---|---|
| background-full (page canvas) | #fff | #121212 |
| background-primary-default (card/tile/button fill) | #fff | neutral-800 #262626 |
| background-inner-default (tile inside card) | #fff | #262626 @60% |
| background-primary-hover | n100 #f7f7f7 | n700 @60% |
| background-primary-active | n200 #ebebeb | n800 |
| background-secondary-default (OUTER card / inset / segmented track) | n100 #f7f7f7 | n900 #171717 |
| background-secondary-hover | n200 | n800 |
| background-tertiary-default (badges, pills, avatar) | n200 #ebebeb | n800 |
| background-tertiary-hover | n300 | n700 |
| background-quaternary-default | n300 | n300 |
| notification-center bg | #fff | n900 |
| segmented-control bg / selected | n100 / #fff | #121212 / n800 |
| border-button-default | n200 #ebebeb | n700 #404040 |
| border-button-hover / active | n300 / n400 | n500 / n600 |
| border-checkbox default/hover | n300 / n400 | n700 / n500 |
| border-table, separator, card border | n200 | n800 |
| separator-strong | n200 | n700 @60% |
| border-focus-ring | blue-500 #2b7fff | same |
| text-primary | n950 #0a0a0a | n50 #fafafa |
| text-secondary | n500 #737373 | n500 |
| text-tertiary / placeholder | n400 #a1a1a1 | n600 (placeholder n400) |
| text-disabled | n300 | n800 |
| text-error | red-500 #fb2c36 | red-400 #ff6467 |
| icon primary/secondary/tertiary/quaternary | n950 / n500 / n400 / n300 | n50 / n500 / n600 / n700 |
| kbd bg / fg | n300 / n500 | n700 / n400 |

### Primary / accent (blue default)
50 `#eff6ff` 100 `#dbeafe` 200 `#bedbff` 300 `#8ec5ff` 400 `#3392ff` 500 `#2b7fff` 600 `#155dfc` 700 `#1447e6` 800 `#193cb8` 900 `#1c398e` 950 `#162556`
- Primary button: gradient 180deg 500 -> 600 (default), 400 -> 500 (hover), 600 -> 700 (active). White text. Inset highlight `inset 0 1.75px 0 0 #ffffff40, inset 0 0 0 0.875px accent-500`.
- Ghost/soft button ("Mark as done"): bg 100, hover 200, active 300, fg 700 (dark: bg 900, hover 800, active 700, fg 300; disabled bg 50 / fg 300).
- Danger button: gradient red-500 `#fb2c36` -> red-600 `#e7000b`; hover red-400->500; active red-600 `#e7000b`->red-700 `#c10007`.
- Disabled (primary & danger): neutral gradient #ebebeb -> #d4d4d4, text n400 (dark: n700 -> n800, text n500).
- Switch ON chip: oklab(0.594 -0.035 -0.223) -> oklab(0.497 -0.025 -0.242) (= blue 500/600); knob 24px gradient #fff 44% -> #f7f7f7.

### Accent variants (all remap `--color-accent-50..950` to same step of Tailwind v4 hue)
blue (default), violet, pink, red, amber, emerald, cyan, indigo, + custom. Measured steps:
- violet: 200 #ddd6ff 300 #c4b4ff 400 #a684ff 500 #8e51ff 600 #7f22fe 700 #7008e7 800 #5d0ec0 950 #2f0d68
- pink: 100 #fce7f3 200 #fccee8 300 #fda5d5 400 #fb64b6 500 #f6339a 600 #e60076 700 #c6005c 950 #510424
- red: 100 #ffe2e2 200 #ffc9c9 300 #ffa2a2 400 #ff6467 500 #fb2c36 600 #e7000b 700 #c10007 900 #82181a 950 #460809
- amber: 200 #fee685 300 #ffd230 400 #ffb900 500 #fe9a00 600 #e17100 700 #bb4d00 800 #973c00 950 #461901
- emerald: 100 #d0fae5 200 #a4f4cf 300 #5ee9b5 400 #00d492 500 #00bc7d 600 #009966 700 #007a55 800 #006045 950 #002c22
- cyan: 200 #a2f4fd 300 #53eafd 400 #00d3f2 500 #00b8db 600 #0092b8 700 #007595 800 #005f78 950 #053345
- indigo: 100 #e0e7ff 200 #c6d2ff 300 #a3b3ff 400 #7c86ff 500 #615fff 600 #4f39f6 700 #432dd7 800 #372aac 950 #1e1a4d
Missing steps (50/900 etc.): use Tailwind v4 default scale for that hue (not exposed on site). Dark mode uses `accent-500` at 10-15% alpha for tinted fills.

### Status chips (bg / text) light | dark
- lime (success/"Shipped"): lime-200 #d8f999 / lime-800 #3c6300 | lime-950 #192e03 @60% / lime-500 #7ccf00
- yellow (warning/"Waiting"): yellow-200 #fff085 / yellow-800 #894b00 | yellow-950 #432004 @60% / yellow-500 #f0b100
- rose (danger/"Delivery failed"): rose-200 #ffccd3 / rose-800 #a50036 | rose-950 #4d0218 @60% / rose-500 #ff2056
- cyan: cyan-200 #a2f4fd / cyan-800 #005f78 | cyan-950 #053345 @60% / cyan-400 #00d3f2
- orange: orange-200 #ffd6a7 / orange-800 #9f2d00 | orange-950 #441306 @60% / orange-500 #ff6900
- blue: blue-200 #bedbff / blue-800 #193cb8 | blue-950 @60% / blue-300 #8ec5ff
- purple: purple-100 #f3e8ff / purple-600 #9810fa | purple-900 #59168b @50% / purple-300 #dab2ff
- Status dot halos (12px ring around 6px dot): green-100 #dbfce7, yellow-200 #fff085, indigo-100 #e0e7ff; dark = hue-800 @40%. Dot cores: green-500 #00c950, yellow-500 #f0b100, indigo-500 #615fff.
- Success state: bg lime-200, text lime-800 (same both themes).
- Notifications: info bg blue-100 fg blue-700 | success bg lime-100 fg lime-600 | error bg rose-100 fg rose-600 (dark: hue-800 @50% bg, fg 300).
- Error surfaces: background-tertiary-error red-100 #ffe2e2 (dark red-950 @60%); border-error red-500 (dark red-400).

### Chart palette (same in light/dark; each has "-active" one step darker for hover)
1 teal-400 #00d5be (active teal-500 #00bba7) · 2 lime-400 #9ae600 (#7ccf00) · 3 pink-400 #fb64b6 (#f6339a) · 4 sky-400 #00bcff (#00a6f4) · 5 purple-400 #c27aff (#ad46ff) · 6 blue-400 #3392ff (#2b7fff) · 7 emerald-400 #00d492 (#00bc7d) · 8 yellow-400 #fdc700 (#f0b100) · 9 indigo-400 #7c86ff (#615fff)
- agents bar: purple-300 #dab2ff (active purple-400) | dark purple-500 (active purple-600)
- chart-track (bar/ring background): n200 | dark n800; cursor/dashed ref: n300 | n700; chart-neutral "other": n300 | n800.
- Activity rings: pink (3) / lime (2) / cyan-sky (4). Heatmap = purple ramp; weekly bars = teal-400 on n200 track.

## 2. Typography
- Sans: **Inter** (variable, via next/font). Mono: **JetBrains Mono**. Both OSS. System fallback stack. `antialiased`. Default letter-spacing 0 except hero/caption. Tabular numerals: not globally set; apply `font-variant-numeric: tabular-nums` for stat values/tables in oniva-ui.
- Scale (size/line-height px, weights 400/500/600/700 each exist as variants; tracking 0 unless noted):
  - large-title 64/80 · display-1 56/72 · display-2 48/64 · display-3 40/54 · display-4 32/44
  - title-1 24/34 · title-2 20/26 · title-3 18/24 (regular) or 26 (medium+)
  - headline 16/22 · body 14/20 (default UI text) · body-2 13/18
  - caption-1 12/16 +0.15px · caption-2 11/15 +0.2px
- Hero h1 measured: 72px / 84px, weight 500, letter-spacing -1.44px (-0.02em). Body paragraph 16/24 text-secondary.
- UI labels (buttons, tabs, inputs): 14/20 weight 500. Sidebar section label: 12/16 w600, +0.3px tracking, text-tertiary. Badge/count: 12/16 w600. Avatar initials w600 (10/12/16/18px for 20/24/32/36).

## 3. Radius / spacing / shadow / borders / focus / motion
- Radius: 2xs 2 · sm 4 · md 6 · 2lg 10 · lg 8 · xl 12 · 2xl 16 · 2-5xl 20 · 3xl 24 · full 9999. Usage: xs controls 4, sm 8, md 10, segmented inner 6, tiles 10, outer card 16, notification card 10, team menu 12, checkbox 4, pills/avatars/kbd full.
- Spacing: Tailwind 4px base (`--spacing: .25rem`). Common: 2,4,6,8,10,12,16. Container widths 24/28/32/36/42/48/56/64/72rem.
- Shadows (light | dark alpha): card `0 1px 1px #0000000d | #00000024`; xs `0 1px 2px #0000000d`; button/input use shadow-xs-like `0 1px 2px rgba(0,0,0,.05)`; sm `0 1px 2px #0000000f, 0 1px 3px #0000001a`; md `0 2px 4px -1px #0000000f, 0 4px 6px -1px #0000001a`; lg `0 4px 6px -2px #0000000d, 0 10px 15px -3px #0000001a`; xl `0 10px 10px -5px #0000000a, 0 20px 25px -5px #0000001a`; dropdown `0 1px 1px #0000000a, 0 4px 4px #00000005`; sidebar/header float `0 1px 0 #00000005, 0 1px 12px #0000000f, 0 0 1px #00000052`; checkbox selected `inset 0 2px 0 #ffffff40, inset 0 0 0 1px accent-500`. Dark = roughly 1.5-2x alpha.
- Borders: 1px, `border-button-default` (#ebebeb / #404040). Cards themselves are borderless (surface contrast + hairline shadow).
- Focus: ring token `--color-border-focus-ring` = blue-500 #2b7fff (accent-driven); use 2px ring + keyboard-only (focus-visible). Browser default outline appears on bare inputs.
- Motion: default 150ms `cubic-bezier(.4,0,.2,1)` for color/bg/border/shadow (button + input transition both 0.15s). ease-in `(.4,0,1,1)`, ease-out `(0,0,.2,1)`. Blur scale 8/12/24/40px (backdrop, hero glow). Charts/hero use staggered blur-in (stagger vars).

## 4. Component anatomy (measured)
- **Card (nested surfaces)**: outer `section` bg n100 #f7f7f7, padding 8px, radius 16, no border, no shadow. Header row (title text-secondary 14, value title-2/4 numerals + caption "total steps"). Inner content = white tiles (bg #fff, radius 10, shadow-card/xs 0 1px 2px .05), row tiles padding 6px 6px 6px 10px, gap 8. Dark: outer n900, tiles n800 @60%.
- **Button** (all label 14/20 w500, gap 2px icon): lg 40? (hero ~ 40-42) ; md 36h r10 pad 8 (8px icon-side / ~12px text side); sm 32h r8 pad 6/8; xs 24h r4 text 12/16 w600 +.15px, pad 0 8. Icon-only: 36/32/28/24 square, same radius. Secondary/outline: bg #fff, 1px border #ebebeb, shadow-xs, text primary. Primary: blue gradient (see §1). Ghost icon: no bg, icon n500. Button group: joined, border 1px, outer radius 10 only at ends, 38h (with border).
- **Input / Select**: 38h incl. 1px border, radius 10, pad 8px 10px, gap 6, bg #fff, border #ebebeb, shadow-xs, text 14/20 w500 (select value) / w400 (input), placeholder n400. Error: border red-500, tertiary-error bg. Disabled bg n100 text n300 (dark bg n800 @30%).
- **Checkbox**: 16px, radius 4, border #d4d4d4, bg #fff, shadow-xs; checked = accent gradient + inset highlight. Label 14/20 w500; description 14/20 n500.
- **Switch**: 56x32 track pill, knob 24 (inset 4), on = accent gradient, off = white->#f7f7f7 chip; 10px inner indicator dot.
- **Badge**: count badge pad 1px 4px, radius 4, 12/16 w600, bg n200, text n500. Status chips: pill (full radius), text 12-13 w500-600, pad 2px 8px 2px 4px with 6/12px dot or trend icon (24h). "New" badge: bg blue-100 text blue-600 (dark blue-950 / blue-400), pill. kbd: pill, pad 2px 4px, 12px w600 bg n300.
- **Segmented control**: track bg n100, pad 4, radius 10, gap 2, 36h; item 28h radius 6 pad 4/10 14px w500; selected = white pill + shadow-xs, text primary; unselected text n500 w400. Theme toggle variant: track n200, selected white.
- **Tabs**: item 36h pad 8/10 gap 10, label + count badge (selected badge bg blue-100 / dark blue @60%). Pill-tab blue selected bg blue-50.
- **Sidebar**: width ~234, nav item 36h radius 10 pad 8; **active = solid accent gradient pill, white text, inset highlight shadow, count badge (white-ish tint) at right**; inactive text n500/primary, hover bg n200. Section label 12/16 w600 +0.3px n400, pad 8/10/4. Sub-items 32h r6 pad-left 32 text 14 w500 n500, active bg n200 text primary. Search = 36h full-radius pill bg n200 with kbd. Profile/team button 60h r12 bg n200 pad 8/16/8/10 (2px transparent border, hover border n300).
- **Table**: th 45h pad 10/12 bg n100 text n400 14 w500 with 1px top/bottom border n200; td ~58h pad 10/12 14/20 w500 text primary; row dividers n200.
- **Avatar**: circle 20/24/32/36; neutral bg n300 text n500 w600; blue variant bg blue-300 text blue-900; small "+" badge overlay on 72px hero avatar (bg white, shadow).
- **Progress**: multi-segment bar ~56h in agent-progress/context-window card: segments radius 12, white tiles; rings use track n200 + accent/ chart colors; use 4-8px bars radius full for thin progress, segments separated by 2px gaps.
- **Loaders**: dot-matrix/pixel loaders in hero (animated dotted glyphs); composer loader = animated dots. Implement as CSS keyframe dots (originals).
- **Stat card icon tile**: 40x40, radius 10, accent gradient bg, white icon.
- **Page chrome**: header pill buttons 36h r10 white w/ border; hero background pastel vertical blue/pink gradient streaks with noise (decorative, optional).

## 5. Recommended StyleX structure
```
packages/oniva-ui/src/tokens/
  colors.stylex.ts      // defineVars: bgFull,bgPrimary,bgInner,bgSecondary,bgTertiary,bgQuaternary (+hover/active), text{Primary,Secondary,Tertiary,Disabled,Placeholder,Error},
                        //   border{Default,Hover,Active,Table,Separator,SeparatorStrong,Focus,Error}, icon*, accent50..950, status{Lime,Yellow,Rose,Cyan,Orange,Blue,Purple}{Bg,Fg}, chart1..9 (+Active), chartTrack/Cursor/Neutral
  primitives.ts         // raw palette consts (neutral/blue/violet/...) used to build themes; not exported as vars
  space.stylex.ts       // defineVars: s0,s1(2),s2(4),s3(6),s4(8),s5(10),s6(12),s8(16)... (4px base)
  radius.stylex.ts      // xs4 sm6 md8 lg10 xl12 card16 xxl20 xxxl24 full
  font.stylex.ts        // families (sans=Inter, mono=JetBrains Mono), sizes (11,12,13,14,16,18,20,24,32,40,48,56,64,72), lineHeights, weights, tracking (caption .15/.2px, hero -0.02em)
  shadow.stylex.ts      // card, xs, sm, md, lg, xl, dropdown, float, insetHighlight(accent), checkbox
  motion.stylex.ts      // dur{fast:'150ms'}, ease{standard,in,out}
  themes.stylex.ts      // createTheme(colors, {...}) -> darkTheme; accentThemes = {violet,pink,red,amber,emerald,cyan,indigo} each createTheme(colors, {accent50..950, focus, ghost*...})
```
Notes: keep accent vars separate (`accent.stylex.ts`) so accent themes compose with light/dark (apply both theme classNames; StyleX themes on the same var group conflict, so split var groups: `colors` for neutrals/status/chart, `accent` for the ramp). Express alpha dark values as rgba/oklab strings. Use `stylex.defineConsts` for breakpoints. Gradients: derive from accent vars (`linear-gradient(180deg, accent500, accent600)`).
