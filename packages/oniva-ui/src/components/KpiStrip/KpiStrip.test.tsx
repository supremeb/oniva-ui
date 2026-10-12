import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { KpiStrip } from './KpiStrip';
import { expectNoA11yViolations } from '../../internal/test-a11y';

const items = [
  { id: 'a', label: 'Revenue', value: 1200, delta: 0.1, spark: [1, 2, 3] },
  { id: 'b', label: 'Churn', value: 3, delta: -0.2, invertDelta: true },
];

describe('KpiStrip', () => {
  it('renders metrics and drilldown buttons', async () => {
    const fn = vi.fn();
    render(<KpiStrip items={items} onDrilldown={fn} className="x" data-testid="k" />);
    expect(screen.getByTestId('k')).toHaveClass('x');
    await userEvent.click(screen.getByRole('button', { name: /Revenue/ }));
    expect(fn).toHaveBeenCalledWith('a');
  });
  it('has no a11y violations', async () => {
    const { container } = render(<KpiStrip items={items} onDrilldown={() => {}} />);
    await expectNoA11yViolations(container);
  });
});
