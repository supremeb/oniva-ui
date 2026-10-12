---
title: React Aria overlay gotchas (context menu anchor, toast actions, animation, tests)
date: 2026-10-12
area: overlays
tags: [react-aria-components, popover, menu, toast, stylex, vitest]
---

- **Portals/theme**: overlays need no container prop; `ThemeProvider`'s `UNSAFE_PortalProvider` already routes Modal/Popover/Tooltip into the themed wrapper (verified dark mode + accent in the docs). `ToastProvider` renders its region inline, so mount it inside `ThemeProvider`.
- **Animations**: RAC exposes `isEntering/isExiting` as className render props; use `className={({isEntering,isExiting}) => stylex.props(...).className}`. RAC waits for `animationend` before unmounting, so exit keyframes work. Wrap `animationName` as `{ default: kf, '@media (prefers-reduced-motion: reduce)': 'none' }`. Keyframes must be non-exported consts in the same file as `stylex.create` (the lint rule rejects imported/exported ones); shared style objects (`internal/overlays-menu.ts`) can be exported.
- **ContextMenu**: RAC 1.22 has no right-click trigger. Use a controlled `MenuTrigger` + a hidden zero-size fixed `Button` as `triggerRef` positioned at `clientX/Y`. The hidden button needs the same `aria-label` as the menu, because the menu gets `aria-labelledby` pointing at the trigger and that overrides the menu's own `aria-label`. Using a plain `div`/`Pressable` as the anchor logs PressResponder warnings or breaks the ref.
- **Toast**: a `Button` with `slot="close"` inside `UNSTABLE_Toast` gets `aria-label="Close"` forced by context, so an action button ("Undo") must NOT use the close slot; call `queue.close(key)` yourself. The queue does not animate exits (needs view transitions), only enter is animated. Mount only one `ToastProvider` per queue or toasts render twice.
- **Menu selection**: `selectionMode` on a `MenuSection` renders `menuitemcheckbox/radio`; multi-select items keep the menu open, single-select closes it.
- **CommandPalette**: first Esc inside the RAC `SearchField` clears the text; second Esc closes the dialog (matches native search UX). Hide `::-webkit-search-cancel-button` for a custom look.
- **Tests (jsdom)**: hover-triggered `Tooltip`/`PreviewTrigger` open only after the pointer modality is established; test those via keyboard focus. Focus-restore after close is async, so use `waitFor(() => expect(trigger).toHaveFocus())`.
