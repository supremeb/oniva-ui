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

const demo: DemoModule = {
  meta: {
    title: 'File diff',
    slug: 'file-diff',
    category: 'AI & Agent',
    description: 'Unified and split diff with line numbers, collapsible hunks and per-hunk accept / reject.',
  },
  demos: [
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
  ],
};

export default demo;
