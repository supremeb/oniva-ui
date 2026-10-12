import type { DemoModule } from '../../internal/demo';
import { SleepScoreWidget, type SleepNight } from './SleepScoreWidget';

const nights: SleepNight[] = [
  {
    label: 'Sun, 4 Jul',
    score: 71,
    factors: [
      { label: 'Duration', detail: '6h 05m', score: 34, max: 50 },
      { label: 'Bedtime', detail: '1h 10m later', score: 17, max: 30 },
      { label: 'Interruptions', detail: '3 wake-ups', score: 12, max: 20 },
    ],
  },
  {
    label: 'Mon, 5 Jul',
    score: 98,
    factors: [
      { label: 'Duration', detail: '7h 50m', score: 49, max: 50 },
      { label: 'Bedtime', detail: '20m earlier', score: 29, max: 30 },
      { label: 'Interruptions', detail: '5m wake up', score: 20, max: 20 },
    ],
  },
];

const demo: DemoModule = {
  meta: {
    title: 'Sleep score widget',
    slug: 'sleep-score-widget',
    category: 'Widgets',
    description:
      'Sleep score ring with verdict and a colored-dot breakdown (duration, bedtime, interruptions).',
  },
  demos: [
    {
      name: 'Nightly breakdown',
      code: `<SleepScoreWidget nights={nights} />`,
      Component: () => (
        <div style={{ maxWidth: 400 }}>
          <SleepScoreWidget nights={nights} />
        </div>
      ),
    },
    {
      name: 'Rougher night',
      code: `<SleepScoreWidget nights={nights} defaultIndex={0} />`,
      Component: () => (
        <div style={{ maxWidth: 400 }}>
          <SleepScoreWidget nights={nights} defaultIndex={0} />
        </div>
      ),
    },
  ],
};

export default demo;
