import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextReveal } from './TextReveal';

describe('TextReveal', () => {
  it('keeps existing word nodes when text is appended', () => {
    const { rerender, container } = render(<TextReveal text="hello world" className="t" />);
    const hello = screen.getByText('hello');
    expect(container.firstElementChild).toHaveClass('t');
    rerender(<TextReveal text="hello world again" className="t" />);
    expect(screen.getByText('hello')).toBe(hello);
    expect(screen.getByText('again').style.getPropertyValue('--oniva-delay')).toBe('0ms');
    expect(container.textContent).toBe('hello world again');
  });
});
