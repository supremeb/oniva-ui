import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { DecisionTree, type Decision } from './DecisionTree';

const decisions: Decision[] = [
  {
    id: 'dupes',
    question: '3 customers have two active subscriptions. How should I proceed?',
    agent: 'Billing agent',
    model: 'Atlas 2',
    risk: 'high',
    options: [
      { label: 'Cancel the newer ones', pick: true, effects: ['Cancels 3 subscriptions · reversible'] },
      { label: 'Refund the newer ones', effects: [['Refunds ', { text: '$147 · not reversible', note: 'One charge is two cycles old.' }]] },
    ],
  },
  { id: 'region', question: 'Which region should the backup run in?', agent: 'Ops agent', options: [{ label: 'us-east' }, { label: 'eu-west' }] },
];

describe('DecisionTree', () => {
  it('shows question, branches, risk and the agent pick', async () => {
    const { container } = render(<DecisionTree decisions={decisions} />);
    expect(screen.getByText(/3 customers/)).toBeInTheDocument();
    expect(screen.getByText('High risk')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Cancel the newer ones, the agent's pick" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it('picks with a click, then moves to the next decision', async () => {
    const onChoose = vi.fn();
    render(<DecisionTree decisions={decisions} onChoose={onChoose} settleMs={10} />);
    fireEvent.click(screen.getByRole('button', { name: /Refund the newer ones/ }));
    await waitFor(() => expect(onChoose).toHaveBeenCalledWith(decisions[0], { index: 1, option: decisions[0]!.options[1] }));
    await waitFor(() => expect(screen.getByText(/Which region/)).toBeInTheDocument());
  });

  it('number keys pick a branch and the next number opens Other', async () => {
    const onChoose = vi.fn().mockResolvedValue('Done, emailing them now.');
    render(<DecisionTree decisions={decisions} onChoose={onChoose} settleMs={10} />);
    fireEvent.keyDown(screen.getByRole('list', { name: /Ways to proceed/ }), { key: '3' });
    const box = await screen.findByRole('textbox', { name: 'Your instruction' });
    fireEvent.change(box, { target: { value: 'Ask them first' } });
    fireEvent.keyDown(box, { key: 'Enter' });
    await waitFor(() => expect(onChoose).toHaveBeenCalledWith(decisions[0], { other: 'Ask them first' }));
    expect(await screen.findAllByText('Done, emailing them now.')).not.toHaveLength(0);
  });

  it('arrow keys move between decisions and F shows a flag note', () => {
    render(<DecisionTree decisions={decisions} />);
    const list = screen.getByRole('list', { name: /Ways to proceed/ });
    fireEvent.keyDown(list, { key: 'f' });
    expect(screen.getByRole('tooltip')).toHaveTextContent('One charge is two cycles old.');
    fireEvent.keyDown(list, { key: 'ArrowRight' });
    expect(screen.getByText(/Which region/)).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DecisionTree decisions={decisions} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
    act(() => {});
  });
});
