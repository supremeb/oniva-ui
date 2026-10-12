import type { DemoModule } from '../../internal/demo';
import { Input } from '../Input';
import { Fieldset } from './Fieldset';

const demo: DemoModule = {
  meta: {
    title: 'Fieldset',
    slug: 'fieldset',
    category: 'Forms',
    description: 'Group related fields under a legend and optional description.',
  },
  demos: [
    {
      name: 'Billing address',
      code: `<Fieldset legend="Billing address" description="Appears on invoices and receipts.">
  <Input label="Street" defaultValue="2032 Westshore Dr" />
  <Input label="City" defaultValue="Cumming" />
</Fieldset>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 360 }}>
          <Fieldset legend="Billing address" description="Appears on invoices and receipts.">
            <Input label="Street" defaultValue="2032 Westshore Dr" />
            <Input label="City" defaultValue="Cumming" />
          </Fieldset>
        </div>
      ),
    },
    {
      name: 'Disabled',
      code: `<Fieldset legend="Workspace" disabled>
  <Input label="Workspace name" defaultValue="Acme Finance" />
</Fieldset>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 360 }}>
          <Fieldset legend="Workspace" disabled>
            <Input label="Workspace name" defaultValue="Acme Finance" />
          </Fieldset>
        </div>
      ),
    },
  ],
};

export default demo;
