import { createRef } from 'react';
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

describe('MemoryPanel (loop 7)', () => {
  const many = [
    { id: 'a', text: 'Prefers TypeScript', category: 'Preferences' },
    { id: 'b', text: 'Product designer', category: 'Work' },
  ];
  it('filters by category with the radio chips', () => {
    render(<MemoryPanel memories={many} />);
    fireEvent.click(screen.getByRole('radio', { name: /^Work/ }));
    // filtered rows fold closed (inert) instead of unmounting
    expect(screen.getByText('Prefers TypeScript').closest('[inert]')).not.toBeNull();
    expect(screen.getByText('Product designer')).toBeInTheDocument();
  });
  it('pauses a memory and the master switch flips', () => {
    const onPause = vi.fn();
    const onEnabledChange = vi.fn();
    render(<MemoryPanel memories={many} onPause={onPause} onEnabledChange={onEnabledChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause memory: Prefers TypeScript' }));
    expect(onPause).toHaveBeenCalledWith('a', true);
    expect(screen.getByRole('button', { name: 'Resume memory: Prefers TypeScript' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('switch', { name: 'Use memory' }));
    expect(onEnabledChange).toHaveBeenCalledWith(false);
  });
  it('offers Undo after forgetting', async () => {
    const onRestore = vi.fn();
    render(<MemoryPanel memories={many} onForget={() => {}} onRestore={onRestore} />);
    fireEvent.click(screen.getByRole('button', { name: 'Forget memory: Prefers TypeScript' }));
    fireEvent.click(await screen.findByRole('button', { name: /Undo/ }));
    expect(onRestore).toHaveBeenCalledWith(many[0], 0);
  });
  it('adds a memory with Enter and forwards ref/className', () => {
    const onAdd = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<MemoryPanel ref={ref} className="extra" memories={many} onAdd={onAdd} />);
    expect(ref.current).toHaveClass('extra');
    fireEvent.click(screen.getByRole('button', { name: /New memory/ }));
    const box = screen.getByRole('textbox', { name: 'New memory' });
    fireEvent.change(box, { target: { value: 'Likes dark mode' } });
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onAdd.mock.calls[0]![0]).toMatchObject({ text: 'Likes dark mode', source: 'You added' });
  });
});
