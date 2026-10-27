import type { DemoModule } from '../../internal/demo';
import { WorldMap } from './WorldMap';

const demo: DemoModule = {
  meta: {
    title: "World map",
    slug: "world-map",
    category: 'Illustrations',
    description: "World map with one highlighted continent and a pastel band along its coastline. Switch between the six continents. Shapes: Natural Earth, public domain.",
  },
  demos: [
    {
      name: "Default",
      code: `<WorldMap />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <WorldMap />
        </div>
      ),
    },
    {
      name: "Controlled, no menu",
      code: `<WorldMap continent="africa" showSwitcher={false} />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <WorldMap continent="africa" showSwitcher={false} />
        </div>
      ),
    },
  ],
};

export default demo;
