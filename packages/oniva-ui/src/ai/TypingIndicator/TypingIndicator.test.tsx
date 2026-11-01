import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TypingIndicator } from './TypingIndicator';

describe('TypingIndicator', () => {
  it('exposes a status label', () => {
    render(<TypingIndicator />);
    expect(screen.getByRole('status')).toHaveTextContent('Assistant is typing');
  });

  it('uses a custom label', () => {
    render(<TypingIndicator label="Atlas 2 is composing a reply" />);
    expect(screen.getByRole('status')).toHaveTextContent('Atlas 2 is composing a reply');
  });

  it('renders three decorative dots hidden from assistive tech', () => {
    render(<TypingIndicator />);
    const dots = screen.getByRole('status').querySelectorAll('[aria-hidden="true"]');
    expect(dots).toHaveLength(3);
  });

  it('staggers the dots through a per-dot index', () => {
    render(<TypingIndicator />);
    const dots = Array.from(screen.getByRole('status').querySelectorAll<HTMLElement>('[aria-hidden="true"]'));
    expect(dots.map((d) => d.style.getPropertyValue('--oniva-i'))).toEqual(['0', '1', '2']);
  });
});
