import type { DemoModule } from '../../internal/demo';
import { SideFolder } from './SideFolder';

const demo: DemoModule = {
  meta: {
    title: "Side folder illustration",
    slug: "side-folder",
    category: 'Illustrations',
    description: "A glassy folder on its side. Hover to swing the frosted pocket forward and slide the documents out.",
  },
  demos: [
    {
      name: "Default",
      code: `<SideFolder />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <SideFolder />
        </div>
      ),
    },
    {
      name: "Small",
      code: `<SideFolder />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <SideFolder />
        </div>
      ),
    },
  ],
};

export default demo;
