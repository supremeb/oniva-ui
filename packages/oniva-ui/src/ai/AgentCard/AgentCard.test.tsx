import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentCard } from './AgentCard';

describe('AgentCard', () => {
  it('renders role, tools and stats', () => {
    render(
      <AgentCard
        name="Invoice Reconciler"
        role="Finance ops"
        status="working"
        model="Claude Sonnet"
        tools={['NetSuite']}
        stats={[{ label: 'Runs', value: '1,284' }]}
      />,
    );
    expect(screen.getByText('Finance ops')).toBeInTheDocument();
    expect(screen.getByText('NetSuite')).toBeInTheDocument();
    expect(screen.getByText('1,284')).toBeInTheDocument();
  });
});
