import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { AgentQueue, type QueueJob, type QueueWorker } from './AgentQueue';

const allWorkers: QueueWorker[] = [
  { id: 'w1', name: 'Atlas 2' },
  { id: 'w2', name: 'Nova Pro' },
  { id: 'w3', name: 'Lumen Fast' },
  { id: 'w4', name: 'Quill Reasoner' },
];
const KINDS = ['llm', 'tool', 'agent', 'human'] as const;
const NAMES = ['Summarize ticket', 'Embed docs', 'Draft reply', 'Sync CRM', 'Classify email', 'Fetch invoices', 'Review contract'];

/** Deterministic simulation: arrival every 700ms, each job runs 3-6s. */
function simulate(t: number, workers: number, limit: boolean): QueueJob[] {
  const jobs: QueueJob[] = [];
  const free = Array.from({ length: workers }, () => 0);
  const n = Math.floor(t / 700);
  for (let i = 0; i < n; i++) {
    const enq = i * 700;
    const dur = 3000 + ((i * 7919) % 3000);
    const k = free.indexOf(Math.min(...free));
    let start = Math.max(enq, free[k]!);
    if (limit && start > 14_000 && start < 26_000) start = 26_000;
    const end = start + dur;
    free[k] = end;
    const base = { id: `j${i}`, name: `${NAMES[i % NAMES.length]} #${4800 + i}`, kind: KINDS[i % 4]!, enqueuedAt: enq, priority: i % 9 === 8 ? ('high' as const) : ('normal' as const) };
    if (t < start) jobs.push({ ...base, status: 'queued' });
    else if (t < end) jobs.push({ ...base, status: 'running', startedAt: start, worker: allWorkers[k]!.id, progress: (t - start) / dur });
    else if (i % 17 === 5) jobs.push({ ...base, status: 'failed', startedAt: start, endedAt: end, error: 'Upstream returned 502.' });
    else jobs.push({ ...base, status: 'done', startedAt: start, endedAt: end });
  }
  return jobs.filter((j) => j.status === 'queued' || j.status === 'running' || (j.endedAt ?? 0) > t - 120_000);
}

function Live() {
  const [t, setT] = useState(0);
  const [workers, setWorkers] = useState(2);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setT((x) => x + 500), 500);
    return () => window.clearInterval(id);
  }, [paused]);
  return (
    <AgentQueue
      name="support-inbox"
      jobs={simulate(t, workers, true)}
      workers={allWorkers.slice(0, workers)}
      now={t}
      rateLimits={[{ from: 14_000, until: 26_000, label: 'provider' }]}
      paused={paused}
      onPausedChange={setPaused}
      onConcurrencyChange={setWorkers}
      backpressure={8}
      onPromote={() => {}}
      onCancel={() => {}}
    />
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Agent queue',
    slug: 'agent-queue',
    category: 'AI & Agent',
    description: 'Live job queue with worker slots, retries, rate-limit pauses and a depth chart showing backpressure.',
  },
  demos: [
    {
      name: 'Live simulation',
      code: `<AgentQueue jobs={jobs} workers={workers} now={clock} rateLimits={[{ from, until, label: 'provider' }]} paused={paused} onPausedChange={setPaused} onConcurrencyChange={setCount} backpressure={8} />`,
      Component: Live,
    },
    {
      name: 'Static snapshot',
      code: `<AgentQueue jobs={jobs} workers={workers} now={30_000} backpressure={6} />`,
      Component: () => <AgentQueue jobs={simulate(30_000, 3, false)} workers={allWorkers.slice(0, 3)} now={30_000} backpressure={6} title="Ingest" />,
    },
  ],
};

export default demo;
