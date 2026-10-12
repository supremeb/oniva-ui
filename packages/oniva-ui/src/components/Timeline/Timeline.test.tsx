import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Timeline } from './Timeline';
import { expectNoA11yViolations } from '../../internal/test-a11y';

const events = [
  { id: '1', time: '2026-10-12T09:42:00', actor: 'Priya Nair', action: 'merged #482', details: 'Details text' },
  { id: '2', time: '2026-10-11T16:30:00', actor: 'Lena Schmidt', action: 'invited a user' },
];

describe('Timeline', () => {
  it('groups by day with Today/Yesterday labels', () => {
    render(<Timeline events={events} today="2026-10-12" className="x" data-testid="t" />);
    expect(screen.getByTestId('t')).toHaveClass('x');
    expect(screen.getByRole('heading', { name: /^Today/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Yesterday/ })).toBeInTheDocument();
  });
  it('expands details', async () => {
    render(<Timeline events={events} />);
    const btn = screen.getByRole('button', { name: /Show details/ });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });
  it('has no a11y violations', async () => {
    const { container } = render(<Timeline events={events} />);
    await expectNoA11yViolations(container);
  });
});
