import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ProjectCard, type ProjectTask } from './ProjectCard';

const tasks = (): ProjectTask[] => [
  { id: 'welcome', label: 'Welcome screen', done: true, assignee: 'Mara' },
  { id: 'workspace', label: 'Workspace setup', done: true, assignee: 'Jonas' },
  { id: 'invite', label: 'Invite teammates', assignee: 'Mara' },
];
const members = [{ name: 'Mara' }, { name: 'Jonas' }];

describe('ProjectCard', () => {
  it('has a head button whose name carries the summary and toggles open', () => {
    render(<ProjectCard title="Onboarding flow" tasks={tasks()} status="progress" due="Oct 24" members={members} />);
    const head = screen.getByRole('button', { name: 'Onboarding flow, 2 of 3 done, In progress, due Oct 24' });
    expect(head).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(head);
    expect(head).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps inner content inert while closed', () => {
    const { container } = render(<ProjectCard title="Onboarding flow" tasks={tasks()} />);
    expect(container.querySelector('[inert]')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: 'Invite teammates' })).toBeNull();
  });

  it('ticks a subtask and calls onTasksChange with the full list', () => {
    const onTasksChange = vi.fn();
    render(<ProjectCard title="Onboarding flow" tasks={tasks()} onTasksChange={onTasksChange} defaultOpen members={members} />);
    fireEvent.click(screen.getByRole('checkbox', { name: /Invite teammates/ }));
    const next = onTasksChange.mock.calls[0]![0] as ProjectTask[];
    expect(next).toHaveLength(3);
    expect(next[2]!.done).toBe(true);
  });

  it('ticks in uncontrolled mode and updates the tray count', () => {
    render(<ProjectCard title="Onboarding flow" tasks={tasks()} defaultOpen />);
    expect(screen.getByText('1 left')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox', { name: /Invite teammates/ }));
    expect(screen.getByText('All done')).toBeInTheDocument();
  });

  it('filters by person and picks a status', () => {
    const onStatusChange = vi.fn();
    render(<ProjectCard title="Onboarding flow" tasks={tasks()} members={members} defaultOpen onStatusChange={onStatusChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Mara' }));
    expect(screen.getByRole('button', { name: 'Mara' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Mara: 2 tasks')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'To do' }));
    fireEvent.click(screen.getByRole('radio', { name: 'In review' }));
    expect(onStatusChange).toHaveBeenCalledWith('review');
  });

  it('closes with Escape (status first) and opens with the keyboard-activated head', () => {
    render(<ProjectCard title="Onboarding flow" tasks={tasks()} defaultOpen />);
    const head = screen.getByRole('button', { name: /Onboarding flow/ });
    fireEvent.click(screen.getByRole('button', { name: 'To do' }));
    fireEvent.keyDown(head, { key: 'Escape' });
    expect(head).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(head, { key: 'Escape' });
    expect(head).toHaveAttribute('aria-expanded', 'false');
  });

  it('runs the action and forwards ref/className', () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<ProjectCard title="Onboarding flow" tasks={tasks()} defaultOpen action={{ label: 'Open', onClick }} ref={ref} className="x" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(onClick).toHaveBeenCalled();
    expect(ref.current).toHaveClass('x');
  });
});
