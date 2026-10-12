import { Bell } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Navbar, NavbarLink } from './Navbar';

const demo: DemoModule = {
  meta: {
    title: 'Navbar',
    slug: 'navbar',
    category: 'Navigation',
    description: 'Top application bar with brand, links and actions. Flat with a hairline, or floating.',
  },
  demos: [
    {
      name: 'Flat',
      code: `<Navbar brand="Oniva" end={<Button size="sm">Upgrade</Button>}>
  <NavbarLink href="#" isActive>Dashboard</NavbarLink>
  <NavbarLink href="#">Reports</NavbarLink>
  <NavbarLink href="#">Customers</NavbarLink>
</Navbar>`,
      Component: () => (
        <Navbar brand="Oniva" end={<Button size="sm">Upgrade</Button>}>
          <NavbarLink href="#" isActive>Dashboard</NavbarLink>
          <NavbarLink href="#">Reports</NavbarLink>
          <NavbarLink href="#">Customers</NavbarLink>
        </Navbar>
      ),
    },
    {
      name: 'Floating with actions',
      code: `<Navbar floating brand="Acme Finance" end={<><Button isIconOnly variant="ghost" aria-label="Notifications"><Bell size={16}/></Button><Avatar name="Aylin Demir" size="sm" /></>}>…</Navbar>`,
      Component: () => (
        <Navbar
          floating
          brand="Acme Finance"
          end={
            <>
              <Button isIconOnly variant="ghost" aria-label="Notifications">
                <Bell size={16} />
              </Button>
              <Avatar name="Aylin Demir" size="sm" />
            </>
          }
        >
          <NavbarLink href="#">Invoices</NavbarLink>
          <NavbarLink href="#" isActive>Payments</NavbarLink>
          <NavbarLink href="#">Payouts</NavbarLink>
        </Navbar>
      ),
    },
  ],
};
export default demo;
