import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MostActiveDays } from './MostActiveDays';

const data = { '2026-01-01': 4000, '2026-01-02': 12000, '2026-02-03': 8000 };

describe('MostActiveDays', () => {
  it('renders every month of the year and the month total', () => {
    render(<MostActiveDays year={2026} data={data} />);
    expect(screen.getByText('16,000')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'January 2026' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'December 2026' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'January 2, 12,000 steps' })).toBeInTheDocument();
  });

  it('switches month and reports pressed day', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MostActiveDays year={2026} data={data} onSelectDay={onSelect} className="extra" />);
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('February')).toBeInTheDocument();
    expect(screen.getByText('8,000')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'February 3, 8,000 steps' }));
    expect(onSelect).toHaveBeenCalledWith('2026-02-03', 8000);
  });
});
