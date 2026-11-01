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
        sources={[{ title: 'SaaS benchmarks', url: 'https://benchmarks.example/saas-growth' }]}
      />,
    );
    expect(screen.getByText('Searched the web')).toBeInTheDocument();
    expect(screen.getByText('8 results')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://benchmarks.example/saas-growth');
  });

  it('shows searching state', () => {
    render(<WebSearchTrail queries={[{ id: '1', query: 'q', status: 'searching' }]} />);
    expect(screen.getByText('Searching the web…')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Searching' })).toBeInTheDocument();
  });

  it('pluralizes and formats result counts', () => {
    render(
      <WebSearchTrail
        queries={[
          { id: '1', query: 'a', status: 'done', resultCount: 1 },
          { id: '2', query: 'b', status: 'done', resultCount: 1240 },
        ]}
      />,
    );
    expect(screen.getByText('1 result')).toBeInTheDocument();
    expect(screen.getByText('1,240 results')).toBeInTheDocument();
  });

  it('shows an empty state without a query list', () => {
    render(<WebSearchTrail queries={[]} />);
    expect(screen.getByText('No searches yet')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders sources as a labelled list and tolerates duplicate urls', () => {
    render(
      <WebSearchTrail
        queries={[{ id: '1', query: 'q', status: 'done' }]}
        sources={[
          { title: 'One', url: 'https://a.example/x' },
          { title: 'Two', url: 'https://a.example/x' },
        ]}
      />,
    );
    expect(screen.getByRole('list', { name: 'Sources' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });
});
