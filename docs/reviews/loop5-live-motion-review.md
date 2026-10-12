# Loop 5 live motion review (oniva-ui)

Method: built docs, served via `vite preview` on :4370, drove Chromium via Playwright (hash routes). Time-boxed pass: automated sweep of every `#/components/*` page + `#/` for rotate-pivot geometry, horizontal overflow and page errors; scripted interactions on Toast, Tabs/Segmented/ToggleButtonGroup/Sidebar indicators, Dialog/Drawer/BottomSheet/Popover/Menu/Select/CommandPalette (animation duration/easing read from `getAnimations()`).

| Area | Verdict | Rule | Notes |
|---|---|---|---|
| Spinners / rotate keyframes (all pages) | pass | spinner-rotation-pivot | Only spotlight-beam (intentional top pivot) and success-check (mid-animation SVG bbox) differ; no orbiting. |
| Page errors / h-scroll (1440 wide) | pass | n/a | 0 page errors. |
| Toast stack | pass | interruptible, origin | 4 fired: stacked peek, scaled/offset, newest in front. |
| Tabs / Segmented / ToggleButtonGroup / Sidebar indicators | pass (LTR) | indicators align on first paint | Indicator box == active item box (0px delta); line/vertical variants intentionally 2px. |
| SlidingIndicator in RTL | FIX (P1) | RTL / geometry | Anchored with `inset-inline-start` but x comes from physical `offsetLeft`, so in RTL the pill sat far from the active item. Now anchored `left:0; right:auto` inline. Verified first group aligned (0,0). |
| SlidingIndicator easing | FIX (P2) | ease-in-out for on-screen movement | Primitive default was ease-out; now `ease-in-out` (consumers already overrode). |
| Dialog / Drawer / BottomSheet / Popover / Menu / Select / Command palette | pass | durations by interaction | enter 200 / 400 / 400 / 150 / 150 / 200 / 80; command palette 80ms opacity. |

## Not verified (this pass)
Tooltip/HoverCard hover timing and placement (hover did not open in scripted pass), drawer/bottom-sheet drag with `page.mouse`, 390px width (no viewport resize API in the harness), reduced-motion emulation, dark theme and non-blue accent screenshots, Charts, Widgets, Blocks, Templates. Re-run these with the `e2e` suite or a harness that supports `setViewportSize`/`emulateMedia`.
