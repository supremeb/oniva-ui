import { Bell, Download, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
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
      code: `<IconButton aria-label="Add" variant="primary"><Plus size={16} /></IconButton>
<IconButton aria-label="Download invoice"><Download size={16} /></IconButton>
<IconButton aria-label="Notifications" variant="soft"><Bell size={16} /></IconButton>
<IconButton aria-label="More" variant="ghost"><MoreHorizontal size={16} /></IconButton>
<IconButton aria-label="Delete" variant="danger"><Trash2 size={16} /></IconButton>`,
      Component: () => (
        <div style={row}>
          <IconButton aria-label="Add" variant="primary">
            <Plus size={16} />
          </IconButton>
          <IconButton aria-label="Download invoice">
            <Download size={16} />
          </IconButton>
          <IconButton aria-label="Notifications" variant="soft">
            <Bell size={16} />
          </IconButton>
          <IconButton aria-label="More" variant="ghost">
            <MoreHorizontal size={16} />
          </IconButton>
          <IconButton aria-label="Delete" variant="danger">
            <Trash2 size={16} />
          </IconButton>
        </div>
      ),
    },
    {
      name: 'Sizes',
      code: `<IconButton aria-label="Add" size="xs"><Plus size={12} /></IconButton>
<IconButton aria-label="Add" size="sm"><Plus size={16} /></IconButton>
<IconButton aria-label="Add" size="md"><Plus size={16} /></IconButton>
<IconButton aria-label="Add" size="lg"><Plus size={18} /></IconButton>`,
      Component: () => (
        <div style={row}>
          <IconButton aria-label="Add" size="xs">
            <Plus size={12} />
          </IconButton>
          <IconButton aria-label="Add" size="sm">
            <Plus size={16} />
          </IconButton>
          <IconButton aria-label="Add" size="md">
            <Plus size={16} />
          </IconButton>
          <IconButton aria-label="Add" size="lg">
            <Plus size={18} />
          </IconButton>
        </div>
      ),
    },
  ],
};
export default demo;
