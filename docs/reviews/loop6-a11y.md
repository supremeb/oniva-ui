# Loop 6 – Accessibility review (WCAG 2.2, better-accessibility skill)

Scope: packages/oniva-ui/src/{components,charts,ai,widgets,motion,blocks} + internal/. Read-only review.
Method: static pattern sweeps over all 227 components (outline removal, div/span onClick, positive tabindex, aria-live/role usage, infinite animation vs reduced-motion, timers, drag handlers, autocomplete, hit-area sizes) + deep reads of Toast, Carousel, ResponseStream, Typewriter, WordRotate, TextScramble, ChartFrame, Kanban, ChatContainer, Waitlist, Newsletter, AuthCard, Drawer, BottomSheet, InboxList, FileUpload, ResizablePanels, LogoCloud/Marquee. Runtime: served the existing `apps/docs/dist` (vite preview :4410), injected axe-core (wcag2a/aa/21aa/22aa + best-practice) on 76 component pages, and tabbed 30 interactive pages checking focus indicator + target size.

Already solid (no finding): no `<div onClick>`; no positive tabindex; every `outline:none` has a `:focus-visible`/RAC `isFocusVisible`/`focus.ring` replacement or sits on an inner input whose wrapper shows the ring; Drawer/BottomSheet/Dialog use RAC Modal (trap, restore, Escape); Kanban uses RAC DnD with keyboard; InboxList swipe has focus buttons; Typewriter/TextScramble/WordRotate respect reduced motion and expose full text; viewport meta has no zoom lock; axe: 0 serious/critical on all pages.

Not verified: 200%/400% zoom reflow at runtime (only the CI 390px check from docs/solutions); screen-reader output (VoiceOver/NVDA); forced-colors; focus-ring contrast numbers (left to better-colors); remaining pages in ai/ and widgets/ were only statically sampled.

Verdict: **Approve with work** — 0 P0, 7 P1, 9 P2.

---
## components/

### P1-1 Toast: action/error toasts auto-dismiss at 5s (WCAG 2.2.1 Timing Adjustable; skill "Nothing the user needs runs on a timer")
- components/Toast/Toast.tsx:201 (`duration = 5000` default for every variant), :221-227 (`promiseToast` settle uses `timeout ?? 5000` for error/success, including a danger result).
- Why: A toast with an `action` (Undo) or `danger`/`warning` variant vanishes on a schedule; the hover/focus pause helps but is not enough for touch/SR users.
- Fix: in `normalize`, default `duration` to `Infinity` when `data.action` is set or variant is `danger`/`warning`; in `settle`, pass `undefined` timeout (persistent) when variant is `danger`, or when the resolved content has an action. Explicit `duration` still wins.
- API impact: none (default behaviour only; explicit `duration` unchanged).

### P1-2 Toast: slide/scale stack transitions ignore prefers-reduced-motion (2.3.3 is AAA, but skill rule "replace slides and scales with opacity crossfade"; HIGH trigger in skill)
- components/Toast/Toast.tsx:60-84 (`slot` transform + transitionProperty `transform, opacity, clip-path`; `enterTy = -dir*70` at :390). File has 0 reduced-motion guards.
- Fix: `transitionProperty: { default: 'transform, opacity, clip-path', [media.reducedMotion]: 'opacity' }` and, via `useReducedMotion()` from internal/motion-hooks, set `enterTy/exitTy = 0` and `scale = 1`. Keep the loading spinner (:109-115) as is (spinners are allowed).
- API impact: none.

### P1-3 Carousel: off-screen slides stay in tab order / AT tree; `aria-label` may read "undefined slides"
- components/Carousel/Carousel.tsx:123 (`${rest['aria-label']} slides` when no aria-label gives "undefined slides"), :139-143 (inactive slides are not `inert`, so links/buttons inside hidden slides are tabbable and scroll the viewport unexpectedly, 2.4.3 / 2.4.11).
- Also :151 `aria-current={i === index}` renders `"false"` on inactive dots; use `i === index ? 'true' : undefined`. Dot hit area: check `dotHit` >= 24px (not measured).
- Fix: `aria-label={rest['aria-label'] ? `${rest['aria-label']} slides` : 'Slides'}`; add `inert={i !== index || undefined}` (React 19 supports `inert`) plus `aria-hidden` is NOT needed with inert; with `loop` scroll-snap keep slides scrollable via the Prev/Next buttons.
- API impact: none.

