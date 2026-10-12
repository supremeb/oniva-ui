---
title: Loop 6 — expert component docs + interface polish (jakubkrehel/skills)
status: active
created: 2026-10-12
reference: user screenshots of an "Insurance Platform / internal design docs" site (Command search page)
skills: ~/code/jakubkrehel-skills/skills/* (MIT, Jakub Krehel) — better-interface, better-ui, better-typography,
        better-colors, better-accessibility, better-layout, better-writing, interface-review, state-machine, break
---

## Track 1 — library polish (safe)
1. Report-only reviewers (parallel): R-a11y (better-accessibility), R-type-color (better-typography + better-colors),
   R-ui-layout (better-ui + better-layout), R-writing (better-writing, incl. all demo + docs copy).
   Output: docs/reviews/loop6-<area>.md with P0/P1/P2, file:line, exact fix, and "API impact: none|…".
2. Fix workers apply P0/P1 only, NO public API changes (prop names/types/exports frozen), tests green after every batch.
3. Final reviewer runs `interface-review` over the Loop 6 diff → docs/reviews/loop6-interface-review.md; fixes regressions.

## Track 2 — docs platform + content
Platform (single worker, first): docs shell (left nav grouped Getting started / Foundations / Components by category /
AI / Charts / Motion / Blocks / Patterns / Templates, `/` search, New/AI badges, mobile drawer; right "on this page"
tick rail), component page template driven by a typed `DocPage` contract in apps/docs/src/content/, doc primitives
(MetaStrip, AnatomyStage w/ selector-anchored numbered markers + linked legend, UsageCards, Playground w/ controls +
synced code, StateGallery, RuleCards, DoDont, PropsTable, KeyboardTable, A11yNotes, Related), foundations pages from
tokens, Getting-started pages, 3 exemplar pages (command-palette, button, select), authoring guide.
Content writers (parallel, after platform): one file per component in apps/docs/src/content/components/<slug>.tsx.
Pages without a doc file fall back to the existing demo page.
