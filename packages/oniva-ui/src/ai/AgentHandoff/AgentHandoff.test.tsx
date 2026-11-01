import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentHandoff } from './AgentHandoff';

describe('AgentHandoff', () => {
  it('describes the transfer', () => {
    render(<AgentHandoff from={{ name: 'Triage Bot' }} to={{ name: 'Billing Specialist' }} reason="Refund over $500 needs finance tools" carried={['ticket-4821.json']} />);
    expect(screen.getByRole('group', { name: 'Handoff from Triage Bot to Billing Specialist' })).toBeInTheDocument();
    expect(screen.getByText('ticket-4821.json')).toBeInTheDocument();
    expect(screen.getByText('accepted')).toBeInTheDocument();
  });

  it('announces the status as a live region and shows pending', () => {
    render(<AgentHandoff status="pending" from={{ name: 'A' }} to={{ name: 'B' }} reason="r" />);
    expect(screen.getByRole('status')).toHaveTextContent('pending');
  });

  it('exposes full text on truncated names, roles and carried files', () => {
    const file = 'exports/northwind-labs/2026/q3/processor-events-duplicate-charges-full-export.csv';
    render(
      <AgentHandoff
        from={{ name: 'Northwind Escalations Coordinator', role: 'Routes unresolved enterprise tickets' }}
        to={{ name: 'Billing Reconciliation Specialist' }}
        reason="r"
        carried={[file]}
      />,
    );
    expect(screen.getByText('Northwind Escalations Coordinator')).toHaveAttribute('title', 'Northwind Escalations Coordinator');
    expect(screen.getByText('Routes unresolved enterprise tickets')).toHaveAttribute('title', 'Routes unresolved enterprise tickets');
    expect(screen.getByText(file).closest('[title]')).toHaveAttribute('title', file);
  });

  it('omits context and carried when not provided', () => {
    render(<AgentHandoff from={{ name: 'A' }} to={{ name: 'B' }} reason="Why" />);
    expect(screen.getByText('Why')).toBeInTheDocument();
    expect(screen.queryByText(/\.json/)).toBeNull();
  });
});
