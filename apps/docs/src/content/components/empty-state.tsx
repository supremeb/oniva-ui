import { FileText, Inbox, SearchX } from 'lucide-react';
import { Button, EmptyState } from 'oniva-ui';
import type { DocPage } from '../types';

const Demo = (p: { bordered?: boolean; icon?: boolean; actions?: boolean; title?: string; description?: string; kind?: 'first' | 'search' | 'error' }) => {
  const kind = p.kind ?? 'first';
  const copy = {
    first: { title: 'No invoices yet', description: 'Invoices you send appear here. Create your first one to start tracking payments.', icon: <FileText size={20} />, primary: 'Create invoice', secondary: 'Import from CSV' },
    search: { title: 'No invoices match "Harbor"', description: 'Nothing found in Paid or Pending. Try a shorter search, or clear the filters.', icon: <SearchX size={20} />, primary: 'Clear filters', secondary: 'Search all invoices' },
    error: { title: 'Couldn\'t load invoices', description: 'The connection dropped before we got your invoices. Your data is safe.', icon: <Inbox size={20} />, primary: 'Try again', secondary: '' },
  }[kind];
  return (
    <div style={{ width: 460 }}>
      <EmptyState
        bordered={p.bordered}
        icon={p.icon === false ? undefined : copy.icon}
        title={p.title ?? copy.title}
        description={p.description ?? copy.description}
        actions={p.actions === false ? undefined : <><Button size="sm">{copy.primary}</Button>{copy.secondary && <Button size="sm" variant="ghost">{copy.secondary}</Button>}</>}
      />
    </div>
  );
};

