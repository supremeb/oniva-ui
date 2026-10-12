import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComposerLoader } from './ComposerLoader';

describe('ComposerLoader', () => {
  it('renders children and flags the active state', () => {
    const { rerender } = render(
      <ComposerLoader data-testid="l">
        <p>Ask anything</p>
      </ComposerLoader>,
    );
    expect(screen.getByText('Ask anything')).toBeInTheDocument();
    expect(screen.getByTestId('l')).toHaveAttribute('data-active', 'true');
    const activeLayers = screen.getByTestId('l').querySelectorAll('[aria-hidden="true"]').length;
    rerender(
      <ComposerLoader data-testid="l" active={false}>
        <p>Ask anything</p>
      </ComposerLoader>,
    );
    expect(screen.getByTestId('l')).not.toHaveAttribute('data-active');
    expect(screen.getByTestId('l').querySelectorAll('[aria-hidden="true"]').length).toBeLessThan(
      activeLayers,
    );
  });
});
