import { ArrowRight, Plus, Settings } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Button } from './Button';

const row = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;

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
