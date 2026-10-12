import { Home } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Breadcrumb, Breadcrumbs } from './Breadcrumbs';

const demo: DemoModule = {
  meta: {
    title: 'Breadcrumbs',
    slug: 'breadcrumbs',
    category: 'Navigation',
    description: 'Shows the path to the current page. The last item is marked aria-current and not linked.',
  },
  demos: [
    {
      name: 'Basic',
      code: `<Breadcrumbs aria-label="Breadcrumb">
  <Breadcrumb href="#">Workspace</Breadcrumb>
  <Breadcrumb href="#">Projects</Breadcrumb>
  <Breadcrumb>Atlas redesign</Breadcrumb>
</Breadcrumbs>`,
      Component: () => (
        <Breadcrumbs aria-label="Breadcrumb">
          <Breadcrumb href="#">Workspace</Breadcrumb>
          <Breadcrumb href="#">Projects</Breadcrumb>
          <Breadcrumb>Atlas redesign</Breadcrumb>
        </Breadcrumbs>
      ),
    },
    {
      name: 'With icon and custom separator',
      code: `<Breadcrumb href="#" icon={<Home size={14} />} separator="/">Home</Breadcrumb>`,
      Component: () => (
        <Breadcrumbs aria-label="Path">
          <Breadcrumb href="#" icon={<Home size={14} />} separator="/">Home</Breadcrumb>
          <Breadcrumb href="#" separator="/">Finance</Breadcrumb>
          <Breadcrumb href="#" separator="/">Invoices</Breadcrumb>
          <Breadcrumb>INV-2041</Breadcrumb>
        </Breadcrumbs>
      ),
    },
  ],
};
export default demo;
