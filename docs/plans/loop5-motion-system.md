# Loop 5 Proposed Motion System for oniva-ui (StyleX)

## 1. Tokens (replace/extend `tokens/motion.stylex.ts`)
Keep existing names as aliases (non-breaking), add:
```ts
export const motion = stylex.defineVars({
  // durations (reduced motion -> 0.01ms retained for state transitions)
  '--oniva-motion-dur-instant': '0ms',
  '--oniva-motion-dur-press':   '120ms',
  '--oniva-motion-dur-fast':    '100ms',   // exits of small popups
  '--oniva-motion-dur-base':    '150ms',
  '--oniva-motion-dur-enter':   '200ms',   // popover/menu/dialog enter
  '--oniva-motion-dur-slow':    '250ms',
  '--oniva-motion-dur-sheet':   '400ms',   // drawer/sheet
  '--oniva-motion-dur-height':  '250ms',
  // easings
  '--oniva-motion-ease-out':        'cubic-bezier(0.23, 1, 0.32, 1)',  // quint-ish, default for enter/exit/press
  '--oniva-motion-ease-out-expo':   'cubic-bezier(0.16, 1, 0.3, 1)',   // big moves, number roll
  '--oniva-motion-ease-in-out':     'cubic-bezier(0.77, 0, 0.175, 1)', // on-screen movement, indicators
  '--oniva-motion-ease-drawer':     'cubic-bezier(0.32, 0.72, 0, 1)',  // drawer/sheet/toast stack
  '--oniva-motion-ease-standard':   'cubic-bezier(0.4, 0, 0.2, 1)',    // legacy alias
  '--oniva-motion-ease-in':         'cubic-bezier(0.4, 0, 1, 1)',      // DEPRECATED: do not use for UI
  // distances / scale (collapse to 0 / 1 under reduced motion)
  '--oniva-motion-pop-scale':   { default: '0.96', [media.reducedMotion]: '1' },
  '--oniva-motion-press-scale': { default: '0.97', [media.reducedMotion]: '0.99' },
  '--oniva-motion-travel':      { default: '8px',  [media.reducedMotion]: '0px' },
  '--oniva-motion-stagger':     '35ms',
});
```
Add to `media.stylex.ts`: `hover: '@media (hover: hover) and (pointer: fine)'`, `coarse: '@media (pointer: coarse)'`.
JS spring presets (only if dependency adopted, or used by `useSpring` primitive): `snappy {stiffness:520,damping:38}`, `gentle {300,30}`, `bouncy {duration:.5,bounce:.2}` (use sparingly), `drag-release {stiffness:400,damping:35}`. CSS approximation for no-JS: `linear()` easing generated from spring (`--oniva-motion-spring-snappy: linear(0,0.35 12%,0.82 30%,1.03 52%,1 70%,1)`; supported Chrome 113/Safari 17.2/FF 112; fallback ease-drawer).
Rules doc: enter ease-out 150-250 / exit 60% of enter, ease-out; keyboard-triggered surfaces (CommandPalette, menus opened by key) skip scale; hover color 100-150ms; never `transition: all`; only transform/opacity (+ clip-path, filter blur <=4px).

