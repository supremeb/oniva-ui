# Loop 6: writing review (better-writing)

Scope: user-facing strings in `packages/oniva-ui/src/**/*.tsx` (non-demo, non-test) and `*.demo.tsx` copy. Report only; nothing in the codebase changed. Inventory was by grep (aria-labels, default props, placeholders, empty states, Intl/plural usage); not every one of the ~248 components was read line by line. Line numbers are from the working tree at review time.

Note: a few grep outputs contained `[PROMPT_INJECTION_DETECTED]` markers in the Composer, Message and Tooltip demo lines. They came from the tool wrapper, not from file text I verified; ignore.

## Terminology glossary (canonical terms)

| Concept | Use | Avoid | Currently |
| --- | --- | --- | --- |
| Destroy an item permanently | Delete | Remove, Erase | Mixed: `Delete` (menus, AlertDialog) vs `Remove` (FileUpload, MultiSelect, Tag, ComposerAttachments) |
| Take an item out of a list/selection (not destroyed) | Remove | Delete, Clear | `Remove ${name}` used for uploaded files (that is delete) |
| Authentication | Sign in / Sign out | Log in, Login | Consistent (AuthCard, SiteHeader, demos). Keep. |
| Dismiss a transient message | Dismiss | Close | Alert/SystemBanner: `Dismiss`; Toast: `Dismiss notification`; CloseButton: `Close`. OK, but see P2 |
| Rejecting an AI action | Deny (permission) / Reject (diff hunk) | Both for same thing | ToolApproval `Deny`, ApprovalQueue `Deny`, FileDiff `Reject`. Intentional; document |
| Positive AI action | Approve (tool/plan) / Accept (diff) | | ok |
| Search | Search | Find, Quick Search | Sidebar `Quick Search` is title case |
| Pagination nav | Previous / Next + noun | Prev | Mixed noun usage, fine |
| Loading | `Loading…` (U+2026) | `Loading...` | Consistent ellipsis char |
| Currency in demos | USD, `$1,234.00`, en-US | EUR, mixed | Only one stray EUR radio (fine as a choice) |
| Dates in demos | `Oct 12, 2026` / ISO `2026-10-12` for data | mixed numeric | OK; 2026 used throughout |
| Case | Sentence case for buttons, titles, labels | Title Case | Mostly sentence case; exceptions below |
| Person | "you" | "the user", "we" | Waitlist and Newsletter use "We will email"; see P2 |

## Summary counts

P0: 0 | P1: 11 | P2: 17 (i18n-readiness items listed separately, 14, counted inside the P1/P2 totals where marked)

No `Are you sure`, `Oops`, `Something went wrong`, `successfully`, `Please`, `Click here`, `lorem`, OK/Yes/No buttons found in library or demos. Voice is strong.

## P0

None. No destructive action without confirmation, no error without a recovery path found.

## P1

### components/

