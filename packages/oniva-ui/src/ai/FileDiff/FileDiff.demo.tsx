import type { DemoModule } from '../../internal/demo';
import { FileDiff } from './FileDiff';

const diff = `@@ -12,9 +12,14 @@ export async function deliver(job: Job) {
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

const prose = `@@ -1,4 +1,4 @@
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

const demo: DemoModule = {
  meta: {
    title: 'File diff',
    slug: 'file-diff',
    category: 'AI & Agent',
    description: 'Unified, split and inline word-level diff with line numbers, collapsible hunks and per-hunk accept / reject (Y / N, undo).',
  },
  demos: [
    {
      name: 'Prose suggestions',
      code: `<FileDiff layout="prose" label="Suggested by AI · Make it shorter" fileName="announcement.md" diff={copy} defaultView="inline" />`,
      Component: () => <FileDiff layout="prose" label="Suggested by AI · Make it shorter" fileName="announcement.md" diff={copy} defaultView="inline" />,
    },
    {
      name: 'Review hunks',
      code: `<FileDiff fileName="src/webhooks/retry.ts" diff={diff} reviewable />`,
      Component: () => <FileDiff fileName="src/webhooks/retry.ts" diff={diff} reviewable />,
    },
    {
      name: 'Split view',
      code: `<FileDiff fileName="src/webhooks/retry.ts" diff={diff} defaultView="split" />`,
      Component: () => <FileDiff fileName="src/webhooks/retry.ts" diff={diff} defaultView="split" />,
    },
    {
      name: 'Inline word diff',
      code: `<FileDiff fileName="release-notes.md" diff={prose} defaultView="inline" reviewable />`,
      Component: () => <FileDiff fileName="release-notes.md" diff={prose} defaultView="inline" reviewable />,
    },
  ],
};

export default demo;
