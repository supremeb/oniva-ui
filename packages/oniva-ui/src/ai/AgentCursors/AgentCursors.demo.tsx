import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { AgentCursors, acceptSuggestion, type AgentCursor, type CursorAgent, type DocBlock, type DocComment, type DocSuggestion } from './AgentCursors';

const agents: CursorAgent[] = [
  { id: 'research', name: 'Researcher', color: '#6d5ae6', cost: 0.18 },
  { id: 'writer', name: 'Writer', color: '#0e9f8e', cost: 0.27 },
  { id: 'design', name: 'Designer', color: '#d9467a', cost: 0.22 },
  { id: 'coder', name: 'Coder', color: '#d98a0e', cost: 0.14 },
];
const blocks0: DocBlock[] = [
  { id: 'title', kind: 'title', text: 'Pricing page launch brief' },
  { id: 'why', kind: 'paragraph', text: 'Trial-to-paid conversion rose by 12% after the new plan comparison shipped, and support tickets about billing fell.' },
  { id: 'h', kind: 'heading', text: 'Next steps' },
  { id: 'l1', kind: 'item', text: 'Announce the Team plan to existing customers' },
  { id: 'l2', kind: 'item', text: 'Update the annual discount in the checkout' },
  { id: 'hero', kind: 'image', text: 'Hero, 480 x 176', alt: 'Hero image', ratio: 2.7, loading: true },
  { id: 'code', kind: 'code', text: 'const plans = ["Starter", "Team", "Scale"];' },
];
const sugg0: DocSuggestion[] = [
  { id: 's1', agent: 'research', block: 'why', at: 33, remove: 3, insert: '18%', note: 'The dashboard export shows 18% for the same cohort.' },
  { id: 's2', agent: 'writer', block: 'l1', at: 44, insert: ' by email this week', note: 'Adds a date so the owner is clear.' },
];
const cursors0: Record<string, AgentCursor | null> = {
  research: { block: 'why', at: 33, select: 3, doing: 'Checking the numbers' },
  writer: { block: 'l2', at: 26, doing: 'Adding detail', typing: true },
  design: { block: 'hero', doing: 'Resizing the hero' },
  coder: { block: 'code', at: 36, doing: 'Fixing the plan list' },
};
const comments0: DocComment[] = [{ id: 'c1', agent: 'writer', block: 'h', text: 'Should Scale be listed here too?' }];

function Live() {
  const [doc, setDoc] = useState({ blocks: blocks0, suggestions: sugg0 });
  const [comments, setComments] = useState(comments0);
  return (
    <AgentCursors
      title="Launch brief"
      agents={agents}
      blocks={doc.blocks}
      suggestions={doc.suggestions}
      cursors={cursors0}
      comments={comments}
      onResolveComment={(c) => setComments((l) => l.filter((x) => x.id !== c.id))}
      onAccept={(s) => setDoc((d) => acceptSuggestion(d.blocks, d.suggestions, s.id))}
      onReject={(s) => setDoc((d) => ({ ...d, suggestions: d.suggestions.filter((x) => x.id !== s.id) }))}
      onAcceptAll={() => setDoc((d) => d.suggestions.reduce((acc, s) => acceptSuggestion(acc.blocks, acc.suggestions, s.id), d))}
    />
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Agent cursors',
    slug: 'agent-cursors',
    category: 'AI & Agent',
    description: 'Agents edit a document like teammates: live pointers with flags, selections, and suggestions you accept or reject.',
  },
  demos: [
    {
      name: 'Document with suggestions',
      code: `<AgentCursors agents={agents} blocks={doc.blocks} suggestions={doc.suggestions} cursors={cursors}
  onAccept={(s) => setDoc((d) => acceptSuggestion(d.blocks, d.suggestions, s.id))} onReject={reject} />`,
      Component: Live,
    },
    {
      name: 'Following one agent',
      code: `<AgentCursors agents={agents} blocks={blocks} cursors={cursors} defaultFollowing="writer" height={260} />`,
      Component: () => <AgentCursors agents={agents} blocks={blocks0} cursors={cursors0} defaultFollowing="writer" height={260} title="Brief" />,
    },
  ],
};

export default demo;
