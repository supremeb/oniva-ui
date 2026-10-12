# Loop 6 fixes: F3 (ai, charts, motion, widgets, blocks)

Verified: vitest on ai/charts/motion/widgets/blocks = 137 files / 231 tests pass; eslint clean; tsc clean for these paths. No API removals; additive props only.

## Fixed
- a11y P1-5 ResponseStream: removed aria-live from the growing text; visible text aria-hidden while streaming; stable `role=status` sibling ("Generating response…" / "Response complete").
- a11y P1-6 VoiceOrb, TypingIndicator, ImageGenerationLoader, Loaders: state text is now VisuallyHidden content inside `role=status` (aria-label removed).
- a11y P1-8 ChartFrame: svg group is the single tab stop (tabIndex 0); points tabIndex -1; Arrow keys (RTL-aware), Home/End rove focus, existing onFocus shows tooltip. Chart tests updated (`tabindex="-1"` selectors).
- a11y P1-7 WordRotate: stops after one full pass, pauses on focus as well as hover (reduced motion already handled).
- a11y P2-10 Waitlist/Newsletter: name/autoComplete/inputMode email; try/catch with inline `role=alert` error linked by aria-describedby (never shows success on rejection); live region moved to a dedicated status node; `onSubscribe` may return a Promise.
- ui P2-18 SuccessCheck blur 10px -> 4px.
- ui P2-20 static will-change removed/moved to :hover/:focus-within (GlowCard, TiltCard, MagneticButton, SpotlightCard, HoverPill, DynamicIsland, n3-ring); removed on Marquee.
- ui P1-4 RTL: PromptLibrary + ConversationList search icon use insetInlineStart.
- writing: "Mark response as good/bad", "Regenerate response" (Message + MessageActions, one term), "Download artifact"/"Close artifact", ToolApproval fallback "Allow this tool to run?", MemoryPanel + NotificationCenter empty states with next step, AuthCard fallback error says how to fix, "Select to dictate", FileDiff "Accept/Reject change N" (hunk jargon), Composer "Permission mode:", Waitlist contractions. Tests updated accordingly.
- i18n: CostBadge + UsageMeter take optional `locale`/`currency`, use useFormatters (no hard-coded `$`/en-US).

## Deferred
- Marquee visible pause control / iteration cap (needs new prop; already pauses on hover/focus/offscreen, static under reduced motion). P2.
- Chart sr-only data table auto-generation for 15 charts (a11y P2-9). P2.
- Status late-mount wrappers (FeedbackBar, ToolApproval, PlanCard, FileDiff, StreamingTable), copy-button live region (CodeBlock/Message), ChatContainer redundant aria-live (a11y P2-5/6/7). P2.
- i18n plurals/labels for Heatmap, Sources, AgentProgress, PromptLibrary, InvoiceCard, KpiStrip, Kanban counts; Reasoning/AgentThinking shared copy; ThinkingStates vocabulary unification; ChartCard prev/next labels. Needs per-component label props; not done this pass.
- SlidingIndicator/AnimatedHeight width/height animation rework; Markdown textAlign start; Pricing "save 20%" prop; AuthCard forgot-password link semantics; tabular-nums on chart `<text>`; SuccessCheck/other P2 items not listed here.
- Full "break" pass (long text, 0/1/1000 items, RTL) was code-read only for the listed components; no runtime visual pass or new break tests were added.

## F3b follow-up
Fixed: i18n via useFormatters/pluralize for Sources (+optional `label`), AgentProgress, PromptLibrary, ModelCompare, Heatmap (ContributionHeatmap unit plurals), InvoiceCard (+optional `locale`); chart formatters (`makeFormatter`/`makeAxisFormatter` take optional locale, all charts pass the React Aria locale; default en-US unchanged). Chart `<text>` already uses shared `svgText.axis/strong` (tabular-nums); tooltip/stat/timer components already carry tabular-nums.
Break pass (runtime, docs vite build served on :4451, 10 pages at 320px + dir=rtl + injected long strings): no overflow found for Composer, ChatContainer, AgentProgress, ToolApproval, FileDiff, RunLog, BarChart, LineChart, StatCard. REAL BUG: Pricing grid was `repeat(3,1fr)` with viewport-only media query, overflowing 320px containers (52 elements out), and long plan strings overflowed. Fixed (auto-fit minmax + overflowWrap anywhere); tests added in Pricing.test.tsx (0/1/50 plans, long strings, grid guard) and Sources.i18n.test.tsx.
Deferred: width/height animation rework (SlidingIndicator/AnimatedHeight, risk to layout; P2); ChartCard prev/next labels; Kanban/KpiStrip not present in owned paths. `npm run build` fails at docs tsc due to concurrent apps/docs edits (not mine); used `vite build` directly.
Verify: tsc clean, eslint clean, vitest 138 files / 235 tests pass.
