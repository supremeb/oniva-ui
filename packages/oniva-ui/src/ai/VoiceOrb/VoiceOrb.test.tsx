import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VoiceOrb } from './VoiceOrb';

describe('VoiceOrb', () => {
  it('exposes the agent state as a status', () => {
    render(<VoiceOrb name="Atlas" state="thinking" />);
    expect(screen.getByRole('status')).toHaveTextContent('Atlas: Thinking…');
  });

  it('announces the state once: the visible caption is hidden from assistive tech', () => {
    render(<VoiceOrb name="Atlas" state="listening" />);
    const caption = screen.getByText('Atlas · Listening…');
    expect(caption).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Atlas: Listening…')).not.toHaveAttribute('aria-hidden');
  });

  it('still announces the state when the caption is hidden', () => {
    render(<VoiceOrb state="speaking" hideLabel />);
    expect(screen.getByRole('status')).toHaveTextContent('Agent: Speaking…');
    expect(screen.queryByText('Agent · Speaking…')).toBeNull();
  });

  it('renders halos only while listening', () => {
    const { container, rerender } = render(<VoiceOrb state="listening" />);
    const empties = () => container.querySelectorAll('span[aria-hidden="true"]:empty').length;
    const listening = empties();
    rerender(<VoiceOrb state="idle" />);
    expect(listening - empties()).toBe(2);
  });

  it('forwards ref, className and the size variable', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <VoiceOrb
        ref={(n) => {
          el = n;
        }}
        className="x"
        size={40}
      />,
    );
    expect(el).toBe(container.firstChild);
    expect(container.firstChild).toHaveClass('x');
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--orb')).toBe('40px');
  });
});
