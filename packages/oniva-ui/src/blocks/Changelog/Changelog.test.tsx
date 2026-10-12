import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Changelog } from './Changelog';

describe('Changelog', () => {
  it('renders entries with time elements', () => {
    const { container } = render(<Changelog className="x" data-testid="c" />);
    expect(screen.getByText('Agent budgets', { exact: false })).toBeInTheDocument();
    expect(container.querySelectorAll('time')).toHaveLength(3);
    expect(screen.getByTestId('c')).toHaveClass('x');
  });
  it('renders custom entries', () => {
    render(<Changelog entries={[{ version: 'v1', date: 'Jan 1, 2026', iso: '2026-01-01', title: 'Hello', changes: ['One'] }]} />);
    expect(screen.getByText('One')).toBeInTheDocument();
  });
});
