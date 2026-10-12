import type { DemoModule } from '../../internal/demo';
import { ChartLegend } from '../ChartLegend';
import { ChartCard } from '../ChartCard';
import { ActivityRings } from './ActivityRings';

const rings = [
  { label: 'Move', value: 540, goal: 600, unit: 'kcal', tone: 3 },
  { label: 'Exercise', value: 34, goal: 30, unit: 'min', tone: 2 },
  { label: 'Stand', value: 9, goal: 12, unit: 'h', tone: 4 },
];

const demo: DemoModule = {
  meta: {
    title: 'Activity rings',
    slug: 'activity-rings',
    category: 'Charts',
    description:
      'Concentric goal rings (Move / Exercise / Stand) with round caps and per-ring tooltips.',
  },
  demos: [
    {
      name: 'Daily activity',
      code: `<ActivityRings rings={[{ label: 'Move', value: 540, goal: 600, unit: 'kcal' }, { label: 'Exercise', value: 34, goal: 30, unit: 'min' }, { label: 'Stand', value: 9, goal: 12, unit: 'h' }]} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 360 }}>
          <ChartCard
            title="Activity"
            value="90%"
            unit="of daily goals"
            legend={
              <ChartLegend
                shape="round"
                items={[
                  { label: 'Move', tone: 3, value: '540/600 kcal' },
                  { label: 'Exercise', tone: 2, value: '34/30 min' },
                  { label: 'Stand', tone: 4, value: '9/12 h' },
                ]}
              />
            }
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
              <ActivityRings rings={rings} size={140} thickness={14} />
            </div>
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Mini rings',
      code: `<ActivityRings size={40} thickness={5} rings={…} />`,
      Component: () => (
        <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
          {[1, 0.7, 0.35, 0.1].map((f, i) => (
            <ActivityRings
              key={i}
              size={40}
              thickness={5}
              rings={rings.map((r) => ({ ...r, value: r.goal * f }))}
              label={`Day ${i + 1} activity`}
            />
          ))}
        </div>
      ),
    },
  ],
};
export default demo;
