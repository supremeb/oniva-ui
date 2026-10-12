import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CostBadge, UsageMeter } from './CostBadge';

describe('CostBadge / UsageMeter', () => {
  it('shows tokens and exposes the meter', () => {
    render(
      <>
        <CostBadge cost={0.043} tokens={12400} />
        <UsageMeter spent={412.5} budget={500} breakdown={[{ label: 'Sonnet', value: 301.2 }]} />
      </>,
    );
    expect(screen.getByText('12.4k tokens')).toBeInTheDocument();
    expect(screen.getByRole('meter', { name: 'API spend usage' })).toHaveAttribute('aria-valuenow', '412.5');
    expect(screen.getByText('Sonnet $301.20')).toBeInTheDocument();
  });
});
