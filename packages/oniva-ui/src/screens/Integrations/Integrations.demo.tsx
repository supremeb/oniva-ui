import type { DemoModule } from '../../internal/demo';
import { IntegrationsScreen } from './Integrations';

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
    title: 'Integrations screen',
    slug: 'integrations-screen',
    category: 'Screens',
    description:
      'App directory with a sticky search and category tabs over a grid of apps with connect states. Fills its container and collapses the sidebar into a drawer on narrow screens.',
  },
  demos: [
    {
      name: 'Default',
      code: `<IntegrationsScreen />`,
      Component: () => (
        <div style={frame}>
          <IntegrationsScreen headingLevel={2} />
        </div>
      ),
    },
    {
      name: 'Custom workspace',
      code: `<IntegrationsScreen
  workspace="Fieldstone Co"
  user={{ name: 'Sam Okafor' }}
  onConnectionChange={(id, on) => console.log(id, on)}
  onNavigate={(label) => console.log(label)}
/>`,
      Component: () => (
        <div style={frame}>
          <IntegrationsScreen
            headingLevel={2}
            workspace="Fieldstone Co"
            user={{ name: 'Sam Okafor' }}
            onConnectionChange={(id, on) => console.log(id, on)}
            onNavigate={(label) => console.log(label)}
          />
        </div>
      ),
    },
  ],
};

export default demo;
