---
title: Backlog — "Shapeshift"-style intent input (owner request: "steal this later")
date: 2026-10-12
source: https://lab.anishfn.ink/shapeshift (by Anish; React + Tailwind + Motion, shadcn registry)
status: backlog (do after landing redesign)
---

Reference concept: an input that becomes what you mean. Register "shapes" (your own components) with
`match` words + a `read(text) → data | null` parser + `render({data})`; type a sentence, the field picks the shape,
opens it over the input and fills it. Behaviors worth matching:
- Decides calmly: opens only when words match AND reader returns data; mid-word holds last reading (no flicker);
  ties → shape that reads more of the sentence, then list order.
- `/` focuses globally; empty focus lists all shapes, narrowing as you type; arrows/Enter/Esc.
- Optional `action` → field grows a primary button (= Enter; submits if the shape is a form).
- Optional `classify` (LLM picks the shape; readers still compute data).
- `side="top|bottom"`, `restWidth` (rests narrow, widens on use); dock at page foot.

oniva-ui plan (clean-room, StyleX + React Aria, no Motion dep): `src/ai/IntentInput` (alias Shapeshift-like) using
RAC Autocomplete/ComboBox semantics, Presence + AnimatedHeight + width morph (transform-safe), 8 starter shapes for our
domain (tip/split, convert currency, schedule meeting → MeetingSchedule, chart a metric → AreaChart, find customer →
DataTable row, run agent task → AgentProgress, set reminder, color/theme → accent switcher). Use it as the landing's
command dock too. Do NOT copy source; reimplement behavior from the public description. Check its license before
reusing any code.
