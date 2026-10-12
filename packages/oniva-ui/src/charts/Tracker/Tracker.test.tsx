import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tracker } from './Tracker';

const items = [
  { label: 'Day 1', status: 'up' as const },
  { label: 'Day 2', status: 'down' as const },
];

describe('Tracker', () => {
  it('summarises operational count and labels cells', () => {
    render(<Tracker items={items} />);
    expect(screen.getByRole('group')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('1 of 2'),
    );
    expect(screen.getByRole('button', { name: 'Day 2: Outage' })).toBeInTheDocument();
  });
  it('shows a tooltip on focus and hides on Escape', () => {
    render(<Tracker items={items} />);
    const b = screen.getByRole('button', { name: /Day 1/ });
    fireEvent.focus(b);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Day 1');
    fireEvent.keyDown(b, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
