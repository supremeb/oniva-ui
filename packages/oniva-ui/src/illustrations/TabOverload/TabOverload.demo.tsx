import type { DemoModule } from '../../internal/demo';
import { TabOverload } from './TabOverload';

const demo: DemoModule = {
  meta: {
    title: "Tab overload illustration",
    slug: "tab-overload",
    category: 'Illustrations',
    description: "Three overlapping browser windows. The highlight follows the hovered window and returns to the front one.",
  },
  demos: [
    {
      name: "Default",
      code: `<TabOverload />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <TabOverload />
        </div>
      ),
    },
    {
      name: "Decorative",
      code: `<TabOverload isDecorative />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <TabOverload isDecorative />
        </div>
      ),
    },
  ],
};

export default demo;
