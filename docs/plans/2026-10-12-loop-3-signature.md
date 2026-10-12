---
title: Loop 3 — signature components (charts, AI/agent, dashboard widgets, landing + templates)
status: active
created: 2026-10-12
parent: docs/plans/2026-10-12-oniva-ui-v0.1.md
---

# Loop 3 — signature

Same rules as Loop 2 (docs/plans/WORKER-BRIEF.md). Folders: `src/charts/<Name>/`, `src/ai/<Name>/`, `src/widgets/<Name>/`.
After Loop 2 is merged, workers SHOULD compose Loop-2 components (Select, Tabs, Tooltip, DropdownMenu, Pagination, ProgressBar…).

## Group F — Charts (`src/charts/`) — hand-built SVG with d3-scale/d3-shape/d3-array/d3-sankey

Shared: `ChartCard` (title, big value, delta chip, period switcher slot, legend), `ChartTooltip` (pointer-follow,
keyboard focusable data points), `ChartLegend`, `useChartDimensions` (ResizeObserver), axis/grid helpers in
`src/internal/charts-*.ts`. Palette = chart1..chart10 tokens (teal, lime, pink, sky, purple, blue, emerald, yellow, indigo).
Charts: AreaChart (stacked/100%/gradient fill), BarChart (vertical/horizontal/stacked/grouped, rounded bars,
background track bars like BoardUI "Steps"), LineChart (multi-series, curve options, dots), DonutChart/PieChart (center label),
Sparkline (line/area/bar), ComboChart (bar + line, dual axis), FunnelChart, Heatmap (matrix + calendar-year contributions,
Weekly/Monthly/Yearly), RadarChart (+ comparison), RadialChart / Gauge / Speedometer, ScatterChart (bubble), BarList (ranked),
CategoryBar / Tracker, SankeyChart, StageBars, ActivityRings (concentric progress rings).
A11y: each chart role="img" + aria-label summary, optional visually-hidden data table, focusable points with tooltip.
Animations: draw-in on mount (respect reduced motion).

## Group G — AI & Agent (`src/ai/`)

Composer (auto-grow textarea, attach button, model selector, effort/permission controls, send/stop), ComposerAttachments
(file tiles with circular upload progress ring), ComposerLoader (orbiting light border), ModelSelector, Message
(user/assistant bubble, avatar, actions: copy/retry/thumbs), ChatContainer (auto-scroll + ScrollToBottomButton),
Markdown (marked → safe React rendering, code blocks), CodeBlock (copy button, filename, language label),
ResponseStream (token streaming text effect), TextShimmer, AgentThinking (collapsible "Thinking…" with duration),
AgentProgress / TaskList (multi-step checklist: done ✓ strikethrough, running spinner, pending dashed circle, "5 steps left"),
AgentLimits (context window multi-segment bar + plan usage limits rows "5-hour limit · Resets in 2 hr 46 min · 38%"),
ToolCallCard (name, args, status, collapsible result), WebSearchTrail (queries + favicons/sources), SourceChip/Citation,
Questionnaire (plan-mode questions with options), FeedbackBar, SystemBanner, ImageGenerationLoader.

## Group H — Dashboard widgets (`src/widgets/`)

StatCard (KPI + delta chip + sparkline), DeltaBadge, ActivityWidget (Move/Exercise/Running tiles + ActivityRings),
StepsWidget (week bar chart + date range switcher "29 Jun – 5 Jul"), SleepScoreWidget (score ring + breakdown rows),
MostActiveDays (year of day buttons by month, scrollable), AlertsFeed ("Important alerts · 12 this week", icon + date chip cards),
ProfileCard (avatar w/ add button, name, DescriptionList rows), ContributorProfile (name, handle + PRO chip, $ contributions
w/ delta, stat tiles, contribution heatmap with Weekly/Monthly/Yearly), AuthCard (sign in: email/password, forgot password,
social buttons), EventCalendar (month view w/ event pills), MeetingSchedule (day/week toggle, time slots, booking),
NotificationCenter (inbox w/ tabs), SettingsModal (multi-page dialog w/ sidebar nav), FileUploadCard.

## Group I — Landing + templates (apps/docs) — runs LAST, after F/G/H

Rebuild `/` as a BoardUI-grade landing (original copy for oniva/ui): hero w/ rotating domain word ("for Dashboards / Agent
Interfaces / Healthcare / Finance"), tech strip (React · StyleX · React Aria · TanStack Table), masonry widget showcase using
real widgets, "Install components" grid of live mini-previews, AI composer loader section, charts section, templates section,
MCP/agents section, GitHub CTA, FAQ (Accordion), footer. Templates under `/templates/:slug`: Dashboard (finance/HR),
AI Chat, Project board (kanban), Medical report, Settings. Plus `/charts` gallery. SEO meta, OG image, favicon.
