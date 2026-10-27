import type { DemoModule } from '../../internal/demo';
import { LayerStack } from './LayerStack';

const demo: DemoModule = {
  meta: {
    title: "Layer stack",
    slug: "layer-stack",
    category: 'Illustrations',
    description: "Isometric stack of layers beside a list. The chosen entry lifts its layer out in colour. Plays on its own until you pick one.",
  },
  demos: [
    {
      name: "Default",
      code: `<LayerStack />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <LayerStack />
        </div>
      ),
    },
    {
      name: "Custom entries",
      code: `<LayerStack
  interval={0}
  defaultIndex={1}
  items={[
    { title: 'Presentation', hint: 'Components and themes' },
    { title: 'Logic', hint: 'State and rules' },
    { title: 'Data', hint: 'Queries and caching' },
  ]}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <LayerStack
            interval={0}
            defaultIndex={1}
            items={[
              { title: 'Presentation', hint: 'Components and themes' },
              { title: 'Logic', hint: 'State and rules' },
              { title: 'Data', hint: 'Queries and caching' },
            ]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
