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

  it('does not report an empty plan as complete', () => {
    render(<AgentProgress items={[]} />);
    expect(screen.queryByText('All steps complete')).not.toBeInTheDocument();
    expect(screen.getByText('No steps yet')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('announces progress through a status region', () => {
    render(<AgentProgress items={items} />);
    const region = screen
      .getAllByRole('status')
      .find((el) => el.textContent === '2 steps left. Group by segment');
    expect(region).toBeDefined();
  });

  it('disables the trigger when isDisabled is set', () => {
    render(<AgentProgress items={items} isDisabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
