# Changelog

All notable changes to oniva-ui. Versions follow [Semantic Versioning](https://semver.org): while the major version is 0,
a minor bump (0.x.0) adds components or opt-in props, and a patch bump (0.x.y) fixes bugs without API changes.

## 0.2.0 — 2026-10-27

### Added
- **Agent components (`ai/`):** AgentCursors, AgentGraph, AgentInbox, AgentLanes, AgentLedger, AgentQueue, AgentSteering,
  AgentTree, AiAnswer, AutonomyDial, CitedAnswer, ConflictRadar, ContextMap, ContextWindow, DecisionInbox, DecisionTree,
  DelegateBoard, EmailDraft, FanOutGrid, ParallelAttempts, PermissionRequest, ReviewCenter, SmartRecommendation,
  ThinkingLoader, TraceWaterfall, WritingAssistant.
- **Components:** BillingSchedule, CommentThread, CommentsPanel, DataSheet, ExperimentCard, FilterMenu, IntegrationPicker,
  IntegrationSettings, NotificationStack, ProfileMenu, ProgressTracker, ProjectCard, ReactionBar, SetupGuide, StepperForm,
  TipsPanel; `ComboboxMulti` (multi-select with chips).
- **DataSheet:** a real spreadsheet grid — cell and range selection, typed in-place editors (title, tag, link, number, date,
  text), tag picker, copy/cut/paste as TSV with Excel and Google Sheets, delete, undo/redo, sort, row checkboxes, add row.
- **Charts:** BreakdownChart, CompactBreakdown, KpiChart. **Widgets:** ChangeSummary, UsageOverview.
- **Blocks:** AgentGallery, AiWorkspace, AppDirectory, ClientContext, InvoiceCredit, KpiBoard, MetricsDashboard, TaskBoard.
- **Screens (new group):** AppShell (flat / inset, workspace panel), AgentChat, AgentRun, Analytics, AssistantHome, Crm,
  Evals, Folder, Folders, Integrations, Onboarding, SettingsBilling.
- **Motion:** GradientFloor, GridBackground, LayoutGlide (FLIP for lists).
- **Opt-in props and variants on existing components** (defaults unchanged): DataTable `layout="sheet"` (renders DataSheet),
  `editable`, `tagTones`, `icon`; Button `loadingStyle="shimmer"`; SegmentedControl `variant="underline"`, item icon/count/badge;
  InputOTP `status`, `align`, `variant="filled"`; DateRangePicker `layout="panel"`, presets, compare; FileUpload
  `variant="panel"`, `maxSize`, retry; CommandPalette `inline`, `quickRun`; Composer `variant="tray"`, `footer`;
  ModelSelector `variant="detailed"`; ThinkingStates `variant="card"` steps mode; MessageActions `variant="panel"`;
  MemoryPanel `variant="grouped"`; PromptLibrary `variant="split"`; FileDiff `layout="prose"`; ToolApproval `variant="row"`;
  PlanCard `layout="timeline"`; ToolCallGroup; Pricing `variant="compact"`; LogoCloud marquee; Testimonials wall;
  Toast `hotkey` (F8 by default).

### Changed
- Motion pass across the library: enter/exit, FLIP reorders, rolling numbers, chart draw-in, meter fills, state morphs;
  all reduced-motion aware. Keyboard-driven highlight moves stay instant.
- Layout and density pass on the new components and screens.
- `widgets/UsageMeter` was introduced as `UsageOverview` to avoid a name clash with `ai/CostBadge`'s `UsageMeter`.
- Vitest timeout raised to 15s for the full suite.

### Removed / disabled
- The Illustrations group is disabled: not exported from the package and not shown in the docs. Source is kept in
  `src/illustrations` for later.

## 0.1.0 — 2026-10-13

- Initial release: core components, charts, AI/agent components, motion primitives, widgets, blocks and the docs site.
