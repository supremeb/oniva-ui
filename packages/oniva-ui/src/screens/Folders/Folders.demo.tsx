import type { DemoModule } from '../../internal/demo';
import { ScreenFrame } from '../../internal/s1-frame';
import { Folders } from './Folders';

const demo: DemoModule = {
  meta: {
    title: 'Folders',
    slug: 'folders',
    category: 'Screens',
    description:
      'Folder overview with tabs, search, sort, grid/list toggle and a filterable list of file templates, inside the app shell.',
  },
  demos: [
    {
      name: 'Inset',
      code: `<Folders
  workspace="Northwind Labs"
  user={{ name: 'Alex Morgan' }}
  onOpenFolder={(name) => router.push(\`/folders/\${name}\`)}
/>`,
      Component: () => (
        <ScreenFrame>
          <Folders headingLevel={2} />
        </ScreenFrame>
      ),
    },
    {
      name: 'Flat',
      code: `<Folders layout="flat" />`,
      Component: () => (
        <ScreenFrame>
          <Folders layout="flat" headingLevel={2} />
        </ScreenFrame>
      ),
    },
  ],
};
export default demo;
