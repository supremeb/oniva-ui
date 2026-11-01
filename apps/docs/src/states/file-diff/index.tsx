import { FileDiff } from 'oniva-ui';
import type { StateModule } from '../types';

const retry = `@@ -12,9 +12,14 @@ export async function deliver(job: Job) {
   const res = await fetch(job.url, { method: 'POST', body: job.payload });
   if (res.ok) return;
-  const delay = 1000 * 2 ** job.attempt;
-  await queue.retry(job, delay);
+  const base = Math.min(1000 * 2 ** job.attempt, MAX_DELAY_MS);
+  const jitter = Math.random() * base * 0.2;
+  await queue.retry(job, base + jitter);
 }

 export async function consume(msg: Message) {
-  await msg.ack();
-  await deliver(msg.job);
+  await deliver(msg.job);
+  await msg.ack();
 }
@@ -40,4 +45,4 @@ const DEFAULTS = {
   attempts: 12,
-  timeoutMs: 5000,
+  timeoutMs: 10_000,
 };`;

const oneHunk = `@@ -3,5 +3,5 @@ export const config = {
   region: 'eu-west-1',
-  retries: 3,
+  retries: 5,
   queue: 'northwind-events',
 };`;

const addOnly = `@@ -1,2 +1,6 @@
 import { queue } from './queue';
+import { logger } from './logger';
+
+export const log = logger.child({ scope: 'webhooks' });
 export const MAX_DELAY_MS = 60_000;`;

const removeOnly = `@@ -8,6 +8,2 @@ export function legacyPoll() {
   const id = setInterval(tick, 500);
-  window.addEventListener('focus', tick);
-  window.addEventListener('blur', pause);
-  window.addEventListener('online', tick);
-  window.addEventListener('offline', pause);
   return () => clearInterval(id);`;

const longLine = `@@ -21,3 +21,3 @@ const endpoints = {
   primary: 'https://hooks.northwind.example/v2/deliver',
-  fallback: 'https://hooks-eu-west-1.northwind.example/v2/deliver?region=eu-west-1&signature=sha256&timeout=30000&retry=exponential&jitter=decorrelated&trace=true&source=scheduler-worker-pool-b',
+  fallback: 'https://hooks-eu-west-1.northwind.example/v2/deliver?region=eu-west-1&signature=sha256&timeout=60000&retry=exponential&jitter=decorrelated&trace=true&source=scheduler-worker-pool-b',
   audit: null,`;

const manyHunks = Array.from({ length: 8 }, (_, i) => {
  const o = 10 + i * 40;
  return `@@ -${o},3 +${o},3 @@ export function step${i + 1}() {
   const input = read(${i + 1});
-  const out = transform(input, ${i});
+  const out = transform(input, ${i + 1});
   return out;`;
}).join('\n');

const releaseNotes = `@@ -1,4 +1,4 @@
 # October release notes
-The new dashboard is available for all customers today, and it has been rebuilt from the ground up.
+The new dashboard is live for all customers, rebuilt from the ground up.
 
-Export to CSV is also supported now.
+You can also export to CSV.`;

const copy = `@@ -1,5 +1,5 @@
-Hi everyone, the new dashboard is now available for all users.
+Hi everyone, the new dashboard is now live for all users.
-It loads a lot faster than before, and you can export any report to CSV with just a single click. Let us know what you think!
+It loads faster than before, and you can export any report to CSV in one click. Let us know what you think!
-We are also adding dark mode next week.
+Dark mode arrives next week.`;

const longPath = 'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';

const mod: StateModule = {
  slug: 'file-diff',
  title: 'File diff',
  width: 720,
  groups: [
    {
      label: 'View',
      states: [
        { id: 'unified', label: 'unified', render: () => <FileDiff fileName="src/webhooks/retry.ts" diff={retry} /> },
        { id: 'split', label: 'split', render: () => <FileDiff fileName="src/webhooks/retry.ts" diff={retry} defaultView="split" /> },
        { id: 'inline', label: 'inline word diff', render: () => <FileDiff fileName="release-notes.md" diff={releaseNotes} defaultView="inline" /> },
      ],
    },
    {
      label: 'Data',
      states: [
        { id: 'empty-diff', label: 'empty diff', render: () => <FileDiff fileName="src/webhooks/retry.ts" diff="" /> },
        { id: 'one-hunk', label: 'one hunk', render: () => <FileDiff fileName="src/config.ts" diff={oneHunk} /> },
        { id: 'additions-only', label: 'additions only', render: () => <FileDiff fileName="src/webhooks/log.ts" diff={addOnly} /> },
        { id: 'removals-only-split', label: 'removals only, split', render: () => <FileDiff fileName="src/legacy/poll.ts" diff={removeOnly} defaultView="split" /> },
        { id: 'many-hunks', label: 'many hunks', render: () => <FileDiff fileName="src/pipeline/steps.ts" diff={manyHunks} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-line-unified', label: 'long line, unified', render: () => <FileDiff fileName="src/webhooks/endpoints.ts" diff={longLine} /> },
        { id: 'long-line-split', label: 'long line, split', render: () => <FileDiff fileName="src/webhooks/endpoints.ts" diff={longLine} defaultView="split" /> },
        { id: 'long-line-inline', label: 'long line, inline', render: () => <FileDiff fileName="src/webhooks/endpoints.ts" diff={longLine} defaultView="inline" /> },
        { id: 'long-file-name', label: 'long file name', render: () => <FileDiff fileName={longPath} diff={oneHunk} reviewable /> },
      ],
    },
    {
      label: 'Review',
      states: [
        { id: 'reviewable', label: 'reviewable, pending', render: () => <FileDiff fileName="src/webhooks/retry.ts" diff={retry} reviewable /> },
        { id: 'reviewable-one-hunk', label: 'reviewable, one hunk', render: () => <FileDiff fileName="src/config.ts" diff={oneHunk} reviewable /> },
        { id: 'reviewable-inline', label: 'reviewable, inline', render: () => <FileDiff fileName="release-notes.md" diff={releaseNotes} defaultView="inline" reviewable /> },
        { id: 'reviewable-empty', label: 'reviewable, empty diff', render: () => <FileDiff fileName="src/webhooks/retry.ts" diff="" reviewable /> },
      ],
    },
    {
      label: 'Prose',
      states: [
        { id: 'prose', label: 'prose suggestions', render: () => <FileDiff layout="prose" label="Suggested by AI · Make it shorter" fileName="announcement.md" diff={copy} defaultView="inline" /> },
        { id: 'prose-default-label', label: 'prose, default label', render: () => <FileDiff layout="prose" fileName="release-notes.md" diff={releaseNotes} defaultView="inline" /> },
        { id: 'prose-empty', label: 'prose, empty diff', render: () => <FileDiff layout="prose" fileName="announcement.md" diff="" defaultView="inline" /> },
      ],
    },
  ],
  missing: [
    'accepted / rejected / all reviewed: decisions are internal state with no default prop; only reachable by interaction',
    'collapsed hunk: open state is internal, no defaultOpen prop',
    'loading / streaming diff: no status prop',
    'binary or renamed file: parser only reads hunks',
  ],
};

export default mod;
