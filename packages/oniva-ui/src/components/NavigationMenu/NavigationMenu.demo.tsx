import type { DemoModule } from '../../internal/demo';
import {
  NavigationMenu,
  NavigationMenuItemLink,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from './NavigationMenu';

const demo: DemoModule = {
  meta: {
    title: 'Navigation menu',
    slug: 'navigation-menu',
    category: 'Navigation',
    description:
      'Site-level menu with plain links and triggers that open a panel of described links.',
  },
  demos: [
    {
      name: 'Links and panels',
      code: `<NavigationMenu aria-label="Site">
  <NavigationMenuLink href="#" isActive>Home</NavigationMenuLink>
  <NavigationMenuTrigger label="Products">
    <NavigationMenuItemLink href="#" title="Payments" description="Accept cards and bank transfers" />
    <NavigationMenuItemLink href="#" title="Invoicing" description="Send and track invoices" />
  </NavigationMenuTrigger>
  <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
</NavigationMenu>`,
      Component: () => (
        <NavigationMenu aria-label="Site">
          <NavigationMenuLink href="#" isActive>
            Home
          </NavigationMenuLink>
          <NavigationMenuTrigger label="Products">
            <NavigationMenuItemLink
              href="#"
              title="Payments"
              description="Accept cards and bank transfers"
            />
            <NavigationMenuItemLink
              href="#"
              title="Invoicing"
              description="Send and track invoices"
            />
            <NavigationMenuItemLink
              href="#"
              title="Payouts"
              description="Pay vendors in 40+ currencies"
            />
          </NavigationMenuTrigger>
          <NavigationMenuTrigger label="Resources">
            <NavigationMenuItemLink
              href="#"
              title="Documentation"
              description="Guides and API reference"
            />
            <NavigationMenuItemLink
              href="#"
              title="Changelog"
              description="What shipped this month"
            />
          </NavigationMenuTrigger>
          <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
        </NavigationMenu>
      ),
    },
  ],
};
export default demo;
