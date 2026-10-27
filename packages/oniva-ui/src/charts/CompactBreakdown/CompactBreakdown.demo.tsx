import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { CompactBreakdown, type BreakdownItem } from './CompactBreakdown';

const usd = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const;

const data: Record<string, { items: BreakdownItem[]; delta: number }> = {
  '7d': {
    delta: 4.2,
    items: [
      { id: 'direct', label: 'Direct', value: 4200 },
      { id: 'search', label: 'Organic search', value: 5900 },
      { id: 'partners', label: 'Partners', value: 2100 },
      { id: 'email', label: 'Email', value: 1300 },
      { id: 'social', label: 'Social', value: 1800 },
    ],
  },
  '30d': {
    delta: 12.4,
    items: [
      { id: 'direct', label: 'Direct', value: 16900 },
      { id: 'search', label: 'Organic search', value: 24300 },
      { id: 'partners', label: 'Partners', value: 8100 },
      { id: 'email', label: 'Email', value: 6800 },
      { id: 'social', label: 'Social', value: 9800 },
    ],
  },
  '90d': {
    delta: -3,
    items: [
      { id: 'direct', label: 'Direct', value: 51200 },
      { id: 'search', label: 'Organic search', value: 47900 },
      { id: 'partners', label: 'Partners', value: 30400 },
      { id: 'email', label: 'Email', value: 19500 },
      { id: 'social', label: 'Social', value: 22400 },
    ],
  },
};

const periods = [
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
];

const wrap = { maxWidth: 360, width: '100%' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Compact breakdown',
    slug: 'compact-breakdown',
    category: 'Charts',
    description:
      'A total split into its parts in one small card. Numbers roll, the bar glides and the ranked rows trade places when the period changes.',
  },
  demos: [
    {
      name: 'Revenue by channel',
      code: `<CompactBreakdown
  title="Revenue by channel"
  totalLabel="Total revenue"
  periods={[{ id: '7d', label: '7d' }, { id: '30d', label: '30d' }, { id: '90d', label: '90d' }]}
  period={period}
  onPeriodChange={setPeriod}
  items={data[period].items}
  delta={data[period].delta}
  format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
/>`,
      Component: () => {
        const [period, setPeriod] = useState('30d');
        const d = data[period]!;
        return (
          <div style={wrap}>
            <CompactBreakdown
              title="Revenue by channel"
              totalLabel="Total revenue"
              periods={periods}
              period={period}
              onPeriodChange={setPeriod}
              items={d.items}
              delta={d.delta}
              format={usd}
            />
          </div>
        );
      },
    },
    {
      name: 'Without a period switch',
      code: `<CompactBreakdown title="Tokens by model" totalLabel="Tokens this week" format={{ notation: 'compact' }} items={[…]} footer="Resets Monday" />`,
      Component: () => (
        <div style={wrap}>
          <CompactBreakdown
            title="Tokens by model"
            totalLabel="Tokens this week"
            format={{ notation: 'compact', maximumFractionDigits: 1 }}
            footer="Resets Monday"
            items={[
              { id: 'atlas', label: 'Atlas 2', value: 4_820_000 },
              { id: 'mini', label: 'Atlas 2 Mini', value: 2_150_000 },
              { id: 'nova', label: 'Nova Pro', value: 1_240_000 },
            ]}
          />
        </div>
      ),
    },
  ],
};
export default demo;
