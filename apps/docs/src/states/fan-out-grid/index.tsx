import { FanOutGrid, SparklesIcon } from 'oniva-ui';
import type { FanoutTask } from 'oniva-ui';
import type { StateModule } from '../types';

const sites = ['northwind-labs.example', 'harbor-freight.example', 'lumen-works.example', 'quill-press.example', 'atlas-cargo.example', 'meridian-bio.example', 'cobalt-grid.example', 'juniper-tea.example'];

type Phase = { done: number; running: number; retrying?: number; failed?: number };

/** Builds `n` tasks in a fixed order: finished first, then in-flight, then queued. */
function build(n: number, p: Phase): FanoutTask[] {
  const failedAt = new Set(Array.from({ length: p.failed ?? 0 }, (_, k) => 3 + k * 7));
  return Array.from({ length: n }, (_, i) => {
    const label = `${sites[i % sites.length]!.replace('.example', '')}-${i + 1}.example`;
    const worker = `W${(i % 8) + 1}`;
    const start = i * 420;
    if (i < p.done) {
      const end = start + 2400 + ((i * 937) % 3100);
      if (failedAt.has(i)) return { id: `t${i}`, label, status: 'failed', worker, start, end, cost: 0.01, attempts: 3, error: 'Page blocked the crawler (HTTP 403).' };
      return { id: `t${i}`, label, status: 'done', worker, start, end, cost: 0.02 + (i % 5) / 100, result: 'Company size and funding round found.' };
    }
    if (i < p.done + p.running) return { id: `t${i}`, label, status: 'running', worker, start };
    if (i < p.done + p.running + (p.retrying ?? 0)) return { id: `t${i}`, label, status: 'retrying', worker, start, attempts: 2 };
    return { id: `t${i}`, label, status: 'queued' };
  });
}

const longLabels: FanoutTask[] = [
  { id: 'l1', label: 'https://www.northwind-labs.example/investors/annual-reports/2025/consolidated-financial-statements-and-notes-final-v3.pdf', status: 'failed', worker: 'W1', start: 0, end: 9200, cost: 0.04, attempts: 3, error: 'Request to https://www.northwind-labs.example/investors/annual-reports/2025/consolidated-financial-statements-and-notes-final-v3.pdf timed out after 30s.' },
  { id: 'l2', label: 'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts', status: 'done', worker: 'W2', start: 0, end: 4100, cost: 0.03, result: 'Summarised 1,204 lines across 38 exported symbols, with no unresolved references to other workspace packages.' },
  { id: 'l3', label: 'quill-press.example', status: 'running', worker: 'W3', start: 1200 },
  { id: 'l4', label: 'atlas-cargo.example', status: 'queued' },
];

const mod: StateModule = {
  slug: 'fan-out-grid',
  title: 'Fan-out grid',
  width: 720,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'empty', label: 'empty, no tasks', render: () => <FanOutGrid tasks={[]} job="Enrich 0 leads" /> },
        { id: 'all-queued', label: 'all queued', render: () => <FanOutGrid tasks={build(48, { done: 0, running: 0 })} job="Enrich 48 leads" workers={8} now={0} /> },
        { id: 'early', label: 'running, few finished (no estimate)', render: () => <FanOutGrid tasks={build(48, { done: 2, running: 8 })} job="Enrich 48 leads" workers={8} now={4200} /> },
        { id: 'mid-run', label: 'mid-run with estimate', render: () => <FanOutGrid tasks={build(96, { done: 40, running: 8 })} job="Enrich 96 leads" workers={8} now={22_000} /> },
        { id: 'retrying', label: 'running with retries', render: () => <FanOutGrid tasks={build(96, { done: 52, running: 6, retrying: 2 })} job="Enrich 96 leads" workers={8} now={26_000} /> },
        { id: 'failures', label: 'some failed, retry offered', render: () => <FanOutGrid tasks={build(96, { done: 70, running: 8, failed: 4 })} job="Enrich 96 leads" workers={8} now={31_000} onRetry={() => {}} /> },
        { id: 'finished', label: 'finished clean', render: () => <FanOutGrid tasks={build(48, { done: 48, running: 0 })} job="Label 48 tickets" title="Labeling" now={40_000} /> },
        { id: 'finished-failed', label: 'finished with failures', render: () => <FanOutGrid tasks={build(48, { done: 48, running: 0, failed: 6 })} job="Label 48 tickets" title="Labeling" now={40_000} onRetry={() => {}} /> },
        { id: 'all-failed', label: 'every task failed', render: () => <FanOutGrid tasks={build(24, { done: 24, running: 0, failed: 24 }).map((t) => ({ ...t, status: 'failed' as const, error: 'Page blocked the crawler (HTTP 403).' }))} job="Enrich 24 leads" now={20_000} onRetry={() => {}} /> },
      ],
    },
    {
      label: 'Data',
      states: [
        { id: 'one-task', label: 'one task', render: () => <FanOutGrid tasks={build(1, { done: 0, running: 1 })} job="Enrich 1 lead" now={1500} /> },
        { id: 'large-set', label: '480 tasks (wraps)', render: () => <FanOutGrid tasks={build(480, { done: 300, running: 12, retrying: 3, failed: 9 })} job="Enrich 480 leads" workers={12} now={80_000} onRetry={() => {}} /> },
        { id: 'long-text', label: 'long labels and errors', render: () => <FanOutGrid tasks={longLabels} job="Fetch 4 filings" now={9500} onRetry={() => {}} /> },
        { id: 'custom', label: 'custom title, icon, cost format', render: () => <FanOutGrid tasks={build(32, { done: 20, running: 6 })} title="Crawl" job="Index 32 sites" icon={<SparklesIcon size={16} aria-hidden="true" />} formatCost={(n) => `${Math.round(n * 1000)} credits`} workers={6} now={18_000} /> },
      ],
    },
  ],
  missing: [
    'pinned / hovered cell details (needs a click or hover; no default prop)',
    'state filter active (internal toggle, no default prop)',
    'loading / skeleton (the component has no pending state)',
  ],
};

export default mod;