### P1-4 Tag remove button 18x18 (2.5.8 Target Size AA)
- components/Tag/Tag.tsx:102-117 (`remove` height/width 18; `X size=12`).
- Why: below 24px and the neighbouring chip edge is within the 24px circle, so the spacing exception fails.
- Fix: keep the 18px visual, add `::after { content:''; position:absolute; inset: -3px }` with `position: relative` on `remove` (24x24 hit area; chip padding leaves room).
- API impact: none.

### P2-1 ResizablePanels handle 12px wide (2.5.8); keep, but extend
- components/ResizablePanels/ResizablePanels.tsx:48-49 (`handleH width:12`, `handleV height:12`). Spans the full panel length, so the exception ("the long dimension is large enough") partially applies; axe/tab walk measured 12x260. Recommend extending to 24px with a transparent `::before` (`inset-inline: -6px`) that stays `pointer-events:auto`; verify it doesn't overlap panel content links.
- API impact: none. Also panel `role="group" tabIndex={0}` (:224) adds a tab stop per panel; acceptable (scrollable-region-focusable) – leave.

### P2-2 Toast / CloseButton / IconButton xs are exactly 24px
- Toast.tsx:150,160 (close 24x24), CloseButton.tsx:40 (`sm` 24), IconButton xs 24, Slider thumb 20px (Slider.tsx:59-63, thumb inside a 20px-high track; a 24px hit area is not provided – the track itself is clickable, so passes via equivalent control).
- These pass 2.5.8 but not the 44px touch heuristic. Optional: add a 44px `::after` on touch (`@media (pointer: coarse)`) for Toast close and CloseButton sm.
- API impact: none.

### P2-3 Navbar / Pagination / Sidebar / DataTable: demo pages emit axe `landmark-unique` (moderate)
- Component defaults are correctly labelled (`Primary`, `Pagination`, `Main`); the duplicates come from several instances on one demo page. Fix in demos (give each instance a distinct `aria-label`) and add a note in docs. `LayoutShell` demo nests a second `<main>` inside the docs `<main>` (`landmark-no-duplicate-main`, `landmark-main-is-top-level`): render the shell content `<div role="region">` when nested, or change the demo only.
- API impact: none (demos only).

### P2-4 FileUpload: `<Check/>`/`<AlertCircle/>` carry `aria-label` without role; DropZone exposes a 16x6 focus target
- components/FileUpload/FileUpload.tsx:326-328 (svg with `aria-label` but no `role="img"`; Lucide removes `aria-hidden` when aria props are present, so the name may be ignored). Fix: add `role="img"` to both icons. :300 `browse` Button measured 49x20 (inline in sentence, passes inline exception); the RAC DropZone inner button measured 16x6 in the tab walk – give the hidden DropZone button `position:absolute; inset:0` or hide it from tab order when the `browse` button exists (the visible `browse` button already covers keyboard users).
- API impact: none.

---
## ai/

### P1-5 ResponseStream: streaming text inside `aria-live="polite"` (screen-readers.md, announce rules)
- ai/ResponseStream/ResponseStream.tsx:89 (`aria-busy` + `aria-live="polite"` on the container whose text grows `speed` chars every `intervalMs`, and `TextReveal` splits into per-word spans).
- Why: SR repeats or truncates a stream of mutations; the skill rule is "stable empty region, short self-contained messages".
- Fix: drop `aria-live` from the stream container (keep `aria-busy`); render the visible stream `aria-hidden` while `!isComplete`, with a visually-hidden `role="status"` sibling that is mounted from the start and receives the full `text` only when `isComplete` (and "Generating response" before). When `render` is provided, same sibling approach.
- API impact: none.

