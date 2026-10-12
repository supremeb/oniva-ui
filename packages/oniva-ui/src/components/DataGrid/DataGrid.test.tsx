import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataGrid, parseCell, summarize, type DataGridColumn, type DataGridRow } from './DataGrid';
import { expectNoA11yViolations } from '../../internal/test-a11y';

const columns: DataGridColumn[] = [
  { id: 'name', header: 'Name', summary: 'count' },
  { id: 'seats', header: 'Seats', type: 'number', editable: true, summary: 'sum' },
];
const rows: DataGridRow[] = Array.from({ length: 2000 }, (_, i) => ({ id: `r${i}`, name: `Acct ${i}`, seats: i }));

describe('DataGrid', () => {
  it('summarizes and parses', () => {
    expect(summarize(rows.slice(0, 4), columns[1]!)).toBe(6);
    expect(parseCell('$1,200', 'currency')).toBe(1200);
    expect(parseCell('abc', 'number')).toBeNull();
  });

  it('windows rows and exposes grid semantics', () => {
    render(<DataGrid aria-label="Accounts" columns={columns} rows={rows} className="x" />);
    const grid = screen.getByRole('grid', { name: 'Accounts' });
    expect(grid).toHaveClass('x');
    expect(grid).toHaveAttribute('aria-rowcount', '2002');
    expect(screen.getAllByRole('row').length).toBeLessThan(60);
  });

  it('navigates by keyboard and edits inline', async () => {
    const onChange = vi.fn();
    render(<DataGrid aria-label="Accounts" columns={columns} rows={rows} onCellChange={onChange} />);
    const first = screen.getByText('Acct 0').closest('[role=gridcell]') as HTMLElement;
    first.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowDown}{Enter}');
    const input = screen.getByLabelText('Edit Seats');
    await userEvent.clear(input);
    await userEvent.type(input, '99{Enter}');
    expect(onChange).toHaveBeenCalledWith('r1', 'seats', 99);
  });

  it('Escape cancels an edit', async () => {
    const onChange = vi.fn();
    render(<DataGrid aria-label="Accounts" columns={columns} rows={rows} onCellChange={onChange} />);
    const cell = screen.getByText('0', { selector: '[role=gridcell] span' }).closest('[role=gridcell]') as HTMLElement;
    fireEvent.doubleClick(cell);
    const input = screen.getByLabelText('Edit Seats');
    await userEvent.type(input, '7{Escape}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<DataGrid aria-label="Accounts" columns={columns} rows={rows} />);
    await expectNoA11yViolations(container);
  });
});
