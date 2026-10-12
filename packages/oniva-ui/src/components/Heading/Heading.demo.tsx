import type { DemoModule } from '../../internal/demo';
import { Heading } from './Heading';
import { Text } from '../Text';

const demo: DemoModule = {
  meta: {
    title: 'Heading',
    slug: 'heading',
    category: 'Typography',
    description: 'Semantic h1-h6 decoupled from the visual scale.',
  },
  demos: [
    {
      name: 'Levels',
      code: `<Heading level={1}>Billing</Heading>
<Heading level={2}>Invoices</Heading>
<Heading level={3}>October 2026</Heading>
<Heading level={4}>Paid</Heading>`,
      Component: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Heading level={1}>Billing</Heading>
          <Heading level={2}>Invoices</Heading>
          <Heading level={3}>October 2026</Heading>
          <Heading level={4}>Paid</Heading>
        </div>
      ),
    },
    {
      name: 'Section header',
      code: `<Heading level={2} variant="headline">Active subscriptions</Heading>
<Text tone="muted">128 customers on the Pro plan.</Text>`,
      Component: () => (
        <div>
          <Heading level={2} variant="headline">
            Active subscriptions
          </Heading>
          <Text tone="muted">128 customers on the Pro plan.</Text>
        </div>
      ),
    },
  ],
};
export default demo;
