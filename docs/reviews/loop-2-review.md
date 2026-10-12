# Loop 2 review (report-only, HEAD: 75 components + src/internal helpers)

Personas run sequentially: API consistency, duplication, a11y, StyleX, tests. Evidence is grep/read of `packages/oniva-ui/src` only. Nothing was built or run. src/charts, src/ai and src/widgets were ignored. Dark chip contrast was computed by hand against an approximate `#121212`/`#262626` surface.

## P0

1. **No accessibility test in any unit test.** `grep axe components/*/*.test.tsx` returns 0 files, and 24 of 90 test files never press, click or type. Many tests are 2 `it`s that only check rendering (e.g. `VisuallyHidden`, `Drawer` with 1). Axe runs only in e2e on docs pages (see loop-1 #6), so overlay and popover states are never audited.
   - Fix: add `internal/test-a11y.ts` (vitest-axe or axe-core `run` on `container`) and call `expectNoA11yViolations(container)` in every component test. For overlays, open them first.
   - Add a keyboard `it` per interactive component.
2. **`IconButton` and `Stack` have no `xstyle`.**
   - Files: `components/IconButton/IconButton.tsx`, `components/Stack/Stack.tsx`.
   - They only work because of `...props` pass-through to `Button` / `Flex`.
   - AGENTS rule 5 is met at runtime but not declared. IconButton's type is inherited from ButtonProps, and Stack's `ref` is typed `Ref<HTMLElement>`.
   - Fix: declare `xstyle` explicitly, or document that it is inherited. Add a test that `xstyle` reaches the DOM.
   - `VisuallyHidden` has no xstyle, ref, className or style. It wraps RAC `VisuallyHidden`. Fix: forward `ref` and `className`, or document the exception in the convention table.
3. **Hard-coded colors in components (rule 1 violation).**
   - `components/Button/Button.tsx:67`: `color: { default: '#ffffff', ':disabled': colors.disabledFg }`. This breaks under dark theme or an accent theme. Fix: `colors.accentFg` or a new `colors.onSolid` token.
   - `components/Tag/Tag.tsx:68`: `':hover': '#00000014'`. Fix: add a `colors.overlayHover` token that is theme-aware, or use `colors.surfaceHover`.
   - Dark tokens in `themes/themes.ts:59-66` use `rgba()`. That is allowed there because they are token values.
   - Grep of `components` and `internal` (excluding tests and demos) found only these two hits. The check of the Switch hex from loop 1 is not repeated here.

## P1

4. **Reduced motion is applied inconsistently.** Handled only in `internal/overlays-menu.ts`, `Tooltip`, `Drawer` and `internal/charts-styles.ts`. Not covered by the grep: Dialog/AlertDialog/Popover/HoverCard/forms-popover enter animations, Toast, Spinner, Skeleton shimmer, Accordion/Collapsible height transitions, and every `transitionDuration: motion.dur*`.
   - Fix (single point): in `tokens/motion.stylex.ts` make `durFast/durBase/durSlow` resolve to `0.01ms` inside `@media (prefers-reduced-motion: reduce)`, and wrap each `animationName` in the shared helper `internal/motion.ts` (`export const NO_MOTION = '@media (prefers-reduced-motion: reduce)'`). Drawer currently defines its own local `NO_MOTION`.
   - Spinner should keep rotating at reduced speed or show a static indicator instead of stopping.
5. **Disabled/invalid prop naming is not canonical.** Where a prop is declared directly (rather than inherited from RAC), `isDisabled?` is used 3 times, `isLoading?` once, and `invalid` twice. Local style keys named `disabled` are only style keys. The RAC-inherited surface is `isDisabled/isInvalid/isRequired/isReadOnly`, so the convention is: `is*` booleans everywhere. Check the `invalid` declarations (`grep -rn "invalid?:" components`) and rename to `isInvalid`.
6. **`size` / `variant` / `tone` vocabulary diverges** (see the table). Examples:
   - Field `size` is `FieldSize` in Select/Combobox/DatePicker/DateField/NumberField/InputGroup/SearchField, but `Input` declares its own inline `'sm' | 'md' | 'lg'`.
   - `Switch` and `ProgressBar` repeat inline `'sm' | 'md' | 'lg'`; `SegmentedControl`, `CloseButton` and `Badge` use `'sm' | 'md'`.
   - `Icon` and `Spinner` use `keyof typeof px`.
   - `RingProgress` `size?: number` collides in meaning with the others.
   - `tone` has four vocabularies: `Meter/RingProgress` `accent|success|warning|danger`; `Link` `accent|muted|inherit`; `Spinner` `current|accent|muted`; `Text/Heading` `TextTone`.
   - `variant` for danger is `'default'|'danger'` in DropdownMenu/CommandPalette/AlertDialog, but `Alert/Toast` use semantic variants.
   - Fix: put `ControlSize = 'sm'|'md'|'lg'` (and `FieldSize`) in `internal/types.ts` and import everywhere. Rename RingProgress `size` to a `ControlSize` plus `diameter?: number`. Use `intent`-free naming: `tone` = color, `variant` = visual style (see convention).
7. **Inline `style={{...}}` for static layout** (rule 1 spirit).
   - `components/Textarea/Textarea.tsx:78-79` (flex/gap), `components/Navbar/Navbar.tsx:100` (`flexGrow: 1`), `components/InputOTP/InputOTP.tsx:138` (`display: 'contents'`).
   - Fix: move these to `stylex.create`.
   - Dynamic values are acceptable and are the right use: `Slider.tsx:110`, `ProgressBar.tsx:110`, `ProgressSegments.tsx:130`, `RingProgress`, `Skeleton`. StyleX dynamic styles (`stylex.create` with function styles) would be cleaner. The `as object` / `as never` casts (`Skeleton.tsx:53`, `RingProgress.tsx:73`, `ProgressBar.tsx:91`) should be replaced by `mergeSx`.
8. **`CommandPalette` has `ref:0` and `className:0`.** `components/CommandPalette/CommandPalette.tsx`. It violates rule 5 (ref forwarding) and the className convention. Same for `DataTable` (`className:0`; root `ref` is declared but check it reaches the DOM). Fix: forward both to the root dialog or table element.
9. **`feedback-control.ts` mirrors Button.** Its own docblock says "Button itself keeps its styles private, so these mirror them". Any Button change must be made twice, and tests do not cover drift. See consolidation plan #1.
10. **Focus ring implementations differ.** 36 files mention `focusRing` or `:focus-visible`; some use outline and others a `box-shadow` ring (loop-1 #6 notes the box-shadow ring is low contrast). Fix: one `internal/focus.ts` exporting `focusRing` (outline 2px `colors.focusRing`, offset 2) and `focusRingInset`, applied via `stylex.props`.
11. **`DataCheckbox` is a second checkbox.** `internal/data-checkbox.tsx` uses `tableStyles.checkBox*` while `components/Checkbox/Checkbox.tsx` has its own box styles. Visual and a11y fixes will diverge. See plan #4.

## P2

12. `DataTable.tsx:118` has an `eslint-disable no-explicit-any` for `ColumnDef<TData, any>`. Use `ColumnDef<TData, unknown>` with a documented cast.
13. `internal/nav-cx.ts` (`cx`) and `internal/sx.ts` (`mergeSx`) overlap. `cx` ignores `sx.style`, so dynamic StyleX values are dropped when `cx` is used. Navbar, Sidebar, NavigationMenu, Tabs, Toolbar, Breadcrumbs, Drawer, Pagination, Tooltip, LayoutShell, ToggleButtonGroup and DropdownMenu use one or the other. Replace `cx` with a `mergeSx` wrapper, delete `nav-cx.ts`.
14. About 471 numeric literals for `fontSize/padding/gap/height/width` in components and internal files, even though `tokens/space.stylex.ts` and `font.stylex.ts` exist. 5 raw `borderRadius: N`. Add tokens for the repeating values, then replace them.
15. Dark status chips pass by my estimate: success about 8:1, warning about 8:1, danger about 5.9:1, info about 8.8:1 (all above AA 4.5:1 against a `#121212` base). Add a unit test over `themes.ts` that computes contrast of every `*Fg` over `*Bg` flattened onto `bg`, in both themes, so token edits cannot regress this.
16. `demo.ts` and `nav-demo.ts` in `internal/` are demo-only code shipped in the library source. Confirm they are tree-shaken, or move to `apps/docs`.
17. Compound patterns are inconsistent: Accordion, Tabs, Table, Field, Dialog, Sidebar, NavigationMenu, Toolbar, Card and Breadcrumbs export multiple parts as separate named exports (`Tabs`, `TabList`, `Tab`...). Not an object-namespace pattern. Keep flat named exports (tree-shakable, matches RAC), and enforce prefixing by parent name. Add a lint/test that `index.ts` of each folder exports only names starting with the folder name, or documented helpers.

## API convention table

Columns: p = present, - = absent (grep count > 0 of the relevant name). Counts come from `grep -c` and some entries are approximate.

| Group | Components (examples) | size | variant | tone | disabled | xstyle | className | style | ref | Gap |
|---|---|---|---|---|---|---|---|---|---|---|
| Actions | Button, LinkButton, ToggleButton, ToggleButtonGroup, CloseButton | p | p (Button, LinkButton, ToggleButton, ToggleButtonGroup) | - | RAC `isDisabled` | p | p | p | p | CloseButton size is `sm|md` only; IconButton has no explicit xstyle |
| Fields | Input, Textarea, SearchField, Select, Combobox, MultiSelect, NumberField, DateField, DatePicker, DateRangePicker, InputGroup | p (MultiSelect: no size) | - | - | RAC `isDisabled` | p | p | p | p | Input redeclares size inline; MultiSelect lacks size |
| Selection | Checkbox, CheckboxGroup, RadioGroup, Switch, SegmentedControl, Slider | Switch, SegmentedControl only | RadioGroup `default|card` | - | RAC | p | p | p | p | Checkbox and Radio have no size |
| Feedback | Alert, Toast, Badge, Tag, Meter, ProgressBar, RingProgress, Spinner, Skeleton | varies (RingProgress: number) | Alert, Toast, Badge, Skeleton | Meter, RingProgress, Spinner, ProgressBar, Tag | n/a | p | p | p | p | Tone vocab differs (see #6) |
| Overlays | Dialog, AlertDialog, Drawer, Popover, Tooltip, HoverCard, DropdownMenu, ContextMenu, CommandPalette | Dialog, Drawer | AlertDialog, DropdownMenu, CommandPalette `default|danger` | - | RAC (Tooltip `isDisabled`) | p | p (CommandPalette: -) | p | p (CommandPalette: -) | CommandPalette ref |
| Nav | Tabs, Navbar, NavigationMenu, Sidebar, Breadcrumbs, Pagination, Stepper, Toolbar, LayoutShell | Tabs | Tabs, Pagination | - | RAC | p | p | p | p | Compound exports flat, see #17 |
| Layout/type | Flex, Stack, Grid, Separator, ScrollArea, Heading, Text, Kbd, Icon, Link | Kbd, Icon | Heading, Text | Heading, Text, Icon, Link | Link RAC | Stack: - | Stack: - | Stack: - | p | Stack and VisuallyHidden missing xstyle |
| Data | Table, DataTable, List, ListBox, TreeView, DescriptionList, Accordion, Collapsible, EmptyState | - | Accordion | - | RAC | p | DataTable: - | p | p | Row/cell style hooks differ |

### Canonical convention

1. **Props.** Booleans use the RAC `is*` form (`isDisabled`, `isInvalid`, `isRequired`, `isReadOnly`, `isLoading`, `isSelected`). Never bare `disabled/invalid/loading`.
2. **Sizes.** `size?: ControlSize` where `ControlSize = 'sm' | 'md' | 'lg'` (default `'md'`), imported from `internal/types.ts`. Subset components narrow with `Extract<>`. A numeric size is a separate prop, `diameter`/`width`.
3. **Variant vs tone.** `variant` is the visual style (solid, soft, ghost, outline); `tone` is semantic color (`accent | neutral | success | warning | danger | info`). A destructive action is `tone="danger"`, not `variant="danger"`. Keep the current `variant="danger"` as a deprecated alias for one release.
4. **Overrides.** Every component accepts `xstyle?: stylex.StyleXStyles`, `className?: string` and `style?: CSSProperties` (merged with `mergeSx`), and `ref` as a React 19 prop typed to the root element. Native wrapper-less components (VisuallyHidden) must document their exception.
5. **Compound parts.** Flat named exports prefixed with the parent name (`Tabs`, `TabList`, `TabPanel`); also valid `Tabs.List` via `Object.assign` only if it is used repo-wide (decision: not adopted, keep flat). Parts accept `xstyle` too.
6. **Index files.** `index.ts` per folder re-exports the component and its `*Props` types. `src/index.ts` is only generated.
7. **Merging.** Use `mergeSx` from `internal/sx.ts` for className and style in all components, never ad hoc.

## Consolidation plan (mechanical, in order)

1. **Button styles.** Move the Button private styles from `components/Button/Button.tsx` into `internal/feedback-control.ts` (or rename to `internal/control-styles.ts`), exporting `controlStyles`. Import them in Button, ToggleButton, LinkButton, CloseButton. Delete the duplicate block in Button.tsx. Run Button/ToggleButton/LinkButton/IconButton tests.
2. **Focus ring.** Create `internal/focus.ts` with `focusRing` / `focusRingInset` (see #10). Replace per-file `outlineColor/outlineOffset/outlineStyle/outlineWidth` blocks and box-shadow rings with it in files found by `grep -ln "focus-visible\|focusRing" components internal`.
3. **Popover/listbox styles.** Make `internal/forms-popover.ts` (`fp`) the single source for popover + listbox item styles. Change `internal/data-table-select.tsx` (its own `dots` and select styles) to import `fp` (`fp.dot*`, `fp.item*`). Change `internal/forms-listbox.tsx` consumers (Select, Combobox, MultiSelect) the same way. Keep `internal/overlays-menu.ts` (`menuStyles`) for menus but import shared item base (padding, radius, font) from a new `internal/popup-item.ts` that both `fp.item` and `menuStyles.item` extend through `stylex.props` composition (not copy). Move popIn/popOut keyframes to `internal/motion.ts` shared with Tooltip and Drawer.
4. **Checkbox.** Extract the box (check/minus indicator, focus, selected) from `components/Checkbox/Checkbox.tsx` into `internal/checkbox-box.tsx` (`CheckboxBox`, with a `density="compact"` prop). Rewrite `internal/data-checkbox.tsx` as `<Checkbox density="compact" slot="selection" />` or have it render `CheckboxBox`. Delete `tableStyles.checkBox*` from `internal/data-table-styles.ts`. Update Table, DataTable, List.
5. **sx helpers.** Replace every `import { cx } from '../../internal/nav-cx'` with `mergeSx` from `internal/sx.ts` (call sites: NavigationMenu, Sidebar, Navbar, Toolbar, Breadcrumbs, Tabs and the others listed under #13). Delete `internal/nav-cx.ts`. Replace the `sx.style as object / as never` casts in Skeleton, RingProgress, ProgressBar with `mergeSx(sx, className, style)`.
6. **Shared types.** Add `internal/types.ts` with `ControlSize`, `FieldSize`, `Tone`, `Intent` aliases. Update Input, Switch, ProgressBar, ProgressSegments, Meter, SegmentedControl, CloseButton, Badge, Spinner, Icon, RingProgress (`size` to `diameter`) accordingly.
7. **Tokens and motion.** Replace the two hard-coded colors (Button.tsx:67, Tag.tsx:68) with tokens (add `onSolid`, `overlayHover` plus dark values in `themes.ts`). Make `motion.dur*` honor reduced motion. Add `internal/motion.ts` with `NO_MOTION` and use it in Drawer, Tooltip, Dialog, Popover, HoverCard, Toast, Skeleton, Spinner, Accordion/Collapsible.
8. **Inline styles.** Move the static `style={{...}}` blocks (Textarea.tsx:78-79, Navbar.tsx:100, InputOTP.tsx:138) into `stylex.create`.
9. **Missing props.** Add explicit `xstyle` (and `className`) to IconButton, Stack, VisuallyHidden. Forward `ref` and `className` in CommandPalette and DataTable. Rename `invalid`, `isLoading` type uses to the `is*` form (#5).
10. **Tests.** Add `internal/test-a11y.ts` and a call to it in each component test (#1). Add a keyboard test for the 24 test files that lack interaction. Add the theme contrast test (#15) and a `xstyle`/`className`/`ref` smoke test generated per component from a table in `internal/test-api.ts`, run over all folders.
11. **Verify.** `NAPI_RS_FORCE_WASI=1 npm run typecheck && npm run lint && npm run test && npm run build`. Check `dist/oniva-ui.css` is unchanged apart from removed duplicates (diff class count).
