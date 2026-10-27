import { useMemo } from 'react';
import type { DemoModule } from '../../internal/demo';
import { ReviewCenter, type ReviewItem } from './ReviewCenter';

const diff = `@@ -8,6 +8,8 @@ export function applyDiscount(cart: Cart) {
   const subtotal = sum(cart.lines);
-  return subtotal * (1 - cart.discount);
+  const capped = Math.min(cart.discount, MAX_DISCOUNT);
+  return round(subtotal * (1 - capped));
 }`;

function useItems(): ReviewItem[] {
  return useMemo(() => {
    const t = Date.now();
    return [
      {
        id: 'refund-4821', title: 'Refund order #4821 for Maya Chen', agent: 'Support agent', model: 'Atlas 2', type: 'Refund', risk: 'high', confidence: 0.62, createdAt: t - 26 * 60_000,
        reasoning: 'Her blender arrived cracked. Damaged items are covered within 30 days of delivery.',
        fields: [
          { label: 'Amount', value: [{ text: '$184.00', note: 'Includes $20 express shipping, which the policy does not refund.', source: 'Refund policy, section 4' }] },
          { label: 'Order', value: '#4821, delivered Oct 14' },
        ],
        bodyLabel: 'Reply to Maya',
        body: ['Hi Maya, I am sorry your blender arrived cracked. I have refunded ', { text: 'the full $184.00', note: 'Shipping is normally excluded.' }, ' to your original card. It should show up in 3 to 5 business days.'],
      },
      {
        id: 'pr-312', title: 'Cap discounts at 40%', agent: 'Coder', model: 'Nova Pro', type: 'Code change', risk: 'medium', confidence: 0.81, createdAt: t - 12 * 60_000,
        reasoning: 'Carts could drop below cost when stacked promos pushed discount past 100%.',
        files: [{ path: 'src/cart/discount.ts', added: 2, removed: 1, diff }],
        links: [{ label: 'PR #312' }, { label: 'CI run 1204' }],
      },
      {
        id: 'plan-77', title: 'Archive 214 inactive workspaces', agent: 'Ops agent', model: 'Lumen Fast', type: 'Plan', risk: 'high', confidence: 0.55, createdAt: t - 4 * 60_000,
        steps: [
          { title: 'Export workspace metadata', tool: 'warehouse.export' },
          { title: 'Notify owners 7 days before', tool: 'mail.send', detail: '214 emails' },
          { title: 'Archive workspaces with no activity in 12 months', tool: 'admin.archive', flagged: true, detail: 'Some have an active billing plan' },
        ],
      },
      { id: 'mig-3', title: 'Split customers.name into two fields', agent: 'Coder', model: 'Nova Pro', type: 'Migration', risk: 'medium', confidence: 0.74, createdAt: t - 14 * 60_000, reasoning: 'The profile form needs first and last name separately.' },
      { id: 'key-8', title: 'Rotate the payments API keys', agent: 'Ops agent', model: 'Lumen Fast', type: 'Plan', risk: 'high', confidence: 0.66, createdAt: t - 11 * 60_000, reasoning: 'Keys are 90 days old and the policy rotates at 90.' },
      { id: 'tag-14', title: 'Tag 14 tickets as Billing', agent: 'Support agent', model: 'Atlas 2', type: 'Triage', risk: 'low', confidence: 0.88, createdAt: t - 6 * 60_000, reasoning: 'All 14 mention an invoice or a charge.' },
      { id: 'note-5', title: 'Post release notes to #announcements', agent: 'Coder', model: 'Nova Pro', type: 'Chat message', risk: 'low', confidence: 0.91, createdAt: t - 2 * 60_000, body: 'Version 4.2 is out: faster imports, a new export menu and two fixes.' },
      { id: 'mail-9', title: 'Reply to Sam about onboarding', agent: 'Support agent', type: 'Email', risk: 'low', confidence: 0.93, createdAt: t - 90_000, body: 'Hi Sam, thanks for your patience. Your workspace is ready and the invite is on its way.' },
    ];
  }, []);
}

const demo: DemoModule = {
  meta: {
    title: 'Review center',
    slug: 'review-center',
    category: 'AI & Agent',
    description: 'A focused workspace for what agents want to do: a risk-sorted queue, one item at a time with uncertain spans marked, and single-key Approve, Edit, Reject and Skip.',
  },
  demos: [
    {
      name: 'Review queue',
      code: `<ReviewCenter
  items={items}
  reviewed={24}
  onDecide={(item, result) => save(item.id, result)}
  onUndo={(item) => revert(item.id)}
/>`,
      Component: function Queue() {
        const items = useItems();
        return <ReviewCenter items={items} reviewed={24} total={32} />;
      },
    },
    {
      name: 'Oldest first, unsure only',
      code: `<ReviewCenter items={items} order="oldest" defaultFilter="unsure" />`,
      Component: function Unsure() {
        const items = useItems();
        return <ReviewCenter items={items} order="oldest" defaultFilter="unsure" />;
      },
    },
  ],
};

export default demo;
