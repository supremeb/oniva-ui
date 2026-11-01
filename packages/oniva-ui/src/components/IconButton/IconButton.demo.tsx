import { BellIcon, DownloadIcon, MoreIcon, PlusIcon, TrashIcon } from '../../icons/IconSet';
import type { DemoModule } from '../../internal/demo';
import { IconButton } from './IconButton';

const row = { display: 'flex', gap: 12, alignItems: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Icon button',
    slug: 'icon-button',
    category: 'Actions',
    description: 'Square, icon-only button sharing Button\u2019s variants and sizes.',
  },
  demos: [
    {
      name: 'Variants',
      code: `<IconButton aria-label="Add" variant="primary"><PlusIcon size={16} /></IconButton>
<IconButton aria-label="Download invoice"><DownloadIcon size={16} /></IconButton>
<IconButton aria-label="Notifications" variant="soft"><BellIcon size={16} /></IconButton>
<IconButton aria-label="More" variant="ghost"><MoreIcon size={16} /></IconButton>
<IconButton aria-label="Delete" variant="danger"><TrashIcon size={16} /></IconButton>`,
      Component: () => (
        <div style={row}>
          <IconButton aria-label="Add" variant="primary">
            <PlusIcon size={16} />
          </IconButton>
          <IconButton aria-label="Download invoice">
            <DownloadIcon size={16} />
          </IconButton>
          <IconButton aria-label="Notifications" variant="soft">
            <BellIcon size={16} />
          </IconButton>
          <IconButton aria-label="More" variant="ghost">
            <MoreIcon size={16} />
          </IconButton>
          <IconButton aria-label="Delete" variant="danger">
            <TrashIcon size={16} />
          </IconButton>
        </div>
      ),
    },
    {
      name: 'Sizes',
      code: `<IconButton aria-label="Add" size="xs"><PlusIcon size={12} /></IconButton>
<IconButton aria-label="Add" size="sm"><PlusIcon size={16} /></IconButton>
<IconButton aria-label="Add" size="md"><PlusIcon size={16} /></IconButton>
<IconButton aria-label="Add" size="lg"><PlusIcon size={18} /></IconButton>`,
      Component: () => (
        <div style={row}>
          <IconButton aria-label="Add" size="xs">
            <PlusIcon size={12} />
          </IconButton>
          <IconButton aria-label="Add" size="sm">
            <PlusIcon size={16} />
          </IconButton>
          <IconButton aria-label="Add" size="md">
            <PlusIcon size={16} />
          </IconButton>
          <IconButton aria-label="Add" size="lg">
            <PlusIcon size={18} />
          </IconButton>
        </div>
      ),
    },
  ],
};
export default demo;
