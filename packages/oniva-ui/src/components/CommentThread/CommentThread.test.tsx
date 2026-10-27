import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CommentThread, type ThreadAuthor, type ThreadMessage } from './CommentThread';

const me: ThreadAuthor = { name: 'Mara Lindqvist' };
const atlas: ThreadAuthor = { name: 'Atlas', assistant: true };
const messages: ThreadMessage[] = [
  { id: '1', author: me, createdAt: Date.now() - 3600_000, text: '@Atlas can you round the totals?' },
  {
    id: '2',
    author: atlas,
    createdAt: Date.now() - 3000_000,
    text: 'Rounded all totals to whole dollars.',
    status: { label: 'Edited 14 cells', details: 'Column D, rows 2 to 15.' },
  },
];

describe('CommentThread', () => {
  it('renders messages with real time elements and a polite live region', () => {
    const { container } = render(<CommentThread messages={messages} currentUser={me} assistant={atlas} />);
    expect(screen.getByText('Rounded all totals to whole dollars.')).toBeInTheDocument();
    expect(container.querySelectorAll('time')).toHaveLength(2);
    expect(screen.getByRole('log', { name: 'Comment messages' })).toHaveAttribute('tabindex', '0');
  });

  it('folds status details open with aria-expanded', () => {
    render(<CommentThread messages={messages} currentUser={me} />);
    const btn = screen.getByRole('button', { name: /Edited 14 cells/ });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('posts a reply on Enter (form submit) and shows the assistant answer after thinking', async () => {
    let resolve!: (m: ThreadMessage) => void;
    const onReply = vi.fn(() => new Promise<ThreadMessage>((r) => (resolve = r)));
    render(<CommentThread messages={messages} currentUser={me} assistant={atlas} onReply={onReply} />);
    const input = screen.getByRole('textbox', { name: 'Reply' });
    fireEvent.change(input, { target: { value: '@Atlas thanks, now sort it' } });
    fireEvent.submit(input.closest('form')!);
    expect(onReply).toHaveBeenCalledWith('@Atlas thanks, now sort it');
    expect(screen.getAllByText('@Atlas')).toHaveLength(2);
    expect(await screen.findByRole('article', { name: 'Atlas is thinking' })).toBeInTheDocument();
    resolve({ id: '9', author: atlas, createdAt: Date.now(), text: 'Sorted by revenue.' });
    expect(await screen.findByText('Sorted by revenue.')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('article', { name: 'Atlas is thinking' })).toBeNull());
  });

  it('shows a close button only with onClose; forwards ref/className', () => {
    const onClose = vi.fn();
    const ref = createRef<HTMLElement>();
    render(<CommentThread messages={messages} currentUser={me} onClose={onClose} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
    fireEvent.click(screen.getByRole('button', { name: 'Close comment' }));
    expect(onClose).toHaveBeenCalled();
  });
});
