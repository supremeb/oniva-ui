# Loop 6 fixes: F2 (core components)

Verified: `tsc --noEmit` clean, eslint clean on components/ + internal/, `vitest run packages/oniva-ui/src/components` all green (1 test updated for intentional copy, 1 added). No commits. All API changes additive.

## Fixed
- a11y P1-1 Toast: action / danger / warning toasts persistent by default (explicit `duration` wins); promise settle no longer forces 5s on errors. Test added.
- a11y P1-2 Toast: `media.reducedMotion` transition = opacity only; `useReducedMotion` zeroes enter/exit travel and stack scale.
- a11y P1-3 Carousel: hidden slides `inert`; fallback label `Slides`; `aria-current` only on active dot (dot hit already 24px).
- a11y P1-4 Tag remove: 24x24 hit area via `::after` (visual stays 18px).
- a11y P2-1 ResizablePanels handle: 24px hit area via `::before`. P2-4 FileUpload icons `role="img"`.
- a11y status P1-6 (Spinner only): label rendered as VisuallyHidden text inside `role="status"` (aria-label kept).
- layout P1-1 Dialog close `insetInlineEnd`. P1-2 Tabs vertical rail logical props. P1-3 DataGrid `text-align:end`, `border-inline-end`, sticky `inset-inline-start`.
- layout P1-7 Dialog/Drawer/BottomSheet overlays: `inset:0` instead of 100vh/100vw. P2-23 Toast `maxWidth:100%` + translateX centering; CommandPalette `calc(100% - 32px)`.
- layout P2 radii: Card tile 8, Tabs indicator/pill 8 and pillSm 6, SegmentedControl item/indicator 6. P2-22 forms-popover `overscroll-behavior: contain`.
- layout P2-24 min-height (not height) on Tabs md/sm, Input sm/md/lg, forms-field sizes (same visual size).
- Reduced motion: chevron rotation guarded in Accordion, Collapsible, TreeView, NavigationMenu. Drawer background scale was already guarded.
- type P1-8 truncation: `Text` sets `title` when `truncate` and children is a string; Sidebar item/switcher, DataGrid cells + headers, FileUpload file names get `title`. P1-9 `text-wrap: balance` (headline/title/display) and `pretty` (body) in Text.
- writing P1: AlertDialog default confirm `Delete` for `variant="danger"` (else `Confirm`); DataTable `Total results`, singular via `{one,other}` itemLabel (string still works, `1 result`), empty state `No results` + next step, new `emptyState` prop; CommandPalette empty copy with next step; FileUpload `Drag files here or` + `Choose files`, new `browseLabel`, `labels`; Sidebar `Quick search` (test updated); Select/MultiSelect placeholders; InboxList empty state (`You're all caught up.`) + `emptyState` prop.
- i18n: DataGrid `locale`/`currency`/`labels` (plural rows via `internal/format`); `dash-data.fmt(value, kind, locale, currency)`; Pagination `labels`; DataTable `locale`; ProgressSegments `locale` (useFormatters); KpiStrip percent via `useFormatters`; Kanban due date + Timeline day headings use active locale (Timeline `locale` prop); PriceCell `locale`.

## Deferred (reason)
- Hover behind `@media (hover: hover)` (layout P1-6): needs `media.stylex.ts` key + feedback-control.ts, both F1-owned.
- Slider / CategoryBar RTL fill (P2-26): RAC Slider mirroring needs a runtime RTL check; not safe statically.
- DataGrid arrow-key direction in RTL, Pagination chevron mirroring: need RTL runtime verification.
- Width-animating Sidebar / indicators (P2-21), static will-change (motion/, not mine), shadow ring recipe, concentric menu item radius 7 vs 8 (1px delta), Card gap rhythm (judgement call).
- CommandPalette `emptyMessage` as `(query) => ReactNode`: Autocomplete owns the input value; needs a wiring spike.
- Avatar label (already uses `name`), landmark default names (only duplicates when several instances), FilterBar/Kanban/Combobox `labels` props, ContextMenu/ChartCard labels: not done this pass.
- FileUpload inner RAC DropZone button 16x6 tab target; NBSP between number and unit; `tabular-nums` in widgets-* (outside owned paths); `slashed-zero` for mono (CodeBlock/FileDiff are ai/).
- ai/, motion/, charts/, blocks/, widgets/ findings: other workers.

## Break pass (code-derived, not visual)
- Toast: long title wraps (`minWidth:0` content); 320px viewport no longer clipped; 1000 toasts capped by `maxVisibleToasts: 5`; RTL centred placement unchanged.
- Dialog: RTL close no longer overlaps title. DataGrid: 0 rows renders header + empty body; 1000 rows windowed; long cells ellipsised with `title`; RTL sticky column follows direction.
- DataTable: 0 -> empty state with next step, 1 -> `1 result`, 1000 -> localized `1,000`. Tabs: translated labels grow tab height (min-height). Select: trigger value already ellipsised. Carousel: 0/1 slide safe (single slide stays active), hidden slides unfocusable. FileUpload: long names ellipsised with title; 0 files hides list.

## F2b (cross-owner leftovers)
- Hover: every plain `':hover'` key in components/** + internal/{data-*,forms-*} (33 files, ~55 rules) now `{ default: null, [media.hover]: x }`; focus-visible untouched. Not done (not mine): internal/{charts,widgets,aib,blocks,n3}-*.
- Accent fills: Sidebar pill, Pagination current, Stepper (fill, border, line), Calendar/RangeCalendar/DatePicker selected day, Slider fill use `--oniva-accent-solid`/`-solid-end`; text via `accent-on-solid` (colors `accent-fg` already aliases it). Switch/Radio were already done by F1. Left: forms-date focused segment (focus-ring bg + accent-fg text; amber risk), Tabs indicator / ProgressBar / RingProgress (non-text marks, accent-500/600 >= 3:1 not asserted).
- Dark chart palette: `#00debf #9df000 #fe66b7 #00bfff #bf7bff #317cff #00c48c #f3b700 #7b7be0 #9b979f` (min dE 5.0 under protan/deutan/tritan, was 0.36/1.4/1.9; all >= 3:1 on dark bg/surface, near-black labels >= 4.5). check-contrast.mjs now runs the CVD-separation check for dark too (1696/1696 pass).
- `labels` (additive, partial, defaults = current English): `FilterBar` (`FilterBarLabels`, incl. function labels for filter names/plurals), `Kanban` (`KanbanLabels`).
- RTL: Slider fill used hard `left`; now follows RAC `useLocale().direction` (verified in browser with locale ar: thumb and fill aligned, fill spans thumb to inline-start edge). Arrow keys: RAC handles direction in its own slider keyboard logic; my automated key press could not focus the hidden input, so key direction is unverified. NOTE: RAC reads the locale (I18nProvider / navigator.language), NOT the `dir` attribute; consumers must wrap I18nProvider.
- Deferred: CategoryBar (charts/, F3b) marker uses `left:%` -> needs `insetInlineStart`/useLocale; Combobox/ContextMenu/ChartCard labels; DataGrid arrow keys RTL; Pagination chevron mirroring.
