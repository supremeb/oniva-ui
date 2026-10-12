import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextShimmer } from './TextShimmer';

describe('TextShimmer', () => {
  it('renders text and forwards className/ref', () => {
    let el: HTMLSpanElement | null = null;
    render(
      <TextShimmer className="x" ref={(n) => void (el = n)}>
        Thinking…
      </TextShimmer>,
    );
    expect(screen.getByText('Thinking…')).toHaveClass('x');
    expect(el).toBe(screen.getByText('Thinking…'));
  });
});
