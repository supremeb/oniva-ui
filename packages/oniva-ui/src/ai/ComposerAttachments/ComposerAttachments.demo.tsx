import type { DemoModule } from '../../internal/demo';
import { ComposerAttachments } from './ComposerAttachments';

const demo: DemoModule = {
  meta: {
    title: 'Composer Attachments',
    slug: 'composer-attachments',
    category: 'AI & Agent',
    description: 'File tiles shown above a composer, with circular upload progress and remove buttons.',
  },
  demos: [
    {
      name: 'Uploads',
      code: `<ComposerAttachments onRemove={remove} files={[
  { id: 'a', name: 'q3_revenue.csv', size: 48200 },
  { id: 'b', name: 'board-deck.pdf', size: 2400000, status: 'uploading', progress: 62 },
]} />`,
      Component: () => (
        <ComposerAttachments
          onRemove={() => {}}
          files={[
            { id: 'a', name: 'q3_revenue.csv', size: 48_200, type: 'text/csv' },
            { id: 'b', name: 'board-deck.pdf', size: 2_400_000, status: 'uploading', progress: 62 },
            { id: 'c', name: 'pipeline.png', size: 310_000, type: 'image/png', status: 'uploading', progress: 18 },
            { id: 'd', name: 'archive.zip', status: 'error' },
          ]}
        />
      ),
    },
  ],
};

export default demo;
