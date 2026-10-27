import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TaskBoard } from './TaskBoard';

describe('TaskBoard', () => {
  it('renders columns with counts and cards', () => {
    render(<TaskBoard />);
    expect(screen.getByRole('group', { name: 'Backlog, 2 tasks' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ONV-102/ })).toBeInTheDocument();
  });
  it('opens the detail panel with Enter and closes it with Escape returning focus', async () => {
    render(<TaskBoard />);
    const card = screen.getByRole('button', { name: /ONV-103/ });
    card.focus();
    await userEvent.keyboard('{Enter}');
    const panel = screen.getByRole('complementary', { name: 'Task ONV-103' });
    expect(panel).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('complementary')).toBeNull();
    expect(card).toHaveFocus();
  });
  it('changes status through toggle buttons without dragging and reports onChange', async () => {
    const onChange = vi.fn();
    render(<TaskBoard onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /ONV-101/ }));
    const panel = screen.getByRole('complementary');
    await userEvent.click(within(panel).getByRole('button', { name: 'Done' }));
    expect(onChange).toHaveBeenCalled();
    const next = onChange.mock.calls.at(-1)![0];
    expect(next.find((t: { id: string }) => t.id === 'ONV-101').status).toBe('done');
    expect(screen.getByRole('status')).toHaveTextContent('moved to Done');
  });
  it('filters by search and label', async () => {
    render(<TaskBoard />);
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search tasks' }), 'audit');
    expect(screen.getByRole('button', { name: /ONV-104/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /ONV-101/ })).toBeNull();
  });
  it('quick-adds a task', async () => {
    render(<TaskBoard />);
    await userEvent.click(screen.getByRole('button', { name: 'Add task to Backlog' }));
    await userEvent.type(screen.getByRole('textbox', { name: /New task title/ }), 'Write docs{Enter}');
    expect(screen.getByRole('button', { name: /Write docs/ })).toBeInTheDocument();
  });
  it('drag and drop moves a card', () => {
    const onChange = vi.fn();
    render(<TaskBoard onChange={onChange} />);
    const card = screen.getByRole('button', { name: /ONV-101/ });
    const col = screen.getByRole('group', { name: /^Done/ });
    fireEvent.dragStart(card, { dataTransfer: { effectAllowed: '' } });
    fireEvent.dragOver(col, { dataTransfer: {} });
    fireEvent.drop(col, { dataTransfer: {} });
    expect(onChange.mock.calls.at(-1)![0].find((t: { id: string }) => t.id === 'ONV-101').status).toBe('done');
  });
  it('forwards ref and className', () => {
    const ref = vi.fn();
    render(<TaskBoard ref={ref} className="x" data-testid="b" />);
    expect(ref).toHaveBeenCalled();
    expect(screen.getByTestId('b')).toHaveClass('x');
  });
});
