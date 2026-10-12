import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Kbd, KbdGroup } from './Kbd';

describe('Kbd', () => {
  it('renders a kbd element and forwards className/ref', () => {
    let el: HTMLElement | null = null;
    render(
      <Kbd
        className="x"
        ref={(n) => {
          el = n;
        }}
      >
        Esc
      </Kbd>,
    );
    const k = screen.getByText('Esc');
    expect(k.tagName).toBe('KBD');
    expect(k).toHaveClass('x');
    expect(el).toBe(k);
  });

  it('renders each key of a group and varies by size', () => {
    const { container } = render(<KbdGroup keys={['⌘', 'K']} />);
    expect(container.querySelectorAll('kbd')).toHaveLength(2);
    const a = container.querySelector('kbd')!.className;
    render(<Kbd size="lg">A</Kbd>);
    expect(screen.getByText('A').className).not.toBe(a);
  });
});
