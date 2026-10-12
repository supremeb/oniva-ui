import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders heading, description and actions', () => {
    render(
      <EmptyState
        title="No invoices yet"
        description="Create your first invoice."
        actions={<button>New invoice</button>}
      />,
    );
    expect(screen.getByRole('heading', { name: 'No invoices yet' })).toBeInTheDocument();
    expect(screen.getByText('Create your first invoice.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New invoice' })).toBeInTheDocument();
  });
  it('bordered + className + ref', () => {
    let el: HTMLDivElement | null = null;
    const { container, rerender } = render(
      <EmptyState
        title="x"
        className="k"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    const a = (container.firstElementChild as HTMLElement).className;
    rerender(
      <EmptyState
        title="x"
        className="k"
        bordered
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect((container.firstElementChild as HTMLElement).className).not.toBe(a);
    expect(el).toBeInstanceOf(HTMLDivElement);
  });
});
