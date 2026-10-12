import type { DemoModule } from '../../internal/demo';
import { Select, SelectItem } from './Select';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 320 } as const;

const demo: DemoModule = {
  meta: {
    title: 'Select',
    slug: 'select',
    category: 'Forms',
    description:
      'Dropdown select with optional colored status dot, label, description and validation. Built on React Aria Select.',
  },
  demos: [
    {
      name: 'Status select',
      code: `<Select label="Status" defaultSelectedKey="paid">
  <SelectItem id="paid" dot="success">Paid</SelectItem>
  <SelectItem id="pending" dot="warning">Pending</SelectItem>
  <SelectItem id="failed" dot="danger">Failed</SelectItem>
  <SelectItem id="draft" dot="neutral">Draft</SelectItem>
</Select>`,
      Component: () => (
        <div style={col}>
          <Select label="Status" defaultSelectedKey="paid">
            <SelectItem id="paid" dot="success">Paid</SelectItem>
            <SelectItem id="pending" dot="warning">Pending</SelectItem>
            <SelectItem id="failed" dot="danger">Failed</SelectItem>
            <SelectItem id="draft" dot="neutral">Draft</SelectItem>
          </Select>
        </div>
      ),
    },
    {
      name: 'Description and placeholder',
      code: `<Select label="Billing region" description="Determines tax and currency." placeholder="Choose a region">
  <SelectItem id="us">United States</SelectItem>
  <SelectItem id="eu">European Union</SelectItem>
  <SelectItem id="in">India</SelectItem>
</Select>`,
      Component: () => (
        <div style={col}>
          <Select
            label="Billing region"
            description="Determines tax and currency."
            placeholder="Choose a region"
          >
            <SelectItem id="us">United States</SelectItem>
            <SelectItem id="eu">European Union</SelectItem>
            <SelectItem id="in">India</SelectItem>
          </Select>
        </div>
      ),
    },
    {
      name: 'Sizes, error and disabled',
      code: `<Select size="sm" aria-label="Small" .../>
<Select label="Owner" isInvalid errorMessage="Assign an owner." />
<Select label="Plan" isDisabled />`,
      Component: () => (
        <div style={col}>
          <Select size="sm" aria-label="Small" defaultSelectedKey="a">
            <SelectItem id="a">Small (32px)</SelectItem>
          </Select>
          <Select size="lg" aria-label="Large" defaultSelectedKey="a">
            <SelectItem id="a">Large (44px)</SelectItem>
          </Select>
          <Select label="Owner" isInvalid errorMessage="Assign an owner.">
            <SelectItem id="a">Priya Raman</SelectItem>
            <SelectItem id="b">Marcus Lee</SelectItem>
          </Select>
          <Select label="Plan" isDisabled defaultSelectedKey="g">
            <SelectItem id="g">Growth</SelectItem>
          </Select>
        </div>
      ),
    },
  ],
};

export default demo;
