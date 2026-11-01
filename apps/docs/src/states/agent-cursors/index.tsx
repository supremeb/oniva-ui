import { AgentCursors } from 'oniva-ui';
import type { AgentCursor, CursorAgent, DocBlock, DocComment, DocSuggestion } from 'oniva-ui';
import type { ReactNode } from 'react';
import type { StateModule } from '../types';

const agents: CursorAgent[] = [
  { id: 'research', name: 'Researcher', color: '#6d5ae6', cost: 0.18 },
  { id: 'writer', name: 'Writer', color: '#0e9f8e', cost: 0.27 },
  { id: 'design', name: 'Designer', color: '#d9467a', cost: 0.22 },
  { id: 'coder', name: 'Coder', color: '#d98a0e', cost: 0.14 },
];
const plainAgents: CursorAgent[] = [{ id: 'a', name: 'Atlas 2' }, { id: 'b', name: 'Quill Reasoner' }];

const heroSrc =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="176" viewBox="0 0 480 176"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6d5ae6"/><stop offset="1" stop-color="#0e9f8e"/></linearGradient></defs><rect width="480" height="176" fill="url(#g)"/></svg>',
  );

const blocks: DocBlock[] = [
  { id: 'title', kind: 'title', text: 'Pricing page launch brief' },
  { id: 'why', kind: 'paragraph', text: 'Trial-to-paid conversion rose by 12% after the new plan comparison shipped, and support tickets about billing fell.' },
  { id: 'h', kind: 'heading', text: 'Next steps' },
  { id: 'l1', kind: 'item', text: 'Announce the Team plan to existing customers' },
  { id: 'l2', kind: 'item', text: 'Update the annual discount in the checkout' },
  { id: 'l3', kind: 'item', text: 'Send the revised price list to Northwind Labs' },
  { id: 'hero', kind: 'image', text: 'Hero, 480 x 176', alt: 'Hero image', ratio: 2.7, src: heroSrc },
  { id: 'code', kind: 'code', text: 'const plans = ["Starter", "Team", "Scale"];' },
];
const loadingBlocks = blocks.map((b) => (b.id === 'hero' ? { ...b, loading: true } : b));

const longBlocks: DocBlock[] = [
  ...blocks.slice(0, 3),
  { id: 'p2', kind: 'paragraph', text: 'The rollout is split into three phases. Phase one covers existing Team customers, phase two opens the new annual discount to self-serve accounts, and phase three retires the legacy comparison table once the support queue has stayed below its weekly target for two weeks in a row.' },
  { id: 'p3', kind: 'paragraph', text: 'Billing questions were the largest single ticket category in the last quarter, accounting for 31% of conversations tagged by the support team. Most were about proration, so the checkout now shows the exact amount due today before the card is charged.' },
  { id: 'h2', kind: 'heading', text: 'Open questions' },
  { id: 'q1', kind: 'item', text: 'Does the Scale plan keep the 14-day trial?' },
  { id: 'q2', kind: 'item', text: 'Who owns the migration email for legacy Starter accounts?' },
  { id: 'q3', kind: 'item', text: 'Do we show prices in local currency at checkout?' },
  { id: 'p4', kind: 'paragraph', text: 'Appendix: export the dashboard at https://analytics.northwind.example/reports/pricing/experiments/2026-q3/plan-comparison-conversion-by-cohort-and-region?compare=previous-quarter&segment=self-serve-trials-with-card-on-file' },
  { id: 'code', kind: 'code', text: 'const plans = ["Starter", "Team", "Scale"];\nconst discount = { annual: 0.2, quarterly: 0.1 };\nexport const price = (p: string, term: "annual" | "quarterly") => base[p] * (1 - discount[term]);' },
];

const longWord = 'packages/northwind-billing/src/checkout/proration/exponential-proration-schedule-with-decorrelated-rounding.worker.ts';
const unbroken: DocBlock[] = [
  { id: 'title', kind: 'title', text: 'Reviewing exponentialproration-schedule-with-decorrelated-rounding-and-fallback' },
  { id: 'p', kind: 'paragraph', text: `The failing path is ${longWord} and nothing else in the module touches it.` },
  { id: 'l', kind: 'item', text: longWord },
];

