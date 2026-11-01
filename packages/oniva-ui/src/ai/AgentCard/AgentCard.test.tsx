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
        model="Atlas 2"
        tools={['Ledger sync']}
        stats={[{ label: 'Runs', value: '1,284' }]}
      />,
    );
    expect(screen.getByText('Finance ops')).toBeInTheDocument();
    expect(screen.getByText('Ledger sync')).toBeInTheDocument();
    expect(screen.getByText('1,284')).toBeInTheDocument();
  });

  it('announces the status through a status region', () => {
    const { rerender } = render(<AgentCard name="Invoice Reconciler" role="Finance ops" />);
    expect(screen.getByRole('status')).toHaveTextContent('idle');
    rerender(<AgentCard name="Invoice Reconciler" role="Finance ops" status="error" />);
    expect(screen.getByRole('status')).toHaveTextContent('error');
  });

  it('keeps every stat label before its value in the DOM', () => {
    const { container } = render(
      <AgentCard
        name="A"
        role="B"
        stats={[
          { label: 'Runs', value: '12' },
          { label: 'Runs', value: '14' },
        ]}
      />,
    );
    const groups = container.querySelectorAll('dl > div');
    expect(groups).toHaveLength(2);
    for (const g of groups) expect([...g.children].map((c) => c.tagName)).toEqual(['DT', 'DD']);
  });

  it('exposes truncated tags through a title and tolerates duplicate tools', () => {
    render(<AgentCard name="A" role="B" model="atlas-2-extended" tools={['Mail', 'Mail']} />);
    expect(screen.getByTitle('atlas-2-extended')).toBeInTheDocument();
    expect(screen.getAllByTitle('Mail')).toHaveLength(2);
  });
});