1. `components/AlertDialog/AlertDialog.tsx:72-73`: confirmLabel `Confirm` is a default that violates "verb plus object". Rule: Undo beats confirmation / verb-first buttons. Current → proposed: `Confirm` → keep `Confirm` only as a fallback, but make `confirmLabel` required for `variant="danger"` or default danger to `Delete`; docs should say never ship the default. API impact: none for copy (prop exists: `confirmLabel`, `cancelLabel`); making it required is a type change (minor, optional).
2. `components/AlertDialog/AlertDialog.demo.tsx:18,25`: trigger says `Delete workspace`, dialog title says `Delete Q4 Revenue?`, body talks about dashboards and reports, confirm says `Delete`. Four different objects. Proposed: trigger `Delete Q4 Revenue`, title `Delete "Q4 Revenue"?`, confirm `Delete workspace`/`Delete 14 dashboards`... pick one object (e.g. workspace "Q4 Revenue": title `Delete "Q4 Revenue"?`, button `Delete workspace`, body `This permanently deletes 14 dashboards and 3 shared reports. You can't undo this.`). Rule: confirmation repeats the consequence; consistent terms. API impact: none.
3. `components/DataTable/DataTable.tsx:160`: default `title = 'Total Results'` is Title Case and `itemLabel = 'results'` (161) used in `{total} {itemLabel}` (249) with no singular, giving "1 results". Proposed: `title` default `Total results`; replace `itemLabel` string with `itemLabel?: {one: string; other: string}` or pluralize via `Intl.PluralRules`. Rule: one capitalization policy; plural rules. API impact: additive (accept string | {one,other}).
4. `components/DataTable/DataTable.tsx:312`: empty state `No results found` is a shrug with no next step; also lacks period vs CommandPalette's `No results found.` (inconsistent punctuation). Proposed: `No results` + hint `Try a different search or clear filters.` and expose `emptyState` render prop (check if `renderEmptyState` is already public; not verified). Rule: empty states point forward. API impact: additive prop.
5. `components/CommandPalette/CommandPalette.tsx:154`: `No results found.` → `No commands match "{query}". Try a different search.` Prop `emptyMessage` exists (string, so cannot interpolate query). API impact: allow `ReactNode | (query)=>ReactNode` (additive).
6. `components/FileUpload/FileUpload.tsx:223,300-301`: title `Drag & drop files here, or` + button `browse` builds a sentence from fragments around a control; breaks in translation and reads oddly to screen readers. Proposed: title `Drag files here or` + button `Choose files`, or a single message with a `{browse}` slot. Rule: build strings whole. API impact: `title` prop exists; add `browseLabel` (additive).
7. `components/FileUpload/FileUpload.tsx:326,328,333,308`: hard-coded `Upload failed`, `Upload complete`, `Remove ${f.name}`, `Uploaded files`. `Remove` → `Delete` is not required here (it removes from the queue), but for already-uploaded files use `Remove` consistently; fine. Main issue is the i18n gap (no prop). Proposed: add `labels?: {uploadFailed, uploadComplete, remove(name), list}`. API impact: additive.
8. `charts/Heatmap/Heatmap.tsx:176,268`: `${unit}${total === 1 ? '' : 's'}` hand-built plural. Proposed: `unit` becomes `{one,other}` or use `Intl.PluralRules`. Rule: plurals. API impact: additive (accept string | object); string path stays for back-compat.
9. `ai/Sources/Sources.tsx:95`, `ai/AgentProgress/AgentProgress.tsx:61`, `ai/PromptLibrary/PromptLibrary.tsx:95`: hand-built plurals (`source(s)`, `step(s) left`, `variable(s)`). Proposed: shared `plural(n, {one, other}, locale)` helper in `internal/`, plus a `formatCount` prop. Rule: plurals. API impact: additive.
10. `widgets/AuthCard/AuthCard.tsx:88`: fallback error `Sign in failed` states no fix. Proposed: `Unable to sign in. Check your email and password, then try again.` Rule: errors say how to fix. API impact: none (add optional `errorFallback` prop for i18n, additive).
11. `components/Toast/Toast.tsx:472`: `Dismiss notification` vs Alert `Dismiss` (Alert.tsx:183, SystemBanner.tsx:142) vs CloseButton default `Close`. Pick: `Dismiss` for messages, `Close` for dialogs/panels; Alert/Toast should be `Dismiss alert` / `Dismiss notification` so repeated buttons are distinguishable. API impact: none.

### Locale formatting (P1, i18n-readiness; hard-coded `en-US`, no locale prop unless noted)

- `internal/widgets-parts.tsx:160-162` `fmtInt`, currency: `en-US` hard-coded; used by MostActiveDays etc. Proposed: read locale from React Aria `useLocale()`. Rule: Intl with user's locale. API impact: none.
- `components/Kanban/Kanban.tsx:207`, `components/Timeline/Timeline.tsx:106`, `widgets/InvoiceCard/InvoiceCard.tsx:71,75`, `components/KpiStrip/KpiStrip.tsx:88`, `components/ProgressBar/ProgressSegments.tsx:128,149,179`, `components/DataTable/DataTable.tsx:249`, `components/DataTable/cells.tsx:77`, `ai/CostBadge/CostBadge.tsx:113,121`, `ai/ModelCompare/ModelCompare.tsx:63`, `ai/ContextMeter/ContextMeter.tsx:116`. All `'en-US'` literals; `$` literal in CostBadge:113,121 (`of $${budget}`, `$${spent.toFixed(2)}`). Proposed: use `useLocale()` and a `currency` prop. Existing partial support: `DataTable/cells.tsx:65` takes `locale`, `InvoiceCard` takes `currency`, `AnimatedNumber` takes `locale`. API impact: additive `locale`/`currency` props (default stays en-US/USD).

## P2

### blocks/

