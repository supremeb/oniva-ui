import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CommentsPanel, type PanelComment } from './CommentsPanel';

const me = { name: 'Mara Lindqvist' };
const now = Date.now();
const comments = (): PanelComment[] => [
  { id: '1', author: { name: 'Omar Haddad' }, createdAt: now - 7200_000, text: 'Can we tighten the headline?' },
  { id: '2', author: me, createdAt: now - 3600_000, text: '/edit shorten headline to 6 words' },
  { id: '3', author: { name: 'Lena Hart' }, createdAt: now - 600_000, text: 'Looks good.', resolved: true },
];

describe('CommentsPanel', () => {
  it('lists comments with tabs showing counts and times as <time>', () => {
    const { container } = render(<CommentsPanel comments={comments()} currentUser={me} />);
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.getByRole('tab', { name: /Open/ })).toHaveTextContent('2');
    expect(container.querySelectorAll('time')).toHaveLength(3);
  });

  it('filters with tabs', async () => {
    render(<CommentsPanel comments={comments()} currentUser={me} />);
    fireEvent.mouseDown(screen.getByRole('tab', { name: /Resolved/ }));
    fireEvent.click(screen.getByRole('tab', { name: /Resolved/ }));
    await waitFor(() => expect(screen.queryByText('Can we tighten the headline?')).toBeNull());
    expect(screen.getByText('Looks good.')).toBeInTheDocument();
  });

  it('resolves a comment with the toggle button', () => {
    const onResolve = vi.fn();
    render(<CommentsPanel comments={comments()} currentUser={me} onResolve={onResolve} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Resolve comment' })[0]!);
    expect(onResolve).toHaveBeenCalledTimes(1);
  });

  it('runs /edit comments until the promise settles', async () => {
    let done!: () => void;
    const onRunEdit = vi.fn(() => new Promise<void>((r) => (done = r)));
    render(<CommentsPanel comments={comments()} currentUser={me} onRunEdit={onRunEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /Run edit/ }));
    expect(onRunEdit).toHaveBeenCalled();
    expect(await screen.findByText('Running…')).toBeInTheDocument();
    done();
    expect(await screen.findByRole('status')).toHaveTextContent('Applied');
  });

  it('adds a comment with Enter', () => {
    const onAdd = vi.fn();
    render(<CommentsPanel comments={comments()} currentUser={me} onAdd={onAdd} />);
    const box = screen.getByRole('textbox', { name: 'Add a comment' });
    fireEvent.change(box, { target: { value: 'Ship it' } });
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ text: 'Ship it' }));
    expect(screen.getByText('Ship it')).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLElement>();
    render(<CommentsPanel comments={comments()} currentUser={me} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
