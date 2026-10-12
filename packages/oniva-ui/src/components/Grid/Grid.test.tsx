import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Grid } from './Grid';

describe('Grid', () => {
  it('renders children and sets columns via a CSS variable', () => {
    render(
      <Grid data-testid="g" columns={3} className="k">
        <span>a</span>
        <span>b</span>
      </Grid>,
    );
    const el = screen.getByTestId('g');
    expect(el).toHaveClass('k');
    expect(el.children).toHaveLength(2);
    expect(el.getAttribute('style') ?? '').toContain('--');
  });
  it('auto-fit mode differs from fixed columns', () => {
    const { rerender } = render(
      <Grid data-testid="g" columns={2}>
        x
      </Grid>,
    );
    const a = screen.getByTestId('g').getAttribute('style');
    rerender(
      <Grid data-testid="g" minColumnWidth={200}>
        x
      </Grid>,
    );
    expect(screen.getByTestId('g').getAttribute('style')).not.toBe(a);
  });
});
