import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { AgentTree, branchCost, type TreeAgent } from './AgentTree';

const NOW = 1_000_000;
const root: TreeAgent = {
  id: 'lead',
  name: 'Orchestrator',
  task: 'Launch pricing page',
  status: 'running',
  cost: 0.4,
  started: NOW - 80_000,
  children: [
    { id: 'r', name: 'Researcher', task: 'Compare vendors', status: 'done', cost: 0.3, started: NOW - 70_000, ended: NOW - 25_000 },
    { id: 'c', name: 'Coder', task: 'Build the page', status: 'waiting', ask: 'Publish to production?', cost: 0.2, started: NOW - 60_000 },
    { id: 'q', name: 'Reviewer', task: 'Check copy', status: 'failed', error: 'Timed out', cost: 0.05 },
  ],
};

describe('AgentTree', () => {
  it('rolls costs up the branch', () => {
    expect(branchCost(root)).toBeCloseTo(0.95);
  });

  it('renders a tree with labelled treeitems and totals', () => {
    render(<AgentTree root={root} now={NOW} />);
    expect(screen.getByRole('tree', { name: 'Agents' })).toBeInTheDocument();
    expect(screen.getByRole('treeitem', { name: 'Orchestrator, Running' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('treeitem', { name: 'Coder, Needs you' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('4 agents, 1 running, 1 need you, 1 failed, $0.95');
  });

  it('folds a branch (controlled callback)', () => {
    const onCollapsedChange = vi.fn();
    render(<AgentTree root={root} now={NOW} onCollapsedChange={onCollapsedChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hide 3 sub-agents of Orchestrator' }));
    expect(onCollapsedChange).toHaveBeenCalledWith(['lead']);
    expect(screen.queryByText('Coder')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show 3 sub-agents of Orchestrator' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('resolves a waiting agent from its dialog with the keyboard-reachable button', () => {
    const onResolve = vi.fn();
    render(<AgentTree root={root} now={NOW} onResolve={onResolve} />);
    fireEvent.click(screen.getByRole('button', { name: 'Needs you' }));
    expect(screen.getByRole('dialog', { name: 'Coder needs you' })).toHaveTextContent('Publish to production?');
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(onResolve).toHaveBeenCalledWith(expect.objectContaining({ id: 'c' }), 'approve');
  });

  it('selects an agent when onSelect is set', () => {
    const onSelect = vi.fn();
    render(<AgentTree root={root} now={NOW} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Researcher' }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'r' }));
  });

  it('forwards ref/className and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<AgentTree ref={ref} className="x" root={root} now={NOW} />);
    expect(ref.current).toHaveClass('x');
    await expectNoA11yViolations(container);
  });
});
