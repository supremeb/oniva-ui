import { ArrowRight, Copy, Plus, Settings, Trash2, Upload } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Button } from './Button';

const row = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;

const label = { color: 'var(--oniva-color-text-muted)', fontSize: 13 } as const;
const group = { display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Button',
    slug: 'button',
    category: 'Actions',
    description:
      'Triggers an action. Built on React Aria Button with gradient primary, outline, ghost, soft and danger variants.',
  },
  demos: [
    {
      name: 'Styles, sizes and states',
      code: `<Button>Save changes</Button> <Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button> <Button variant="danger" startIcon={<Trash2 size={16} />}>Delete</Button>
<Button variant="secondary" size="sm" startIcon={<Plus size={16} />}>Add item</Button>
<Button endIcon={<ArrowRight size={16} />}>Continue</Button>
<Button variant="secondary" startIcon={<Copy size={16} />}>Copy link</Button>
<Button isDisabled>Disabled</Button>`,
      Component: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
          <div style={group}>
            <span style={label}>Styles</span>
            <div style={{ ...row, justifyContent: 'center' }}>
              <Button>Save changes</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger" startIcon={<Trash2 size={16} />}>
                Delete
              </Button>
            </div>
          </div>
          <div style={group}>
            <span style={label}>Icons and sizes</span>
            <div style={{ ...row, justifyContent: 'center' }}>
              <Button variant="secondary" size="sm" startIcon={<Plus size={16} />}>
                Add item
              </Button>
              <Button endIcon={<ArrowRight size={16} />}>Continue</Button>
              <Button isIconOnly variant="ghost" aria-label="More">
                <Settings size={16} />
              </Button>
              <Button variant="secondary" size="lg">
                Large
              </Button>
            </div>
          </div>
          <div style={group}>
            <span style={label}>Feedback and states</span>
            <div style={{ ...row, justifyContent: 'center' }}>
              <Button variant="secondary" startIcon={<Copy size={16} />}>
                Copy link
              </Button>
              <Button isIconOnly variant="secondary" aria-label="Copy">
                <Copy size={16} />
              </Button>
              <Button variant="secondary" startIcon={<Upload size={16} />}>
                Upload file
              </Button>
              <Button isDisabled>Disabled</Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: 'Shimmer loading',
      code: `<Button isLoading loadingStyle="shimmer">Saving changes</Button>
<Button variant="secondary" isLoading loadingStyle="shimmer">Syncing</Button>`,
      Component: () => (
        <div style={row}>
          <Button isLoading loadingStyle="shimmer">
            Saving changes
          </Button>
          <Button variant="secondary" isLoading loadingStyle="shimmer">
            Syncing
          </Button>
        </div>
      ),
    },
    {
      name: 'Variants',
      code: `<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="soft">Soft</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>`,
      Component: () => (
        <div style={row}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Delete</Button>
        </div>
      ),
    },
    {
      name: 'Sizes',
      code: `<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
      Component: () => (
        <div style={row}>
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      ),
    },
    {
      name: 'With icons',
      code: `<Button startIcon={<Plus size={16} />}>New project</Button>
<Button variant="secondary" endIcon={<ArrowRight size={16} />}>Continue</Button>
<Button isIconOnly variant="secondary" aria-label="Settings"><Settings size={16} /></Button>`,
      Component: () => (
        <div style={row}>
          <Button startIcon={<Plus size={16} />}>New project</Button>
          <Button variant="secondary" endIcon={<ArrowRight size={16} />}>
            Continue
          </Button>
          <Button isIconOnly variant="secondary" aria-label="Settings">
            <Settings size={16} />
          </Button>
          <Button isIconOnly variant="ghost" aria-label="Add">
            <Plus size={16} />
          </Button>
        </div>
      ),
    },
    {
      name: 'Loading and disabled',
      code: `<Button isLoading>Saving</Button>
<Button isDisabled>Disabled</Button>
<Button variant="secondary" isDisabled>Disabled</Button>`,
      Component: () => (
        <div style={row}>
          <Button isLoading>Saving</Button>
          <Button isDisabled>Disabled</Button>
          <Button variant="secondary" isDisabled>
            Disabled
          </Button>
        </div>
      ),
    },
  ],
};

export default demo;
