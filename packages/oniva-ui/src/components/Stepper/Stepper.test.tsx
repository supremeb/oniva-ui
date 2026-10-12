import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Stepper } from './Stepper';

const steps = [
  { id: 'a', title: 'Account', description: 'Create login' },
  { id: 'b', title: 'Company' },
  { id: 'c', title: 'Billing' },
];

describe('Stepper', () => {
  it('renders an ordered list with the current step marked', () => {
    render(<Stepper steps={steps} currentStep={1} aria-label="Onboarding" className="x" />);
    expect(screen.getByRole('list', { name: 'Onboarding' })).toHaveClass('x');
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).toHaveTextContent('completed');
    expect(items[2]).toHaveTextContent('not started');
  });
  it('makes completed steps pressable only when onStepPress is given', async () => {
    const onStepPress = vi.fn();
    const { rerender } = render(<Stepper steps={steps} currentStep={1} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    rerender(<Stepper steps={steps} currentStep={1} onStepPress={onStepPress} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
    await userEvent.click(screen.getAllByRole('button')[0]!);
    expect(onStepPress).toHaveBeenCalledWith(0);
  });
  it('vertical orientation renders differently', () => {
    const { rerender } = render(<Stepper steps={steps} currentStep={0} />);
    const a = screen.getByRole('list').className;
    rerender(<Stepper steps={steps} currentStep={0} orientation="vertical" />);
    expect(screen.getByRole('list').className).not.toBe(a);
  });
});