### P1-6 VoiceOrb / TypingIndicator / ImageGenerationLoader / AgentStatusPill: state carried only by `aria-label` on `role="status"`
- ai/VoiceOrb/VoiceOrb.tsx:123 (label includes `captions[state]`; changing `aria-label` on a role=status node is not announced), ai/TypingIndicator/TypingIndicator.tsx:44, ai/ImageGenerationLoader/ImageGenerationLoader.tsx:81, motion/Loaders/Loaders.tsx:121, components/Spinner/Spinner.tsx:66.
- Why: live regions announce text content changes, not attribute changes (skill: loading states announced via polite region text; "Loading…" then outcome).
- Fix: render the label/caption as visually-hidden text content inside the `role="status"` element (`<VisuallyHidden>{label}</VisuallyHidden>`) and remove the `aria-label`; VoiceOrb must update that text on state change. Keep the node mounted (it is).
- API impact: none.

### P2-5 Late-mounted `role="status"` nodes (inserted together with their text)
- ai/FeedbackBar/FeedbackBar.tsx:60, ai/ToolApproval/ToolApproval.tsx:99, ai/PlanCard/PlanCard.tsx:89, ai/FileDiff/FileDiff.tsx:124, ai/StreamingTable/StreamingTable.tsx:74 and widgets/AuthCard/AuthCard.tsx:124 (`role="alert"` inserted with text; acceptable for alert but focus is not moved).
- Skill: "Inserting a polite region with its content is announced inconsistently."
- Fix: wrap in a stable always-mounted `<div role="status">` container (visually unaffected) and swap the child; for AuthCard also set `aria-invalid` on the offending inputs is not possible (error is form-level) – keep `role="alert"`.
- API impact: none.

### P2-6 Copy buttons announce via aria-label swap only
- ai/CodeBlock/CodeBlock.tsx:~120 and ai/Message/Message.tsx:118 (`aria-label={copied ? 'Copied' : 'Copy …'}`; no live region). motion/CopyButton does it right (stable `role="status"`). Fix: reuse CopyButton's `<span role="status">` pattern (VisuallyHidden, always mounted).
- API impact: none.

### P2-7 ChatContainer: `role="log"` + redundant `aria-live="polite"` on a focusable scroller
- ai/ChatContainer/ChatContainer.tsx:116-121. `role=log` already implies polite; remove `aria-live` to avoid double handling. Streaming tokens inside the log have the same flooding risk as P1-5; ensure `Message` streaming content uses the P1-5 pattern.
- API impact: none.

---
## motion/

### P1-7 WordRotate / Marquee: auto-updating content without a visible pause control (2.2.2 Pause, Stop, Hide)
- motion/WordRotate/WordRotate.tsx:50-57 (infinite interval, pauses on pointer hover only, not on focus, no control), motion/Marquee/Marquee.tsx:69+ (pauses on hover/focus but offers no visible control; infinite > 5s), blocks/LogoCloud (uses Marquee – inherits).
- Why: 2.2.2 (Level A) requires a mechanism for anything auto-moving > 5s that is not essential. Hover/focus pause is not a visible control; keyboard-only users who never focus inside cannot stop it.
- Fix: WordRotate: stop after one full pass of the words (cap at `words.length` rotations, then rest on the last/first word) so motion ends within a few cycles; also pause on `focusin`. Marquee: add an optional built-in visually small pause toggle shown on focus-within and hover (no new required prop; default `true` for the built-in toggle, `false` hides it) – OR, if adding a prop is undesirable, stop the loop after N iterations. Mark as **P2-deferred** if the toggle needs a new prop; the iteration-cap fix is API-neutral.
- API impact: none for the iteration cap / focus pause; a visible toggle needs a new optional prop (P2-deferred).

### P2-8 Typewriter / TextScramble / WordRotate: initial paint hides or scrambles text for sighted low-vision users only
- Fine for SR (full text via VisuallyHidden). No change required; documented for completeness.

---
## charts/

### P1-8 ChartFrame: every data point is `tabIndex={0}` (2.4.3 / APG roving; keyboard tedium)
- charts/_shared/ChartFrame.tsx:126 (`bind()` returns `tabIndex: 0` for every bar/point/segment). A 50-point line chart = 50 tab stops; the user cannot skip the chart (2.1.1 passes, 2.4.1/“bypass” heuristic fails).
- Fix (API-neutral): make the `<svg role="group">` the single tab stop (`tabIndex=0`) and give points `tabIndex=-1`; add an `onKeyDown` on the svg that roves with ArrowLeft/Right/Up/Down, Home/End over `[role=graphics-symbol]` (focus the next, which fires the existing onFocus → tooltip). Escape handling already exists at :137. `bind()` stays internal.
- API impact: none (internal `TipBind`).

