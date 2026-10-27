import type { DemoModule } from '../../internal/demo';
import { ModelWheel } from './ModelWheel';

const demo: DemoModule = {
  meta: {
    title: "Model wheel",
    slug: "model-wheel",
    category: 'Illustrations',
    description: "AI model names on a turning drum. Rows tilt away at the edges and each model lands on a soft fill. Drag, flick or use the arrow keys. Fictional model names.",
  },
  demos: [
    {
      name: "Default",
      code: `<ModelWheel />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <ModelWheel />
        </div>
      ),
    },
    {
      name: "Slower, custom models",
      code: `<ModelWheel
  hold={2600}
  models={[
    { name: 'Atlas 3' }, { name: 'Atlas 3 Mini' }, { name: 'Nova Studio' }, { name: 'Lumen Instant' },
    { name: 'Quill Deep' }, { name: 'Orion Sight' }, { name: 'Cobalt 4' },
  ]}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <ModelWheel
            hold={2600}
            models={[
              { name: 'Atlas 3' }, { name: 'Atlas 3 Mini' }, { name: 'Nova Studio' }, { name: 'Lumen Instant' },
              { name: 'Quill Deep' }, { name: 'Orion Sight' }, { name: 'Cobalt 4' },
            ]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
