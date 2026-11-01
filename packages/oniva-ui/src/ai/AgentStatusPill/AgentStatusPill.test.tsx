import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentStatusPill } from './AgentStatusPill';

describe('AgentStatusPill', () => {
  it('shows default and custom labels', () => {
    const { rerender } = render(<AgentStatusPill status="waiting" />);
    expect(screen.getByRole('status')).toHaveTextContent('Waiting for approval');
    rerender(<AgentStatusPill status="error" label="Tests failed" />);
    expect(screen.getByRole('status')).toHaveTextContent('Tests failed');
  });

  it('falls back to the default label when label is empty', () => {
    render(<AgentStatusPill status="idle" label="" />);
    expect(screen.getByRole('status')).toHaveTextContent('Idle');
  });

  it('keeps a long label in a single truncating line', () => {
    render(<AgentStatusPill status="error" label="Reviewing packages/northwind-queue/src/workers/scheduler/strategies/backoff.worker.ts" />);
    expect(screen.getByRole('status')).toHaveTextContent('backoff.worker.ts');
  });
});
