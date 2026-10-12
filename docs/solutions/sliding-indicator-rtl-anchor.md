---
title: Measured-offset overlays must anchor physically (RTL)
date: 2026-10-12
area: motion
tags: [rtl, sliding-indicator, offsetLeft, logical-properties]
---

**Symptom:** with `dir="rtl"` the Tabs/Segmented pill sat far from the active item.
**Cause:** `SlidingIndicator` used `inset-inline-start: 0` (right edge in RTL) plus `translate(offsetLeft)`; `offsetLeft` is always physical.
**Fix:** anchor with `left: 0; right: auto` (inline style, so StyleX's logical flipping can't rewrite it).
**Rule:** if a position is computed from `offsetLeft/getBoundingClientRect().x`, the anchor must be physical too. Note ResizeObserver does not fire on a `dir` flip with unchanged sizes; real RTL apps set dir before mount so this only affects live toggling.
