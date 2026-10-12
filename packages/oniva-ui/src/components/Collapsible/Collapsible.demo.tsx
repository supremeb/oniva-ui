import type { DemoModule } from '../../internal/demo';
import { Collapsible } from './Collapsible';

const demo: DemoModule = {
  meta: {
    title: 'Collapsible',
    slug: 'collapsible',
    category: 'Data display',
    description:
      'A single expandable region with a chevron trigger, built on React Aria Disclosure.',
  },
  demos: [
    {
      name: 'Basic',
      code: `<Collapsible trigger="Advanced filters">
  Filter by region, plan tier and last-active date.
</Collapsible>`,
      Component: () => (
        <Collapsible trigger="Advanced filters">
          Filter by region, plan tier and last-active date to narrow the customer list.
        </Collapsible>
      ),
    },
    {
      name: 'Default open',
      code: `<Collapsible trigger="3 more reviewers" defaultExpanded>
  Priya Natarajan, Tomas Berg and Hana Okafor
</Collapsible>`,
      Component: () => (
        <Collapsible trigger="3 more reviewers" defaultExpanded>
          Priya Natarajan, Tomas Berg and Hana Okafor
        </Collapsible>
      ),
    },
  ],
};

export default demo;
