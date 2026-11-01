# New `*.demo.tsx` files are not picked up by a running dev server

**Symptom:** after adding a component folder, `/#/components/<slug>` says "No component called …" even after a reload.

**Cause:** `apps/docs/src/demos.ts` expands `import.meta.glob(...)` once. On the locked-down Mac the file watcher does not
report added files, so the running Vite server keeps the old list. Edits to existing files still hot-reload.

**Fix:** `touch apps/docs/src/demos.ts` (forces a re-transform, which re-expands the glob), then reload the page.
Restarting the dev server also works.

## Motion patterns worth reusing (from the AI trace components)

- Replay an entrance on every open by keying the list on an open counter, not by re-running an effect.
- Stagger only the rows present at mount (or at open); rows appended later get delay 0 so a live stream never waits.
- Grow rails and connectors with `transform: scaleY` from `top`, never `height`.
- Cross-fading a header label: key the span on the text so the keyframe replays; keep `role="status"` on it.
- A pill that changes size (overlay only) can glide its width with WAAPI between measured `offsetWidth`s; inline layout
  should use `AnimatedHeight` / `grid-template-*` instead.
- Preset selections (docs, tests) must paint their own highlight; native selections must not be re-rendered under the user
  (splitting the text node collapses the browser selection), so only freeze into a `<mark>` once focus leaves the text.
