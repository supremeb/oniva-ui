import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { BreakdownChart } from './BreakdownChart';
import { sprintDimensions, sprintMeasures, sprintTasks } from './BreakdownChart.data';

const small = [
  { status: 'Todo', priority: 'High', points: 3 },
  { status: 'Todo', priority: 'Low', points: 2 },
  { status: 'Done', priority: 'High', points: 5 },
];
const dims = [
  { key: 'status', label: 'Status', values: ['Todo', 'Done'] },
  { key: 'priority', label: 'Priority', values: ['High', 'Low'] },
];
const measures = [
  { key: 'count', label: 'Task count', unit: 'tasks' },
  { key: 'points', label: 'Story points', unit: 'points', field: 'points' },
];

describe('BreakdownChart', () => {
  it('renders a chart group and a table repeating every number', () => {
    render(<BreakdownChart records={small} dimensions={dims} measures={measures} title="Sprint 24" />);
    expect(screen.getByRole('group', { name: /Stacked bar chart of task count by status/i })).toBeInTheDocument();
    const table = screen.getByRole('table');
    const todo = within(table).getByRole('row', { name: /Todo/ });
    expect(within(todo).getAllByRole('cell').map((c) => c.textContent)).toEqual(['1', '1', '2']);
  });
  it('exposes each bar as a labelled data point with totals', () => {
    render(<BreakdownChart records={small} dimensions={dims} measures={measures} />);
    expect(screen.getByLabelText('Todo: 2 tasks')).toBeInTheDocument();
    expect(screen.getByLabelText('Done: 1 tasks')).toBeInTheDocument();
  });
  it('hovering a bar highlights its table row', () => {
    render(<BreakdownChart records={small} dimensions={dims} measures={measures} />);
    const row = within(screen.getByRole('table')).getByRole('row', { name: /Done/ });
    expect(row).not.toHaveAttribute('data-active');
    fireEvent.pointerEnter(screen.getByLabelText('Done: 1 tasks'));
    expect(row).toHaveAttribute('data-active');
    fireEvent.pointerLeave(screen.getByLabelText('Done: 1 tasks'));
    expect(row).not.toHaveAttribute('data-active');
  });
  it('legend entries are toggle buttons that remove a segment', () => {
    render(<BreakdownChart records={small} dimensions={dims} measures={measures} />);
    const btn = screen.getByRole('button', { name: 'High' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: 'High' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('Todo: 1 tasks')).toBeInTheDocument();
  });
  it('starts from defaultMeasure and sums the measure field', () => {
    render(<BreakdownChart records={small} dimensions={dims} measures={measures} defaultMeasure="points" />);
    expect(screen.getByLabelText('Todo: 5 points')).toBeInTheDocument();
  });
  it('forwards className and ref', () => {
    let el: HTMLElement | null = null;
    render(<BreakdownChart records={small} dimensions={dims} measures={measures} className="x" ref={(n) => void (el = n)} />);
    expect(el).toHaveClass('x');
  });
  it('has no axe violations', async () => {
    const { container } = render(<BreakdownChart records={sprintTasks} dimensions={sprintDimensions} measures={sprintMeasures} />);
    await expectNoA11yViolations(container);
  });
});
