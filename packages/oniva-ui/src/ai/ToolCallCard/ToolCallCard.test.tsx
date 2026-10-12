import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToolCallCard } from './ToolCallCard';

describe('ToolCallCard', () => {
  it('shows name, summarized args, and expands to the result', () => {
    render(
      <ToolCallCard name="query_warehouse" args={{ table: 'deals', quarter: 'Q3' }} duration="1.2s">
        412 rows
      </ToolCallCard>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent('query_warehouse');
    expect(btn).toHaveTextContent('table="deals"');
    fireEvent.click(btn);
    expect(screen.getByText('412 rows')).toBeVisible();
  });

  it('exposes the running status', () => {
    render(<ToolCallCard name="run_python" status="running" />);
    expect(screen.getByRole('status', { name: 'Running' })).toBeInTheDocument();
  });
});