const page: DocPage = {
  slug: 'empty-state',
  status: 'Stable',
  version: '0.1.0',
  importName: 'EmptyState',
  group: ['Components', 'Feedback'],
  sourcePath: 'components/EmptyState',
  lede: 'What to show when there is nothing to show: a first-use page, a search with no matches, or a load that failed. It says what happened and offers a way forward.',
  anatomy: {
    intro: 'Five parts. The title is required; icon, description, actions and the dashed frame are optional.',
    Render: () => <Demo bordered />,
    parts: [
      { name: 'Frame', description: 'Optional dashed 1px outline with a 16px radius, for empty table and list areas. 32px padding, 4px gap.', selector: 'h3' },
      { name: 'Icon tile', description: '48px raised tile, 12px radius, 1px border, sm shadow, muted icon. Decorative.', selector: 'span[aria-hidden="true"]' },
      { name: 'Title', description: 'An h3, 16px semibold. Says what happened.', selector: 'h3' },
      { name: 'Description', description: '14px muted, 360px max width. Says why and what next.', selector: 'p' },
      { name: 'Actions', description: 'Row of buttons 16px below the text. One primary action, one optional secondary.', selector: 'button:first-of-type' },
    ],
  },
  usage: {
    use: ['A new area before any data exists.', 'A search or filter with no matches.', 'A failed load where retry is possible.'],
    avoid: [
      { text: 'Notices above existing content.', instead: { slug: 'alert', label: 'Alert' } },
      { text: 'Content that is still loading.', instead: { slug: 'skeleton', label: 'Skeleton' } },
      { text: 'A short placeholder in a field.', instead: { slug: 'input', label: 'Input' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'kind', label: 'Situation', options: ['first', 'search', 'error'] },
      { kind: 'toggle', key: 'bordered', label: 'Dashed frame' },
      { kind: 'toggle', key: 'icon', label: 'Icon' },
      { kind: 'toggle', key: 'actions', label: 'Actions' },
    ],
    initial: { kind: 'first', bordered: false, icon: true, actions: true },
    render: (p) => <Demo kind={p.kind as 'first' | 'search' | 'error'} bordered={Boolean(p.bordered)} icon={Boolean(p.icon)} actions={Boolean(p.actions)} />,
    code: (p) => `<EmptyState${p.bordered ? ' bordered' : ''}\n  ${p.icon ? 'icon={<FileText size={20} />}\n  ' : ''}title="No invoices yet"\n  description="Invoices you send appear here."${p.actions ? '\n  actions={<Button size="sm">Create invoice</Button>}' : ''}\n/>`,
  },
  states: [
    { name: 'First use', description: 'Nothing created yet: explain the value and offer the first step.', Render: () => <Demo kind="first" /> },
    { name: 'No results', description: 'Search or filters removed everything: name the cause and offer a reset.', Render: () => <Demo kind="search" bordered /> },
    { name: 'Load failed', description: 'Something broke: say it, reassure, offer a retry.', Render: () => <Demo kind="error" /> },
    { name: 'Text only', description: 'No icon or actions, for tight spaces.', Render: () => <Demo icon={false} actions={false} /> },
  ],
  sections: [
    { type: 'numbered', id: 'pattern', title: 'The three-part pattern', intro: 'Every empty state does three things, in this order.', items: [
      { title: 'Say what happened', body: 'The title names the situation in plain words: "No invoices match \'Harbor\'", "Couldn\'t load invoices". Not "Oops" and not "Nothing here".' },
      { title: 'Offer a way forward', body: 'One primary action that fixes it: Create invoice, Clear filters, Try again. A secondary action for the second-best path.' },
      { title: 'Suggest close matches', body: 'For searches, show what is near: "Did you mean Harbor Co.?", recent searches, or the filters that hid results. Add them in children, under the description.' },
    ] },
    { type: 'itemTypes', id: 'kinds', title: 'Which situation', intro: 'Three situations need different words and actions.', items: [
      { name: 'First use', description: 'Teach and invite. Describe what will live here and offer the creation action.', Render: () => <span style={{ fontSize: 13 }}>No invoices yet</span> },
      { name: 'No results', description: 'Reflect the query, name the filters, offer clear or broaden.', Render: () => <span style={{ fontSize: 13 }}>No invoices match "Harbor"</span> },
      { name: 'Error', description: 'Own the failure, say data is safe if true, offer Try again and a status link.', Render: () => <span style={{ fontSize: 13 }}>Couldn't load invoices</span> },
    ] },
    { type: 'dodont', id: 'dodont', title: 'Do and don\'t', items: [
      { kind: 'do', caption: 'Explain, then act.', example: () => <Demo kind="search" /> },
      { kind: 'dont', caption: 'Dead end: no cause, no action.', example: () => <Demo title="Nothing here" description="" actions={false} icon={false} /> },
    ] },
  ],
  content: { rules: [
    { title: 'Title', body: 'Sentence case, no period, a fact. Reflect the user query when there is one.' },
    { title: 'Description', body: 'One or two sentences, under 120 characters. Cause, then next step.' },
    { title: 'Actions', body: 'Verb first, matching the title: Create invoice, Clear filters. One primary.' },
    { title: 'Tone', body: 'Plain. No jokes in error states, no blame.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Reaches the action buttons.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused button.' },
    ],
    notes: ['The title is an h3; keep heading levels sequential in the surrounding page.', 'The icon tile is aria-hidden.', 'When results change to empty after a search, announce it with a polite live region ("No results for Harbor").', 'When the empty state replaces a control the user was on, move focus to its primary action.'],
  },
  props: [
    { name: 'title', type: 'ReactNode', description: 'Required. Says what happened.' },
    { name: 'description', type: 'ReactNode', description: 'Why and what next.' },
    { name: 'icon', type: 'ReactNode', description: 'Icon or illustration in a raised tile.' },
    { name: 'actions', type: 'ReactNode', description: 'Buttons below the text.' },
    { name: 'children', type: 'ReactNode', description: 'Extra content such as close matches, between the description and actions.' },
    { name: 'bordered', type: 'boolean', default: 'false', description: 'Dashed outline.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['alert', 'data-table', 'table', 'skeleton', 'filter-bar'],
};
export default page;
