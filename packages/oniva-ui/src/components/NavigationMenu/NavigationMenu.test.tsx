import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  NavigationMenu,
  NavigationMenuItemLink,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from './NavigationMenu';

function Example() {
  return (
    <NavigationMenu aria-label="Site" className="x">
      <NavigationMenuLink href="#home" isActive>
        Home
      </NavigationMenuLink>
      <NavigationMenuTrigger label="Products">
        <NavigationMenuItemLink
          href="#pay"
          title="Payments"
          description="Accept cards and bank transfers"
        />
        <NavigationMenuItemLink
          href="#inv"
          title="Invoicing"
          description="Send and track invoices"
        />
      </NavigationMenuTrigger>
    </NavigationMenu>
  );
}

describe('NavigationMenu', () => {
  it('renders a labelled nav with an active link', () => {
    render(<Example />);
    expect(screen.getByRole('navigation', { name: 'Site' })).toHaveClass('x');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });
  it('opens the panel from the trigger and closes with Escape', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Products' });
    expect(screen.queryByRole('link', { name: /Payments/ })).toBeNull();
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Payments/ })).toHaveTextContent('Accept cards');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
