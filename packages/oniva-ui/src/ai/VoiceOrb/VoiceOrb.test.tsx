import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VoiceOrb } from './VoiceOrb';

describe('VoiceOrb', () => {
  it('exposes the agent state as a status', () => {
    render(<VoiceOrb name="Atlas" state="thinking" />);
    expect(screen.getByRole('status', { name: 'Atlas: Thinking…' })).toBeInTheDocument();
  });
});
