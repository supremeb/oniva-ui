import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConversationList } from './ConversationList';

const threads = [
  { id: 'a', title: 'Q3 board deck review', pinned: true, time: '2h' },
  { id: 'b', title: 'Refund policy edge cases', time: '1d' },
];

describe('ConversationList', () => {
  it('groups, searches, pins and renames', () => {
    const onPin = vi.fn();
    const onRename = vi.fn();
    render(<ConversationList threads={threads} activeId="a" onPin={onPin} onRename={onRename} />);
    expect(screen.getByRole('region', { name: 'Pinned' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Pin Refund policy edge cases' }));
    expect(onPin).toHaveBeenCalledWith('b', true);
    fireEvent.click(screen.getByRole('button', { name: 'Rename Refund policy edge cases' }));
    const input = screen.getByRole('textbox', { name: 'Rename conversation' });
    fireEvent.change(input, { target: { value: 'Refund edge cases' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRename).toHaveBeenCalledWith('b', 'Refund edge cases');
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search conversations' }), { target: { value: 'zzz' } });
    expect(screen.getByText('No conversations found.')).toBeInTheDocument();
  });
});
