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
});
