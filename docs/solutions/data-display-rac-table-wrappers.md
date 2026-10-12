---
title: RAC Table/Select wrappers for styled data display
date: 2026-10-12
area: data-display
tags: [react-aria, table, tanstack, stylex]
---

- RAC `Table` does NOT auto-render the selection checkbox column. Wrap `TableHeader`/`Row` and use `useTableOptions()` to
  add a `<Column>`/`<Cell>` with `<Checkbox slot="selection">` (see `components/Table`). Native indeterminate is the
  input's `.indeterminate` property, not `aria-checked="mixed"` (test accordingly).
- DataTable = TanStack for state (sorting/filter/pagination/rowSelection), RAC Table for rendering: map `sorting[0]` <-> RAC
  `sortDescriptor` and `rowSelection` <-> `selectedKeys`; rows are RAC items via `row.id`. Header "select all" in RAC only
  touches the current page's rows; merge `'all'` into the existing selection yourself.
- RAC `SelectValue` render-prop `selectedItem` is the collection item, not the key. For static option arrays render the
  label yourself from the `value` prop instead.
- Style RAC state with `className={(renderProps) => stylex.props(...).className}` (isSelected/isFocusVisible); StyleX
  attribute selectors like `[data-selected]` are not needed.
- `DisclosurePanel`: put padding on an inner div; padding on the panel itself leaves a gap when collapsed.
