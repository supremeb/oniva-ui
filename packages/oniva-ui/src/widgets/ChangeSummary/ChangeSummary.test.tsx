import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { ChangeSummary } from './ChangeSummary';

const changes = [
  { label: 'Active users', change: 'Up 6.1% to 18.2K', tone: 'good' as const },
  { label: 'Churn', change: 'Down to 2.1% from 2.6%', tone: 'good' as const, direction: 'down' as const },
  { label: 'Support tickets', change: 'Up 14% to 312', tone: 'bad' as const, direction: 'up' as const },
  { label: 'NPS', change: 'Unchanged at 41' },
];

describe('ChangeSummary', () => {
  it('renders a section named by the title with a description list', () => {
    render(<ChangeSummary changes={changes} period="This week" />);
    const section = screen.getByRole('region', { name: "What's changed" });
    expect(within(section).getByText('This week')).toBeInTheDocument();
    expect(within(section).getAllByRole('term')).toHaveLength(4);
    expect(within(section).getAllByRole('definition')).toHaveLength(4);
  });
  it('pairs each metric with its change text and keeps arrows decorative', () => {
    const { container } = render(<ChangeSummary changes={changes} />);
    const term = screen.getByRole('term', { name: 'Churn' });
    expect(term.nextElementSibling).toHaveTextContent('Down to 2.1% from 2.6%');
    expect(container.querySelectorAll('dd > [aria-hidden="true"]')).toHaveLength(4);
  });
  it('uses a custom title and omits the list when empty', () => {
    render(<ChangeSummary changes={[]} title="Weekly recap" />);
    expect(screen.getByRole('region', { name: 'Weekly recap' })).toBeInTheDocument();
    expect(screen.queryByRole('term')).toBeNull();
  });
  it('treats unknown tones as neutral and staggers rows with a capped index', () => {
    const many = Array.from({ length: 15 }, (_, i) => ({ label: `M${i}`, change: 'Flat' }));
    const { container } = render(<ChangeSummary changes={many} />);
    const rows = container.querySelectorAll<HTMLElement>('dl > div');
    expect(rows[0]!.style.getPropertyValue('--oniva-i')).toBe('0');
    expect(rows[14]!.style.getPropertyValue('--oniva-i')).toBe('12');
  });
  it('forwards className and ref', () => {
    let el: HTMLElement | null = null;
    render(<ChangeSummary changes={changes} className="x" ref={(n) => void (el = n)} />);
    expect(el).toHaveClass('x');
  });
  it('has no axe violations', async () => {
    const { container } = render(<ChangeSummary changes={changes} period="This week" />);
    await expectNoA11yViolations(container);
  });
});
