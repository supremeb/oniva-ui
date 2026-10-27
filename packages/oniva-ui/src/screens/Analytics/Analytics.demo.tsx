import type { DemoModule } from '../../internal/demo';
import { AnalyticsScreen } from './Analytics';

const frame = {
  border: '1px solid var(--oniva-color-border)',
  borderRadius: 16,
  height: 720,
  overflow: 'hidden',
  position: 'relative',
  transform: 'translateZ(0)',
  width: '100%',
} as const;

const demo: DemoModule = {
  meta: {
    title: 'Analytics screen',
    slug: 'analytics-screen',
    category: 'Screens',
    description: 'Revenue dashboard: key figures, revenue by channel, breakdown, top products and weekly trends. Panels reflow by container width.',
  },
  demos: [
    {
      name: 'Default',
      code: `<AnalyticsScreen />`,
      Component: () => (
        <div style={frame}>
          <AnalyticsScreen headingLevel={2} />
        </div>
      ),
    },
    {
      name: 'Custom workspace',
      code: `<AnalyticsScreen
  workspace="Fieldstone Co"
  user={{ name: 'Sam Okafor' }}
  onRefresh={() => console.log('refresh')}
  onNavigate={(label) => console.log(label)}
/>`,
      Component: () => (
        <div style={frame}>
          <AnalyticsScreen
            headingLevel={2}
            workspace="Fieldstone Co"
            user={{ name: 'Sam Okafor' }}
            onRefresh={() => console.log('refresh')}
            onNavigate={(label) => console.log(label)}
          />
        </div>
      ),
    },
  ],
};

export default demo;
