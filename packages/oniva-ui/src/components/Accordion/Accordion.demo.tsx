import { CreditCard, Shield, Truck } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Accordion, AccordionItem } from './Accordion';

const demo: DemoModule = {
  meta: {
    title: 'Accordion',
    slug: 'accordion',
    category: 'Data display',
    description:
      'Vertically stacked disclosure sections built on React Aria DisclosureGroup. Single or multiple expanded, divided or card variants.',
  },
  demos: [
    {
      name: 'Divided',
      code: `<Accordion defaultExpandedKeys={['shipping']}>
  <AccordionItem id="shipping" title="Shipping & delivery">Orders ship within 2 business days...</AccordionItem>
  <AccordionItem id="returns" title="Returns">Return unused items within 30 days.</AccordionItem>
  <AccordionItem id="warranty" title="Warranty">All plans include a 12-month warranty.</AccordionItem>
</Accordion>`,
      Component: () => (
        <Accordion defaultExpandedKeys={['shipping']}>
          <AccordionItem id="shipping" title="Shipping & delivery">
            Orders ship within 2 business days. Standard delivery takes 3 to 5 days, and you get a
            tracking link as soon as the parcel leaves the warehouse.
          </AccordionItem>
          <AccordionItem id="returns" title="Returns">
            Return unused items within 30 days for a full refund to your original payment method.
          </AccordionItem>
          <AccordionItem id="warranty" title="Warranty">
            Every plan includes a 12-month limited warranty covering manufacturing defects.
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      name: 'Cards with icons, multiple open',
      code: `<Accordion variant="cards" allowsMultipleExpanded defaultExpandedKeys={['billing', 'security']}>
  <AccordionItem id="billing" icon={<CreditCard size={16} />} title="Billing">...</AccordionItem>
  <AccordionItem id="security" icon={<Shield size={16} />} title="Security">...</AccordionItem>
  <AccordionItem id="delivery" icon={<Truck size={16} />} title="Delivery">...</AccordionItem>
</Accordion>`,
      Component: () => (
        <Accordion
          variant="cards"
          allowsMultipleExpanded
          defaultExpandedKeys={['billing', 'security']}
        >
          <AccordionItem id="billing" icon={<CreditCard size={16} />} title="Billing">
            Invoices are issued on the 1st of each month. Update your card under Settings, Billing.
          </AccordionItem>
          <AccordionItem id="security" icon={<Shield size={16} />} title="Security">
            Two-factor authentication is enforced for every admin on the Scale plan.
          </AccordionItem>
          <AccordionItem id="delivery" icon={<Truck size={16} />} title="Delivery">
            Track every shipment from the Orders page.
          </AccordionItem>
        </Accordion>
      ),
    },
  ],
};

export default demo;
