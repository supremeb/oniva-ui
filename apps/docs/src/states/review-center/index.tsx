import { ReviewCenter, PullRequestIcon, MailIcon } from 'oniva-ui';
import type { ReviewItem } from 'oniva-ui';
import type { StateModule } from '../types';

const NOW = 1_793_000_000_000;
const min = (m: number) => NOW - m * 60_000;

const diff = `@@ -8,6 +8,8 @@ export function applyDiscount(cart: Cart) {
   const subtotal = sum(cart.lines);
-  return subtotal * (1 - cart.discount);
+  const capped = Math.min(cart.discount, MAX_DISCOUNT);
+  return round(subtotal * (1 - capped));
 }`;

const refund: ReviewItem = {
  id: 'refund-4821', title: 'Refund order #4821 for Maya Chen', agent: 'Support agent', model: 'Atlas 2', type: 'Refund', risk: 'high', confidence: 0.62, createdAt: min(26),
  reasoning: 'Her blender arrived cracked. Damaged items are covered within 30 days of delivery.',
  fields: [
    { label: 'Amount', value: [{ text: '$184.00', note: 'Includes $20 express shipping, which the policy does not refund.', source: 'Refund policy, section 4' }] },
    { label: 'Order', value: '#4821, delivered Oct 14' },
  ],
  bodyLabel: 'Reply to Maya',
  body: ['Hi Maya, I am sorry your blender arrived cracked. I have refunded ', { text: 'the full $184.00', note: 'Shipping is normally excluded.' }, ' to your original card. It should show up in 3 to 5 business days.'],
};
const pr: ReviewItem = {
  id: 'pr-312', title: 'Cap discounts at 40%', agent: 'Coder', model: 'Nova Pro', type: 'Code change', risk: 'medium', confidence: 0.81, createdAt: min(12),
  reasoning: 'Carts could drop below cost when stacked promos pushed the discount past 100%.',
  files: [{ path: 'src/cart/discount.ts', added: 2, removed: 1, diff }],
  links: [{ label: 'PR #312' }, { label: 'CI run 1204' }],
};
const plan: ReviewItem = {
  id: 'plan-77', title: 'Archive 214 inactive workspaces', agent: 'Ops agent', model: 'Lumen Fast', type: 'Plan', risk: 'high', confidence: 0.55, createdAt: min(4),
  steps: [
    { title: 'Export workspace metadata', tool: 'warehouse.export' },
    { title: 'Notify owners 7 days before', tool: 'mail.send', detail: '214 emails' },
    { title: 'Archive workspaces with no activity in 12 months', tool: 'admin.archive', flagged: true, detail: 'Some have an active billing plan' },
  ],
};
const migration: ReviewItem = { id: 'mig-3', title: 'Split customers.name into two fields', agent: 'Coder', model: 'Nova Pro', type: 'Migration', risk: 'medium', confidence: 0.74, createdAt: min(14), reasoning: 'The profile form needs first and last name separately.' };
const keys: ReviewItem = { id: 'key-8', title: 'Rotate the payments API keys', agent: 'Ops agent', model: 'Lumen Fast', type: 'Plan', risk: 'high', confidence: 0.66, createdAt: min(11), reasoning: 'Keys are 90 days old and the policy rotates at 90.' };
const tag: ReviewItem = { id: 'tag-14', title: 'Tag 14 tickets as Billing', agent: 'Support agent', model: 'Atlas 2', type: 'Triage', risk: 'low', confidence: 0.88, createdAt: min(6), reasoning: 'All 14 mention an invoice or a charge.' };
const note: ReviewItem = { id: 'note-5', title: 'Post release notes to #announcements', agent: 'Coder', model: 'Nova Pro', type: 'Chat message', risk: 'low', confidence: 0.91, createdAt: min(2), body: 'Version 4.2 is out: faster imports, a new export menu and two fixes.' };
const mail: ReviewItem = { id: 'mail-9', title: 'Reply to Sam about onboarding', agent: 'Support agent', type: 'Email', risk: 'low', confidence: 0.93, createdAt: NOW - 90_000, body: 'Hi Sam, thanks for your patience. Your workspace is ready and the invite is on its way.' };

const queue = [refund, pr, plan, migration, keys, tag, note, mail];
const longPath = 'packages/northwind-billing/src/invoices/reconciliation/strategies/partial-refund-with-currency-rounding.worker.ts';

