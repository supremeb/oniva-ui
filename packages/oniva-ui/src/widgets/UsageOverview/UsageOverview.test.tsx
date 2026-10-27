import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { UsageOverview } from './UsageOverview';

const used = [
  { label: 'Chat', value: 3980 },
  { label: 'Search', value: 1640 },
  { label: 'Images', value: 1800 },
];
const limits = [
  { label: 'Seats', used: 8, total: 10 },
  { label: 'Storage', used: 3.2, total: 5, unit: 'GB' },
  { label: 'Projects', used: 12, total: null },
];
const daily = [
  { label: 'Oct 1', value: 312 },
  { label: 'Oct 2', value: 420 },
  { label: 'Oct 3', value: null },
];
const periods = [
  { id: 'month', label: 'This month' },
  { id: 'last', label: 'Last month' },
];
const now = new Date('2026-10-08T12:00:00Z');

describe('UsageOverview', () => {
  it('exposes the bar and every limit as meters with their value as text', () => {
    render(<UsageOverview total={10000} used={used} limits={limits} />);
    expect(screen.getByRole('meter', { name: 'Credits used' })).toHaveAttribute('aria-valuetext', '7,420 of 10,000 credits');
    expect(screen.getByRole('meter', { name: 'Seats' })).toHaveAttribute('aria-valuetext', '8 of 10');
    expect(screen.getByRole('meter', { name: 'Storage' })).toHaveAttribute('aria-valuetext', '3.2 of 5.0 GB');
    expect(screen.getByText('12 of ∞')).toBeInTheDocument();
  });
  it('shows the reset countdown with the date on hover', () => {
    render(<UsageOverview total={10000} used={used} plan="Pro plan" resetAt="2026-10-17T12:00:00Z" now={now} />);
    const el = screen.getByText('Resets in 9 days');
    expect(el).toHaveAttribute('title', expect.stringContaining('2026'));
    expect(screen.getByText(/Pro plan/)).toBeInTheDocument();
  });
  it('is ok below the warn share and calls onUpgrade with the state', async () => {
    const onUpgrade = vi.fn();
    render(<UsageOverview total={10000} used={used} onUpgrade={onUpgrade} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Upgrade' }));
    expect(onUpgrade).toHaveBeenCalledWith('ok');
    expect(screen.queryByText('Running low')).toBeNull();
  });
  it('warns near the limit with text, a solid button and a live announcement', async () => {
    const onUpgrade = vi.fn();
    render(<UsageOverview total={8000} used={used} onUpgrade={onUpgrade} />);
    expect(screen.getByText('Running low')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Running low: 93% of credits used');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Add credits' }));
    expect(onUpgrade).toHaveBeenCalledWith('warn');
  });
  it('reports the limit state', () => {
    render(<UsageOverview total={7000} used={used} topUpLabel="Top up" />);
    expect(screen.getByText('Limit reached')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Top up' })).toBeInTheDocument();
  });
  it('steps through categories with the arrow keys and clears with Escape', () => {
    render(<UsageOverview total={10000} used={used} />);
    const bar = screen.getByRole('meter', { name: 'Credits used' });
    bar.focus();
    fireEvent.keyDown(bar, { key: 'ArrowRight' });
    expect(screen.getByRole('status')).toHaveTextContent('Chat: 3,980 credits, 40%');
    fireEvent.keyDown(bar, { key: 'ArrowRight' });
    expect(screen.getByRole('status')).toHaveTextContent('Search: 1,640 credits, 16%');
    const row = within(screen.getByRole('list', { name: 'Usage by category' })).getAllByRole('listitem')[1]!;
    expect(row).toHaveAttribute('data-active');
    fireEvent.keyDown(bar, { key: 'Escape' });
    expect(row).not.toHaveAttribute('data-active');
  });
  it('switches periods and exposes daily points', async () => {
    const onPeriodChange = vi.fn();
    render(<UsageOverview total={10000} used={used} periods={periods} daily={daily} onPeriodChange={onPeriodChange} />);
    await userEvent.setup().click(screen.getByRole('radio', { name: 'Last month' }));
    expect(onPeriodChange).toHaveBeenCalledWith('last');
    expect(screen.getByLabelText('Oct 1: 312 credits')).toBeInTheDocument();
    expect(screen.getByLabelText('Oct 3: no data yet')).toBeInTheDocument();
  });
  it('forwards className and ref', () => {
    let el: HTMLElement | null = null;
    render(<UsageOverview total={10000} used={used} className="x" ref={(n) => void (el = n)} />);
    expect(el).toHaveClass('x');
  });
  it('has no axe violations', async () => {
    const { container } = render(<UsageOverview total={10000} used={used} limits={limits} daily={daily} periods={periods} plan="Pro plan" resetAt="2026-10-17" now={now} />);
    await expectNoA11yViolations(container);
  });
});
