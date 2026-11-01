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
        limits={[
          { id: '5h', label: '5-hour limit', resetsIn: 'Resets in 2 hr 46 min', percent: 38 },
        ]}
      />,
    );
    expect(screen.getByText('820k / 1M (82%)')).toBeInTheDocument();
    expect(screen.getByText('Max (5x)')).toBeInTheDocument();
    expect(screen.getByText('38%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: '5-hour limit' })).toBeInTheDocument();
  });

  it('shows a message when there is no context and no limits', () => {
    render(<AgentLimits />);
    expect(screen.getByText('No usage data yet')).toBeInTheDocument();
  });

  it('never prints Infinity or NaN for a zero max or bad percent', () => {
    const { container } = render(
      <AgentLimits
        context={{ max: 0, segments: [{ id: 'a', label: 'Messages', value: 5 }] }}
        limits={[
          { id: 'a', label: 'Bad', percent: Number.NaN },
          { id: 'b', label: 'Negative', percent: -5 },
          { id: 'c', label: 'Over', percent: 112 },
        ]}
      />,
    );
    expect(container.textContent).not.toMatch(/Infinity|NaN/);
    expect(screen.getAllByText('0%').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('112%')).toBeInTheDocument();
  });

  it('labels the limits group and keeps the plan name in a title', () => {
    render(<AgentLimits plan="Max (5x)" limits={[{ id: 'a', label: '5-hour limit', percent: 10 }]} />);
    expect(screen.getByRole('group', { name: 'Plan usage limits' })).toBeInTheDocument();
    expect(screen.getByTitle('Max (5x)')).toBeInTheDocument();
  });
});
