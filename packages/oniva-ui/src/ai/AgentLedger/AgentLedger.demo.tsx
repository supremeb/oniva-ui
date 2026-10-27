import { GitMerge, Triangle } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { AgentLedger, type LedgerEntry } from './AgentLedger';

const t0 = Date.now();
const entries: LedgerEntry[] = [
  { id: 'coupon', action: 'Created coupon', target: 'LAUNCH20', system: 'Billing', at: t0 - 4_000, detail: '20% off the first year \u00b7 ends in 7 days', dependsOn: ['price'] },
  { id: 'price', action: 'Changed price', target: 'Pro plan', system: 'Billing', at: t0 - 31_000, change: ['$29 / month', '$34 / month'] },
  { id: 'deploy', action: 'Deployed', target: 'oniva.ai', system: 'Hosting', icon: <Triangle size={14} fill="currentColor" />, at: t0 - 55_000, change: ['#481', '#483 in production'], dependsOn: ['merge'], reversible: false },
  { id: 'merge', action: 'Merged PR #482', target: 'Pricing page v2', system: 'Repo', icon: <GitMerge size={15} />, at: t0 - 60_000, change: ['pricing-v2', 'main'] },
];

const demo: DemoModule = {
  meta: {
    title: 'Agent ledger',
    slug: 'agent-ledger',
    category: 'AI & Agent',
    description: 'Audit trail of agent changes with before and after, undo/redo and honest dependency consequences.',
  },
  demos: [
    {
      name: 'Undo with consequences',
      code: `<AgentLedger entries={entries} agent="Launch agent" onUndo={(ids) => revert(ids)} />`,
      Component: () => <AgentLedger entries={entries} agent="Launch agent" />,
    },
    {
      name: 'Walkthrough (pointAt)',
      code: `<AgentLedger entries={entries} pointAt="merge" title="Changes" />`,
      Component: () => <AgentLedger entries={entries} pointAt="merge" title="Changes" />,
    },
    {
      name: 'Pre-undone',
      code: `<AgentLedger entries={entries} defaultUndone={['coupon']} />`,
      Component: () => <AgentLedger entries={entries} defaultUndone={['coupon']} />,
    },
  ],
};

export default demo;
