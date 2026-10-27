import type { DemoModule } from '../../internal/demo';
import { CoverFlow } from './CoverFlow';

const demo: DemoModule = {
  meta: {
    title: "Cover flow",
    slug: "cover-flow",
    category: 'Illustrations',
    description: "Browse covers in 3D. Drag, flick or scrub the row and it springs to the nearest cover. Keyboard, buttons and ticks work too.",
  },
  demos: [
    {
      name: "Default",
      code: `<CoverFlow />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <CoverFlow />
        </div>
      ),
    },
    {
      name: "Custom covers",
      code: `<CoverFlow
  aria-label="Recent projects"
  reflection={false}
  defaultIndex={0}
  items={[
    { id: 'a', title: 'Brand refresh', subtitle: 'Northwind Co.' },
    { id: 'b', title: 'Mobile app', subtitle: 'Harbor Pay' },
    { id: 'c', title: 'Design system', subtitle: 'Lumen Health' },
  ]}
  onSelect={(item) => console.log(item.title)}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <CoverFlow
            aria-label="Recent projects"
            reflection={false}
            defaultIndex={0}
            items={[
              { id: 'a', title: 'Brand refresh', subtitle: 'Northwind Co.' },
              { id: 'b', title: 'Mobile app', subtitle: 'Harbor Pay' },
              { id: 'c', title: 'Design system', subtitle: 'Lumen Health' },
            ]}
            onSelect={(item) => console.log(item.title)}
          />
        </div>
      ),
    },
  ],
};

export default demo;
