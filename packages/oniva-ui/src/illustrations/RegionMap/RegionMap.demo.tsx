import type { DemoModule } from '../../internal/demo';
import { RegionMap } from './RegionMap';

const demo: DemoModule = {
  meta: {
    title: "Region map",
    slug: "dach-region",
    category: 'Illustrations',
    description: "Map illustration of Germany, Austria and Switzerland (or the United States). A pastel band travels along the outer border and the maps cross-fade when you switch region. Shapes: Natural Earth, public domain.",
  },
  demos: [
    {
      name: "DACH region",
      code: `<RegionMap />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <RegionMap />
        </div>
      ),
    },
    {
      name: "Controlled, no menu",
      code: `<RegionMap region="us" showSwitcher={false} />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <RegionMap region="us" showSwitcher={false} />
        </div>
      ),
    },
  ],
};

export default demo;
