import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PlanCard } from './PlanCard';

const steps = [
  { id: 'a', title: 'Read diff' },
  { id: 'b', title: 'Write review' },
];

describe('PlanCard', () => {
  it('approves the plan', () => {
    const onApprove = vi.fn();
    render(<PlanCard steps={steps} onApprove={onApprove} />);
    fireEvent.click(screen.getByRole('button', { name: 'Approve plan' }));
    expect(onApprove).toHaveBeenCalledWith(steps);
    expect(screen.getByRole('status')).toHaveTextContent('Plan approved');
  });
  it('edits a step', () => {
    const onChange = vi.fn();
    render(<PlanCard steps={steps} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.change(screen.getByLabelText('Step 1'), { target: { value: 'Read the full diff' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(onChange.mock.calls[0]![0][0].title).toBe('Read the full diff');
  });
});
