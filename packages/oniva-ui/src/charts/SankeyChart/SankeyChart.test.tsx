import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { sankeyFlows } from '../_data/datasets';
import { SankeyChart } from './SankeyChart';

describe('SankeyChart', () => {
  it('renders every node label and a focusable flow per link', () => {
    const { container } = render(
      <SankeyChart nodes={sankeyFlows.nodes} links={sankeyFlows.links} />,
    );
    expect(screen.getAllByText('Landing page').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('path[tabindex="-1"]')).toHaveLength(sankeyFlows.links.length);
  });
  it('tooltip names source and target', () => {
    render(<SankeyChart nodes={sankeyFlows.nodes} links={sankeyFlows.links} />);
    fireEvent.focus(screen.getByLabelText(/^Search to Landing page:/));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Search');
  });
});