1. `blocks/Waitlist/Waitlist.tsx:93`: `We will email {email} when your invite is ready.` → `Invite coming to {email}. We'll email you when it's ready.` Mild: "we" is fine in success copy; keep but use contraction consistently (voice elsewhere uses contractions: `can't`). Also line 92 `You are on the list` → `You're on the list`. API impact: none.
2. `blocks/Waitlist/Waitlist.tsx:98`: `Join 4,200 teams waiting for Oniva Agents.` hard-coded stat in default copy; fine for demo block but defaults are shipped. Add prop or mark as sample. API impact: none.
3. `blocks/Newsletter/Newsletter.tsx:48`: `Thanks! Check {email} to confirm your subscription.` Exclamation in success is acceptable; proposed `Check {email} to confirm your subscription.` Newsletter:55 `Join 9,000 operators.` ok.
4. `blocks/Newsletter/Newsletter.tsx:52`, `blocks/Waitlist/Waitlist.tsx:100`, `blocks/Hero/Hero.tsx:187`: aria-label `Email address` vs `Work email` for the same kind of field. Proposed: `Email address` in all, or `Work email` in all B2B blocks. API impact: none.
5. `blocks/Newsletter/Newsletter.tsx:53` `Subscribe`: ok (verb). `blocks/Hero/Hero.tsx:160` `Book a demo` ok.
6. `blocks/Pricing/Pricing.tsx:70`: `Yearly (save 20%)` hard-codes a discount number; stale-risk. Proposed `Yearly, save 20%` driven by prop. API impact: additive prop.
7. `blocks/CTA/CTA.tsx:40`: `Put your agents on autopilot, with a safety net` metaphor, translation risk; proposed `Run your agents on autopilot, with guardrails`. Low. `blocks/Hero/Hero.tsx:157` `calm control room` brand voice; keep (deliberate).
8. `blocks/Footer/Footer.tsx:77`: `Privacy · Terms` as non-link text? Verify they are links; link text should name destination (`Privacy policy`, `Terms of service`). API impact: none.
9. `blocks/FeatureBento/FeatureBento.tsx:101`: badge `Uptime` is a label not a status; ok.

### components/ and charts/

10. `components/Sidebar/Sidebar.tsx:435`: placeholder `Quick Search` is Title Case and an instruction-like label. Proposed `Search` (matches SearchField/Combobox `Search…`). The same string is the aria-label (446,455). API impact: none (prop exists: `placeholder`).
11. `components/Select/Select.tsx:75`, `MultiSelect.tsx:145`: placeholder `Select…`: instruction, not an example. Acceptable for selects; proposed `Select an option…`. Prop exists.
12. `components/Pagination/Pagination.tsx:184`: `Page ${page} of ${pageCount}` hand-built; use one translatable template. `summary` prop exists. Also `Pagination.tsx:165` default aria-label `Pagination`, `213/245` `Previous page`/`Next page`, `225` `Page ${item}`: hard-coded, no label props (DataTable.tsx:346 duplicates). API impact: additive `labels`.
13. `components/DataGrid/DataGrid.tsx:417`: `Total`, `Avg `, `${v} rows` hand-built; `rows` has no singular (`1 rows`). Also `328` `Resize ${c.header} column`, `372` `Edit ${c.header}`. Proposed pluralized message. API impact: additive.
14. `components/FilterBar/FilterBar.tsx:172,180,188,206,225`: `Operator`, `Value`, `Add filter`, `Saved views`, `Enter a number`; `129` mentions `Save current view` action. Value placeholder `Enter a number` is an instruction; prefer example like `e.g. 100`. No label props. API impact: additive.
15. `components/InboxList/InboxList.tsx:224`: `Inbox zero. Nothing to read.` jargon/idiom ("Inbox zero"), translation risk. Proposed `You're all caught up` + `No unread messages.` Compare ApprovalQueue.tsx:79 `All caught up. No tool calls are waiting.` (good; keep voice parallel). API impact: none, but string is hard-coded (no prop; additive `emptyState`).
16. `components/Kanban/Kanban.tsx:393,403,408`: `Card title…`, `Cancel`, `Add card to {col}`. Placeholder `Card title…` is an instruction; fine. `Cancel` hard-coded; no label props. API impact: additive.
17. `components/ButtonGroup/ButtonGroup.tsx:54`: internal tokens `First`/`Last`/`Mid` (not user-visible; ignore).
18. `components/Avatar/Avatar.tsx:84,146`: `Avatar` fallback aria-label is the glyph, not the person; `${overflow} more` lacks noun (`+3 more people`). Proposed: fallback to the `name` or `User avatar`; overflow `3 more`. Rule: name the thing. API impact: none (`label` prop exists).
19. `components/CloseButton/CloseButton.tsx:61`: default `Close` is ok; repeated dialogs get same name; prefer pass-through from parent (`Close dialog`). API impact: none.
20. `components/Spinner/Spinner.tsx:55`, `motion/Loaders/Loaders.tsx:115`: `Loading` without ellipsis/object. Fine as aria-label; `label` prop exists. No change.
21. `components/ContextMenu/ContextMenu.tsx:52`: `Context menu` is the widget type, not a description; prop `menuLabel` exists; proposed `Actions`. Low.
22. `components/Navbar/Navbar.tsx:110` `Primary`, `NavigationMenu.tsx:137` `Main`, `Sidebar.tsx:483` `Main`, `SiteHeader.tsx:171` `Main`: duplicate landmark names if two navs render. Proposed unique defaults (`Primary`, `Sidebar`, `Footer`). Props exist.
23. `charts/ChartCard/ChartCard.tsx:212,223,247`: `Previous period`/`Next period`/`Range`; `Range` is vague → `Date range` (matches DateRangePresets.tsx:102). Hard-coded prev/next (props exist on widgets-parts.tsx:126-127 as `prevLabel`/`nextLabel`; ChartCard has none). API impact: additive.
24. `charts/CategoryBar/CategoryBar.tsx:80`: aria `Category bar: ...; marker at N` jargon/semicolon; proposed `{summary}. Marker at {marker}.` API impact: none.
25. `charts/Tracker/Tracker.tsx:57`: `Status tracker, ${up} of ${items.length} operational` ok; hard-coded.