## 2. Dependency decision: `motion` / framer-motion vs CSS + WAAPI
| Factor | `motion` (LazyMotion + `m`, domAnimation) | Pure CSS + WAAPI + ~1.5KB hooks |
|---|---|---|
| Bundle | ~4.6KB (`animate` mini) to ~17KB (LazyMotion domAnimation); layout/drag adds ~12KB+ more | 0 KB deps; own hooks ~2-3KB gz total |
| StyleX | Works (className/style passthrough) but motion drives inline `style` -> fights StyleX atomic classes for transforms; two sources of truth | Native: tokens, `data-*` state, CSS vars (`--indicator-x`) |
| RSC | needs `'use client'` everywhere it is used (library already client via RAC) | same (RAC is client) |
| Springs | Real springs, velocity hand-off on interrupt | `linear()` springs (static, no velocity hand-off); JS rAF spring only for drag release |
| Layout/shared-element, AnimatePresence | Excellent (`layoutId`, presence) | Must hand-roll: FLIP util + RAC `isEntering/isExiting` (already gives presence for overlays) |
| Gestures (drag/swipe) | Good, but touch-action/scroll conflicts still on us | Pointer Events hook ~80 lines for drawer + toast swipe |
| Peer-dep cost for consumers | Adds a runtime dep to a design-system library: version pinning, dual React-contexts risk, SSR | None |
**Recommendation: NO hard dependency. Pure CSS (transitions for interruptible state, keyframes/RAC data-attrs for overlay enter/exit) + WAAPI/Pointer-Events primitives.** RAC already supplies presence for Popover/Dialog/Modal/Toast/Tooltip. Gaps (Drawer drag, Toast swipe, layout reflow of toasts, AnimatedNumber) are small enough for hooks. Escape hatch: expose optional `peerDependencies` `motion` ONLY if a later loop needs layoutId-style shared-element transitions (e.g. DataTable reorder); load via dynamic import, never in the core entry. Revisit if >3 components need velocity-aware springs.

## 3. Shared primitives (put in `src/motion/` ; export hooks, not components, where possible)
| Primitive | API | Implementation notes |
|---|---|---|
| `usePresence(isOpen, {exitMs})` / `<Presence>` | returns `{mounted, state: 'entering'|'entered'|'exiting'}` | for non-RAC conditionals (Tag removal, list items, banners). Sets `data-state`; unmounts on `animationend`/`transitionend` w/ timeout fallback = exitMs+50; skips when reduced motion. Interruptible (re-open during exit flips state back, no remount). |
| `useAnimatedHeight(ref, open)` | `{style/className}` | Primary: grid-rows `0fr->1fr` CSS class (`motionStyles.collapse`, `.collapseInner`); fallback ResizeObserver + `height` px WAAPI for Safari <17.4/old. Handles `hidden="until-found"`. |
| `<SlidingIndicator>` + `useSlidingIndicator(containerRef, activeKey)` | sets `--indicator-x/-y/-w/-h`; `data-ready` after first measure | ResizeObserver + `offsetLeft/Width`, rtl aware; indicator `transform: translate(var(--x)) ` + `width` transition via `clip-path` variant for SegmentedControl; no animation first paint or when tab list overflows/scrolls. |
| `usePressScale()` / `motionStyles.pressable` | StyleX style: `transform` + `:active` scale | StyleX-only (no hook needed): `pressable: { transform: { default:'none', ':active:not([data-disabled])': 'scale(var(--oniva-motion-press-scale))' }, transitionProperty:'transform,…' }`. Hook version only for non-button elements (`onPointerDown` sets `data-pressed`). |
| `<AnimatedNumber value format>` | `Intl.NumberFormat` options; `trend` | Splits formatted parts, per-digit column (translateY by digit*1em, 400ms ease-out-expo, blur 2px mid), `aria-label` full value, `tabular-nums`, SSR renders plain text. Reduced motion: crossfade. ~1.2KB. |
| `<Stagger>` / `useStaggerStyle(i)` | `style={{'--i': i}}` + CSS `animation-delay: calc(min(var(--i),6) * var(--oniva-motion-stagger))` | Enter once on mount; `data-stagger-seen` prevents replay on re-render. |
| `useDragDismiss({axis, threshold, velocity})` | pointer-capture drag with rubber-band, velocity 0.11px/ms, returns `{bind, progress}` and writes `--drag` CSS var | Used by Drawer, Toast swipe, bottom sheet. `touch-action` set per axis; ignore drag from scrollable inner content; `will-change:transform` only while dragging. |
| `useInViewAnimation(ref)` | pauses infinite loops / triggers chart draw-in once | IntersectionObserver + `document.visibilityState`. |
| `useWarmTooltip()` | module-level last-close timestamp | Tooltip delay skip + `data-instant`. |
| `flip(elements)` util | FLIP with WAAPI | Toast reflow, list removals. |

