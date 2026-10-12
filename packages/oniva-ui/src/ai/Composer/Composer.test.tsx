import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Composer } from './Composer';

const models = [
  { id: 'sonnet-5', name: 'Sonnet 5' },
  { id: 'opus-5', name: 'Opus 5' },
];

describe('Composer', () => {
  it('submits on Enter, not Shift+Enter, and clears', () => {
    const onSubmit = vi.fn();
    render(<Composer onSubmit={onSubmit} />);
    const box = screen.getByRole('textbox', { name: 'Message' });
    fireEvent.change(box, { target: { value: 'Analyze Q3 revenue' } });
    fireEvent.keyDown(box, { key: 'Enter', shiftKey: true });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledWith('Analyze Q3 revenue');
    expect(box).toHaveValue('');
  });

  it('disables send when empty and shows Stop while streaming', () => {
    const onStop = vi.fn();
    const { rerender } = render(<Composer />);
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
    rerender(<Composer isStreaming onStop={onStop} />);
    fireEvent.click(screen.getByRole('button', { name: 'Stop generating' }));
    expect(onStop).toHaveBeenCalled();
  });

  it('shows the selected model and passes attached files', () => {
    const onAttach = vi.fn();
    render(<Composer models={models} model="sonnet-5" onAttach={onAttach} />);
    expect(screen.getByRole('button', { name: 'Model: Sonnet 5' })).toBeInTheDocument();
    const f = new File(['a'], 'q3.csv', { type: 'text/csv' });
    fireEvent.change(screen.getByTestId('composer-file-input'), { target: { files: [f] } });
    expect(onAttach).toHaveBeenCalledWith([f]);
  });
});
