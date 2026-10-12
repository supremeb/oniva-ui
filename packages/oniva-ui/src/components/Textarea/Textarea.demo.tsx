import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Textarea } from './Textarea';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 400 } as const;

function Counter() {
  const [v, setV] = useState('Quarterly vendor review: renegotiate AWS commit before Dec 15.');
  return <Textarea label="Internal note" maxLength={200} showCount value={v} onChange={setV} />;
}

const demo: DemoModule = {
  meta: {
    title: 'Textarea',
    slug: 'textarea',
    category: 'Forms',
    description: 'Multi-line text field with label, description, error and optional character counter.',
  },
  demos: [
    {
      name: 'Basic',
      code: `<Textarea label="Description" placeholder="What changed in this invoice?" description="Visible to approvers." />`,
      Component: () => (
        <div style={col}>
          <Textarea
            label="Description"
            placeholder="What changed in this invoice?"
            description="Visible to approvers."
          />
        </div>
      ),
    },
    {
      name: 'Character count',
      code: `const [v, setV] = useState('...');
<Textarea label="Internal note" maxLength={200} showCount value={v} onChange={setV} />`,
      Component: () => (
        <div style={col}>
          <Counter />
        </div>
      ),
    },
    {
      name: 'Error and disabled',
      code: `<Textarea label="Reason" isInvalid errorMessage="A reason is required to void an invoice." />
<Textarea label="Archived note" isDisabled defaultValue="Closed on Sep 30." />`,
      Component: () => (
        <div style={col}>
          <Textarea label="Reason" isInvalid errorMessage="A reason is required to void an invoice." />
          <Textarea label="Archived note" isDisabled defaultValue="Closed on Sep 30." />
        </div>
      ),
    },
  ],
};

export default demo;
