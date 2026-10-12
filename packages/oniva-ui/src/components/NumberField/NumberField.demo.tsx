import type { DemoModule } from '../../internal/demo';
import { NumberField } from './NumberField';

const col = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  maxWidth: 240,
} as const;

const demo: DemoModule = {
  meta: {
    title: 'Number field',
    slug: 'number-field',
    category: 'Forms',
    description:
      'Numeric input with stepper buttons, locale-aware formatting and min/max clamping.',
  },
  demos: [
    {
      name: 'Stepper',
      code: `<NumberField label="Seats" defaultValue={12} minValue={1} maxValue={100} />`,
      Component: () => (
        <div style={col}>
          <NumberField label="Seats" defaultValue={12} minValue={1} maxValue={100} />
        </div>
      ),
    },
    {
      name: 'Currency',
      code: `<NumberField label="Invoice total" defaultValue={2480} step={10}
  formatOptions={{ style: 'currency', currency: 'USD' }} description="Includes tax." />`,
      Component: () => (
        <div style={col}>
          <NumberField
            label="Invoice total"
            defaultValue={2480}
            step={10}
            formatOptions={{ style: 'currency', currency: 'USD' }}
            description="Includes tax."
          />
        </div>
      ),
    },
    {
      name: 'Error and disabled',
      code: `<NumberField label="Discount %" isInvalid errorMessage="Max 50%." defaultValue={72} />`,
      Component: () => (
        <div style={col}>
          <NumberField label="Discount %" isInvalid errorMessage="Max 50%." defaultValue={72} />
          <NumberField label="Locked" isDisabled defaultValue={3} />
        </div>
      ),
    },
  ],
};

export default demo;
