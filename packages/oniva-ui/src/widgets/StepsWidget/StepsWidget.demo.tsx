import type { DemoModule } from '../../internal/demo';
import { StepsWidget, type StepsWeek } from './StepsWidget';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const week = (label: string, steps: number[]): StepsWeek => ({
  label,
  data: days.map((day, i) => ({ day, steps: steps[i] ?? 0 })),
});
const weeks = [
  week('15 Jun – 21 Jun', [7240, 6810, 9120, 5330, 8460, 10240, 3980]),
  week('22 Jun – 28 Jun', [6120, 7450, 8040, 9010, 7730, 11820, 5210]),
  week('29 Jun – 5 Jul', [8420, 3180, 2650, 9870, 11240, 7620, 4890]),
];

const demo: DemoModule = {
  meta: {
    title: 'Steps widget',
    slug: 'steps-widget',
    category: 'Widgets',
    description: 'Weekly steps as rounded teal bars on a gray track with a date-range switcher.',
  },
  demos: [
    {
      name: 'Week switcher',
      code: `<StepsWidget weeks={weeks} />`,
      Component: () => (
        <div style={{ maxWidth: 420 }}>
          <StepsWidget weeks={weeks} />
        </div>
      ),
    },
    {
      name: 'Compact',
      code: `<StepsWidget weeks={weeks} defaultIndex={1} height={160} />`,
      Component: () => (
        <div style={{ maxWidth: 420 }}>
          <StepsWidget weeks={weeks} defaultIndex={1} height={160} />
        </div>
      ),
    },
  ],
};

export default demo;
