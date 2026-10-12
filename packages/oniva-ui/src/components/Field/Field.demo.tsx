import { Input as RacInput, TextField } from 'react-aria-components';
import * as stylex from '@stylexjs/stylex';
import type { DemoModule } from '../../internal/demo';
import { ff } from '../../internal/forms-field';
import { Description, Field, FieldError, Label } from './Field';

const demo: DemoModule = {
  meta: {
    title: 'Field',
    slug: 'field',
    category: 'Forms',
    description:
      'Layout primitives (Field, Label, Description, FieldError) that compose with any React Aria field to build custom controls.',
  },
  demos: [
    {
      name: 'Composed field',
      code: `<TextField>
  <Field>
    <Label>Billing email</Label>
    <RacInput />
    <Description>Invoices are sent here.</Description>
  </Field>
</TextField>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 360 }}>
          <TextField>
            <Field>
              <Label>Billing email</Label>
              <RacInput
                {...stylex.props(ff.control, ff.md, ff.bare)}
                defaultValue="finance@acme.co"
              />
              <Description>Invoices are sent here.</Description>
            </Field>
          </TextField>
        </div>
      ),
    },
    {
      name: 'With error',
      code: `<TextField isInvalid>
  <Field>
    <Label>Tax ID</Label>
    <RacInput />
    <FieldError>Enter a valid EIN (12-3456789).</FieldError>
  </Field>
</TextField>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 360 }}>
          <TextField isInvalid>
            <Field>
              <Label>Tax ID</Label>
              <RacInput
                {...stylex.props(ff.control, ff.md, ff.bare, ff.invalid)}
                defaultValue="12-345"
              />
              <FieldError>Enter a valid EIN (12-3456789).</FieldError>
            </Field>
          </TextField>
        </div>
      ),
    },
  ],
};

export default demo;