const sugg: DocSuggestion[] = [
  { id: 's1', agent: 'research', block: 'why', at: 33, remove: 3, insert: '18%', note: 'The dashboard export shows 18% for the same cohort.' },
  { id: 's2', agent: 'writer', block: 'l1', at: 44, insert: ' by email this week', note: 'Adds a date so the owner is clear.' },
];
const suggMany: DocSuggestion[] = [
  ...sugg,
  { id: 's3', agent: 'design', block: 'l2', at: 11, remove: 6, note: 'Drop "annual"; the checkout copy already says it.' },
  { id: 's4', agent: 'coder', block: 'code', at: 36, insert: ', "Enterprise"', note: 'Matches the plan list in the billing service.' },
];

const cursorsAll: Record<string, AgentCursor | null> = {
  research: { block: 'why', at: 33, select: 3, doing: 'Checking the numbers' },
  writer: { block: 'l2', at: 26, doing: 'Adding detail', typing: true },
  design: { block: 'hero', doing: 'Resizing the hero' },
  coder: { block: 'code', at: 36, doing: 'Fixing the plan list' },
};

const comments: DocComment[] = [
  { id: 'c1', agent: 'writer', block: 'h', text: 'Should Scale be listed here too?' },
  { id: 'c2', agent: 'research', block: 'why', text: 'Source needed for this figure: the experiment ran for 5 weeks, not 8.' },
];

// The narrow layout only switches on below 520px of page width, which the frame cannot reach; wrap in a fixed box.
const Box = ({ w, children }: { w: number; children: ReactNode }) => <div style={{ width: w }}>{children}</div>;

