import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WebSearchTrail } from './WebSearchTrail';

describe('WebSearchTrail', () => {
  it('lists queries and sources', () => {
    render(
      <WebSearchTrail
        queries={[
          { id: '1', query: 'SaaS Q3 2026 NRR benchmarks', status: 'done', resultCount: 8 },
        ]}
        sources={[{ title: 'SaaS benchmarks', url: 'https://www.bvp.com/atlas' }]}
      />,
    );
    expect(screen.getByText('Searched the web')).toBeInTheDocument();
    expect(screen.getByText('8 results')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://www.bvp.com/atlas');
  });

  it('shows searching state', () => {
    render(<WebSearchTrail queries={[{ id: '1', query: 'q', status: 'searching' }]} />);
    expect(screen.getByText('Searching the web…')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Searching' })).toBeInTheDocument();
  });
});
