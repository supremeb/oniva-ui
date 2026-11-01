import { AgentLedger, MergeIcon, MailIcon, TriangleIcon } from 'oniva-ui';
import type { LedgerEntry } from 'oniva-ui';
import type { StateModule } from '../types';

const NOW = Date.UTC(2026, 9, 31, 14, 30, 0);
const ago = (s: number) => NOW - s * 1000;

const typical: LedgerEntry[] = [
  { id: 'coupon', action: 'Created coupon', target: 'LAUNCH20', system: 'Billing', at: ago(4), detail: '20% off the first year · ends in 7 days', dependsOn: ['price'] },
  { id: 'price', action: 'Changed price', target: 'Pro plan', system: 'Billing', at: ago(31), change: ['$29 / month', '$34 / month'] },
  { id: 'deploy', action: 'Deployed', target: 'northwind.example', system: 'Hosting', icon: <TriangleIcon size={14} fill="currentColor" />, at: ago(55), change: ['#481', '#483 in production'], dependsOn: ['merge'], reversible: false },
  { id: 'merge', action: 'Merged PR #482', target: 'Pricing page v2', system: 'Repo', icon: <MergeIcon size={15} />, at: ago(60), change: ['pricing-v2', 'main'] },
];

const consequences: LedgerEntry[] = [
  { id: 'price', action: 'Changed price', target: 'Pro plan', system: 'Billing', at: ago(7200), change: ['$29 / month', '$34 / month'] },
  { id: 'deals', action: 'Updated 212 deals', system: 'CRM', at: ago(3600), change: ['$29', '$34'], dependsOn: ['price'] },
  { id: 'invoices', action: 'Reissued 48 draft invoices', system: 'Billing', at: ago(1800), change: ['$29.00', '$34.00'], dependsOn: ['price'] },
  { id: 'email', action: 'Sent email', target: '3,812 customers', system: 'Mail', icon: <MailIcon size={14} />, at: ago(90), detail: 'Subject: Pricing changes on 1 December', dependsOn: ['price'], reversible: false },
];

const longPath = 'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';

const many: LedgerEntry[] = Array.from({ length: 14 }, (_, i): LedgerEntry => {
  const base = [
    { action: 'Updated', target: 'Segment "Trial users"', system: 'CRM', change: ['1,204 contacts', '1,311 contacts'] as [string, string] },
    { action: 'Renamed', target: 'Invoice template', system: 'Billing', change: ['Standard', 'Standard 2026'] as [string, string] },
    { action: 'Archived', target: 'Campaign Q3 Retention', system: 'Mail', detail: 'Moved to archive · 6 automations paused' },
    { action: 'Rotated', target: 'Webhook signing secret', system: 'Platform', detail: 'Old secret valid for 24 hours' },
  ][i % 4]!;
  return { id: `m${i}`, system: base.system, action: base.action, target: base.target, change: base.change, detail: base.detail, at: ago(60 + i * 540) };
});

const render = (props: Partial<React.ComponentProps<typeof AgentLedger>> & { entries: LedgerEntry[] }) => () => (
  <AgentLedger now={NOW} agent="Launch agent" {...props} />
);

const mod: StateModule = {
  slug: 'agent-ledger',
  title: 'Agent ledger',
  width: 640,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty', render: render({ entries: [] }) },
        { id: 'one-entry', label: 'one change', render: render({ entries: typical.slice(1, 2) }) },
        { id: 'typical', label: 'typical (change, detail, icon, permanent)', render: render({ entries: typical }) },
        { id: 'many', label: 'many changes (14)', render: render({ entries: many }) },
        { id: 'no-agent', label: 'no agent, custom title', render: render({ entries: typical, agent: undefined, title: 'Changes' }) },
      ],
    },
    {
      label: 'Undo',
      states: [
        { id: 'pre-undone', label: 'one undone', render: render({ entries: typical, defaultUndone: ['coupon'] }) },
        { id: 'all-undone', label: 'all undone', render: render({ entries: typical, defaultUndone: ['coupon', 'price', 'merge'] }) },
        { id: 'point-self', label: 'pointing: change with dependents', render: render({ entries: consequences, pointAt: 'price' }) },
        { id: 'point-leaf', label: 'pointing: leaf change', render: render({ entries: typical, pointAt: 'coupon' }) },
        { id: 'point-permanent', label: 'pointing: permanent change', render: render({ entries: typical, pointAt: 'deploy' }) },
        { id: 'point-partly-undone', label: 'pointing: some dependents already undone', render: render({ entries: consequences, pointAt: 'price', defaultUndone: ['deals'] }) },
      ],
    },
    {
      label: 'Size',
      states: [
        { id: 'narrow', label: 'narrow (360): icon-only buttons, no system', render: () => <div style={{ width: 360 }}><AgentLedger now={NOW} agent="Launch agent" entries={typical} /></div> },
        { id: 'narrow-pointing', label: 'narrow (360): pointing', render: () => <div style={{ width: 360 }}><AgentLedger now={NOW} agent="Launch agent" entries={consequences} pointAt="price" /></div> },
        { id: 'narrow-undone', label: 'narrow (360): undone', render: () => <div style={{ width: 360 }}><AgentLedger now={NOW} agent="Launch agent" entries={typical} defaultUndone={['price']} /></div> },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-text',
          label: 'long action, target and change',
          render: render({
            entries: [
              { id: 'a', action: 'Rewrote retry scheduler', target: longPath, system: 'Repo', at: ago(120), change: [`${longPath}@3f9a1c2`, `${longPath}@b71e0d4 (merged into release/2026.11)`] },
              { id: 'b', action: 'Updated the shipping rules for every warehouse in the northern region', target: 'Northwind Labs fulfilment policy', system: 'Logistics', at: ago(900), detail: 'Orders over 40 kg now route through the Rotterdam hub instead of the closest regional warehouse' },
              { id: 'c', action: 'Created coupon', system: 'Billing', at: ago(2400) },
            ],
          }),
        },
        {
          id: 'plain',
          label: 'no change, no detail',
          render: render({ entries: [{ id: 'a', action: 'Paused campaign', target: 'Spring sale', system: 'Mail', at: ago(300) }, { id: 'b', action: 'Archived project', system: 'Workspace', at: ago(7200) }] }),
        },
        {
          id: 'old',
          label: 'timestamps: seconds to days',
          render: render({
            entries: [
              { id: 'a', action: 'Synced', target: 'Product catalog', system: 'Store', at: ago(2) },
              { id: 'b', action: 'Synced', target: 'Product catalog', system: 'Store', at: ago(14 * 60) },
              { id: 'c', action: 'Synced', target: 'Product catalog', system: 'Store', at: ago(5 * 3600) },
              { id: 'd', action: 'Synced', target: 'Product catalog', system: 'Store', at: ago(3 * 86400) },
              { id: 'e', action: 'Synced', target: 'Product catalog', system: 'Store', at: ago(45 * 86400) },
            ],
          }),
        },
        { id: 'all-permanent', label: 'all permanent', render: render({ entries: consequences.slice(3).concat(typical.slice(2, 3)).map((e) => ({ ...e, dependsOn: undefined, reversible: false })) }) },
      ],
    },
  ],
  missing: [
    'Loading / pending ledger (no loading prop)',
    'Error on an entry (no failed status on LedgerEntry)',
    'Disabled / read-only ledger (no isDisabled prop; Undo buttons always show)',
    'Hover / focus reveal of Undo (pointer interaction, not reachable through props)',
  ],
};
export default mod;
