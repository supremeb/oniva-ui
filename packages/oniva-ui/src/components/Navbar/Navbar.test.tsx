import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Navbar, NavbarLink } from './Navbar';

describe('Navbar', () => {
  it('renders banner, labelled nav, links, brand and end slot', () => {
    render(
      <Navbar brand="Oniva" end={<button>Sign in</button>} aria-label="Primary" className="x">
        <NavbarLink href="#a" isActive>Dashboard</NavbarLink>
        <NavbarLink href="#b">Reports</NavbarLink>
      </Navbar>,
    );
    expect(screen.getByRole('banner')).toHaveClass('x');
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Reports' })).not.toHaveAttribute('aria-current');
    expect(screen.getByText('Oniva')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
  it('floating variant changes classes', () => {
    const { rerender } = render(<Navbar>x</Navbar>);
    const a = screen.getByRole('banner').className;
    rerender(<Navbar floating sticky>x</Navbar>);
    expect(screen.getByRole('banner').className).not.toBe(a);
  });
});
