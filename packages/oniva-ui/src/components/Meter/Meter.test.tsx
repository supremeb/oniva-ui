import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Meter } from './Meter';

describe('Meter', () => {
  it('has meter role, label and value', () => {
    render(<Meter label="Seats used" value={42} />);
    const m = screen.getByRole('meter', { name: 'Seats used' });
    expect(m).toHaveAttribute('aria-valuenow', '42');
    expect(screen.getByText('42%')).toBeInTheDocument();
  });
  it('colour class changes across thresholds', () => {
    const { container, rerender } = render(<Meter aria-label="d" value={30} />);
    const cls = () =>
      (container.querySelector('[role=meter] > div:last-child > div') as HTMLElement).className;
    const low = cls();
    rerender(<Meter aria-label="d" value={95} />);
    expect(cls()).not.toBe(low);
  });
  it('supports custom range', () => {
    render(<Meter aria-label="Disk" value={30} minValue={0} maxValue={60} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
