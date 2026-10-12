import { Mail, Search } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Input } from './Input';

const col = { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 } as const;

const demo: DemoModule = {
  meta: {
    title: 'Input',
    slug: 'input',
    category: 'Forms',
    description:
      'Text field with label, description, validation error and adornments. Built on React Aria TextField.',
  },
  demos: [
    {
      name: 'Basic',
      code: `<Input label="Email" placeholder="you@company.com" description="We never share it." prefix={<Mail size={16} />} />`,
      Component: () => (
        <div style={col}>
          <Input
            label="Email"
            placeholder="you@company.com"
            description="We never share it."
            prefix={<Mail size={16} />}
          />
          <Input
            label="Search"
            placeholder="Search…"
            prefix={<Search size={16} />}
            suffix={<kbd>⌘K</kbd>}
          />
        </div>
      ),
    },
    {
      name: 'Sizes',
      code: `<Input size="sm" aria-label="Small" placeholder="Small" />
<Input size="md" aria-label="Medium" placeholder="Medium" />
<Input size="lg" aria-label="Large" placeholder="Large" />`,
      Component: () => (
        <div style={col}>
          <Input size="sm" aria-label="Small" placeholder="Small" />
          <Input size="md" aria-label="Medium" placeholder="Medium" />
          <Input size="lg" aria-label="Large" placeholder="Large" />
        </div>
      ),
    },
    {
      name: 'Error and disabled',
      code: `<Input label="Username" isInvalid errorMessage="That username is taken." defaultValue="bala" />
<Input label="Disabled" isDisabled defaultValue="Read only value" />`,
      Component: () => (
        <div style={col}>
          <Input
            label="Username"
            isInvalid
            errorMessage="That username is taken."
            defaultValue="bala"
          />
          <Input label="Disabled" isDisabled defaultValue="Read only value" />
        </div>
      ),
    },
  ],
};

export default demo;
