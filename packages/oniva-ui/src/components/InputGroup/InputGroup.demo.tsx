import { Mail } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { InputGroup } from './InputGroup';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 380 } as const;

const demo: DemoModule = {
  meta: {
    title: 'InputGroup',
    slug: 'input-group',
    category: 'Forms',
    description: 'Input with attached addons (protocol, currency, units, domains) that share the field border.',
  },
  demos: [
    {
      name: 'Text addons',
      code: `<InputGroup label="Website" startAddon="https://" endAddon=".com" placeholder="acme" />
<InputGroup label="Amount" startAddon="$" endAddon="USD" placeholder="0.00" />`,
      Component: () => (
        <div style={col}>
          <InputGroup label="Website" startAddon="https://" endAddon=".com" placeholder="acme" />
          <InputGroup label="Amount" startAddon="$" endAddon="USD" placeholder="0.00" />
        </div>
      ),
    },
    {
      name: 'Icon and error',
      code: `<InputGroup label="Billing email" startAddon={<Mail size={16} />} isInvalid errorMessage="Enter a valid email." />`,
      Component: () => (
        <div style={col}>
          <InputGroup
            label="Billing email"
            startAddon={<Mail size={16} />}
            defaultValue="finance@acme"
            isInvalid
            errorMessage="Enter a valid email."
          />
        </div>
      ),
    },
  ],
};

export default demo;
