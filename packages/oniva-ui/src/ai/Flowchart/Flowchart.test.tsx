import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Flowchart, type FlowNode } from './Flowchart';

const nodes: FlowNode[] = [
  { id: 't', kind: 'trigger', title: 'New order created', description: 'When an order arrives' },
  { id: 'c', kind: 'condition', title: 'Order matches', status: 'running', conditions: [{ id: 'x', join: 'If', subject: 'order', field: 'flavor', operator: 'is', value: 'Rocky Road', valueTone: 'warning' }] },
  { id: 'a', kind: 'action', title: 'Notify', status: 'done' },
];

describe('Flowchart', () => {
  it('renders nodes in order with default tags', () => {
    render(<Flowchart nodes={nodes} />);
    expect(screen.getByRole('list', { name: 'Workflow' })).toBeInTheDocument();
    expect(screen.getByText('Trigger')).toBeInTheDocument();
    expect(screen.getByText('If / Else')).toBeInTheDocument();
    expect(screen.getByText('Rocky Road')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
  it('marks the active node', () => {
    render(<Flowchart nodes={nodes} activeId="c" />);
    expect(screen.getByText('Order matches').closest('li')).toHaveAttribute('aria-current', 'step');
  });
  it('makes headers pressable when onNodePress is set', () => {
    const onNodePress = vi.fn();
    render(<Flowchart nodes={nodes} onNodePress={onNodePress} />);
    fireEvent.click(screen.getByRole('button', { name: /New order created/ }));
    expect(onNodePress).toHaveBeenCalledWith(nodes[0]);
  });
  it('shows a default and a custom empty label', () => {
    const { rerender } = render(<Flowchart nodes={[]} />);
    expect(screen.getByText('No steps yet')).toBeInTheDocument();
    rerender(<Flowchart nodes={[]} emptyLabel="Add a trigger" />);
    expect(screen.getByText('Add a trigger')).toBeInTheDocument();
  });
  it('announces the running node and completion in a status region', () => {
    const { rerender } = render(<Flowchart nodes={nodes} />);
    expect(screen.getByRole('status')).toHaveTextContent('Order matches: running');
    rerender(<Flowchart nodes={nodes.map((n) => ({ ...n, status: 'done' as const }))} />);
    expect(screen.getByRole('status')).toHaveTextContent('Workflow complete');
  });
  it('exposes the full condition value as a title for truncated chips', () => {
    const long = 'warehouse/northwind-labs/exports/2026/q3/invoices/overdue/enterprise-accounts.csv';
    render(<Flowchart nodes={[{ id: 'c', kind: 'condition', title: 'Matches', conditions: [{ id: 'x', field: 'path', value: long }] }]} />);
    expect(screen.getByTitle(long)).toBeInTheDocument();
  });
});
