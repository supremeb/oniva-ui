import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { UsageOverview, type UsageDay } from './UsageOverview';

const wrap = { maxWidth: 460, width: '100%' } as const;

const days = (n: number, upTo: number): UsageDay[] =>
  Array.from({ length: n }, (_, i) => ({
    label: `Oct ${i + 1}`,
    value: i < upTo ? 180 + ((i * 97) % 260) + (i % 5) * 30 : null,
  }));

const data = {
  month: {
    used: [
      { label: 'Chat', value: 3980 },
      { label: 'Search', value: 1640 },
      { label: 'Image', value: 1120 },
      { label: 'API', value: 680 },
    ],
    daily: days(30, 22),
  },
  week: {
    used: [
      { label: 'Chat', value: 1010 },
      { label: 'Search', value: 420 },
      { label: 'Image', value: 260 },
      { label: 'API', value: 190 },
    ],
    daily: days(7, 7),
  },
  last: {
    used: [
      { label: 'Chat', value: 4410 },
      { label: 'Search', value: 2080 },
      { label: 'Images', value: 1760 },
      { label: 'API', value: 1180 },
    ],
    daily: days(30, 30),
  },
} as const;

const limits = [
  { label: 'Seats', used: 8, total: 10 },
  { label: 'Storage', used: 3.2, total: 5, unit: 'GB' },
  { label: 'Projects', used: 12, total: null },
];

const demo: DemoModule = {
  meta: {
    title: 'Usage overview',
    slug: 'usage-overview',
    category: 'Widgets',
    description:
      'Plan usage and AI credits: a stacked meter by category, a daily sparkline, thin limits and a button that speaks up near the limit.',
  },
  demos: [
    {
      name: 'Credits with periods',
      code: `<UsageOverview
  title="Workspace credits"
  plan="Pro plan"
  total={10000}
  used={data[period].used}
  daily={data[period].daily}
  limits={[{ label: 'Seats', used: 8, total: 10 }, { label: 'Storage', used: 3.2, total: 5, unit: 'GB' }, { label: 'Projects', used: 12, total: null }]}
  periods={[{ id: 'month', label: 'This month' }, { id: 'last', label: 'Last month' }]}
  period={period}
  onPeriodChange={setPeriod}
  resetAt="2026-11-01"
/>`,
      Component: () => {
        const [period, setPeriod] = useState<'month' | 'last' | 'week'>('month');
        return (
          <div style={wrap}>
            <UsageOverview
              title="Workspace credits"
              plan="Pro plan"
              total={10000}
              used={[...data[period].used]}
              daily={[...data[period].daily]}
              limits={limits}
              periods={[
                { id: 'month', label: 'This month' },
                { id: 'last', label: 'Last month' },
                { id: 'week', label: '7 days' },
              ]}
              period={period}
              onPeriodChange={(id) => setPeriod(id as 'month' | 'last' | 'week')}
              resetAt="2026-11-01"
            />
          </div>
        );
      },
    },
    {
      name: 'Near the limit',
      code: `<UsageOverview total={7000} used={[…]} onUpgrade={(state) => openTopUp(state)} topUpLabel="Add credits" />`,
      Component: () => (
        <div style={wrap}>
          <UsageOverview
            title="Agent runs"
            total={7000}
            unit="runs"
            used={[
              { label: 'Scheduled', value: 3900 },
              { label: 'Manual', value: 1650 },
              { label: 'Webhooks', value: 1120 },
            ]}
            limits={[{ label: 'Concurrent agents', used: 5, total: 5 }]}
          />
        </div>
      ),
    },
  ],
};
export default demo;