### P2-9 Charts without `dataTable` have no text equivalent for the series
- ChartFrame.tsx:56-60 & :172 render the sr-only table only when `dataTable` is passed. Most chart components (BarChart, LineChart, AreaChart, DonutChart…) show no `role`/`aria-label` of their own in their .tsx (summary only on Sparkline/CategoryBar/Tracker). Recommend auto-generating the sr-only table from `data` inside each chart (props already available) so SR users get values without hovering points. Not breaking, but touches 15 files → mark P2.
- API impact: none (derived from existing props).

---
## blocks/ and widgets/

### P2-10 Waitlist / Newsletter: email field lacks `autocomplete`, `name`, inline error path (1.3.5 Identify Input Purpose, AA)
- blocks/Waitlist/Waitlist.tsx:~110 and blocks/Newsletter/Newsletter.tsx:~77: `<Input type="email" aria-label="Email address" …>` without `autoComplete="email"`, `name="email"`, `inputMode="email"`. The `placeholder` duplicates the label example (ok), but the visible label is absent (aria-label only; fine).
- Waitlist.tsx:~100: `await onJoin?.(email)` without try/catch – a rejection leaves `state==='loading'` forever and the button spinner never stops; Newsletter sets `done` regardless. Fix: try/catch, restore `idle`, show an inline `role="alert"` error linked via `aria-describedby`; focus the input.
- Both put `aria-live="polite"` on the form/wrapper that also contains the inputs (Newsletter.tsx:46 on `<form>`); move the live region to a dedicated always-mounted `<div role="status">` around the success text only.
- API impact: none.

### P2-11 AuthCard: forgot password is an `<a href="#forgot">` with `onPress` and no navigation (semantics-and-aria.md "link that performs an action is a button")
- widgets/AuthCard/AuthCard.tsx:120, 187-190. If `onForgotPassword` is provided and no href is desired, render `Link` with a real `href` prop or a `<Button variant="link">`. With no `href` the "#forgot" hash changes the URL in SPA apps. Also add `name="email"`/`name="password"` to the Inputs and `aria-describedby` for the form error (:124). Form-level `role="alert"` is acceptable.
- API impact: none.

### P2-12 Hero / dashboards decorative pieces
- blocks/Hero/Hero.tsx:121 `aria-hidden` dashboard mock: verify it contains no focusable elements (not verified). If it does, add `inert`.

---
## Cross-cutting (fix once)

- **internal/focus.ts**: ring is `2px solid focus-ring` with offset 2 (good). Forced-colors fallback is not set; add `@media (forced-colors: active) { outlineColor: 'Highlight' }` via stylex `forcedColors` media key (if available in tokens/media.stylex.ts, else add the key). API impact: none.
- **Sticky chrome (2.4.11)**: no `scroll-padding-top` in components with sticky headers (SiteHeader, Navbar sticky, DataTable sticky header). Add `scrollPaddingTop` to the scroller of DataTable/DataGrid and to the docs `html`. API impact: none.
- **Reduced motion coverage**: of ~60 files that animate, 56 use `media.reducedMotion`; files with transitions but no guard (not all are problems; colour-only transitions are fine): Toast.tsx (see P1-2), internal/overlays-drag.ts, components/Accordion/Collapsible/TreeView (height/chevron rotate), motion/AnimatedHeight, SlidingIndicator, HoverPill, DynamicIsland, Presence, InView, charts/StageBars|FunnelChart|BarList|ComboChart (verify entrance presets use `animationName` map as in charts-styles.ts). Fix workers should add `{ default: x, [media.reducedMotion]: 'none' }` to transform/slide transitions; opacity/colour transitions can stay.

## Counts
P0: 0 · P1: 8 (Toast timer, Toast motion, Carousel, Tag target, ResponseStream live, status-by-aria-label, WordRotate/Marquee pause, ChartFrame tab stops) · P2: 12 (+ cross-cutting).
Folder split for workers: components (P1-1..4, P2-1..4), ai (P1-5,6, P2-5..7), motion (P1-7), charts (P1-8, P2-9), blocks+widgets (P2-10..12), cross-cutting.
