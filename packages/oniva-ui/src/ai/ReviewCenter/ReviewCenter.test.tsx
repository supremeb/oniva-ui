import { fireEvent, render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { ReviewCenter, type ReviewItem } from './ReviewCenter';

const NOW = 1_800_000_000_000;
const items: ReviewItem[] = [
  { id: 'low', title: 'Reply to Sam', agent: 'Support agent', type: 'Email', risk: 'low', confidence: 0.95, createdAt: NOW - 60_000, body: 'Hi Sam, thanks for waiting.' },
  {
    id: 'refund', title: 'Refund order #4821', agent: 'Support agent', model: 'Atlas 2', type: 'Refund', risk: 'high', confidence: 0.62, createdAt: NOW - 26 * 60_000,
    reasoning: 'Damaged items are covered within 30 days.',
    fields: [{ label: 'Amount', value: [{ text: '$184.00', note: 'Includes $20 express shipping.' }] }, { label: 'Order', value: '#4821' }],
    body: 'Hi Maya, I am sorry your blender arrived cracked.', bodyLabel: 'Reply to Maya',
  },
  { id: 'med', title: 'Update plan tiers', agent: 'Ops agent', type: 'Plan', risk: 'medium', confidence: 0.8, createdAt: NOW - 5 * 60_000, steps: [{ title: 'Edit tiers', tool: 'cms.update', flagged: true }] },
];

describe('ReviewCenter', () => {
  it('sorts the queue high risk first and shows the first item', async () => {
    const { container } = render(<ReviewCenter items={items} now={NOW} reviewed={4} />);
    const rows = within(screen.getByRole('list', { name: 'Review queue' })).getAllByRole('button');
    expect(rows[0]).toHaveAccessibleName(/Refund order #4821, Refund, high risk, 62% confident, waiting 26m/);
    expect(rows[0]).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('heading', { name: 'Refund order #4821' })).toBeInTheDocument();
    expect(screen.getByText('4 of 7 reviewed')).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it('A approves and moves on; Z undoes', () => {
    const onDecide = vi.fn();
    const onUndo = vi.fn();
    render(<ReviewCenter items={items} now={NOW} onDecide={onDecide} onUndo={onUndo} />);
    const region = screen.getByRole('region', { name: 'Current item' });
    fireEvent.keyDown(region, { key: 'a' });
    expect(onDecide).toHaveBeenCalledWith(expect.objectContaining({ id: 'refund' }), { decision: 'approved' });
    expect(screen.getByRole('heading', { name: 'Update plan tiers' })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('region', { name: 'Current item' }), { key: 'z' });
    expect(onUndo).toHaveBeenCalledWith(expect.objectContaining({ id: 'refund' }), { decision: 'approved' });
    expect(screen.getByRole('heading', { name: 'Refund order #4821' })).toBeInTheDocument();
  });

  it('R then a number rejects with the reason', () => {
    const onDecide = vi.fn();
    render(<ReviewCenter items={items} now={NOW} onDecide={onDecide} />);
    const region = screen.getByRole('region', { name: 'Current item' });
    fireEvent.keyDown(region, { key: 'r' });
    expect(screen.getByRole('group', { name: 'Reason for rejecting' })).toBeInTheDocument();
    fireEvent.keyDown(region, { key: '2' });
    expect(onDecide).toHaveBeenCalledWith(expect.objectContaining({ id: 'refund' }), { decision: 'rejected', reason: 'Tone' });
  });

  it('E edits the body and Ctrl+Enter approves with the edits', () => {
    const onDecide = vi.fn();
    render(<ReviewCenter items={items} now={NOW} onDecide={onDecide} />);
    fireEvent.keyDown(screen.getByRole('region', { name: 'Current item' }), { key: 'e' });
    const box = screen.getByRole('textbox', { name: 'Reply to Maya' });
    fireEvent.change(box, { target: { value: 'Hi Maya, a replacement is on its way.' } });
    fireEvent.keyDown(box, { key: 'Enter', ctrlKey: true });
    expect(onDecide).toHaveBeenCalledWith(expect.objectContaining({ id: 'refund' }), { decision: 'approved', text: 'Hi Maya, a replacement is on its way.' });
  });

  it('F shows the agent note for the next flag; the filter narrows the queue', () => {
    render(<ReviewCenter items={items} now={NOW} />);
    fireEvent.keyDown(screen.getByRole('region', { name: 'Current item' }), { key: 'f' });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Includes $20 express shipping.');
    fireEvent.click(screen.getByRole('radio', { name: 'High risk' }));
    expect(within(screen.getByRole('list', { name: 'Review queue' })).getAllByRole('button')).toHaveLength(1);
  });

  it('skip marks the row and advances', () => {
    const onSkip = vi.fn();
    render(<ReviewCenter items={items} now={NOW} onSkip={onSkip} />);
    fireEvent.keyDown(screen.getByRole('region', { name: 'Current item' }), { key: 's' });
    expect(onSkip).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Update plan tiers' })).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ReviewCenter items={items} ref={ref} className="x" now={NOW} />);
    expect(ref.current).toHaveClass('x');
  });
});
