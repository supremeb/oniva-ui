import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { AgentLanes, type LaneAgent, type LaneTask } from './AgentLanes';

const NOW = Date.UTC(2026, 9, 26, 15, 0, 0);
const MIN = 60_000;
const agents: LaneAgent[] = [
  { id: 'r', name: 'Researcher', model: 'Atlas 2' },
  { id: 'w', name: 'Writer', model: 'Nova Pro' },
  { id: 'q', name: 'Reviewer' },
];
const tasks: LaneTask[] = [
  { id: 't1', agentId: 'r', title: 'Compare vendors', status: 'done', start: NOW - 25 * MIN, end: NOW - 12 * MIN, handoffTo: 't2', summary: ['Found 5 vendors', 'Built a table'] },
  { id: 't2', agentId: 'w', title: 'Draft brief', status: 'waiting', start: NOW - 11 * MIN, ask: 'Publish the draft to the team wiki?' },
];


const stubReduce = () =>
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }));

describe('AgentLanes', () => {
  it('renders blocks and still opens decisions under prefers-reduced-motion', () => {
    stubReduce();
    render(<AgentLanes agents={agents} tasks={tasks} now={NOW} />);
    fireEvent.click(screen.getByRole('button', { name: /Draft brief/ }));
    expect(screen.getByRole('dialog', { name: 'Decision: Draft brief' })).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it('renders a labelled list per agent with described blocks', () => {
    render(<AgentLanes agents={agents} tasks={tasks} now={NOW} />);
    expect(screen.getByRole('list', { name: 'Researcher' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Reviewer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Researcher: Compare vendors, done/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Writer: Draft brief, needs you/ })).toBeInTheDocument();
    expect(screen.getAllByText('Idle')).toHaveLength(2);
  });

  it('opens the decision popover and approves', () => {
    const onApprove = vi.fn();
    render(<AgentLanes agents={agents} tasks={tasks} now={NOW} onApprove={onApprove} />);
    const block = screen.getByRole('button', { name: /Draft brief/ });
    fireEvent.click(block);
    expect(screen.getByRole('dialog', { name: 'Decision: Draft brief' })).toHaveTextContent('Publish the draft');
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(onApprove).toHaveBeenCalledWith(expect.objectContaining({ id: 't2' }));
  });

  it('changes status itself without handlers', () => {
    render(<AgentLanes agents={agents} tasks={tasks} now={NOW} />);
    fireEvent.click(screen.getByRole('button', { name: /Draft brief/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }));
    expect(screen.getByRole('button', { name: /Draft brief, failed/ })).toBeInTheDocument();
  });

  it('shows a summary popover with Open for non-waiting blocks', () => {
    const onOpen = vi.fn();
    render(<AgentLanes agents={agents} tasks={tasks} now={NOW} onOpen={onOpen} />);
    fireEvent.click(screen.getByRole('button', { name: /Compare vendors/ }));
    expect(screen.getByText('Found 5 vendors')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpen).toHaveBeenCalled();
  });

  it('forwards ref/className and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<AgentLanes ref={ref} className="x" agents={agents} tasks={tasks} now={NOW} />);
    expect(ref.current).toHaveClass('x');
    await expectNoA11yViolations(container);
  });
});
