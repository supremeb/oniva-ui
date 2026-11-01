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

  it('announces recording through a status region', async () => {
    render(<SpeechInput demo />);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    fireEvent.click(screen.getByRole('button', { name: 'Start recording' }));
    expect(await screen.findByText('Recording')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Recording');
  });

  it('renders the idle label and forwards ref and className', () => {
    let node: HTMLDivElement | null = null;
    render(<SpeechInput demo idleLabel="Dictate your reply" className="x" ref={(n) => { node = n; }} />);
    expect(screen.getByText('Dictate your reply')).toBeInTheDocument();
    expect((node as HTMLDivElement | null)?.classList.contains('x')).toBe(true);
  });

  it('ignores a second press while the microphone prompt is pending', async () => {
    let resolve: (s: MediaStream) => void = () => undefined;
    const getUserMedia = vi.fn(() => new Promise<MediaStream>((r) => { resolve = r; }));
    const stop = vi.fn();
    const start = vi.fn();
    class FakeRecorder {
      state = 'recording';
      mimeType = 'audio/webm';
      ondataavailable: unknown;
      onstop: unknown;
      start = start;
      stop = stop;
    }
    vi.stubGlobal('MediaRecorder', FakeRecorder);
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } });
    render(<SpeechInput />);
    const btn = screen.getByRole('button', { name: 'Start recording' });
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(getUserMedia).toHaveBeenCalledTimes(1);
    resolve({ getTracks: () => [] } as unknown as MediaStream);
    expect(await screen.findByRole('timer')).toBeInTheDocument();
    expect(start).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: undefined });
  });
});
