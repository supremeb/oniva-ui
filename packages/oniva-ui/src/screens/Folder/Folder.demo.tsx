import type { DemoModule } from '../../internal/demo';
import { ScreenFrame } from '../../internal/s1-frame';
import { Folder } from './Folder';

const demo: DemoModule = {
  meta: {
    title: 'Folder',
    slug: 'folder',
    category: 'Screens',
    description: 'Inside one folder: breadcrumbs, file cards with previews, and an empty state.',
  },
  demos: [
    {
      name: 'With files',
      code: `<Folder folder="Q3 Campaign" onOpenFile={(id) => openFile(id)} onNavigate={(label) => router.push(routes[label])} />`,
      Component: () => (
        <ScreenFrame>
          <Folder folder="Q3 Campaign" headingLevel={2} />
        </ScreenFrame>
      ),
    },
    {
      name: 'Empty, flat',
      code: `<Folder layout="flat" folder="Hiring" />`,
      Component: () => (
        <ScreenFrame>
          <Folder layout="flat" folder="Hiring" headingLevel={2} />
        </ScreenFrame>
      ),
    },
  ],
};
export default demo;
