import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LinkButton } from './LinkButton';

describe('LinkButton', () => {
  it('is a link with href', () => {
    render(<LinkButton href="/new" className="c">New invoice</LinkButton>);
    const a = screen.getByRole('link', { name: 'New invoice' });
    expect(a).toHaveAttribute('href', '/new');
    expect(a).toHaveClass('c');
  });
  it('variant/size alter classes; icon-only needs label', () => {
    const { rerender } = render(<LinkButton href="/a">a</LinkButton>);
    const a = screen.getByRole('link').className;
    rerender(<LinkButton href="/a" variant="primary" size="lg">a</LinkButton>);
    expect(screen.getByRole('link').className).not.toBe(a);
    rerender(<LinkButton href="/a" isIconOnly aria-label="Open">+</LinkButton>);
    expect(screen.getByRole('link', { name: 'Open' })).toBeInTheDocument();
  });
});
