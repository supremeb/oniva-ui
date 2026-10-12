import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InboxList } from './InboxList';
import { expectNoA11yViolations } from '../../internal/test-a11y';

const items = [
  { id: '1', from: 'Priya Nair', subject: 'Q4 pricing', snippet: 'Check slide 7', time: '9:41 AM', unread: true },
  { id: '2', from: 'Stripe', snippet: 'Payout on the way', time: 'Yesterday' },
];

describe('InboxList', () => {
  it('renders unread markers and fires actions', async () => {
    const onArchive = vi.fn();
    const onToggleRead = vi.fn();
    render(<InboxList items={items} onArchive={onArchive} onToggleRead={onToggleRead} className="x" />);
    expect(screen.getByText('Unread')).toBeInTheDocument();
    expect(screen.getByRole('grid')).toHaveClass('x');
    await userEvent.click(screen.getByRole('button', { name: 'Archive Priya Nair' }));
    expect(onArchive).toHaveBeenCalledWith('1');
    await userEvent.click(screen.getByRole('button', { name: 'Mark Priya Nair as read' }));
    expect(onToggleRead).toHaveBeenCalledWith('1');
  });
  it('has no a11y violations', async () => {
    const { container } = render(<InboxList items={items} />);
    await expectNoA11yViolations(container);
  });
});
