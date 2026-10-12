import type { DemoModule } from '../../internal/demo';
import { InvoiceCard, type Invoice } from './InvoiceCard';

const invoice: Invoice = {
  number: 'INV-2041',
  status: 'due',
  issued: '2026-10-01',
  due: '2026-10-31',
  taxRate: 0.0825,
  billTo: { name: 'Northwind Traders', email: 'ap@northwind.io' },
  lines: [
    { description: 'Pro plan, 62 seats (Oct)', quantity: 62, unitPrice: 24 },
    { description: 'Usage overage, API calls', quantity: 3, unitPrice: 49.5 },
    { description: 'Priority support', quantity: 1, unitPrice: 250 },
  ],
};

const demo: DemoModule = {
  meta: {
    title: 'Invoice card',
    slug: 'invoice-card',
    category: 'Widgets',
    description: 'Compact invoice summary with status, billing details, line items, totals and pay/download actions.',
  },
  demos: [
    {
      name: 'Open invoice',
      code: `<InvoiceCard invoice={invoice} onPay={() => pay(invoice.number)} onDownload={() => download()} />`,
      Component: () => <InvoiceCard invoice={invoice} />,
    },
    {
      name: 'Paid',
      code: `<InvoiceCard invoice={{ ...invoice, status: 'paid' }} />`,
      Component: () => <InvoiceCard invoice={{ ...invoice, number: 'INV-2038', status: 'paid' }} />,
    },
  ],
};
export default demo;