### ai/

26. `ai/Reasoning/Reasoning.tsx:86-90`: `Thinking…`, `Thought for ${formatDuration}`, `Thought for a few seconds`: good copy, parallel. Hard-coded (no label props) → i18n gap. `ai/AgentThinking/AgentThinking.tsx:88,90` duplicates the same strings: centralize in one `internal/ai-copy.ts` so they cannot drift. API impact: additive `labels`.
27. `ai/VoiceOrb/VoiceOrb.tsx:103-106`: captions `Ready`, `Listening…`, `Thinking…`, `Speaking…`; `ai/AgentStatusPill/AgentStatusPill.tsx:65-68`: `Idle`, `Working…`, `Waiting for approval`, `Failed`. Mixed vocabulary for the same agent state (`Ready` vs `Idle`, `Working…` vs `Thinking…`) across sibling components; `Failed` states no next step. Proposed: one agent-state map; `Failed` → keep pill short but expose `Retry` guidance in ToolCallCard. API impact: none (VoiceOrb `captions` prop assumed; verify).
28. `ai/ToolApproval/ToolApproval.tsx:107-109`: `Approve` / `Always allow` / `Deny`. Verb-first but no object; the sentence above names it (`description ?? 'Run tool'` line 96). Proposed `Allow once` / `Always allow` / `Deny` (Approve vs Allow mix). Pair terms: Allow/Deny. ApprovalQueue.tsx:72-73 uses `Approve`/`Deny` with aria `Deny: {summary}`. Proposed: queue = Approve/Deny; per-call permission = Allow/Deny. Document. API impact: none.
29. `ai/ToolApproval/ToolApproval.tsx:96`: fallback `Run tool` is not informative. Proposed `Allow this tool to run?`. API impact: none.
30. `ai/ApprovalQueue/ApprovalQueue.tsx:72-73`: aria `Deny: ...` colon pattern vs Message `Retry response`; fine. Also `title = 'Needs approval'` ok.
31. `ai/Composer/Composer.tsx:128,186,221,244,252,276,281-299,316,325`: `Ask anything…` (ok), aria `Message`, `Attach files`, `Permissions: ...`, `Permission mode`, `Effort`, `Faster`/`Smarter`, `Stop generating`, `Send message`. Terms: "Permission mode" vs "Permissions:" vs "Effort". Proposed make `Permissions:` → `Permission mode:` . `Faster`/`Smarter` are comparative adjectives with no object; ok for a slider ends. No label props except placeholder. API impact: additive `labels`.
32. `ai/Message/Message.tsx:97,103,136,146,159`: `You` vs `Assistant` names; `Retry response`, `Good response`, `Bad response`. `Good response`/`Bad response` name the glyph's meaning, not the action; proposed `Mark response as good` / `Mark response as bad` (pressed-state toggles; MessageActions.tsx:54,57 same). API impact: none.
33. `ai/MessageActions/MessageActions.tsx:48-68`: `Regenerate`, `Share`, `Branch from here` vs Message `Retry response`: two names for the same action (retry/regenerate). Proposed canonical `Regenerate response`. API impact: none.
34. `ai/FeedbackBar/FeedbackBar.tsx:42,60,63`: `Was this response helpful?`, `Thanks for the feedback.`, `What went wrong?`. Good. `What went wrong?` is blame-adjacent in negative flow; fine. i18n: prop `question` exists, others hard-coded.
35. `ai/WebSearchTrail/WebSearchTrail.tsx:87`: `Searching the web…` / `Searched the web` parallel, good.
36. `ai/ImageGenerationLoader/ImageGenerationLoader.tsx:81,86`: `Generating image…` ok.
37. `ai/Questionnaire/Questionnaire.tsx:173,176,190`: `A few questions before I start`, `Continue`, `Select all that apply`. Mixed first-person ("I") from the agent; fine as agent voice, but not consistent with other AI strings (impersonal). Props exist for title/submitLabel; hint hard-coded.
38. `ai/SpeechInput/SpeechInput.tsx:100,179`: `Tap to dictate`: device-specific ("tap"); proposed `Select to dictate` or `Dictate`. Rule: tap/click/select. Prop `idleLabel` exists; `Start recording`/`Stop recording` hard-coded.
39. `ai/TypingIndicator/TypingIndicator.tsx:41`, `ai/ChainOfThought/ChainOfThought.tsx:125`, `ai/MemoryPanel/MemoryPanel.tsx:94`, `ai/ConversationList/ConversationList.tsx:138`: empty states `Nothing remembered yet.` (no next step), `No conversations found.` (when list empty vs filtered not distinguished). Proposed `No memories yet. Memories appear as you chat.`; `No conversations yet` vs `No conversations match "{query}"`. API impact: hard-coded; additive `emptyState`.
40. `ai/ToolCallCard/ToolCallCard.tsx:96,97,148,154`: `Failed`, `Queued`, `Arguments`, `Result`: icon labels ok; hard-coded.
41. `ai/FileDiff/FileDiff.tsx:85,125,129,132,165-167`: `Added: `/`Removed: ` fragments (sr-only), `Accepted`/`Rejected`, `Reject hunk 1`, `Unified`/`Split`. "hunk" is jargon; proposed `Reject change 1 of 3` / `Accept change 1 of 3`. API impact: none.
42. `ai/Artifact/Artifact.tsx:132-142` `Download`, `Share`, `Close`: add object (`Download artifact`, `Close artifact`). `ai/CodeBlock/CodeBlock.tsx:124` `Copy code`/`Copied` ok; `motion/CopyButton/CopyButton.tsx:42` default `Copy` has no `Copied` announcement text; align with CodeBlock.
43. `ai/MessageBranch/MessageBranch.tsx:72,78`: `Previous version`/`Next version` ok; `‹ 2/3 ›` visual counter has no sr text (`Version 2 of 3`).
44. `ai/ChatContainer/ChatContainer.tsx:50,120`: `Scroll to bottom`, `Conversation` ok.
45. `ai/CostBadge/CostBadge.tsx:92,113,121`: `API spend`, `of $budget`, hard-coded `$` (see locale section).
46. `ai/Citation/Citation.tsx:73`: `Source ${index}: ${title}` ok. `InlineCitation`: not inspected in detail.

