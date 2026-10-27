import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { AgentCursors, acceptSuggestion, type CursorAgent, type DocBlock, type DocSuggestion } from './AgentCursors';

const agents: CursorAgent[] = [
  { id: 'r', name: 'Researcher', cost: 0.12 },
  { id: 'w', name: 'Writer', cost: 0.3 },
];
const blocks: DocBlock[] = [
  { id: 'title', kind: 'title', text: 'Launch brief' },
  { id: 'why', kind: 'paragraph', text: 'Churn fell by 21% after the new onboarding shipped.' },
  { id: 'a', kind: 'item', text: 'Ship the checklist' },
  { id: 'b', kind: 'item', text: 'Measure activation' },
];
const suggestions: DocSuggestion[] = [
  { id: 's1', agent: 'r', block: 'why', at: 14, remove: 3, insert: '38%', note: 'Dashboard shows 38%.' },
  { id: 's2', agent: 'w', block: 'why', at: 40, insert: ' last quarter' },
];

describe('acceptSuggestion', () => {
  it('writes the change and moves later suggestions along', () => {
    const r = acceptSuggestion(blocks, suggestions, 's1');
    expect(r.blocks.find((b) => b.id === 'why')!.text).toBe('Churn fell by 38% after the new onboarding shipped.');
    expect(r.suggestions).toEqual([{ ...suggestions[1], at: 40 }]);
  });
});

describe('AgentCursors', () => {
  it('renders real text in headings, paragraphs and one list', () => {
    render(<AgentCursors agents={agents} blocks={blocks} />);
    expect(screen.getByRole('heading', { name: 'Launch brief' })).toBeInTheDocument();
    expect(screen.getAllByRole('list')).toHaveLength(1);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('labels suggestions and accepts/rejects them from the dialog', () => {
    const onAccept = vi.fn();
    const onReject = vi.fn();
    render(<AgentCursors agents={agents} blocks={blocks} suggestions={suggestions} onAccept={onAccept} onReject={onReject} />);
    const s = screen.getByRole('button', { name: 'Researcher suggests replacing text with: 38%' });
    fireEvent.click(s);
    expect(screen.getByRole('dialog', { name: 'Suggestion from Researcher' })).toHaveTextContent('Dashboard shows 38%.');
    fireEvent.click(screen.getByRole('button', { name: 'Accept' }));
    expect(onAccept).toHaveBeenCalledWith(suggestions[0]);
    fireEvent.click(screen.getByRole('button', { name: /Writer suggests adding:/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }));
    expect(onReject).toHaveBeenCalledWith(suggestions[1]);
  });

  it('follows an agent via toggle faces and shows Accept all', () => {
    const onFollowingChange = vi.fn();
    const onAcceptAll = vi.fn();
    render(<AgentCursors agents={agents} blocks={blocks} suggestions={suggestions} cursors={{ r: { block: 'why', at: 5, doing: 'Checking numbers' } }} onFollowingChange={onFollowingChange} onAcceptAll={onAcceptAll} />);
    const face = screen.getByRole('button', { name: 'Researcher, Checking numbers' });
    expect(face).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(face);
    expect(onFollowingChange).toHaveBeenCalledWith('r');
    expect(face).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Writer, away' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Accept all' }));
    expect(onAcceptAll).toHaveBeenCalled();
    expect(screen.getByText('$0.42')).toBeInTheDocument();
  });

  it('resolves a comment', () => {
    const onResolveComment = vi.fn();
    render(<AgentCursors agents={agents} blocks={blocks} comments={[{ id: 'c1', agent: 'w', block: 'why', text: 'Source needed for this figure.' }]} onResolveComment={onResolveComment} />);
    fireEvent.click(screen.getByRole('button', { name: 'Comment from Writer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Resolve' }));
    expect(onResolveComment).toHaveBeenCalledWith(expect.objectContaining({ id: 'c1' }));
  });

  it('forwards ref/className and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<AgentCursors ref={ref} className="x" agents={agents} blocks={blocks} suggestions={suggestions} cursors={{ r: { block: 'why', at: 5 } }} />);
    expect(ref.current).toHaveClass('x');
    await expectNoA11yViolations(container);
  });
});
