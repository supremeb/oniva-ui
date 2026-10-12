import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CategoryBar } from './CategoryBar';

describe('CategoryBar', () => {
  it('summarises segments and marker', () => {
    render(
      <CategoryBar
        marker={64}
        segments={[
          { value: 40, label: 'Low' },
          { value: 60, label: 'High' },
        ]}
      />,
    );
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Low 40%'),
    );
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('marker at 64'),
    );
  });
  it('renders labels when asked', () => {
    render(
      <CategoryBar
        showLabels
        segments={[
          { value: 1, label: 'One' },
          { value: 1, label: 'Two' },
        ]}
      />,
    );
    expect(screen.getByText('Two')).toBeInTheDocument();
  });
});
