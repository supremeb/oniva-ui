import { GitMerge, MessageSquare, Rocket, TriangleAlert } from 'lucide-react';
import { Timeline, type TimelineEvent } from 'oniva-ui';
import type { DocPage } from '../types';

const events: TimelineEvent[] = [
  { id: '1', time: '2026-10-12T14:20:00Z', actor: 'Priya Nair', action: 'deployed v2.8.0 to production', icon: <Rocket size={14} />, tone: 'success', details: 'Rolled out to 100% of traffic. No errors in the first 15 minutes.' },
  { id: '2', time: '2026-10-12T11:05:00Z', actor: 'Marcus Okafor', action: 'merged pull request #482', icon: <GitMerge size={14} />, tone: 'info' },
  { id: '3', time: '2026-10-11T16:40:00Z', actor: 'CI', action: 'failed on webhook retry tests', icon: <TriangleAlert size={14} />, tone: 'danger', details: '3 of 214 tests failed in webhook-retry.spec.ts.' },
  { id: '4', time: '2026-10-11T09:12:00Z', actor: 'Lena Schmidt', action: 'commented on the launch checklist', icon: <MessageSquare size={14} /> },
];

const Demo = (p: { events?: TimelineEvent[]; today?: string }) => (
  <div style={{ width: 420 }}>
    <Timeline aria-label="Activity" events={p.events ?? events} today={p.today ?? '2026-10-12'} locale="en-US" />
  </div>
);

const page: DocPage = {
  slug: 'timeline',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Timeline',
  group: ['Components', 'Data display'],
  sourcePath: 'components/Timeline',
  lede: 'A vertical activity history grouped by day, with tone-coded icons and expandable details.',
  anatomy: {
    intro: 'Six parts. Day heading, rail, actor line and time are always present; icon, tone and details are optional.',
    Render: () => <Demo />,
    parts: [
      { name: 'Day heading', description: '12px semibold, uppercase, muted. Reads "Today · Monday, October 12" or "Yesterday · ..." relative to today.', selector: 'section[aria-label^="Today"] h3' },
      { name: 'Marker', description: '28px circle with a 2px surface ring. Neutral or tinted by tone (info, success, warning, danger); holds a 14px icon.', selector: 'section[aria-label^="Today"] ol > li:first-child > div > span[aria-hidden="true"]' },
      { name: 'Rail', description: '1px line in the border color joining markers within a day. Omitted after the last item.', selector: 'section[aria-label^="Today"] ol > li:first-child > div > span:last-child' },
      { name: 'Event text', description: 'Actor in the title style followed by the action, 14px on a 20px line.', selector: 'section[aria-label^="Today"] ol > li:first-child > div:last-child > div > span:first-child' },
      { name: 'Time', description: '12px muted, tabular numerals, right-aligned (for example 2:20 PM). A time element with dateTime.', selector: 'section[aria-label^="Today"] time' },
      { name: 'Details toggle', description: '"Show details" button with a 14px chevron. Opens an inset panel (8px radius, 13px muted text, 10px padding).', selector: 'section[aria-label^="Today"] button[aria-expanded]' },
    ],
  },
  usage: {
    use: ['Audit logs and activity feeds for one object.', 'Order, deployment or ticket history.', 'Events that may need detail on demand.'],
    avoid: [
      { text: 'Steps the user must complete.', instead: { slug: 'stepper', label: 'Stepper' } },
      { text: 'Messages to triage.', instead: { slug: 'inbox-list', label: 'InboxList' } },
      { text: 'Work organized by stage.', instead: { slug: 'kanban', label: 'Kanban' } },
    ] ,
  },
  playground: {
    controls: [
      { kind: 'number', key: 'count', label: 'Events', min: 1, max: 4, step: 1 },
      { kind: 'select', key: 'today', label: 'Today is', options: ['2026-10-12', '2026-10-13', '2026-11-30'] },
    ],
    initial: { count: 4, today: '2026-10-12' },
    render: (p) => <Demo events={events.slice(0, Number(p.count))} today={String(p.today)} />,
    code: (p) => `<Timeline aria-label="Activity" today="${p.today}" events={[\n  { id: '1', time: '2026-10-12T14:20:00Z', actor: 'Priya Nair', action: 'deployed v2.8.0', tone: 'success', details: 'Rolled out to 100%.' },\n]} />`,
  },
  states: [
    { name: 'Grouped by day', description: 'Today and Yesterday labels from the today prop.', Render: () => <Demo /> },
    { name: 'Single event', description: 'No rail below the only marker.', Render: () => <Demo events={events.slice(0, 1)} /> },
    { name: 'Older dates', description: 'Beyond yesterday the full weekday and date show.', Render: () => <Demo today="2026-11-30" events={events.slice(1, 3)} /> },
    { name: 'Empty', description: 'The component renders nothing for no events. Show your own message.', Render: () => <div style={{ width: 420, fontSize: 14, color: 'var(--oniva-color-text-muted)' }}>No activity yet. Changes to this order will appear here.</div> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Newest first', body: 'Events render in input order. Sort descending before passing them in.' },
      { title: 'Tone carries meaning', body: 'Success for completed, danger for failures, warning for risk, info for neutral system changes. Leave user comments neutral.' },
      { title: 'Details for the long tail', body: 'Keep the line to one sentence. Logs, diffs and payloads go in details.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With Tabs', body: 'Filter All, Comments and System events by passing a filtered array.' },
      { title: 'With Avatar', body: 'Use an Avatar as the icon for people, or an icon for systems.' },
    ] },
  ],
  content: { rules: [
    { title: 'Actor', body: 'A name or system, not "User".' },
    { title: 'Action', body: 'Past tense, lowercase, no actor repeated: "merged pull request #482".' },
    { title: 'Time', body: 'ISO string in; the component formats the local clock time. Always include a time zone note elsewhere on the page if it matters.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves between Show details buttons.' },
      { keys: ['Enter', 'Space'], action: 'Toggles the details panel.' },
    ],
    notes: ['Each day is a section labelled by its date, containing an ordered list.', 'Markers and the rail are aria-hidden; tone is not conveyed by color alone, so state the outcome in the action text.', 'Time uses a time element with dateTime.', 'The toggle has aria-expanded and aria-controls; the closed panel is inert and not reachable.'],
    reducedMotion: 'The panel height and chevron transitions are removed.',
  },
  props: [
    { name: 'events', type: 'TimelineEvent[]', description: 'id, time (ISO), actor, action, icon?, tone?, details?.' },
    { name: 'today', type: 'string (YYYY-MM-DD)', description: 'Reference date for Today and Yesterday.' },
    { name: 'locale', type: 'string', description: 'Day heading locale.' },
    { name: 'TimelineEvent.tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", default: "'neutral'", description: 'Marker tint.' },
    { name: 'TimelineEvent.details', type: 'ReactNode', description: 'Adds the Show details toggle.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['stepper', 'kanban', 'inbox-list', 'accordion'],
};
export default page;