## 4. Per-component change list (worker-executable; order = priority)
1. **tokens**: apply §1; keep aliases; update docs "Motion" page and all `ease-in` exits -> `ease-out`. Files: `tokens/motion.stylex.ts`, `tokens/media.stylex.ts`.
2. **Pressables**: add `pressable` style to Button, IconButton, ToggleButton, SegmentedControl item, Tabs tab, Pagination item, CloseButton, Checkbox/Radio/Switch root (scale .94-.97). Files: `internal/feedback-control.ts`, `Button.tsx`, `CloseButton.tsx`, etc. Gate hover with `media.hover`; add `touch-action: manipulation`.
3. **Popover family** (Popover, Tooltip, HoverCard, Select, Combobox, MultiSelect, DatePicker*, overlays-menu): origin-aware transform-origin (var + placement fallback), enter 160-200ms ease-out `scale(var(--pop-scale))`, exit 100ms ease-out; Tooltip warm-skip.
4. **CommandPalette**: remove scale; opacity-only 80ms; instant item highlight; `overscroll-behavior: contain`.
5. **Dialog/AlertDialog**: 200/140ms, drop translateY; <=640px bottom-sheet variant using ease-drawer.
6. **Drawer**: sheet durations 400/300 with ease-drawer; `useDragDismiss`; handle + backdrop progress; `overscroll-behavior: contain`.
7. **Toast**: exit animation, stacked layout (CSS vars `--index`, `--front-height`), hover expand, swipe via `useDragDismiss`, pause on hover/hidden tab, FLIP reflow.
8. **Tabs, SegmentedControl, Sidebar, NavigationMenu**: `SlidingIndicator` replacing border/bg active styles; keep non-JS fallback (`:not([data-ready])` uses current style).
9. **Accordion, Collapsible, TreeView expand, DataTable expandable row**: `useAnimatedHeight` + chevron 200ms.
10. **Switch**: transform knob + press squish. **Checkbox/Radio**: check draw/dot scale. **Slider**: thumb scale, no `left` transition while dragging.
11. **ProgressBar / RingProgress / Gauge / Meter**: transform/dashoffset transitions; `AnimatedNumber` for value labels; widgets (Stat, MostActiveDays, etc.).
12. **Skeleton + Spinner + Button pending**: transform shimmer, crossfade boundary, reduced-motion pulse.
13. **Charts**: draw-in once on in-view, cap stagger 400ms, data-update tweens; add visible focus for `charts-styles.ts` outline:none (L106).
14. **AI**: TextShimmer/ComposerLoader/ImageGenerationLoader pause offscreen via `useInViewAnimation`; AgentThinking->answer crossfade; TaskList `Stagger` + status-icon swap; ChatContainer scroll-to-bottom smooth only when near bottom (`scroll-behavior` guard + `overscroll-behavior`).
15. **Reduced-motion policy**: introduce `--oniva-motion-travel/pop-scale` collapse; replace blanket `animationName: none` for enter/exit with opacity-only; loops -> static/pulse.
16. **Global a11y/touch**: 44px coarse-pointer hit areas for Switch/Checkbox/Radio/Slider thumb/CloseButton/Tag remove; `-webkit-tap-highlight-color: transparent`; `overscroll-behavior: contain` on all popups; `Intl` replace `compactNumber`.
17. **Docs app**: Motion/Tokens page with live curve visualizer; per-component "Motion" section listing duration/ease; theme-toggle `transition:none` guard; hero stagger once; code-copy icon morph.
18. **Tests**: assert via vitest/jest-dom that elements have `data-entering/exiting`; Playwright visual: reduced-motion emulation yields no transform; lint rule (stylelint-ish script) failing on `transition: all`, `ease-in` in exits, and animated `width/height/left/top` in `stylex.create`.

## 5. Acceptance
Frame budget: all new motion on transform/opacity (check DevTools Performance, no layout in animations). Interrupt test: spam-toggle Switch/Accordion/Popover mid-animation, state follows without jump. Reduced-motion emulation passes. Bundle delta <= 3KB gz for motion/ primitives; tree-shakable per hook.
