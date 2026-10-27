import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { KpiChart } from './KpiChart';

const labels = ['Mar 3', 'Mar 4', 'Mar 5', 'Mar 6'];
const series = [
  { label: 'Organic', values: [4600, 4900, 5200, 5000] },
  { label: 'Paid ads', values: [3100, 3400, 3200, 3900] },
];
const props = { title: 'Revenue', value: '$96.4k', delta: 7900, labels, series, format: (n: number) => `$${(n / 1000).toFixed(1)}k` };

describe('KpiChart', () => {
  it('renders the headline, delta and a chart group named by the series', () => {
    render(<KpiChart {...props} footer="Top channels" />);
    expect(screen.getByText('$96.4k')).toBeInTheDocument();
    expect(screen.getByText('Top channels')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /Revenue: Organic, Paid ads over Mar 3 to Mar 6/ })).toBeInTheDocument();
    expect(screen.getByText(/\+\$7\.9k/)).toBeInTheDocument();
  });
  it('exposes every point as a labelled data point listing all series', () => {
    render(<KpiChart {...props} />);
    expect(screen.getByLabelText('Mar 5: Organic $5.2k, Paid ads $3.2k')).toBeInTheDocument();
  });
  it('shows a tooltip with all series on focus and announces it politely', () => {
    render(<KpiChart {...props} tooltipLabels={['Mon 3 Mar', 'Tue 4 Mar', 'Wed 5 Mar', 'Thu 6 Mar']} />);
    const pt = screen.getByLabelText('Wed 5 Mar: Organic $5.2k, Paid ads $3.2k');
    fireEvent.focus(pt);
    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveTextContent('Wed 5 Mar');
    expect(tip).toHaveTextContent('Organic');
    expect(tip).toHaveTextContent('Paid ads');
    expect(screen.getByRole('status')).toHaveTextContent('Wed 5 Mar: Organic $5.2k, Paid ads $3.2k');
  });
  it('Escape closes the tooltip and the live message', () => {
    render(<KpiChart {...props} />);
    const pt = screen.getByLabelText(/^Mar 4:/);
    fireEvent.focus(pt);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.keyDown(pt, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('');
  });
  it('moves focus between points with the arrow keys', () => {
    render(<KpiChart {...props} />);
    const first = screen.getByLabelText(/^Mar 3:/);
    first.focus();
    fireEvent.keyDown(screen.getByRole('group', { name: /Revenue/ }), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByLabelText(/^Mar 4:/));
  });
  it('forwards className and ref', () => {
    let el: HTMLElement | null = null;
    render(<KpiChart {...props} className="x" ref={(n) => void (el = n)} />);
    expect(el).toHaveClass('x');
  });
  it('has no axe violations', async () => {
    const { container } = render(<KpiChart {...props} footer="Top channels" />);
    await expectNoA11yViolations(container);
  });
});