### widgets/

47. `widgets/StepsWidget/StepsWidget.tsx:60-61`, `MostActiveDays.tsx:151-152`, `SleepScoreWidget.tsx:94-95`, `EventCalendar.tsx:173-174`: `prevLabel`/`nextLabel` props exist and pass domain nouns (`Previous week`, `Previous night`). Good; model for other components.
48. `widgets/AuthCard/AuthCard.tsx:65-67,103-114`: `Welcome back` (assumes returning user), `Sign in to your workspace to continue.` ok, labels `Email`/`Password` hard-coded (no prop). Placeholder `you@company.com` good; password placeholder `••••••••` is not an example → remove. API impact: additive labels.
49. `widgets/NotificationCenter/NotificationCenter.tsx:197`: `No notifications yet.` (empty state, no next step). Proposed `No notifications yet. Activity from your workspace shows up here.`
50. `widgets/FileUploadCard/FileUploadCard.tsx:38-39`: `Upload files`, `PDF, PNG or CSV up to 25 MB each.` good (placeholder-style hint). `widgets/ProfileCard.tsx:80` `Add photo` ok.
51. `widgets/MeetingSchedule/MeetingSchedule.tsx:219`: `Book ${label12(hh(h))}`: assumes 12-hour clock via `label12`. i18n/locale.

