---
title: Loop 2 — core component coverage (5 parallel workers)
status: active
created: 2026-10-12
parent: docs/plans/2026-10-12-oniva-ui-v0.1.md
---

# Loop 2 — core coverage

All workers share one working tree. Each owns ONLY the component folders listed for its group under
`packages/oniva-ui/src/components/`. Do not edit other groups' folders, tokens, themes, docs app, or
`src/index.ts` (generated). New shared helpers → new file in `src/internal/` prefixed with your group (e.g.
`internal/forms-field.ts`). Follow `AGENTS.md` + the Button exemplar exactly. Measured visuals:
`docs/research/design-language.md` + `docs/research/boardui-shots/`.

Every component: RAC-based where applicable, `xstyle` prop, sizes consistent with Button (xs 24 / sm 32 / md 36 / lg 40),
light/dark/accent via tokens only, `.demo.tsx` with 2–4 realistic BoardUI-style demos (real-looking dashboard
content, not lorem ipsum), `.test.tsx` covering render + key interaction + a11y role/label.

## Group A — Forms

Field (Label, Description, FieldError), Form, Fieldset, Textarea, Checkbox, CheckboxGroup, RadioGroup (+ card-style radio),
Select, Combobox, MultiSelect (tag-chips), Slider (single + range), NumberField, SearchField (with ⌘K hint),
SegmentedControl, InputOTP, InputGroup (addons), FileUpload (dropzone + file list w/ progress ring),
DateField, Calendar, RangeCalendar, DatePicker, DateRangePicker.

## Group B — Overlays

Dialog (+ Modal), AlertDialog, Drawer/Sheet (left/right/bottom), Popover, Tooltip, DropdownMenu (sections,
icons, shortcuts, checkable items, submenus), ContextMenu, CommandPalette (⌘K, groups, fuzzy filter), HoverCard,
Toast (provider + `toast()` queue, variants, actions).

## Group C — Navigation & Layout

Tabs (line + pill/segmented styles), Breadcrumbs, Pagination (numbers + ellipsis + prev/next), Sidebar
(collapsible, sections, active solid accent pill w/ count badge, quick search, account switcher footer), Navbar,
NavigationMenu, Stepper (horizontal/vertical), Stack/Flex/Grid primitives, LayoutShell (sidebar + header + content),
ResizablePanels, ScrollArea, Toolbar, Separator.

## Group D — Data display

Table (RAC Table: sortable columns, selection, sticky header), DataTable (TanStack: filter selects, column
sort, row selection checkbox, avatar cells, status select cell, badge cells, pagination, "Total results"
header — mirror BoardUI's data-table shot), Accordion, Collapsible, DescriptionList (key/value w/ icons — like the
medical-ID profile card), ListBox/List, TreeView, Kbd.

## Group E — Feedback & Primitives

Alert/Banner/Callout, EmptyState, ProgressBar (incl. multi-segment), Meter, Skeleton, Spinner (+ the
"n steps left" ring loader), IconButton, Link/LinkButton, ToggleButton, ToggleButtonGroup, ButtonGroup,
Tag/Chip (removable, TagGroup), CloseButton, Heading/Text (typography scale), VisuallyHidden, Icon wrapper.

## Done when

`npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` pass for the whole repo; each new component
page renders in the docs site; worker reports list of components + any helper files added + learnings.
