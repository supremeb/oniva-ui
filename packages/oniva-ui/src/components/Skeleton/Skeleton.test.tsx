import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('is hidden from assistive tech and applies dimensions', () => {
    const { container } = render(<Skeleton width={120} height={12} className="s" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.style.width).toBe('120px');
    expect(el).toHaveClass('s');
  });
  it('variants differ', () => {
    const { container, rerender } = render(<Skeleton />);
    const a = (container.firstElementChild as HTMLElement).className;
    rerender(<Skeleton variant="circle" />);
    expect((container.firstElementChild as HTMLElement).className).not.toBe(a);
  });
});
