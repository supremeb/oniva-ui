import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ActivityRings } from './ActivityRings';

const rings = [
  { label: 'Move', value: 300, goal: 600, unit: 'kcal' },
  { label: 'Stand', value: 12, goal: 12, unit: 'h' },
];

describe('ActivityRings', () => {
  it('lists progress in the label and tooltip', () => {
    render(<ActivityRings rings={rings} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Move 300 kcal of 600'),
    );
    fireEvent.focus(screen.getByLabelText(/^Move:/));
    expect(screen.getByRole('tooltip')).toHaveTextContent('50%');
  });
  it('renders centre children', () => {
    render(<ActivityRings rings={rings}>90%</ActivityRings>);
    expect(screen.getByText('90%')).toBeInTheDocument();
  });
});
