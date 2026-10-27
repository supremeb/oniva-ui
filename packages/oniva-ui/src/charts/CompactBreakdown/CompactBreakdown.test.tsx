import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { CompactBreakdown } from './CompactBreakdown';

const items = [
  { label: 'Direct', value: 16900 },
  { label: 'Search', value: 24300 },
  { label: 'Referral', value: 8100 },
];
const periods = [
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
];

describe('CompactBreakdown', () => {
  it('ranks rows by value and announces the total with the change', () => {
    render(<CompactBreakdown title="Revenue by channel" items={items} delta={12.4} totalLabel="Total revenue" />);
    expect(screen.getByRole('status')).toHaveTextContent('Total revenue 49,300, up 12.4% versus the previous period');
    const rows = screen.getAllByRole('listitem');
    const rank = (name: string) => rows.find((r) => r.textContent?.includes(name))!.style.getPropertyValue('--oniva-rank');
    expect(rank('Search')).toBe('0');
    expect(rank('Direct')).toBe('1');
    expect(rank('Referral')).toBe('2');
  });
  it('shows the largest part in the footer, or a custom footer, or none', () => {
    const { rerender } = render(<CompactBreakdown items={items} />);
    expect(screen.getByText((_, el) => el?.tagName === 'DIV' && el.textContent === 'Largest: Search')).toBeInTheDocument();
    rerender(<CompactBreakdown items={items} footer="Updated today" />);
    expect(screen.getByText('Updated today')).toBeInTheDocument();
    rerender(<CompactBreakdown items={items} footer={null} />);
    expect(screen.queryByText(/Largest/)).toBeNull();
  });
  it('focusing a row highlights the part and shows its share', () => {
    render(<CompactBreakdown items={items} />);
    const row = screen.getAllByRole('listitem').find((r) => r.textContent?.includes('Referral'))!;
    fireEvent.focus(row);
    expect(row).toHaveAttribute('data-active');
    expect(screen.getByText(/Referral · 16%/)).toBeInTheDocument();
    fireEvent.blur(row);
    expect(row).not.toHaveAttribute('data-active');
  });
  it('switches periods with the arrow keys and reports them', async () => {
    const onChange = vi.fn();
    render(<CompactBreakdown items={items} periods={periods} defaultPeriod="30d" onPeriodChange={onChange} />);
    expect(screen.getByRole('radiogroup', { name: 'Period' })).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole('radio', { name: '30d' }));
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('90d');
  });
  it('keeps one bar segment per part ever seen so parts keep their place', () => {
    const { rerender, container } = render(<CompactBreakdown items={items} />);
    const first = container.querySelectorAll('svg rect').length;
    rerender(<CompactBreakdown items={[items[2]!, items[0]!]} />);
    expect(container.querySelectorAll('svg rect')).toHaveLength(first);
  });
  it('forwards className and ref', () => {
    let el: HTMLElement | null = null;
    render(<CompactBreakdown items={items} className="x" ref={(n) => void (el = n)} />);
    expect(el).toHaveClass('x');
  });
  it('has no axe violations', async () => {
    const { container } = render(<CompactBreakdown items={items} periods={periods} delta={-3} />);
    await expectNoA11yViolations(container);
  });
});
