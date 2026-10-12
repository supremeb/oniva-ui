import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Kanban, moveCards, type KanbanColumnData } from './Kanban';
import { expectNoA11yViolations } from '../../internal/test-a11y';

const cols: KanbanColumnData[] = [
  { id: 'a', title: 'Todo', wipLimit: 1, cards: [{ id: '1', title: 'Write docs', priority: 'high', assignees: ['Priya Nair'], tags: ['Docs'] }, { id: '2', title: 'Ship v2' }] },
  { id: 'b', title: 'Done', cards: [{ id: '3', title: 'Set up CI' }] },
];

describe('Kanban', () => {
  it('moveCards moves across and within columns', () => {
    const across = moveCards(cols, ['1'], 'b', '3', 'after');
    expect(across[0]!.cards.map((c) => c.id)).toEqual(['2']);
    expect(across[1]!.cards.map((c) => c.id)).toEqual(['3', '1']);
    const within = moveCards(cols, ['2'], 'a', '1', 'before');
    expect(within[0]!.cards.map((c) => c.id)).toEqual(['2', '1']);
  });

  it('renders counts and warns over the WIP limit', () => {
    render(<Kanban columns={cols} data-testid="k" className="x" />);
    expect(screen.getByTestId('k')).toHaveClass('x');
    expect(screen.getByText(/Over work-in-progress limit/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Todo' })).toBeInTheDocument();
  });

  it('adds a card', async () => {
    const onAdd = vi.fn();
    render(<Kanban columns={cols} onAddCard={onAdd} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add card to Done' }));
    await userEvent.type(screen.getByLabelText('New card title in Done'), 'Deploy{enter}');
    expect(onAdd).toHaveBeenCalledWith('b', 'Deploy');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Kanban columns={cols} />);
    await expectNoA11yViolations(container);
  });
});