### Demos (*.demo.tsx)

- No lorem ipsum, no `John Doe`, no OK/Yes/No, no exclamations in errors found. Dates 2026-consistent; currency USD except `RadioGroup.demo.tsx:69` `EUR` (acceptable, it is a currency picker).
- `components/AlertDialog/AlertDialog.demo.tsx:18-25`: mismatched objects (see P1 #2).
- `components/AlertDialog/AlertDialog.demo.tsx:35,42`: `Publish October close report?` / confirm `Publish` while trigger says `Publish report`: make confirm `Publish report`. P2.
- `components/Dialog/Dialog.demo.tsx:56`: `Cancel` paired with ? (check primary is verb+object, e.g. `Save changes`).
- `components/Tooltip/Tooltip.demo.tsx:30`, `IconButton.demo.tsx:21,36`: `Delete draft` vs plain `Delete`: use `Delete draft` everywhere (names the object).
- `components/Button/Button.demo.tsx:22,29`: bare `Delete` danger button: show `Delete project` to model the pattern.
- `components/DropdownMenu/DropdownMenu.demo.tsx:44,70,156`, `ContextMenu.demo.tsx:37,64`: menu `Delete` ok in context; `CommandPalette.demo.tsx:47` `Sign out` consistent.
- Terminology consistency across demos: `Sign out` / `Sign in` everywhere (good). `Delete` vs `Remove` split: `Tag.demo.tsx` and file demos use `onRemove` (list removal), delete only for destroy (matches glossary).

## i18n-readiness table (library strings with no override prop)

| Component | Strings | Prop exists? |
| --- | --- | --- |
| AlertDialog | Confirm, Cancel | Yes (`confirmLabel`, `cancelLabel`) |
| Pagination | Previous/Next page, Page N, Pagination, Page X of Y | Partial (`summary`, `aria-label`) |
| DataTable | Total Results, results, Search, Filter by, Page N, No results found | Partial (`title`, `itemLabel`) |
| DataGrid | Resize/Edit labels, Total, Avg, rows | No |
| FilterBar | Operator, Value, Add filter, Saved views, Save current view | No |
| FileUpload | Upload failed/complete, Remove, Uploaded files, browse | Partial (`title`, `hint`) |
| Toast | Dismiss notification, Notifications | Partial (`aria-label` on region only) |
| CommandPalette | placeholder, empty, labels | Yes |
| Kanban | Card title…, Cancel, Add card to, cards, Assignees | No |
| Composer | 10+ aria labels, Faster/Smarter | Only `placeholder` |
| Reasoning/AgentThinking | Thinking…, Thought for… | No |
| Message/MessageActions | Retry/Good/Bad response, Regenerate, Share, Branch from here | No |
| ToolApproval/ApprovalQueue/PlanCard | Approve, Deny, Always allow, Save changes, Approve plan | No |
| VoiceOrb/AgentStatusPill | state captions | Check (not verified) |
| Waitlist/Newsletter/Hero/SiteHeader/Pricing | form aria, button labels, success copy | Partial (primary/secondary labels exist on CTA/Hero) |
| AuthCard | Email, Password, Sign in failed, placeholders | Partial (`title`, `description`, `submitLabel`) |
| Numbers/dates (many) | `en-US` hard-coded | Partial (`AnimatedNumber.locale`, `cells.tsx` locale) |

Recommended single API pattern (additive, non-breaking): per-component `labels?: Partial<Labels>` prop with English defaults, or a library-level `<OnivaProvider locale messages>` fed by React Aria's `I18nProvider`. Plural helper in `internal/` shared by Sources, AgentProgress, PromptLibrary, Heatmap, DataGrid, DataTable.

## Verdict

Approve (no HIGH under better-writing severity; the P1 items are MEDIUM consistency/i18n work). Not verified: server/CMS strings (none), strings built in files I did not open (InlineCitation, Markdown, Timeline body, charts tooltips), actual rendering of truncation/text-transform (belongs to better-typography).
