import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Composer } from './Composer';

const models = [
  { id: 'nova-pro', name: 'Nova Pro' },
  { id: 'atlas-2', name: 'Atlas 2' },
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
    render(<Composer models={models} model="nova-pro" onAttach={onAttach} />);
    expect(screen.getByRole('button', { name: 'Model: Nova Pro' })).toBeInTheDocument();
    const f = new File(['a'], 'q3.csv', { type: 'text/csv' });
    fireEvent.change(screen.getByTestId('composer-file-input'), { target: { files: [f] } });
    expect(onAttach).toHaveBeenCalledWith([f]);
  });

  it('simulated dictation types into the field and toggles the mic', async () => {
    vi.useFakeTimers();
    render(<Composer showMic dictation="Two words" />);
    fireEvent.click(screen.getByRole('button', { name: 'Start dictation' }));
    expect(screen.getByRole('button', { name: 'Stop dictation' })).toHaveAttribute('aria-pressed', 'true');
    await act(async () => void vi.advanceTimersByTime(400));
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('Two words');
    expect(screen.getByRole('button', { name: 'Start dictation' })).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('shows the send hint for typed text but not while disabled', () => {
    const { unmount } = render(<Composer defaultValue="Draft the close note" />);
    expect(screen.getByText('send')).toBeInTheDocument();
    unmount();
    render(<Composer defaultValue="Draft the close note" isDisabled />);
    expect(screen.queryByText('send')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeDisabled();
  });

  it('sends with only an attachment and keeps the file list in its own scroll region', () => {
    const onSubmit = vi.fn();
    render(<Composer onSubmit={onSubmit} attachments={[{ id: 'a', name: 'q3.csv', size: 48_200 }]} />);
    expect(screen.getByText('q3.csv')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onSubmit).toHaveBeenCalledWith('');
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Composer ref={ref} className="extra" />);
    expect(ref.current).toHaveClass('extra');
  });
});
