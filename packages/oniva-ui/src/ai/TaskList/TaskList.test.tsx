import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TaskList } from './TaskList';

describe('TaskList', () => {
  it('renders each status', () => {
    render(
      <TaskList
        items={[
          { id: '1', label: 'Load CSV', status: 'done' },
          { id: '2', label: 'Group by segment', status: 'running' },
          { id: '3', label: 'Draft summary', status: 'pending' },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items.map((i) => i.getAttribute('data-status'))).toEqual(['done', 'running', 'pending']);
    expect(screen.getByRole('status', { name: 'In progress' })).toBeInTheDocument();
    expect(screen.getByText(/Completed/)).toBeInTheDocument();
  });

  it('announces done and pending status to assistive tech', () => {
    render(
      <TaskList
        items={[
          { id: '1', label: 'Load CSV', status: 'done' },
          { id: '2', label: 'Draft summary', status: 'pending' },
        ]}
      />,
    );
    const [done, pending] = screen.getAllByRole('listitem');
    expect(done).toHaveTextContent('Load CSV (Completed)');
    expect(pending).toHaveTextContent('Draft summary (Pending)');
  });

  it('forwards ref and className, and renders an empty list', () => {
    const ref = { current: null as HTMLOListElement | null };
    render(<TaskList ref={ref} className="x" items={[]} />);
    expect(ref.current).toBeInstanceOf(HTMLOListElement);
    expect(ref.current).toHaveClass('x');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
