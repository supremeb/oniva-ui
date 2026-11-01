import { ArrowRightIcon, CopyIcon, PlusIcon, SettingsIcon, TrashIcon, UploadIcon } from '../../icons/IconSet';
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
<Button variant="ghost">Ghost</Button> <Button variant="danger" startIcon={<TrashIcon size={16} />}>Delete</Button>
<Button variant="secondary" size="sm" startIcon={<PlusIcon size={16} />}>Add item</Button>
<Button endIcon={<ArrowRightIcon size={16} />}>Continue</Button>
<Button variant="secondary" startIcon={<CopyIcon size={16} />}>Copy link</Button>
<Button isDisabled>Disabled</Button>`,
      Component: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
          <div style={group}>
            <span style={label}>Styles</span>
            <div style={{ ...row, justifyContent: 'center' }}>
              <Button>Save changes</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger" startIcon={<TrashIcon size={16} />}>
                Delete
              </Button>
            </div>
          </div>
          <div style={group}>
            <span style={label}>Icons and sizes</span>
            <div style={{ ...row, justifyContent: 'center' }}>
              <Button variant="secondary" size="sm" startIcon={<PlusIcon size={16} />}>
                Add item
              </Button>
              <Button endIcon={<ArrowRightIcon size={16} />}>Continue</Button>
              <Button isIconOnly variant="ghost" aria-label="More">
                <SettingsIcon size={16} />
              </Button>
              <Button variant="secondary" size="lg">
                Large
              </Button>
            </div>
          </div>
          <div style={group}>
            <span style={label}>Feedback and states</span>
            <div style={{ ...row, justifyContent: 'center' }}>
              <Button variant="secondary" startIcon={<CopyIcon size={16} />}>
                Copy link
              </Button>
              <Button isIconOnly variant="secondary" aria-label="Copy">
                <CopyIcon size={16} />
              </Button>
              <Button variant="secondary" startIcon={<UploadIcon size={16} />}>
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
      code: `<Button startIcon={<PlusIcon size={16} />}>New project</Button>
<Button variant="secondary" endIcon={<ArrowRightIcon size={16} />}>Continue</Button>
<Button isIconOnly variant="secondary" aria-label="Settings"><SettingsIcon size={16} /></Button>`,
      Component: () => (
        <div style={row}>
          <Button startIcon={<PlusIcon size={16} />}>New project</Button>
          <Button variant="secondary" endIcon={<ArrowRightIcon size={16} />}>
            Continue
          </Button>
          <Button isIconOnly variant="secondary" aria-label="Settings">
            <SettingsIcon size={16} />
          </Button>
          <Button isIconOnly variant="ghost" aria-label="Add">
            <PlusIcon size={16} />
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
