import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { NotificationCenter, type NotificationItem } from './NotificationCenter';

const items: NotificationItem[] = [
  {
    id: '1',
    title: 'Priya commented on Q4 plan',
    time: '5m ago',
    actor: 'Priya Nair',
    mention: true,
  },
  { id: '2', title: 'Invoice paid', body: '$4,820 from Northwind', time: '2h ago' },
  { id: '3', title: 'Backup finished', time: 'Yesterday', read: true },
];

describe('NotificationCenter', () => {
  it('lists all items and filters unread/mentions via tabs', async () => {
    const user = userEvent.setup();
    render(<NotificationCenter notifications={items} />);
    expect(screen.getByText('Invoice paid')).toBeInTheDocument();
    expect(screen.getByText('Backup finished')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /Unread/ }));
    expect(screen.queryByText('Backup finished')).toBeNull();
    await user.click(screen.getByRole('tab', { name: /Mentions/ }));
    expect(screen.getByText(/Priya commented/)).toBeInTheDocument();
    expect(screen.queryByText('Invoice paid')).toBeNull();
  });

  it('marks all as read and forwards ref', async () => {
    const user = userEvent.setup();
    let el: HTMLElement | null = null;
    render(
      <NotificationCenter
        notifications={items}
        className="extra"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    await user.click(screen.getByRole('button', { name: /Mark all as read/ }));
    expect(screen.getByRole('button', { name: /Mark all as read/ })).toBeDisabled();
    await user.click(screen.getByRole('tab', { name: /Unread/ }));
    expect(screen.getByText('You are all caught up.')).toBeInTheDocument();
    expect(el).toBeInstanceOf(HTMLElement);
  });
});
