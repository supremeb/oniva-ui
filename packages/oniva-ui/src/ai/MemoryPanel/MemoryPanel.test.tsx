import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryPanel } from './MemoryPanel';

const memories = [{ id: 'm1', text: 'Prefers weekly summaries on Fridays', category: 'Preference', source: 'Chat · Oct 3' }];

describe('MemoryPanel', () => {
  it('edits and forgets', async () => {
    const onEdit = vi.fn();
    const onForget = vi.fn();
    render(<MemoryPanel memories={memories} onEdit={onEdit} onForget={onForget} />);
    fireEvent.click(screen.getByRole('button', { name: /Edit memory: Prefers/ }));
    const input = screen.getByRole('textbox', { name: 'Edit memory' });
    fireEvent.change(input, { target: { value: 'Prefers Monday summaries' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onEdit).toHaveBeenCalledWith('m1', 'Prefers Monday summaries');
    fireEvent.click(screen.getByRole('button', { name: /Forget memory/ }));
    await waitFor(() => expect(onForget).toHaveBeenCalledWith('m1'));
  });
});
