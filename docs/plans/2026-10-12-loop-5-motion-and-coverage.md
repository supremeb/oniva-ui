---
title: Loop 5 — motion system + coverage expansion (8 parallel workers)
status: active
created: 2026-10-12
inputs: docs/research/loop5-gap-list.md · docs/research/loop5-motion-recipes.md · docs/reviews/loop5-motion-audit.md · docs/plans/loop5-motion-system.md
bar: Emil Kowalski skills (~/code/emilkowalski-skills/skills/*), Rauno interfaces, Vercel Web Interface Guidelines, Anthropic frontend-design
---

# Loop 5

5a (done first, single worker): motion tokens + `src/motion/` primitives (Presence, AnimatedHeight, SlidingIndicator,
usePressScale, AnimatedNumber, Stagger, useInView, TextReveal, Shimmer, CrossFade) + AGENTS.md "Motion rules".

Then 8 workers in parallel, disjoint folders. Every worker: read AGENTS.md "Motion rules" + docs/plans/WORKER-BRIEF.md +
the Emil skills (emil-design-eng, animate, review-animations) and self-review every animation against review-animations
before reporting. No new dependencies.

## 5b — apply motion to existing components (edit existing folders)
- **M1 Overlays**: Toast → Sonner-grade (stacking w/ depth scale/peek, expand on hover, pause timers on hover/focus, swipe-to-dismiss w/ velocity, exit anim);
  Drawer → Vaul-grade drag-to-dismiss + snap points + new `BottomSheet`; Dialog (200 in / 140 out, scale only, mobile sheet);
  Popover/Tooltip/HoverCard origin-aware; Tooltip skip-delay within 300ms; DropdownMenu/ContextMenu ease-out exits; CommandPalette no scale, instant highlight.
  Folders: Toast, Drawer (+ new BottomSheet), Dialog, AlertDialog, Popover, Tooltip, HoverCard, DropdownMenu, ContextMenu, CommandPalette, internal/overlays-*.
- **M2 Controls**: press scale (Button, IconButton, ToggleButton, CloseButton, Checkbox, Radio, Tag); Switch → transform + subtle overshoot;
  SlidingIndicator in Tabs, SegmentedControl, ToggleButtonGroup, Sidebar active pill (+ hover pill); Accordion/Collapsible AnimatedHeight;
  InputOTP digit roll + gliding ring + success sweep; Field/Input ErrorShake; Select/Combobox/MultiSelect/DatePicker popover origin-aware.
  Folders: those components + internal/feedback-control.ts, internal/forms-*, internal/focus.ts, internal/checkbox-box.tsx.
- **M3 Feedback/Charts/AI/Widgets**: ProgressBar/Meter transform; Skeleton→content CrossFade; Spinner/loader polish + offscreen pause;
  charts: entrance once-in-view (clip wipe / bar grow / draw-on, ≤400ms stagger), data-change tween, gradient/glow/SVG-pattern fill defs,
  scrub crosshair with rolling values, donut morph between periods, stacked/grouped/blocks bar variants;
  AnimatedNumber in StatCard/ChartCard/widgets; TextShimmer/AgentThinking/ResponseStream → TextReveal streaming words.
  Folders: ProgressBar, Meter, Skeleton, Spinner, RingProgress, src/charts/**, internal/charts-*, src/widgets/**, src/ai/{TextShimmer,AgentThinking,ResponseStream,ComposerLoader}.

## 5c — new components (new folders only)
- **N1 AI batch A** (`src/ai/`): Reasoning, ChainOfThought, ThinkingStates, Artifact (panel), Sources, Suggestions, ToolApproval (Confirmation),
  PlanCard, ContextMeter, TokenCounter, FileDiff (DiffViewer), MessageBranch, MessageActions, TypingIndicator, AgentStatusPill, RunLog (Terminal).
- **N2 AI batch B** (`src/ai/`): SpeechInput, AudioWaveform, VoiceOrb, ImageGenGrid + the remaining AI P1 rows from the gap list
  (pick ≥12: e.g. MemoryPanel, McpServerList, ModelCompare, PromptLibrary, AgentCard, AgentAvatar, StreamingTable, InlineCitation hover, BranchTree, CostBadge, ApprovalQueue, AgentHandoff).
- **N3 Motion primitives** (`src/motion/`): BorderBeam, ShineBorder, Marquee, DynamicIsland, SuccessCheck (spinner→check), CopyButton (icon swap),
  HoverPill (shared-layout bg), Loaders pack (dots, bars, matrix, comet, typing), SpotlightCard, TiltCard, MagneticButton, Ripple, Confetti,
  TextScramble, RollingText, GlowCard, plus remaining Motion P0/P1 from the gap list.
- **N4 Blocks** (`src/blocks/`): Hero (4 variants), SiteHeader (+mega menu), FeatureGrid, FeatureBento, LogoCloud (+carousel), Pricing (+billing toggle),
  Testimonials, CTA, FAQ, Changelog, Waitlist (success check), Footer, StatsBand, Newsletter.
- **N5 Data/dashboard extras** (new folders in `src/components/` or `src/widgets/`): Kanban (drag via RAC useDrag/useDrop/GridList DnD, WIP limits),
  Timeline (activity), DataGrid (resize, inline edit, sticky cols, virtualized rows, summary row), FilterBar (chips w/ operators), DateRangePresets
  (preset list + DateRangePicker composition — new folder, don't edit DateRangePicker), KpiStrip, Carousel, Leaderboard, InvoiceCard, InboxList.

## Done when
Whole-repo typecheck/lint/vitest/build green; every new page renders w/o console errors and passes axe (real-browser axe via injected axe-core);
each worker's self-review against Emil's review-animations recorded in its report; compound notes written.
