import { Badge } from '../../components/Badge';
import type { DemoModule } from '../../internal/demo';
import { Sparkline } from './Sparkline';

const kpis = [
  {
    name: 'MRR',
    value: '$88.4K',
    delta: '+10.8%',
    good: true,
    tone: 7,
    data: [42, 46, 52, 50, 57, 63, 61, 69, 74, 71, 80, 88],
  },
  {
    name: 'Active seats',
    value: '2,481',
    delta: '+4.1%',
    good: true,
    tone: 6,
    data: [18, 20, 19, 22, 24, 23, 26, 27, 26, 29, 30, 31],
  },
  {
    name: 'Churn',
    value: '2.3%',
    delta: '+0.4%',
    good: false,
    tone: 3,
    data: [1.8, 1.9, 1.7, 1.8, 2.0, 2.1, 1.9, 2.0, 2.2, 2.1, 2.2, 2.3],
  },
];
const row = {
  alignItems: 'center',
  borderBottom: '1px solid rgba(128,128,128,0.2)',
  display: 'flex',
  fontFamily: 'Inter, system-ui, sans-serif',
  gap: 16,
  justifyContent: 'space-between',
  padding: '10px 0',
} as const;

const demo: DemoModule = {
  meta: {
    title: 'Sparkline',
    slug: 'sparkline',
    category: 'Charts',
    description: 'Tiny inline trend chart in line, area or bar form for KPI rows and tables.',
  },
  demos: [
    {
      name: 'KPI rows',
      code: `<Sparkline data={[42, 46, 52, 50, 57, 63]} tone={7} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          {kpis.map((k) => (
            <div key={k.name} style={row}>
              <div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>{k.name}</div>
                <div style={{ fontSize: 20, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                  {k.value}
                </div>
              </div>
              <Sparkline data={k.data} tone={k.tone} label={`${k.name} trend`} />
              <Badge size="sm" variant={k.good ? 'success' : 'danger'}>
                {k.delta}
              </Badge>
            </div>
          ))}
        </div>
      ),
    },
    {
      name: 'Variants',
      code: `<Sparkline variant="line" data={data} />
<Sparkline variant="area" data={data} />
<Sparkline variant="bar" data={data} />`,
      Component: () => (
        <div style={{ alignItems: 'center', display: 'flex', gap: 32 }}>
          <Sparkline variant="line" data={kpis[0]!.data} tone={6} />
          <Sparkline variant="area" data={kpis[0]!.data} tone={1} />
          <Sparkline variant="bar" data={kpis[0]!.data} tone={5} />
        </div>
      ),
    },
  ],
};
export default demo;
