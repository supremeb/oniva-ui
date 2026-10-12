import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TypingIndicator } from './TypingIndicator';

describe('TypingIndicator', () => {
  it('exposes a status label', () => {
    render(<TypingIndicator />);
    expect(screen.getByRole('status', { name: 'Assistant is typing' })).toBeInTheDocument();
  });
});
