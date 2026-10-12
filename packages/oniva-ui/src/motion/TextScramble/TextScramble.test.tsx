import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextScramble } from './TextScramble';

describe('TextScramble', () => {
  it('renders and forwards props', () => {
    render(<TextScramble text="Hello" trigger="mount" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
