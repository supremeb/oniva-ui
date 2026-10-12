import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentLimits } from './AgentLimits';

describe('AgentLimits', () => {
  it('shows the context summary and limit rows', () => {
    render(
      <AgentLimits
        plan="Max (5x)"
        context={{
          max: 1_000_000,
          segments: [
            { id: 'a', label: 'Messages', value: 520_000 },
            { id: 'b', label: 'Tools', value: 300_000 },
          ],
        }}
        limits={[{ id: '5h', label: '5-hour limit', resetsIn: 'Resets in 2 hr 46 min', percent: 38 }]}
      />,
    );
    expect(screen.getByText('820k / 1M (82%)')).toBeInTheDocument();
    expect(screen.getByText('Max (5x)')).toBeInTheDocument();
    expect(screen.getByText('38%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: '5-hour limit' })).toBeInTheDocument();
  });
});
