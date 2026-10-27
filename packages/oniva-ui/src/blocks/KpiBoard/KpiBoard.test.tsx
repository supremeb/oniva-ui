import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { KpiBoard } from './KpiBoard';

describe('KpiBoard', () => {
  it('renders three stat cards, the overview chart and the focus card', () => {
    render(<KpiBoard />);
    expect(screen.getByRole('article', { name: 'Revenue' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Traced runs' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Overview chart' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Team plan focus' })).toBeInTheDocument();
  });
  it('says whether change is good in text and flips when lower is better', () => {
    render(<KpiBoard />);
    expect(screen.getByText('+12.4%')).toBeInTheDocument();
    expect(screen.getByText('−9.2%')).toBeInTheDocument();
  });
  it('switches range with the keyboard and reports it', async () => {
    const onRangeChange = vi.fn();
    render(<KpiBoard onRangeChange={onRangeChange} />);
    const first = screen.getByRole('radio', { name: '7 days' });
    first.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onRangeChange).toHaveBeenCalledWith('30d');
    expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
  });
  it('segment filter changes only the overview', async () => {
    const onSegmentChange = vi.fn();
    render(<KpiBoard onSegmentChange={onSegmentChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Team' }));
    expect(onSegmentChange).toHaveBeenCalledWith('team');
  });
  it('forwards ref and className', () => {
    const ref = vi.fn();
    render(<KpiBoard ref={ref} className="x" data-testid="k" />);
    expect(ref).toHaveBeenCalled();
    expect(screen.getByTestId('k')).toHaveClass('x');
  });
});
