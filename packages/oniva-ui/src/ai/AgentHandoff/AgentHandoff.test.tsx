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
});
