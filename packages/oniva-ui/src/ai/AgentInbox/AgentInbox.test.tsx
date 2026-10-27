import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { AgentInbox, type InboxTask } from './AgentInbox';

const NOW = 5_000_000;
const tasks: InboxTask[] = [
  { id: 'm', title: 'Migrate users table', description: 'Dry run passed.', agent: 'Atlas 2', status: 'waiting', startedAt: NOW - 360_000, tools: 14, steps: [{ label: 'Dry run on staging', time: '2m ago' }] },
  { id: 'n', title: 'Release notes v2.4', agent: 'Nova Pro', status: 'running', startedAt: NOW - 80_000 },
  { id: 'd', title: 'Weekly digest', agent: 'Lumen Fast', status: 'done', elapsed: 252_000 },
  { id: 'f', title: 'Sync invoices', agent: 'Lumen Fast', status: 'failed', elapsed: 12_000 },
];

describe('AgentInbox', () => {
  it('groups tasks into labelled columns with clocks', () => {
    render(<AgentInbox tasks={tasks} now={NOW} />);
    expect(screen.getByRole('region', { name: 'Needs you' })).toHaveTextContent('Migrate users table');
    expect(screen.getByRole('region', { name: 'Needs you' })).toHaveTextContent('Sync invoices');
    expect(screen.getByRole('region', { name: 'Running' })).toHaveTextContent('1m 20s');
    expect(screen.getByRole('region', { name: 'Done' })).toHaveTextContent('4m 12s');
  });

  it('opens a card, approves, and moves the task to Running without a handler', async () => {
    render(<AgentInbox tasks={tasks} now={NOW} />);
    const trigger = screen.getByRole('button', { name: /Migrate users table/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(screen.getByText('Dry run on staging')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    // The new state shows in place first; the card glides to its column a beat later.
    await waitFor(() => expect(screen.getByRole('region', { name: 'Running' })).toHaveTextContent('Migrate users table'), { timeout: 1500 });
  });

  it('calls handlers and closes on Escape', () => {
    const onReject = vi.fn();
    render(<AgentInbox tasks={tasks} now={NOW} onReject={onReject} />);
    const trigger = screen.getByRole('button', { name: /Migrate users table/ });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }));
    expect(onReject).toHaveBeenCalledWith(expect.objectContaining({ id: 'm' }));
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('switches layout via radio group', () => {
    const onViewChange = vi.fn();
    render(<AgentInbox tasks={tasks} now={NOW} onViewChange={onViewChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'List' }));
    expect(onViewChange).toHaveBeenCalledWith('list');
  });

  it('forwards ref/className and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<AgentInbox ref={ref} className="x" tasks={tasks} now={NOW} />);
    expect(ref.current).toHaveClass('x');
    await expectNoA11yViolations(container);
  });
});
