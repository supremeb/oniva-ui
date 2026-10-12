import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SpeechInput } from './SpeechInput';

describe('SpeechInput', () => {
  it('toggles recording in demo mode and reports the clip', async () => {
    const onRecorded = vi.fn();
    render(<SpeechInput demo onRecorded={onRecorded} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Start recording' }));
    expect(await screen.findByRole('timer')).toHaveTextContent('0:00');
    fireEvent.click(screen.getByRole('button', { name: 'Stop recording' }));
    expect(onRecorded).toHaveBeenCalledWith(null, 0);
    expect(screen.getByRole('button', { name: 'Start recording' })).toBeInTheDocument();
  });
});
