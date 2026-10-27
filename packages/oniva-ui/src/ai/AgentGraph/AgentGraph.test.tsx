import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { AgentGraph, type GraphCall, type GraphNode } from './AgentGraph';

const NOW = 1_000_000;
const nodes: GraphNode[] = [
  { id: 'lead', kind: 'agent', name: 'Orchestrator', detail: 'Atlas 2', status: 'working', lead: true, cost: 0.2 },
  { id: 'res', kind: 'agent', name: 'Researcher', detail: 'Nova Pro', status: 'waiting', doing: 'Waiting for sign-off', cost: 0.12 },
  { id: 'web', kind: 'tool', name: 'Web search', short: 'Search' },
  { id: 'you', kind: 'user', name: 'You' },
];
const calls: GraphCall[] = [
  { id: 'c1', from: 'lead', to: 'res', at: NOW - 4000, status: 'pending', label: 'Compare pricing' },
  { id: 'c2', from: 'res', to: 'web', at: NOW - 900, status: 'ok', ms: 820, label: 'pricing search' },
];

describe('AgentGraph', () => {
  it('renders a labelled button per node with status and call counts', () => {
    render(<AgentGraph nodes={nodes} calls={calls} edges={[['you', 'lead']]} now={NOW} />);
    expect(screen.getByRole('button', { name: /Researcher, agent, needs you, Waiting for sign-off, 1 call in the last minute/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^You, user, idle/ })).toBeInTheDocument();
    expect(screen.getByText('1 needs you')).toBeInTheDocument();
  });

  it('has a hidden text list of the same picture', () => {
    render(<AgentGraph nodes={nodes} calls={calls} now={NOW} />);
    const list = screen.getByRole('list', { name: 'Agent graph summary' });
    expect(list).toHaveTextContent('Researcher: Needs you, called Web search 1 times');
    expect(list).toHaveTextContent('$0.12');
  });

  it('opens the node card, reports selection, and closes with Escape', () => {
    const onSelect = vi.fn();
    render(<AgentGraph nodes={nodes} calls={calls} now={NOW} onSelect={onSelect} />);
    const btn = screen.getByRole('button', { name: /^Researcher/ });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Researcher details' })).toHaveTextContent('Waiting for sign-off');
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'res' }));
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it('announces a waiting agent and respects reduced motion', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }));
    render(<AgentGraph nodes={nodes} calls={calls} now={NOW} />);
    expect(screen.getAllByText(/Researcher needs you/).length).toBeGreaterThan(0);
    vi.unstubAllGlobals();
  });

  it('forwards ref/className and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<AgentGraph ref={ref} className="x" nodes={nodes} calls={calls} now={NOW} />);
    expect(ref.current).toHaveClass('x');
    await expectNoA11yViolations(container);
  });
});