const mod: StateModule = {
  slug: 'agent-cursors',
  title: 'Agent cursors',
  width: 720,
  groups: [
    {
      label: 'Document',
      states: [
        { id: 'empty', label: 'empty document', render: () => <AgentCursors agents={agents} blocks={[]} title="Untitled" /> },
        { id: 'title-only', label: 'title only', render: () => <AgentCursors agents={agents} blocks={blocks.slice(0, 1)} title="Launch brief" /> },
        { id: 'typical', label: 'typical (every block kind)', render: () => <AgentCursors agents={agents} blocks={blocks} title="Launch brief" /> },
        { id: 'image-loading', label: 'image loading', render: () => <AgentCursors agents={agents} blocks={loadingBlocks} title="Launch brief" /> },
        { id: 'long-clipped', label: 'long doc, fixed height', render: () => <AgentCursors agents={agents} blocks={longBlocks} height={320} title="Launch brief" /> },
        { id: 'long-full', label: 'long doc, full height', render: () => <AgentCursors agents={agents} blocks={longBlocks} title="Launch brief" /> },
        { id: 'unbroken', label: 'long unbroken text', render: () => <AgentCursors agents={agents} blocks={unbroken} title="Reviewing the proration worker for the Northwind Labs checkout rewrite" /> },
        { id: 'narrow', label: 'narrow (400px)', render: () => <Box w={400}><AgentCursors agents={agents} blocks={blocks} suggestions={sugg} cursors={cursorsAll} title="Launch brief" onAcceptAll={() => undefined} /></Box> },
      ],
    },
    {
      label: 'Cursors',
      states: [
        { id: 'no-cursors', label: 'nobody in the document', render: () => <AgentCursors agents={agents} blocks={blocks} title="Launch brief" /> },
        { id: 'one-cursor', label: 'one cursor', render: () => <AgentCursors agents={agents} blocks={blocks} cursors={{ writer: { block: 'l2', at: 26, doing: 'Adding detail' } }} title="Launch brief" /> },
        { id: 'typing', label: 'typing', render: () => <AgentCursors agents={agents} blocks={blocks} cursors={{ writer: { block: 'l2', at: 26, doing: 'Adding detail', typing: true } }} title="Launch brief" /> },
        { id: 'all-agents', label: 'four agents, selection, image', render: () => <AgentCursors agents={agents} blocks={blocks} cursors={cursorsAll} title="Launch brief" /> },
        { id: 'selection-wraps', label: 'selection across wrapped lines', render: () => <AgentCursors agents={agents} blocks={longBlocks} cursors={{ research: { block: 'p2', at: 40, select: 190, doing: 'Reading the rollout plan' } }} title="Launch brief" /> },
        { id: 'no-doing', label: 'cursor without an action', render: () => <AgentCursors agents={agents} blocks={blocks} cursors={{ research: { block: 'why', at: 12 } }} title="Launch brief" /> },
        { id: 'no-color', label: 'agents without colors', render: () => <AgentCursors agents={plainAgents} blocks={blocks} cursors={{ a: { block: 'why', at: 12, doing: 'Reading' }, b: { block: 'l1', at: 9, select: 4, doing: 'Reviewing' } }} title="Launch brief" /> },
        { id: 'following', label: 'following one agent', render: () => <AgentCursors agents={agents} blocks={blocks} cursors={cursorsAll} defaultFollowing="writer" title="Launch brief" /> },
        { id: 'long-flag', label: 'long action text', render: () => <AgentCursors agents={agents} blocks={blocks} cursors={{ coder: { block: 'code', at: 20, doing: 'Reconciling the plan list with the billing service catalog and the checkout config' } }} title="Launch brief" /> },
      ],
    },
    {
      label: 'Suggestions',
      states: [
        { id: 'sugg-replace-insert', label: 'replace and insert', render: () => <AgentCursors agents={agents} blocks={blocks} suggestions={sugg} title="Launch brief" /> },
        { id: 'sugg-single', label: 'single suggestion (no Accept all)', render: () => <AgentCursors agents={agents} blocks={blocks} suggestions={sugg.slice(0, 1)} onAcceptAll={() => undefined} title="Launch brief" /> },
        { id: 'sugg-many', label: 'four suggestions, Accept all', render: () => <AgentCursors agents={agents} blocks={blocks} suggestions={suggMany} onAcceptAll={() => undefined} onAccept={() => undefined} onReject={() => undefined} title="Launch brief" /> },
        { id: 'sugg-remove', label: 'removal only', render: () => <AgentCursors agents={agents} blocks={blocks} suggestions={[suggMany[2]!]} title="Launch brief" /> },
        { id: 'sugg-with-cursor', label: 'suggestion under a selection', render: () => <AgentCursors agents={agents} blocks={blocks} suggestions={sugg.slice(0, 1)} cursors={{ research: cursorsAll.research! }} title="Launch brief" /> },
        { id: 'sugg-no-color', label: 'suggestion, no agent color', render: () => <AgentCursors agents={plainAgents} blocks={blocks} suggestions={[{ id: 'p1', agent: 'a', block: 'why', at: 33, remove: 3, insert: '18%' }]} title="Launch brief" /> },
      ],
    },
    {
      label: 'Comments and cost',
      states: [
        { id: 'comments', label: 'comment pins', render: () => <AgentCursors agents={agents} blocks={blocks} comments={comments} onResolveComment={() => undefined} title="Launch brief" /> },
        { id: 'comments-readonly', label: 'comment pins, no resolve', render: () => <AgentCursors agents={agents} blocks={blocks} comments={comments} title="Launch brief" /> },
        { id: 'no-cost', label: 'no cost shown', render: () => <AgentCursors agents={plainAgents} blocks={blocks} cursors={{ a: { block: 'why', at: 12, doing: 'Reading' } }} title="Launch brief" /> },
        { id: 'custom-cost', label: 'custom cost format', render: () => <AgentCursors agents={agents} blocks={blocks} cursors={cursorsAll} formatCost={(n) => `${Math.round(n * 1000)} credits`} title="Launch brief" /> },
        { id: 'everything', label: 'everything at once', render: () => <AgentCursors agents={agents} blocks={blocks} suggestions={suggMany} cursors={cursorsAll} comments={comments} onAcceptAll={() => undefined} onResolveComment={() => undefined} title="Launch brief" /> },
      ],
    },
  ],
  missing: [
    'Suggestion popover open, comment popover open (internal press state; no defaultOpen prop)',
    'Streaming a suggestion in letter by letter (TypedInsert only animates suggestions added after mount)',
    'Image failed to load (no error branch)',
    'Disabled / read-only document (no such prop)',
    'Empty agents list header state (reachable but meaningless)',
  ],
};
export default mod;
