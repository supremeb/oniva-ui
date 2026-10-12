import type { DemoModule } from '../../internal/demo';
import { Checkbox } from '../Checkbox';
import { CheckboxGroup } from './CheckboxGroup';

const demo: DemoModule = {
  meta: {
    title: 'CheckboxGroup',
    slug: 'checkbox-group',
    category: 'Forms',
    description: 'Labelled group of checkboxes with shared value, validation and orientation.',
  },
  demos: [
    {
      name: 'Notification channels',
      code: `<CheckboxGroup label="Notify me via" description="You can change this anytime." defaultValue={['email']}>
  <Checkbox value="email">Email</Checkbox>
  <Checkbox value="slack">Slack</Checkbox>
  <Checkbox value="sms">SMS</Checkbox>
</CheckboxGroup>`,
      Component: () => (
        <CheckboxGroup label="Notify me via" description="You can change this anytime." defaultValue={['email']}>
          <Checkbox value="email">Email</Checkbox>
          <Checkbox value="slack">Slack</Checkbox>
          <Checkbox value="sms">SMS</Checkbox>
        </CheckboxGroup>
      ),
    },
    {
      name: 'Horizontal with error',
      code: `<CheckboxGroup label="Report columns" orientation="horizontal" isInvalid errorMessage="Select at least one column.">...</CheckboxGroup>`,
      Component: () => (
        <CheckboxGroup
          label="Report columns"
          orientation="horizontal"
          isInvalid
          errorMessage="Select at least one column."
        >
          <Checkbox value="amount">Amount</Checkbox>
          <Checkbox value="status">Status</Checkbox>
          <Checkbox value="due">Due date</Checkbox>
        </CheckboxGroup>
      ),
    },
  ],
};

export default demo;
