import type { DemoModule } from '../../internal/demo';
import { GlassFolder } from './GlassFolder';

const demo: DemoModule = {
  meta: {
    title: "Glass folder illustration",
    slug: "glass-folder",
    category: 'Illustrations',
    description: "A glassy blue folder holding documents behind a frosted pocket that tips open on hover.",
  },
  demos: [
    {
      name: "Default",
      code: `<GlassFolder />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <GlassFolder />
        </div>
      ),
    },
    {
      name: "Small",
      code: `<GlassFolder />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <GlassFolder />
        </div>
      ),
    },
  ],
};

export default demo;
