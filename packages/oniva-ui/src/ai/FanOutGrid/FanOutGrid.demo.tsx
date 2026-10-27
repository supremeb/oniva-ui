import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { FanOutGrid, type FanoutTask } from './FanOutGrid';

const domains = ['acme.io', 'globex.com', 'initech.dev', 'umbrella.co', 'hooli.net', 'stark.org', 'wayne.biz', 'wonka.app'];
const make = (n: number, elapsed: number): FanoutTask[] =>
  Array.from({ length: n }, (_, i) => {
    const start = i * 450;
    const dur = 2500 + ((i * 937) % 3000);
    const end = start + dur;
    const label = `${domains[i % domains.length]!.replace('.', `${i}.`)}`;
    if (elapsed < start) return { id: `t${i}`, label, status: 'queued' as const };
    if (elapsed < end) return { id: `t${i}`, label, status: i % 11 === 4 ? ('retrying' as const) : ('running' as const), start, worker: `W${(i % 8) + 1}`, attempts: i % 11 === 4 ? 2 : 1 };
    if (i % 13 === 6) return { id: `t${i}`, label, status: 'failed' as const, start, end, worker: `W${(i % 8) + 1}`, cost: 0.01, attempts: 3, error: 'Page blocked the crawler (403).' };
    return { id: `t${i}`, label, status: 'done' as const, start, end, worker: `W${(i % 8) + 1}`, cost: 0.02 + (i % 5) / 100, result: 'Company size and funding found.' };
  });

function Live() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setElapsed((e) => (e > 40_000 ? 0 : e + 250)), 250);
    return () => window.clearInterval(id);
  }, []);
  return <FanOutGrid tasks={make(96, elapsed)} job="Enrich 96 leads" workers={8} now={elapsed} onRetry={() => {}} />;
}

const demo: DemoModule = {
  meta: {
    title: 'Fan-out grid',
    slug: 'fan-out-grid',
    category: 'AI & Agent',
    description: 'One cell per task of a fanned-out job: live progress, cost, time left, retries and per-cell details.',
  },
  demos: [
    {
      name: 'Live run',
      code: `<FanOutGrid tasks={tasks} job="Enrich 96 leads" workers={8} now={elapsed} onRetry={(ids) => retry(ids)} />`,
      Component: Live,
    },
    {
      name: 'Finished',
      code: `<FanOutGrid tasks={tasks} job="Label 48 tickets" now={60_000} title="Labeling" />`,
      Component: () => <FanOutGrid tasks={make(48, 90_000)} job="Label 48 tickets" now={60_000} title="Labeling" />,
    },
  ],
};

export default demo;
