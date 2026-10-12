import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Gauge, Speedometer } from './Gauge';

describe('Gauge', () => {
  it('announces value and range', () => {
    render(<Gauge value={72} />);
    expect(screen.getByRole('group')).toHaveAttribute(
      'aria-label',
      'Gauge: 72 on a scale of 0 to 100',
    );
  });
  it('speedometer names the active zone and has focusable zones', () => {
    render(<Speedometer value={64} />);
    expect(screen.getByRole('group')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Fair'),
    );
    fireEvent.focus(screen.getByLabelText(/^Good,/));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
