# Loop 6: UI polish + layout review (better-ui / better-layout / break)

Scope: static audit of packages/oniva-ui/src (tokens, internal, components, motion, ai, charts, widgets, blocks), plus a partial runtime pass on the docs preview (:4420).
Report-only. No source changed. All fixes below keep the public API unchanged unless stated.

Verification status
- Verified from code: radius math, shadows, physical vs logical props, transitions, will-change, overscroll, 100vh/100vw, press scale, blur values.
- Runtime: a 320px iframe sweep of all 227 component doc pages found no page-level horizontal overflow (iframe-based, so the docs shell's own overflow containers may hide component overflow). The RTL visual pass was cut short when the browser tab closed. Not verified: RTL screenshots, translated-text (+30%) rendering, 0/1/1000-item rendering, tiny/huge containers. The break-style stress items below are code-derived.
- No `transition: all` anywhere, `will-change` always names `transform` (one `transform, opacity`), no `ease-in` used for UI exits. Those rules pass.

## P0
None. Nothing blocks content or an action at a supported viewport on the evidence gathered.

## P1

### Logical properties / RTL (better-layout: "Logical properties for anything that mirrors")
1. components/Dialog/Dialog.tsx:192 (`right: 16`) next to header `paddingInlineEnd: 56` (:135). In RTL the header reserves space on the left but the close button stays on the right, overlapping the title. Fix: replace `right: 16` with `insetInlineEnd: 16`. API impact: none.
2. components/Tabs/Tabs.tsx:70-72, 129-133 (vertical line tabs: `borderRight*`, `marginRight: -1`; `paddingInlineEnd: 4` on :74). In RTL the vertical rail divider stays on the physical right, away from the tabs' inline-end side. Fix: `borderInlineEndColor/Style/Width` and `marginInlineEnd: -1`. Keep the indicator transform physical (AGENTS live-geometry rule). API impact: none.
3. components/DataGrid/DataGrid.tsx:96 (`textAlign: 'right'`), :83-86 (`borderRight*`, sticky `left: 0`). StreamingTable already uses `textAlign: 'end'` (ai/StreamingTable/StreamingTable.tsx:24), so this is also an inconsistency. Fix: `textAlign: 'end'`, `borderInlineEnd*`, sticky `insetInlineStart: 0`. Row absolute `left: 0` (:43) is virtualization geometry, leave physical but flip with `[dir=rtl]` only if columns are RTL-ordered. API impact: none.
4. ai/PromptLibrary/PromptLibrary.tsx:42 and ai/ConversationList/ConversationList.tsx:14 (search icon `left: 10`). The icon stays left while the input's leading padding flips. Fix: `insetInlineStart: 10`. API impact: none.
5. ai/Markdown/Markdown.tsx:106-107 (table cell `textAlign: 'left' | 'right'`). Markdown alignment is source-defined, but the unaligned default must be `start`. Fix: map `:---` to `left`, but default to `textAlign: 'start'` and use `end` for `---:`. API impact: none.

### Hover on touch (better-ui: "Hover effects only on hover-capable pointers")
6. 78 plain `':hover'` conditions, central ones in internal/feedback-control.ts (7), components/Pagination (6), internal/data-table-styles.ts (4), Sidebar (4), NavigationMenu (4), Link (3), SiteHeader (3), Toolbar/Toast/forms-field. No `@media (hover: hover)` key exists in tokens/media.stylex.ts. After a tap the hover state sticks. Fix: add `hover: '@media (hover: hover)'` to `media.stylex.ts`, then write `{ default: x, ':hover': { default: null, [media.hover]: y } }` (StyleX nested form) starting with feedback-control.ts, forms-field.ts, data-table-styles.ts. `-webkit-tap-highlight-color` is already set in feedback-control.ts:43 only; add to Tabs, SegmentedControl, Sidebar, Pagination items. API impact: none.

### Full-height fixed panes (better-layout: `100vh`/`100vw` detection rows)
7. components/Dialog/Dialog.tsx:44,50; components/Drawer/Drawer.tsx:61,65; components/BottomSheet/BottomSheet.tsx:39,43 (`height: '100vh'`, `width: '100vw'` on fixed overlays). On mobile the browser toolbar and keyboard cover the bottom-aligned sheet, and 100vw adds scrollbar width on desktop. Fix: drop both and use `inset: 0` (position fixed already), or `height: '100dvh'`, `width: '100%'`. API impact: none.

## P2

### Concentric radius (better-ui: outer = inner + padding + border)
8. components/Card/Card.tsx:19,25 vs :63. Card radius 16, padding 8, Tile radius 10 (lg). Concentric inner is 8 (inset) or 7 (outline, 1px border). 10 leaves a visibly fat gap at the corners. Fix: `tile.borderRadius` to `radius['--oniva-radius-md']` (8px), and for `tileMd`/`tileLg` (padding 12/16) nothing more to do since the Tile is its own surface. API impact: none.
9. components/Tabs/Tabs.tsx:80-84 (list pill: radius 12 xl, border 1, padding 3) vs :56, :142 (indicator and pill radius-lg 10) and :143 (pillSm radius-md 8). Concentric inner is 12-3-1=8. Fix: `indPill` and `pill` to radius-md (8px), `pillSm` to radius-sm (6px) (6 for sm: pill height 32 inside). API impact: none.
10. components/SegmentedControl/SegmentedControl.tsx:24,34,41 (track radius-lg 10, padding 4; indicator and item radius-md 8). Concentric inner is 6. Fix: `indicator` and `item` to `radius['--oniva-radius-sm']` (6px). API impact: none.
11. internal/overlays-menu.ts:40,83 and internal/forms-popover.ts:13,37 (popup radius-xl 12, border 1, list padding 4; item radius-md 8). Concentric inner is 7. Fix: item radius `calc(12px - 4px - 1px)` = 7px (or radius-sm 6px). Delta is 1px, so lowest priority. API impact: none.

### Shadows / surfaces (better-ui: surfaces.md shadow recipes)
12. tokens/shadow.stylex.ts:5-14. Shadows use opaque-looking hex alpha (`#0000000d`, fine) but the card/xs/sm tokens carry no 1px ring layer, so surfaces rely on a `border` plus shadow (Card.tsx:23-28, Input.tsx:37-45, Tabs listPill). Per skill: depth-only borders should become `0 0 0 1px oklch(0 0 0 / .06), 0 1px 2px -1px oklch(0 0 0 / .06), 0 2px 4px oklch(0 0 0 / .04)` with `border: 1px solid transparent` underneath; keep real borders on inputs, tables, dividers. Candidate only for Card outline and popovers; decide per brand. Dark-mode override should be a single `0 0 0 1px oklch(1 0 0 / .08)`. API impact: none (token values).
13. Content images: ai/Markdown/Markdown.tsx:109 (`img` has radius but no outline), ai/ImageGenGrid, Avatar images. Add `outline: 1px solid oklch(0 0 0 / .1)` (dark `oklch(1 0 0 / .1)`), `outlineOffset: -1`. API impact: none.

### Optical alignment / icons
14. components/Button/Button.tsx:62-80 with internal/feedback-control.ts:128-130 (symmetric `paddingInline` 10/12/16 with `startIcon`/`endIcon`). Buttons with an icon look outward-heavy on the icon side. Fix: when `startIcon` is set, `paddingInlineStart` minus 2px (md 10, lg 14, sm 8); same for `endIcon` on the end side. Apply via an extra style entry, not a prop. API impact: none.
15. Icon stroke consistency: Icon.tsx:41 defaults `strokeWidth = 2`, but inline check icons use 3 (ai/Questionnaire:156, ChainOfThought:150, TaskList:128, ComposerAttachments:160), Spinner 3, SuccessCheck 2/2.2, checkbox 2.25. At 10-12px, 2 renders ~0.9px, 3 ~1.4px. Per icons.md, keep 1.5px rendered at 14-16px with 400 weight text and 2px beside 500-600. Fix: use `vector-effect: non-scaling-stroke` (or lucide `absoluteStrokeWidth`) and set 1.5 for regular, 2 for medium labels (buttons are weight 500 so 2 is right), 2.5 only for tiny check marks. API impact: none (internal defaults).
16. Icon state transitions: motion/CopyButton/CopyButton.tsx:23,28 and internal/n1-ai.tsx:29 cross-fade with scale 0.25 to 1, matching the skill. They omit the 4px blur and the transition curve should be `cubic-bezier(0.2,0,0,1)` 300ms; verify it uses `ease-out` 0.23,1,0.32,1 at dur-base 150ms (project token). Project convention wins; add `filter: blur(4px)` to the hidden state for exact parity if desired. API impact: none.

### Motion (better-ui + AGENTS.md "Motion rules")
17. Press scale token is 0.97 (tokens/motion.stylex.ts:36); skill says 0.96. Checkbox (internal/checkbox-box.tsx:26) and RadioGroup (RadioGroup.tsx:49) use hard-coded `scale(0.94)`, inconsistent with the token. Fix: both to `scale(${motion['--oniva-motion-press-scale']})` and consider 0.96 for the token. API impact: none.
18. motion/SuccessCheck/SuccessCheck.tsx:29 `blur(10px)` exceeds AGENTS cap (blur <= 4px). Fix: `blur(4px)`. Also SuccessCheck.tsx:21,32 `scale(0.6)` starts from small, AGENTS says never scale from 0 (0.6 is fine, 0.25 for icon swaps is the exception).
19. Drawer.tsx:323 `scale(0.94) translateY(8px)` drag-back state; confirm it is reduced-motion gated (inline style bypasses `media.reducedMotion`). Fix: skip scale when `matchMedia('(prefers-reduced-motion: reduce)')`. API impact: none.
20. will-change: motion/GlowCard:37, TiltCard:30, MagneticButton:19, SpotlightCard:51, HoverPill:29, Marquee:35, DynamicIsland:36 and internal/n3-ring:41 set `willChange: 'transform'` statically. Per performance.md it should be added only after seeing stutter, and a permanent layer on each of many instances (card grids, docs galleries) costs memory; also it makes `position: fixed` descendants resolve to the card. Fix: apply on `:hover`/active state or only while animating (as Drawer/BottomSheet already do imperatively). SpotlightBeam.tsx:33 `transform, opacity` is OK if it animates both. API impact: none.
21. components/Sidebar/Sidebar.tsx:68 `transitionProperty: 'width'` and internal/controls-motion.tsx:74 / motion/SlidingIndicator.tsx:82 `transform, width, height`: layout-affecting width transitions. AGENTS says never animate width/height in-flow. Sidebar collapse should use `grid-template-columns` via AnimatedHeight-style pattern or a transform on an inner panel. Indicators are absolute so width/height there is cheaper but `scale`-based sizing avoids layout. API impact: none.

### Overscroll / containment
22. internal/forms-popover.ts:21,32 (`overflow: auto` on listbox/popover) lack `overscrollBehavior: 'contain'`; overlays-menu.ts:78 has it. Also widgets/NotificationCenter, widgets/SettingsModal, ai/ToolApproval/ApprovalQueue popups if rendered in overlays. Fix: add `overscrollBehavior: 'contain'`. API impact: none.

### Room for growth / clipping (better-layout: "Plan for growth")
23. components/Toast/Toast.tsx:51 `maxWidth: '100vw'` with `width: 392`; Toast.tsx:58 `marginLeft: -196` centers with a fixed 392 width, so a toast on a 320px viewport is clipped when the INSET is not subtracted. Fix: `maxWidth: '100%'`, centerX `insetInlineStart: 50%; translate -50%` or `left:0; right:0; marginInline:auto`. blocks/SiteHeader/SiteHeader.tsx:89 and components/CommandPalette/CommandPalette.tsx:28 `calc(100vw - 32px)` should be `calc(100% - 32px)` or `100dvw`. API impact: none.
24. Fixed heights that hold text: Input.tsx:75-77 (32/38/44) and feedback-control.ts:128-134 (Button 32/36/40) use `height`. Long-locale labels (German, +30%) wrap and clip in a fixed-height button; Tabs.tsx:119-120 same. Fix: `minHeight` instead of `height` and `whiteSpace: nowrap` + `maxWidth: 100%` + ellipsis on the label span, or allow wrap. API impact: none.
25. Dialog/Toast/Tabs/Select labels: confirm `minWidth: 0` on flex text children (Card headerText has it, StatCard.left has it). Audit remaining flex rows with text and no `minWidth: 0` using `grep -L minWidth` on components with `display: 'flex'` and a text child (not exhaustively verified).
26. charts/CategoryBar/CategoryBar.tsx:103 marker `left: X%` and components/Slider/Slider.tsx:122 fill `left: start%`: progress-like sequences should mirror in RTL (better-layout: "arrangement encodes progression"). Fix: `insetInlineStart` for the percent anchored items, since they are not measured-offset overlays. Gauge.tsx:17-20, BarList.tsx:34 same check. API impact: none (Slider needs extra care: RAC Slider already mirrors thumb in RTL, so the fill must follow).

### Grouping / proximity / alignment
27. Card.tsx:15 root `gap: 4`, section gap `8` and header `paddingInline: 8`: inside-group 8 vs between-group 4 breaks the "between >= 2x within" rule for header-to-content. Fix: root `gap: 8`, header-to-content stays 8 (tile padding 12 aligns to the 8px header inset only for `tileSm`; use 8px inline inset for header/footer to align edges with tileSm, or add 4px to tileMd). Judge by eye. API impact: none.
28. Borderless icon clearance: Toolbar and Pagination borderless buttons use gap 4 (Tabs list gap 4, Tabs.tsx:38). Skill suggests 24px between glyphs; buttons are 32-36px wide, giving ~16-20px between glyphs. Acceptable density; leave.

## Counts
P0: 0 / P1: 7 (groups) / P2: 21 items (8-28). 

## Top 10
1. Dialog close button physical `right: 16` breaks RTL title overlap (Dialog.tsx:192).
2. Hover not behind `@media (hover: hover)`, 78 sites, fix centrally via media.stylex + feedback-control.
3. 100vh/100vw on Dialog/Drawer/BottomSheet overlays (use inset:0 / dvh).
4. Tabs vertical borderRight/marginRight not RTL-safe.
5. DataGrid textAlign right, borderRight, sticky left (RTL).
6. PromptLibrary/ConversationList search icon `left: 10`.
7. Card Tile radius 10 inside 16/8 (should be 8); Tabs pill 10 inside 12/3 (should be 8); Segmented 8 inside 10/4 (should be 6).
8. SuccessCheck blur(10px) violates the 4px cap; checkbox/radio press 0.94 vs token 0.97.
9. Static `will-change: transform` on 8 motion components; Sidebar/indicators animating width.
10. Fixed `height` on Button/Input/Tab sizes will clip long-locale labels; forms-popover lacks overscroll-behavior.

Verdict: Block is not warranted (no P0). Resolve P1 before release.
