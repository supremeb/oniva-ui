import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { ParallelAttempts, type Attempt } from './ParallelAttempts';

const settled: Attempt[] = [
  { id: 'a', name: 'Atlas 2', approach: 'Retry with exponential backoff', status: 'done', score: 88, note: '19/20 runs green', took: 98000, cost: 0.19 },
  { id: 'b', name: 'Nova Pro', approach: 'Mock the payments API', status: 'done', score: 94, note: '20/20 runs green', took: 125000, cost: 0.27 },
  { id: 'c', name: 'Lumen Fast', approach: 'Freeze timers in the test', status: 'done', score: 71, note: '17/20 runs green', took: 61000, cost: 0.08 },
  { id: 'd', name: 'Quill Reasoner', approach: 'Rewrite the test from scratch', status: 'failed', progress: 0.35, note: 'Timed out after 120s' },
];

function Race() {
  const [p, setP] = useState(0.1);
  useEffect(() => {
    const t = window.setInterval(() => setP((v) => (v >= 1 ? 0.1 : Math.min(1, v + 0.06))), 700);
    return () => window.clearInterval(t);
  }, []);
  const attempts: Attempt[] = [
    { id: 'a', name: 'Atlas 2', approach: 'Retry with exponential backoff', status: p >= 1 ? 'done' : 'running', progress: p, step: `Running tests ${Math.round(p * 20)}/20`, score: 88, note: '19/20 runs green', took: 98000, cost: p >= 1 ? 0.19 : 0.14 },
    { id: 'b', name: 'Nova Pro', approach: 'Mock the payments API', status: 'done', score: 94, note: '20/20 runs green', took: 125000, cost: 0.27 },
    { id: 'c', name: 'Lumen Fast', approach: 'Freeze timers in the test', status: 'running', progress: Math.min(1, p * 0.7), step: 'Patching 3 files', cost: 0.12 },
  ];
  return <ParallelAttempts attempts={attempts} task="Fix the flaky checkout test" />;
}

const demo: DemoModule = {
  meta: {
    title: 'Parallel attempts',
    slug: 'parallel-attempts',
    category: 'AI & Agent',
    description: 'Best-of-N: attempts race as rows with a live bar, get scored, and the best is marked and picked. Switch with Use this one.',
  },
  demos: [
    {
      name: 'Settled',
      code: `<ParallelAttempts
  task="Fix the flaky checkout test"
  attempts={attempts}
  onPick={(a) => apply(a.id)}
/>`,
      Component: () => <ParallelAttempts task="Fix the flaky checkout test" attempts={settled} />,
    },
    {
      name: 'Live race',
      code: `<ParallelAttempts task="Fix the flaky checkout test" attempts={attempts} /> // attempts update as progress streams in`,
      Component: Race,
    },
  ],
};

export default demo;
