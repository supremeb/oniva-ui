import type { DemoModule } from '../../internal/demo';
import { ActivityWidget } from './ActivityWidget';

const demo: DemoModule = {
  meta: {
    title: 'Activity widget',
    slug: 'activity-widget',
    category: 'Widgets',
    description:
      'Move / Exercise / Running summary with concentric progress rings and a tile per metric.',
  },
  demos: [
    {
      name: 'Daily goals',
      code: `<ActivityWidget
  move={{ value: 486, goal: 600 }}
  exercise={{ value: 32, goal: 45 }}
  running={{ value: 5.2, goal: 8 }}
/>`,
      Component: () => (
        <div style={{ maxWidth: 380 }}>
          <ActivityWidget
            move={{ value: 486, goal: 600 }}
            exercise={{ value: 32, goal: 45 }}
            running={{ value: 5.2, goal: 8 }}
          />
        </div>
      ),
    },
    {
      name: 'Goals closed',
      code: `<ActivityWidget title="Yesterday" move={{ value: 640, goal: 600 }} exercise={{ value: 52, goal: 45 }} running={{ value: 8.4, goal: 8 }} ringSize={120} />`,
      Component: () => (
        <div style={{ maxWidth: 380 }}>
          <ActivityWidget
            title="Yesterday"
            move={{ value: 640, goal: 600 }}
            exercise={{ value: 52, goal: 45 }}
            running={{ value: 8.4, goal: 8 }}
            ringSize={120}
          />
        </div>
      ),
    },
  ],
};

export default demo;
