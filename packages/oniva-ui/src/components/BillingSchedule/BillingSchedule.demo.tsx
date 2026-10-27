import type { DemoModule } from '../../internal/demo';
import { BillingSchedule, type BillingCatalogItem, type BillingLine } from './BillingSchedule';

const catalog: BillingCatalogItem[] = [
  { id: 'setup', name: 'Set-up fee', repeat: 'once', price: 4999 },
  { id: 'impl', name: 'Implementation', repeat: 'once', price: 8500 },
  { id: 'seat', name: 'Platform seat', repeat: 'monthly', price: 49 },
  { id: 'support', name: 'Priority support', repeat: 'quarterly', price: 1200 },
  { id: 'audit', name: 'Annual security review', repeat: 'yearly', price: 3600 },
];

const lines: BillingLine[] = [
  { id: 'l1', name: 'Set-up fee', repeat: 'once', price: 4999, quantity: 1 },
];

const wrap = { width: '100%', maxWidth: 640 } as const;

const demo: DemoModule = {
  meta: {
    title: 'Billing schedule',
    slug: 'billing-schedule',
    category: 'Forms',
    description:
      'Build one billing phase: start date, duration, product lines that repeat, a discount, a minimum commitment and live totals.',
  },
  demos: [
    {
      name: 'Build-out phase',
      code: `<BillingSchedule
  phase="Build-out phase"
  catalog={catalog}
  defaultLines={lines}
  defaultStart="2026-01-01"
  defaultDurationMonths={6}
  onChange={(schedule, totals) => save(schedule, totals)}
/>`,
      Component: () => (
        <div style={wrap}>
          <BillingSchedule
            phase="Build-out phase"
            catalog={catalog}
            defaultLines={lines}
            defaultStart="2026-01-01"
            defaultDurationMonths={6}
          />
        </div>
      ),
    },
    {
      name: 'Empty, in euros',
      code: `<BillingSchedule currency="EUR" catalog={catalog} defaultDurationMonths={6} />`,
      Component: () => (
        <div style={wrap}>
          <BillingSchedule currency="EUR" catalog={catalog} defaultDurationMonths={6} defaultStart="2027-01-15" />
        </div>
      ),
    },
  ],
};

export default demo;
