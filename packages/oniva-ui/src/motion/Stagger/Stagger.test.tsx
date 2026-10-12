import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stagger } from './Stagger';

describe('Stagger', () => {
  it('assigns capped step indices', () => {
    render(
      <Stagger max={2} className="s" data-testid="root">
        {['a', 'b', 'c', 'd'].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </Stagger>,
    );
    expect(screen.getByTestId('root')).toHaveClass('s');
    const idx = ['a', 'b', 'c', 'd'].map((t) => (screen.getByText(t).parentElement as HTMLElement).style.getPropertyValue('--oniva-i'));
    expect(idx).toEqual(['0', '1', '2', '2']);
  });
});
