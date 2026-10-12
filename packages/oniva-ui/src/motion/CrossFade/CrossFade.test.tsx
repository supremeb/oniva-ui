import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});
