---
title: Dashboard extras - RAC DnD across lists, hand-rolled windowed grid, StyleX lint traps
date: 2026-10-12
area: components/Kanban, components/DataGrid, components/InboxList
tags: [react-aria, dnd, virtualization, stylex, a11y]
---

- **Kanban across columns:** one `GridList` + `useDragAndDrop` per column. Put every move in the *target* handlers (`onReorder`, `onInsert`, `onRootDrop`) via a pure `moveCards(columns, ids, columnId, targetId, position)` that strips the cards from wherever they live, so no `onDragEnd` bookkeeping. Drag payload is a custom MIME (`application/x-oniva-kanban-card`) holding ids; `acceptedDragTypes` scopes drops. Items need `<Button slot="drag">` for keyboard DnD: Enter on grip, Tab cycles columns, arrows pick the insertion point, Enter drops (verified in Chromium).
- **Drop "settle" animation:** RAC unmounts the drag preview; animate the destination card instead (keyframe scale 1.02 + shadow -> rest) by tracking the moved id in state. `renderDragPreview: () => <span />` hides the ghost so the lifted look comes from `data-dragging` on the source.
- **DataGrid windowing:** RAC Table can't window partial rows, so the grid is a hand-rolled ARIA `grid` (aria-rowcount/rowindex, roving tabindex). Always render the active row even when scrolled out of the window or the grid loses its only tab stop. Set `scrollTop` manually before focusing a not-yet-rendered target row.
- **StyleX lint:** `flex: 1` (number) fails `valid-styles` (use `flexGrow: 1`); pseudo-classes must nest inside the property (`color: { default, ':hover' }`), never as top-level keys.
- **RangeCalendar** renders a `<header>` inside `role=application`, which trips axe `landmark-banner-is-top-level` (moderate) in jsdom; real-browser axe was clean on the presets page.
