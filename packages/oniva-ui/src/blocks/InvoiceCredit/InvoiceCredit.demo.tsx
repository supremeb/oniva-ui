import type { DemoModule } from '../../internal/demo';
import { InvoiceCredit } from './InvoiceCredit';

const demo: DemoModule = {
  meta: {
    title: 'Invoice and credit note',
    slug: 'invoice-credit',
    category: 'Blocks',
    description: 'An invoice and its credit note stacked like paper: switch between them, pick lines to credit, adjust amounts and issue.',
  },
  demos: [
    { name: 'Default', code: `<InvoiceCredit />`, Component: () => <InvoiceCredit /> },
    {
      name: 'Euro, custom lines',
      code: `<InvoiceCredit currency="EUR" invoiceNo="INV-0099" lines={[{ id: 'a', name: 'Design sprint', qty: 2, rate: 2400, tax: 0.19 }]} />`,
      Component: () => <InvoiceCredit currency="EUR" invoiceNo="INV-0099" lines={[{ id: 'a', name: 'Design sprint', qty: 2, rate: 2400, tax: 0.19 }]} />,
    },
  ],
};
export default demo;
