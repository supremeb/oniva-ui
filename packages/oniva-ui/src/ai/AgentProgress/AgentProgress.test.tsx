import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentProgress } from './AgentProgress';

const items = [
  { id: '1', label: 'Load CSV', status: 'done' as const },
  { id: '2', label: 'Group by segment', status: 'running' as const },
  { id: '3', label: 'Write summary', status: 'pending' as const },
];

describe('AgentProgress', () => {
  it('summarizes steps left and the running step', () => {
    render(<AgentProgress items={items} />);
    expect(screen.getByText('2 steps left')).toBeInTheDocument();
    expect(screen.getAllByText('Group by segment').length).toBeGreaterThan(0);
  });

  it('collapses', () => {
    render(<AgentProgress items={items} />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('reports completion', () => {
    render(<AgentProgress items={items.map((i) => ({ ...i, status: 'done' as const }))} />);
    expect(screen.getByText('All steps complete')).toBeInTheDocument();
  });
});