const mod: StateModule = {
  slug: 'review-center',
  title: 'Review center',
  width: 1000,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty', render: () => <ReviewCenter items={[]} now={NOW} /> },
        { id: 'empty-reviewed', label: 'empty, all reviewed', render: () => <ReviewCenter items={[]} reviewed={32} total={32} now={NOW} /> },
        { id: 'one-item', label: 'one item', render: () => <ReviewCenter items={[mail]} now={NOW} /> },
        { id: 'typical', label: 'typical queue', render: () => <ReviewCenter items={queue} reviewed={24} total={32} now={NOW} /> },
        { id: 'many', label: 'long queue scrolls', render: () => <ReviewCenter items={Array.from({ length: 24 }, (_, i): ReviewItem => ({ ...queue[i % queue.length]!, id: `m${i}`, createdAt: min(3 + i * 3) }))} reviewed={140} total={164} now={NOW} /> },
      ],
    },
    {
      label: 'Filter and order',
      states: [
        { id: 'filter-high', label: 'filter: high risk', render: () => <ReviewCenter items={queue} defaultFilter="high" now={NOW} /> },
        { id: 'filter-unsure', label: 'filter: unsure', render: () => <ReviewCenter items={queue} defaultFilter="unsure" now={NOW} /> },
        { id: 'filter-no-match', label: 'filter matches nothing', render: () => <ReviewCenter items={[tag, note, mail]} defaultFilter="high" now={NOW} /> },
        { id: 'order-oldest', label: 'order: oldest first', render: () => <ReviewCenter items={queue} order="oldest" now={NOW} /> },
        { id: 'order-given', label: 'order: as given', render: () => <ReviewCenter items={queue} order="given" now={NOW} /> },
      ],
    },
    {
      label: 'Waiting',
      states: [
        {
          id: 'sla-late',
          label: 'waiting: ok, amber, overdue',
          render: () => (
            <ReviewCenter
              sla={30 * 60_000}
              now={NOW}
              items={[
                { ...refund, id: 'late', title: 'Refund order #4821 for Maya Chen', createdAt: min(41) },
                { ...pr, id: 'amber', createdAt: min(25) },
                { ...tag, id: 'ok', createdAt: min(3) },
                { ...note, id: 'hours', title: 'Post release notes to #announcements', createdAt: min(135) },
              ]}
            />
          ),
        },
        { id: 'custom-sla', label: 'short SLA (10m)', render: () => <ReviewCenter items={queue} sla={10 * 60_000} now={NOW} /> },
        { id: 'low-confidence', label: 'lowConfidence 0.9', render: () => <ReviewCenter items={queue} lowConfidence={0.9} defaultFilter="unsure" now={NOW} /> },
      ],
    },
    {
      label: 'Item content',
      states: [
        { id: 'item-fields-body', label: 'fields + flagged body', render: () => <ReviewCenter items={[refund]} now={NOW} /> },
        { id: 'item-code', label: 'files with diff', render: () => <ReviewCenter items={[pr]} now={NOW} /> },
        {
          id: 'item-files-nodiff',
          label: 'files without diff',
          render: () => (
            <ReviewCenter
              now={NOW}
              items={[{ ...pr, id: 'f', files: [{ path: 'src/cart/discount.ts', added: 2, removed: 1 }, { path: 'src/cart/discount.test.ts', added: 18 }, { path: longPath, added: 64, removed: 9 }] }]}
            />
          ),
        },
        {
          id: 'item-code-body',
          label: 'body as code',
          render: () => <ReviewCenter now={NOW} items={[{ ...note, id: 'c', title: 'Apply discount cap patch', type: 'Code change', risk: 'medium', format: 'code', bodyLabel: 'Patch', body: diff }]} />,
        },
        { id: 'item-plan', label: 'plan with flagged step', render: () => <ReviewCenter items={[plan]} now={NOW} /> },
        { id: 'item-reasoning-only', label: 'reasoning only (Edit disabled)', render: () => <ReviewCenter items={[migration]} now={NOW} /> },
        {
          id: 'item-custom-icon',
          label: 'custom icons and links',
          render: () => (
            <ReviewCenter
              now={NOW}
              items={[
                { ...pr, id: 'i1', icon: <PullRequestIcon size={14} />, links: [{ label: 'northwind/billing#312', icon: <PullRequestIcon size={13} /> }, { label: 'ops@northwind.example', icon: <MailIcon size={13} /> }] },
                { ...mail, id: 'i2', icon: <MailIcon size={14} /> },
              ]}
            />
          ),
        },
        {
          id: 'item-long-text',
          label: 'long unbroken text',
          render: () => (
            <ReviewCenter
              now={NOW}
              items={[
                {
                  ...refund,
                  id: 'long',
                  title: 'Reconcile partially refunded invoices across the Northwind Labs EU and UK billing entities before month end close',
                  type: 'Reconciliation of cross-entity partial refunds',
                  agent: 'Finance reconciliation agent for Northwind Labs',
                  reasoning: `The worker at ${longPath} found 38 invoices whose rounding differs by more than one cent between ledgers, so a manual check is needed before posting.`,
                  fields: [
                    { label: 'Ledger path', value: `https://ledger.northwind.example/entities/eu-west/invoices/2026/10/reconciliation/INV-2026-10-004821-partial-refund-currency-rounding-adjustment` },
                    { label: 'Requested by', value: 'finance-operations-automation@northwind.example' },
                  ],
                  body: `Posting adjustment ${'NW-ADJ-2026-10-'.repeat(8)}0042 against ${longPath}`,
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      label: 'Width',
      states: [
        { id: 'width-narrow', label: 'narrow (360)', render: () => <div style={{ width: 360 }}><ReviewCenter items={queue} reviewed={24} total={32} now={NOW} /></div> },
        { id: 'width-medium', label: 'stacked (560)', render: () => <div style={{ width: 560 }}><ReviewCenter items={queue} reviewed={24} total={32} now={NOW} /></div> },
        { id: 'width-narrow-empty', label: 'narrow, empty', render: () => <div style={{ width: 360 }}><ReviewCenter items={[]} reviewed={12} now={NOW} /></div> },
      ],
    },
  ],
  missing: [
    'Editing (inline fields and textarea) and the reject reason picker only open after E or R / a press, and there is no default prop',
    'Undo last button and skipped row marker (need a decision or skip first)',
    'Open flag note (needs F or a press)',
    'New items arriving (highlight animation needs items to change after mount)',
    'Leaving/ghost row animation after a decision (transient)',
    'Custom reasons list (reasons prop only shows after R opens the reject picker)',
    'Controlled filter (filter prop) is the same render as defaultFilter',
  ],
};
export default mod;
