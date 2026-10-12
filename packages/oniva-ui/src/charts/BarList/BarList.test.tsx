import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BarList } from './BarList';

const items = [
  { name: 'B', value: 5 },
  { name: 'A', value: 10, href: '#a' },
];

describe('BarList', () => {
  it('sorts descending and renders links', () => {
    render(<BarList items={items} />);
    const rows = screen.getAllByRole('listitem');
    expect(rows[0]).toHaveTextContent('A');
    expect(screen.getByRole('link', { name: 'A' })).toHaveAttribute('href', '#a');
  });
  it('keeps order when sort is false and shows ranks', () => {
    render(<BarList items={items} sort={false} ranked className="x" data-testid="l" />);
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('1B');
    expect(screen.getByTestId('l')).toHaveClass('x');
  });
});
