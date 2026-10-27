import { fireEvent, render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import demo from './DataSheet.demo';
import { DataSheet } from './DataSheet';
import type { SheetColumn, SheetRow } from './types';

const columns: SheetColumn[] = [
  { key: 'tool', label: 'Tool', type: 'title' },
  { key: 'category', label: 'Category', type: 'tag' },
  { key: 'qty', label: 'Qty', type: 'number' },
];
const rows: SheetRow[] = [
  { id: 'a', tool: 'Sketchpad', category: 'Design', qty: 3 },
  { id: 'b', tool: 'Trackline', category: 'Hosting', qty: 1 },
  { id: 'c', tool: 'Reelbox', category: 'Video', qty: 2 },
];

function setup(props: Partial<React.ComponentProps<typeof DataSheet>> = {}) {
  render(<DataSheet title="Stack" columns={columns} rows={rows} {...props} />);
  const grid = screen.getByRole('grid', { name: 'Stack' });
  const status = screen.getByRole('status');
  const cell = (r: number, c: number) => within(grid).getAllByRole('row')[r + 1]!.querySelectorAll('[role="gridcell"]')[c + 1] as HTMLElement;
  return { grid, status, cell };
}

describe('DataSheet', () => {
  it('has meta slug', () => expect(demo.meta.slug).toBe('data-sheet'));

  it('renders grid semantics, cells and forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DataSheet ref={ref} title="Stack" columns={columns} rows={rows} className="x" />);
    expect(ref.current?.className).toContain('x');
    expect(screen.getAllByRole('columnheader')).toHaveLength(4);
    expect(screen.getByText('Sketchpad')).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: 'Select Trackline' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Undo' }).hasAttribute('disabled')).toBe(true);
  });

  it('shows the active cell address and moves with arrows', () => {
    const { grid, status, cell } = setup();
    expect(status.textContent).toBe('A1');
    fireEvent.keyDown(grid, { key: 'ArrowDown' });
    fireEvent.keyDown(grid, { key: 'ArrowRight' });
    expect(status.textContent).toBe('B2');
    expect(cell(1, 1).hasAttribute('data-active')).toBe(true);
    expect(grid.getAttribute('aria-activedescendant')).toBe(cell(1, 1).id);
    fireEvent.keyDown(grid, { key: 'ArrowDown', metaKey: true });
    expect(status.textContent).toBe('B3');
    fireEvent.keyDown(grid, { key: 'ArrowLeft', ctrlKey: true });
    expect(status.textContent).toBe('A3');
    fireEvent.keyDown(grid, { key: 'End' });
    expect(status.textContent).toBe('C3');
    fireEvent.keyDown(grid, { key: 'Home' });
    expect(status.textContent).toBe('A3');
  });

  it('tabs through cells and wraps rows', () => {
    const { grid, status } = setup();
    fireEvent.keyDown(grid, { key: 'Tab' });
    fireEvent.keyDown(grid, { key: 'Tab' });
    fireEvent.keyDown(grid, { key: 'Tab' });
    expect(status.textContent).toBe('A2');
    fireEvent.keyDown(grid, { key: 'Tab', shiftKey: true });
    expect(status.textContent).toBe('C1');
  });

  it('extends a range with shift+arrows, collapses on Esc', () => {
    const { grid, status, cell } = setup();
    fireEvent.keyDown(grid, { key: 'ArrowDown', shiftKey: true });
    fireEvent.keyDown(grid, { key: 'ArrowRight', shiftKey: true });
    expect(status.textContent).toBe('4 values');
    expect(cell(1, 1).getAttribute('aria-selected')).toBe('true');
    expect(cell(2, 1).getAttribute('aria-selected')).toBe('false');
    fireEvent.keyDown(grid, { key: 'Escape' });
    expect(status.textContent).toBe('B2');
    expect(cell(0, 0).getAttribute('aria-selected')).toBe('false');
  });

  it('selects all with mod+A', () => {
    const { grid, status } = setup();
    fireEvent.keyDown(grid, { key: 'a', metaKey: true });
    expect(status.textContent).toBe('9 values');
  });

  it('click, shift+click and drag select ranges', () => {
    const { status, cell } = setup();
    fireEvent.mouseDown(cell(1, 1));
    expect(status.textContent).toBe('B2');
    fireEvent.mouseDown(cell(2, 2), { shiftKey: true });
    expect(status.textContent).toBe('4 values');
    fireEvent.mouseDown(cell(0, 0));
    fireEvent.mouseEnter(cell(0, 1));
    fireEvent.mouseEnter(cell(1, 1));
    fireEvent.mouseUp(window);
    expect(status.textContent).toBe('4 values');
  });

  it('sorts asc, desc, none with aria-sort', () => {
    const { grid } = setup();
    const header = screen.getByRole('columnheader', { name: /Tool/ });
    const btn = within(header).getByRole('button');
    const order = () => within(grid).getAllByRole('row').slice(1).map((r) => r.querySelectorAll('[role="gridcell"]')[1]!.lastElementChild?.lastElementChild?.textContent);
    fireEvent.click(btn);
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    expect(order()).toEqual(['Reelbox', 'Sketchpad', 'Trackline']);
    fireEvent.click(btn);
    expect(header.getAttribute('aria-sort')).toBe('descending');
    expect(order()).toEqual(['Trackline', 'Sketchpad', 'Reelbox']);
    fireEvent.click(btn);
    expect(header.getAttribute('aria-sort')).toBe('none');
    expect(order()).toEqual(['Sketchpad', 'Trackline', 'Reelbox']);
  });

  it('keeps the active cell on its row after sorting', () => {
    const { status } = setup();
    const btn = within(screen.getByRole('columnheader', { name: /Tool/ })).getByRole('button');
    fireEvent.click(btn); // Sketchpad moves to row 2
    expect(status.textContent).toBe('A2');
  });

  it('select-all shows mixed state and reports ids', () => {
    const onSelectionChange = vi.fn();
    const { status } = setup({ onSelectionChange });
    const all = screen.getByRole('checkbox', { name: 'Select all rows' });
    expect(all.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select Sketchpad' }));
    expect(all.getAttribute('aria-checked')).toBe('mixed');
    expect(status.textContent).toBe('1 row selected');
    fireEvent.click(all);
    expect(all.getAttribute('aria-checked')).toBe('true');
    expect(status.textContent).toBe('3 rows selected');
    expect(onSelectionChange).toHaveBeenLastCalledWith(['a', 'b', 'c']);
    fireEvent.click(all);
    expect(all.getAttribute('aria-checked')).toBe('false');
  });

  describe('editing', () => {
    const live = () => document.querySelector('[data-live]')!.textContent;
    const onRows = () => vi.fn();
    const text = (el: HTMLElement) => el.textContent;

    it('types to replace, Enter saves and moves down', () => {
      const onRowsChange = onRows();
      const { grid, status, cell } = setup({ onRowsChange });
      fireEvent.keyDown(grid, { key: 'S' });
      const input = screen.getByRole('textbox', { name: 'Tool A1' }) as HTMLInputElement;
      expect(input.value).toBe('S');
      fireEvent.change(input, { target: { value: 'Sketch' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.queryByRole('textbox')).toBeNull();
      expect(text(cell(0, 0))).toContain('Sketch');
      expect(status.textContent).toBe('A2');
      expect(live()).toBe('Edited A1');
      expect(onRowsChange).toHaveBeenCalledTimes(1);
      expect(onRowsChange.mock.calls[0]![0][0].tool).toBe('Sketch');
    });

    it('Enter opens the editor with the current value; Tab saves right; Shift+Tab left; Esc cancels', () => {
      const { grid, status } = setup();
      fireEvent.keyDown(grid, { key: 'Enter' });
      let input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('Sketchpad');
      fireEvent.keyDown(input, { key: 'Tab' });
      expect(status.textContent).toBe('B1');
      fireEvent.keyDown(grid, { key: 'ArrowRight' });
      fireEvent.keyDown(grid, { key: 'F2' });
      input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.keyDown(input, { key: 'Tab', shiftKey: true });
      expect(status.textContent).toBe('B1');
      fireEvent.keyDown(grid, { key: 'ArrowLeft' });
      fireEvent.keyDown(grid, { key: 'F2' });
      input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Nope' } });
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(screen.queryByRole('textbox')).toBeNull();
      expect(screen.queryByText('Nope')).toBeNull();
      expect(screen.getByRole('button', { name: 'Undo' }).hasAttribute('disabled')).toBe(true);
    });

    it('double-click edits', () => {
      const { cell } = setup();
      fireEvent.doubleClick(cell(1, 0));
      expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Trackline');
    });

    it('rejects non-numeric input in number columns', () => {
      const { grid, cell } = setup();
      fireEvent.keyDown(grid, { key: 'End' });
      fireEvent.keyDown(grid, { key: 'Enter' });
      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'abc' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '1,200.5' } });
      expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBeNull();
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
      expect(screen.queryByRole('textbox')).toBeNull();
      expect(text(cell(0, 2))).toContain('1,200.5');
    });

    it('picks a tag from the picker, creating new tags when allowed', () => {
      const { grid, cell } = setup();
      fireEvent.keyDown(grid, { key: 'ArrowRight' });
      fireEvent.keyDown(grid, { key: 'Enter' });
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(
        expect.arrayContaining(['Design', 'Hosting', 'Video']),
      );
      const box = screen.getByRole('combobox');
      fireEvent.change(box, { target: { value: 'Host' } });
      expect(screen.getAllByRole('option')).toHaveLength(2); // Hosting + Create 'Host'
      fireEvent.keyDown(box, { key: 'ArrowDown' });
      fireEvent.keyDown(box, { key: 'Enter' });
      expect(screen.queryByRole('combobox')).toBeNull();
      expect(text(cell(0, 1))).toContain('Host');
      fireEvent.keyDown(grid, { key: 'Enter' });
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
      expect(screen.queryByRole('combobox')).toBeNull();
      expect(text(cell(1, 1))).toContain('Hosting');
    });

    it('limits tags to fixed options', () => {
      const fixed = columns.map((c) => (c.key === 'category' ? { ...c, options: ['Design', 'Video'] } : c));
      const { grid, cell } = setup({ columns: fixed });
      fireEvent.keyDown(grid, { key: 'ArrowRight' });
      fireEvent.keyDown(grid, { key: 'v' });
      expect(screen.getAllByRole('option')).toHaveLength(1);
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
      expect(text(cell(0, 1))).toContain('Video');
    });

    it('Delete clears the range as one history step, undo/redo restore it', () => {
      const { grid, cell } = setup();
      fireEvent.keyDown(grid, { key: 'ArrowDown', shiftKey: true });
      fireEvent.keyDown(grid, { key: 'ArrowRight', shiftKey: true });
      fireEvent.keyDown(grid, { key: 'Delete' });
      expect(text(cell(0, 0))).toBe('');
      expect(text(cell(1, 1))).toBe('');
      expect(live()).toBe('Cleared 4 cells');
      const undoBtn = screen.getByRole('button', { name: 'Undo' });
      fireEvent.click(undoBtn);
      expect(text(cell(0, 0))).toContain('Sketchpad');
      expect(text(cell(1, 1))).toContain('Hosting');
      expect(live()).toBe('Undid edit');
      expect(undoBtn.hasAttribute('disabled')).toBe(true);
      fireEvent.keyDown(grid, { key: 'z', metaKey: true, shiftKey: true });
      expect(text(cell(0, 0))).toBe('');
      expect(live()).toBe('Redid edit');
      fireEvent.keyDown(grid, { key: 'z', ctrlKey: true });
      expect(text(cell(0, 0))).toContain('Sketchpad');
      fireEvent.keyDown(grid, { key: 'y', ctrlKey: true });
      expect(text(cell(0, 0))).toBe('');
    });

    it('pastes TSV from the active cell, clipped and validated', () => {
      const onRowsChange = onRows();
      const { grid, cell } = setup({ onRowsChange });
      fireEvent.keyDown(grid, { key: 'ArrowDown' });
      fireEvent.paste(grid, {
        clipboardData: { getData: () => 'Alpha\tVideo\t7\nBeta\tx\tnope\nGamma\tDesign\t9\tExtra\nOverflow\tVideo\t1' },
      });
      expect(text(cell(1, 0))).toContain('Alpha');
      expect(text(cell(1, 2))).toContain('7');
      expect(text(cell(2, 0))).toContain('Beta');
      expect(text(cell(2, 2))).toContain('2'); // "nope" skipped
      expect(live()).toBe('Pasted 5 cells');
      expect(onRowsChange).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
      expect(text(cell(1, 0))).toContain('Trackline');
      expect(onRowsChange).toHaveBeenCalledTimes(2);
    });

    it('validates pasted tags against fixed options', () => {
      const fixed = columns.map((c) => (c.key === 'category' ? { ...c, options: ['Design', 'Video'] } : c));
      const { grid, cell } = setup({ columns: fixed });
      fireEvent.keyDown(grid, { key: 'ArrowRight' });
      fireEvent.paste(grid, { clipboardData: { getData: () => 'video\nSpace' } });
      expect(text(cell(0, 1))).toContain('Video');
      expect(text(cell(1, 1))).toContain('Hosting');
    });

    it('copy writes TSV and an html table; cut also clears', () => {
      const { grid, cell } = setup();
      fireEvent.keyDown(grid, { key: 'ArrowDown', shiftKey: true });
      fireEvent.keyDown(grid, { key: 'ArrowRight', shiftKey: true });
      const data: Record<string, string> = {};
      const clipboardData = { setData: (t: string, v: string) => (data[t] = v) };
      fireEvent.copy(grid, { clipboardData });
      expect(data['text/plain']).toBe('Sketchpad\tDesign\nTrackline\tHosting');
      expect(data['text/html']).toContain('<td>Trackline</td>');
      expect(text(cell(0, 0))).toContain('Sketchpad');
      fireEvent.cut(grid, { clipboardData });
      expect(text(cell(0, 0))).toBe('');
    });

    it('copies dates as displayed text', () => {
      const cols: SheetColumn[] = [{ key: 'd', label: 'Renews', type: 'date' }];
      render(<DataSheet title="Dates" columns={cols} rows={[{ id: 'x', d: '2026-10-26' }]} />);
      const grid = screen.getByRole('grid', { name: 'Dates' });
      const data: Record<string, string> = {};
      fireEvent.copy(grid, { clipboardData: { setData: (t: string, v: string) => (data[t] = v) } });
      expect(data['text/plain']).not.toBe('2026-10-26');
      expect(data['text/plain']).toMatch(/2026/);
    });

    it('adds a row, selects its first cell and starts editing', () => {
      const onRowsChange = onRows();
      const { grid, status } = setup({ onRowsChange });
      fireEvent.click(screen.getByRole('button', { name: 'Add row' }));
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('');
      expect(status.textContent).toBe('A4');
      expect(within(grid).getAllByRole('row')).toHaveLength(5);
      expect(onRowsChange.mock.calls[0]![0]).toHaveLength(4);
      fireEvent.change(input, { target: { value: 'New tool' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText('New tool')).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
      fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
      expect(within(grid).getAllByRole('row')).toHaveLength(4);
    });

    it('respects editable=false and column.editable=false', () => {
      const onRowsChange = onRows();
      const { grid, cell } = setup({ editable: false, onRowsChange });
      fireEvent.keyDown(grid, { key: 'Enter' });
      fireEvent.keyDown(grid, { key: 'x' });
      fireEvent.doubleClick(cell(0, 0));
      fireEvent.keyDown(grid, { key: 'Delete' });
      fireEvent.paste(grid, { clipboardData: { getData: () => 'Z' } });
      expect(screen.queryByRole('textbox')).toBeNull();
      expect(text(cell(0, 0))).toContain('Sketchpad');
      expect(screen.getByRole('button', { name: 'Add row' }).hasAttribute('disabled')).toBe(true);
      const data: Record<string, string> = {};
      fireEvent.copy(grid, { clipboardData: { setData: (t: string, v: string) => (data[t] = v) } });
      expect(data['text/plain']).toBe('Sketchpad');
      expect(onRowsChange).not.toHaveBeenCalled();
    });

    it('column.editable=false blocks edit, clear and paste for that column only', () => {
      const cols = columns.map((c) => (c.key === 'qty' ? { ...c, editable: false } : c));
      const { grid, cell } = setup({ columns: cols });
      fireEvent.keyDown(grid, { key: 'End' });
      fireEvent.keyDown(grid, { key: 'Enter' });
      expect(screen.queryByRole('textbox')).toBeNull();
      fireEvent.keyDown(grid, { key: 'Delete' });
      expect(text(cell(0, 2))).toContain('3');
      fireEvent.keyDown(grid, { key: 'Home' });
      fireEvent.paste(grid, { clipboardData: { getData: () => 'A\tVideo\t99' } });
      expect(text(cell(0, 0))).toContain('A');
      expect(text(cell(0, 2))).toContain('3');
    });
  });
});
