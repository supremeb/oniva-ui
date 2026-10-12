import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { funnelSteps } from '../_data/datasets';
import { FunnelChart } from './FunnelChart';

describe('FunnelChart', () => {
  it('labels each step with value and share of first step', () => {
    render(<FunnelChart steps={funnelSteps} />);
    expect(screen.getByRole('group')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Paid'),
    );
    fireEvent.focus(screen.getByLabelText(/^Paid:/));
    expect(screen.getByRole('tooltip')).toHaveTextContent('3.1%');
  });
});
