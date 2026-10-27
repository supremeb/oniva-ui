import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LogoCloud } from './LogoCloud';

const Mark = () => <svg />;

describe('LogoCloud', () => {
  it('renders the grid of logos', () => {
    render(<LogoCloud />);
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
  });
  it('marquee repeats the set once as an aria-hidden, inert copy', () => {
    const { container } = render(<LogoCloud variant="marquee" className="x" />);
    const hidden = container.querySelector('ul[aria-hidden="true"]')!;
    expect(hidden.querySelectorAll('li')).toHaveLength(8);
    expect(hidden).toHaveAttribute('inert');
    expect(container.querySelector('section')).toHaveClass('x');
    expect(screen.getByRole('list', { name: 'Customer logos' }).querySelectorAll('li')).toHaveLength(8);
  });
  it('two rows split the logos alternately', () => {
    render(<LogoCloud variant="marquee" rows={2} />);
    expect(screen.getByRole('list', { name: 'Customers, row 1' }).querySelectorAll('li')).toHaveLength(4);
    expect(screen.getByRole('list', { name: 'Customers, row 2' }).querySelectorAll('li')).toHaveLength(4);
  });
  it('linked logos are keyboard focusable and only the original copy links', async () => {
    render(<LogoCloud variant="marquee" logos={[{ name: 'Acme', Mark, href: '/c/acme' }, { name: 'Bolt', Mark }]} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
    await userEvent.tab();
    expect(screen.getByRole('link', { name: /Acme/ })).toHaveFocus();
  });
  it('forwards ref', () => {
    const ref = vi.fn();
    render(<LogoCloud ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
  it('reduced motion renders one static copy', () => {
    const mm = window.matchMedia;
    window.matchMedia = ((q: string) => ({ ...mm(q), matches: true, addEventListener() {}, removeEventListener() {} })) as typeof window.matchMedia;
    const { container } = render(<LogoCloud variant="marquee" />);
    expect(container.querySelector('[aria-hidden="true"][inert]')).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
    window.matchMedia = mm;
  });
});
