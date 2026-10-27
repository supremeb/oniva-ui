import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { AgentLedger, redoPlan, undoPlan, type LedgerEntry } from './AgentLedger';

const NOW = 2_000_000;
const entries: LedgerEntry[] = [
  { id: 'price', action: 'Changed price', target: 'Pro plan', system: 'Billing', at: NOW - 120_000, change: ['$29 / month', '$34 / month'] },
  { id: 'deals', action: 'Updated 212 deals', system: 'CRM', at: NOW - 60_000, change: ['$29', '$34'], dependsOn: ['price'] },
  { id: 'email', action: 'Sent email', target: '3,812 customers', system: 'Mail', at: NOW - 1000, dependsOn: ['price'], reversible: false },
];

describe('AgentLedger', () => {
  it('computes undo and redo plans', () => {
    expect(undoPlan(entries, 'price')).toEqual({ ids: ['price', 'deals'], also: ['deals'], kept: ['email'] });
    expect(undoPlan(entries, 'email').ids).toEqual([]);
    expect(redoPlan(entries, 'price', ['price', 'deals'])).toEqual(['price', 'deals']);
  });

  it('lists newest first with before and after text', () => {
    render(<AgentLedger entries={entries} now={NOW} agent="Launch agent" />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Sent email');
    expect(items[2]).toHaveTextContent('$29 / month');
    expect(items[2]).toHaveTextContent('$34 / month');
  });

  it('undoes a change and its dependents, then redoes it', () => {
    const onUndo = vi.fn();
    const onRedo = vi.fn();
    render(<AgentLedger entries={entries} now={NOW} onUndo={onUndo} onRedo={onRedo} />);
    const undo = screen.getByRole('button', { name: /^Undo Changed price Pro plan, also undoes 1 change, 1 can't be undone/ });
    fireEvent.click(undo);
    expect(onUndo).toHaveBeenCalledWith(['price', 'deals']);
    expect(screen.getAllByRole('listitem')[2]).toHaveAttribute('data-state', 'undone');
    fireEvent.click(screen.getByRole('button', { name: 'Redo Changed price' }));
    expect(onRedo).toHaveBeenCalledWith(['price', 'deals']);
  });

  it('shows consequences when Undo is focused', () => {
    render(<AgentLedger entries={entries} now={NOW} />);
    screen.getByRole('button', { name: /^Undo Changed price/ }).focus();
    fireEvent.focus(screen.getByRole('button', { name: /^Undo Changed price/ }));
    expect(screen.getByText('Also undone')).toBeInTheDocument();
    expect(screen.getByText("Can't undo")).toBeInTheDocument();
  });

  it('forwards ref/className and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<AgentLedger ref={ref} className="x" entries={entries} now={NOW} />);
    expect(ref.current).toHaveClass('x');
    await expectNoA11yViolations(container);
  });
});
