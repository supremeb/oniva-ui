import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ReactionBar } from './ReactionBar';

describe('ReactionBar', () => {
  it('renders toggle buttons with counts in the label', () => {
    render(<ReactionBar reactions={{ like: { count: 12 }, comment: { count: 1 } }} />);
    expect(screen.getByRole('button', { name: 'Like, 12 likes' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Comment, 1 comment' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  it('toggles, updates the count and calls onReact', () => {
    const onReact = vi.fn();
    render(<ReactionBar reactions={{ like: { count: 12 } }} onReact={onReact} />);
    fireEvent.click(screen.getByRole('button', { name: 'Like, 12 likes' }));
    expect(onReact).toHaveBeenCalledWith('like', { count: 13, active: true });
    const btn = screen.getByRole('button', { name: 'Unlike, 13 likes' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(btn);
    expect(onReact).toHaveBeenLastCalledWith('like', { count: 12, active: false });
  });

  it('toggles with the keyboard (Space)', () => {
    render(<ReactionBar actions={['like']} reactions={{ like: { count: 0 } }} />);
    const btn = screen.getByRole('button', { name: 'Like' });
    btn.focus();
    fireEvent.keyDown(btn, { key: ' ' });
    fireEvent.keyUp(btn, { key: ' ' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('respects actions and forwards ref/className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ReactionBar ref={ref} className="x" actions={['like', 'share']} />);
    expect(ref.current).toHaveClass('x');
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
