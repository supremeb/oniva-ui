import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Citation } from './Citation';

describe('Citation', () => {
  it('renders a numbered link with an accessible name', () => {
    render(
      <Citation index={2} title="Q3 earnings roundup" url="https://www.northwind.example/markets" />,
    );
    const a = screen.getByRole('link', { name: 'Source 2: Q3 earnings roundup' });
    expect(a).toHaveTextContent('2');
    expect(a).toHaveAttribute('href', 'https://www.northwind.example/markets');
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('drops unsafe urls instead of linking to them', () => {
    render(<Citation index={1} title="Bad source" url="javascript:alert(1)" />);
    expect(screen.getByRole('link', { name: 'Source 1: Bad source' })).not.toHaveAttribute('href');
  });

  it('keeps three-digit indexes intact', () => {
    render(<Citation index={128} title="Appendix" url="https://data.northwind.example/a" />);
    expect(screen.getByRole('link', { name: 'Source 128: Appendix' })).toHaveTextContent('128');
  });

  it('forwards ref to the anchor', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<Citation ref={ref} index={3} title="Ref source" url="https://www.northwind.example/r" />);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
