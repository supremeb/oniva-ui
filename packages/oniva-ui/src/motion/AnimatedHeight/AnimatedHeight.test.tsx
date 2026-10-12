import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnimatedHeight } from './AnimatedHeight';

describe('AnimatedHeight', () => {
  it('toggles data-open and inert on content', () => {
    const { container, rerender } = render(<AnimatedHeight isOpen={false} className="c">body</AnimatedHeight>);
    const root = container.firstElementChild as HTMLElement;
    expect(root).not.toHaveAttribute('data-open');
    expect(root).toHaveClass('c');
    expect(screen.getByText('body')).toHaveAttribute('inert');
    rerender(<AnimatedHeight isOpen className="c">body</AnimatedHeight>);
    expect(root).toHaveAttribute('data-open');
    expect(screen.getByText('body')).not.toHaveAttribute('inert');
  });
  it('forwards ref', () => {
    let n: HTMLDivElement | null = null;
    render(<AnimatedHeight isOpen ref={(e) => void (n = e)}>x</AnimatedHeight>);
    expect(n).toBeInstanceOf(HTMLDivElement);
  });
});
