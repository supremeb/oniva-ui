import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CrossFade } from './CrossFade';

describe('CrossFade', () => {
  it('shows skeleton while loading, then content; skeleton leaves after exit', () => {
    const { rerender } = render(<CrossFade isLoading skeleton={<i>sk</i>}>content</CrossFade>);
    expect(screen.getByText('sk')).toBeInTheDocument();
    expect(screen.queryByText('content')).toBeNull();
    rerender(<CrossFade isLoading={false} skeleton={<i>sk</i>}>content</CrossFade>);
    expect(screen.getByText('content')).toBeInTheDocument();
    fireEvent.animationEnd(screen.getByText('sk').parentElement as HTMLElement);
    expect(screen.queryByText('sk')).toBeNull();
  });
  it('swaps keyed content: old copy leaves inert and aria-hidden, then unmounts', () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <CrossFade contentKey="save" as="span" data-testid="cf">
        Save
      </CrossFade>,
    );
    expect(screen.getByTestId('cf').tagName).toBe('SPAN');
    rerender(
      <CrossFade contentKey="saved" as="span" data-testid="cf">
        Saved
      </CrossFade>,
    );
    const old = screen.getByText('Save');
    expect(old).toHaveAttribute('aria-hidden', 'true');
    expect(old).toHaveAttribute('inert');
    expect(screen.getByText('Saved')).not.toHaveAttribute('aria-hidden');
    act(() => void vi.advanceTimersByTime(400));
    expect(screen.queryByText('Save')).toBeNull();
    vi.useRealTimers();
  });
  it('keeps only the latest leaving copy on quick changes and caps blur at 4px', () => {
    const { rerender } = render(<CrossFade contentKey={1} blur={10} data-testid="cf">one</CrossFade>);
    rerender(<CrossFade contentKey={2} blur={10} data-testid="cf">two</CrossFade>);
    rerender(<CrossFade contentKey={3} blur={10} data-testid="cf">three</CrossFade>);
    expect(screen.queryByText('one')).toBeNull();
    expect(screen.getByText('two')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('cf').style.getPropertyValue('--oniva-cf-blur')).toBe('4px');
  });
  it('forwards ref and className in swap mode', () => {
    let el: HTMLElement | null = null;
    render(<CrossFade contentKey="a" className="x" ref={(n) => void (el = n)}>a</CrossFade>);
    expect(el).toHaveClass('x');
  });
});
