import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { PlanCard, type PlanStep } from './PlanCard';

const steps: PlanStep[] = [
  { id: '1', title: 'Pull Q3 subscription export from the warehouse', detail: 'warehouse.subscriptions, 214k rows, read-only', tool: 'warehouse.query' },
  { id: '2', title: 'Join with CRM account tiers', detail: 'Match on account_id; flag 312 unmatched rows', tool: 'crm.lookup' },
  { id: '3', title: 'Compute monthly cohort retention' },
  { id: '4', title: 'Draft a summary with the 3 biggest movers', tool: 'docs.write' },
];

function Run() {
  const [list, setList] = useState<PlanStep[]>(steps);
  const [status, setStatus] = useState<'draft' | 'running' | 'done'>('draft');
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (status !== 'running') return;
    const t = window.setTimeout(() => setTick((n) => n + 1), 1600);
    return () => window.clearTimeout(t);
  }, [status, tick]);
  const phase = status === 'running' ? tick : 0;
  useEffect(() => {
    if (status !== 'running') return;
    setList((prev) => prev.map((s, i) => ({ ...s, status: i < phase ? 'done' : i === phase ? 'active' : 'pending', duration: i < phase ? 1400 + i * 300 : undefined })));
    if (phase >= list.length) setStatus('done');
  }, [phase, status]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <PlanCard
      title="Plan: Q3 retention analysis"
      estimate="~7 s"
      steps={list}
      status={status}
      onChange={setList}
      onRun={(final) => {
        setList(final);
        setTick(0);
        setStatus('running');
      }}
      onCancel={() => setStatus('draft')}
    />
  );
}

const board: PlanStep[] = [
  { id: 'b1', title: 'Pull Q3 revenue and ARR', detail: 'Monthly revenue, ARR and net retention', tool: 'billing.query', status: 'active' },
  { id: 'b2', title: 'Summarize product launches', detail: 'Shipped projects and adoption', tool: 'tracker.search', status: 'pending' },
  { id: 'b3', title: 'Draft the board memo', detail: 'One page, wins, risks and asks', tool: 'docs.write', status: 'pending' },
  { id: 'b4', title: 'Build the KPI slides', detail: 'Six charts in the board template', tool: 'slides.create', status: 'pending' },
  { id: 'b5', title: 'Send the draft for review', tool: 'mail.draft', status: 'pending' },
];

const failed: PlanStep[] = [
  { id: '1', title: 'Pull Q3 subscription export', status: 'done', duration: 2100 },
  { id: '2', title: 'Join with CRM account tiers', status: 'failed', error: 'CRM API rate limit reached (429). Try again in a minute.' },
  { id: '3', title: 'Compute monthly cohort retention', status: 'pending' },
];

const demo: DemoModule = {
  meta: {
    title: 'Plan card',
    slug: 'plan-card',
    category: 'AI & Agent',
    description: 'Proposed agent plan: rename, reorder, remove and add steps, run it, then watch live step timers and retry from a failed step.',
  },
  demos: [
    {
      name: 'Timeline, running',
      code: `<PlanCard layout="timeline" title="Prepare the Q3 board update" steps={steps} status="running" />`,
      Component: () => <PlanCard layout="timeline" title="Prepare the Q3 board update" steps={board} status="running" />,
    },
    {
      name: 'Review, then run',
      code: `<PlanCard title="Plan: Q3 retention analysis" steps={steps} status={status} onChange={setSteps} onRun={(final) => run(final)} onCancel={discard} />`,
      Component: Run,
    },
    {
      name: 'Approve only',
      code: `<PlanCard steps={steps} onApprove={(s) => run(s)} />`,
      Component: () => <PlanCard title="Plan: Q3 retention analysis" steps={steps} />,
    },
    {
      name: 'Retry from a failed step',
      code: `<PlanCard steps={steps} status="running" onRetry={(id) => agent.retryFrom(id)} />`,
      Component: () => <PlanCard title="Plan: Q3 retention analysis" steps={failed} status="running" onRetry={() => {}} />,
    },
  ],
};

export default demo;
