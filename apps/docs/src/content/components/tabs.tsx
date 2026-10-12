import { Tab, TabList, TabPanel, Tabs } from 'oniva-ui';
import type { DocPage } from '../types';

const Demo = ({ variant = 'line', size = 'md', disabled = false, counts = true, selected = 'invoices' }: { variant?: 'line' | 'pill'; size?: 'sm' | 'md'; disabled?: boolean; counts?: boolean; selected?: string }) => (
  <div style={{ width: 420 }}>
    <Tabs variant={variant} size={size} selectedKey={selected}>
      <TabList aria-label="Workspace">
        <Tab id="overview">Overview</Tab>
        <Tab id="invoices" count={counts ? 12 : undefined}>Invoices</Tab>
        <Tab id="members" isDisabled={disabled}>Members</Tab>
      </TabList>
      <TabPanel id="overview">Revenue is up 8.2% vs. last month.</TabPanel>
      <TabPanel id="invoices">12 invoices are awaiting payment.</TabPanel>
      <TabPanel id="members">4 members, 1 pending invite.</TabPanel>
    </Tabs>
  </div>
);

const page: DocPage = {
  slug: 'tabs',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Tabs',
  group: ['Components', 'Navigation'],
  sourcePath: 'components/Tabs',
  lede: 'Switches between peer views of the same context without leaving the page. Underline tabs for pages, pill tabs for compact toggles.',
  anatomy: {
    intro: 'Five parts. The list, tabs and panel are always present; counts and icons are optional.',
    Render: () => <Demo />,
    parts: [
      { name: 'Tab list', description: 'role="tablist", 4px gap. Line variant has a bottom rule; pill sits on an inset track with 12px radius.', selector: '[role="tablist"]' },
      { name: 'Tab', description: 'Min height 36px (md) or 32px (sm), 14px text, 6px gap to icon. Selected is full color.', selector: '[role="tab"]:first-of-type' },
      { name: 'Selected tab', description: 'aria-selected="true". Line shows a 2px indicator that slides; pill uses a raised 8px radius thumb.', selector: '[role="tab"][aria-selected="true"]' },
      { name: 'Count', description: 'Optional pill, 11px text, 6px side padding, full radius.', selector: '[role="tab"][aria-selected="true"] span:last-child' },
      { name: 'Panel', description: 'role="tabpanel", labelled by its tab. Only the selected panel is mounted.', selector: '[role="tabpanel"]' },
    ],
  },
  usage: {
    use: ['Peer views of one record or page: Overview, Invoices, Members.', 'Filters of the same list when counts help.', 'Compact view toggles with the pill variant.'],
    avoid: [
      { text: 'Steps that must happen in order.', instead: { slug: 'stepper', label: 'Stepper' } },
      { text: 'Navigating between pages or routes with different layouts.', instead: { slug: 'navbar', label: 'Navbar' } },
      { text: 'A single on/off or view choice in a toolbar.', instead: { slug: 'segmented-control', label: 'SegmentedControl' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['line', 'pill'] },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['md', 'sm'] },
      { kind: 'toggle', key: 'counts', label: 'Count badge' },
      { kind: 'toggle', key: 'disabled', label: 'Disable Members' },
    ],
    initial: { variant: 'line', size: 'md', counts: true, disabled: false },
    render: (p, ev) => (
      <div style={{ width: 420 }}>
        <Tabs variant={p.variant as 'line' | 'pill'} size={p.size as 'sm' | 'md'} onSelectionChange={(k) => ev(`onSelectionChange(${String(k)})`)}>
          <TabList aria-label="Workspace">
            <Tab id="overview">Overview</Tab>
            <Tab id="invoices" count={p.counts ? 12 : undefined}>Invoices</Tab>
            <Tab id="members" isDisabled={Boolean(p.disabled)}>Members</Tab>
          </TabList>
          <TabPanel id="overview">Revenue is up 8.2% vs. last month.</TabPanel>
          <TabPanel id="invoices">12 invoices are awaiting payment.</TabPanel>
          <TabPanel id="members">4 members, 1 pending invite.</TabPanel>
        </Tabs>
      </div>
    ),
    code: (p) => `<Tabs${p.variant !== 'line' ? ` variant="${p.variant}"` : ''}${p.size !== 'md' ? ` size="${p.size}"` : ''}>\n  <TabList aria-label="Workspace">\n    <Tab id="overview">Overview</Tab>\n    <Tab id="invoices"${p.counts ? ' count={12}' : ''}>Invoices</Tab>\n    <Tab id="members"${p.disabled ? ' isDisabled' : ''}>Members</Tab>\n  </TabList>\n  <TabPanel id="overview">…</TabPanel>\n</Tabs>`,
  },
  states: [
    { name: 'Line', description: 'Underline indicator, default.', Render: () => <Demo /> },
    { name: 'Pill', description: 'Segmented thumb on an inset track.', Render: () => <Demo variant="pill" /> },
    { name: 'Small', description: '32px tabs for dense toolbars.', Render: () => <Demo size="sm" variant="pill" /> },
    { name: 'Disabled tab', description: 'Skipped by arrow keys.', Render: () => <Demo disabled /> },
    { name: 'No counts', description: 'Plain labels only.', Render: () => <Demo counts={false} /> },
  ],
  sections: [
    { type: 'rules', id: 'tab-recipes', title: 'Composition recipes', items: [{ title: 'Vertical', body: 'orientation="vertical" lays tabs in a column with a 16px gap to the panel.' }, { title: 'Routed tabs', body: 'Control selectedKey from the URL so a tab is shareable.' }, { title: 'With counts', body: 'Use count for pending items, not for static totals.' }] },
    { type: 'numbered', id: 'tab-rules', title: 'Rules', items: [{ title: '2 to 6 tabs', body: 'More overflow; use a Select or Sidebar.' }, { title: 'Keep the order stable', body: 'Never reorder tabs based on use.' }, { title: 'Lazy panels', body: 'Only the selected panel is rendered; fetch its data on select.' }] },
  ],
  content: { rules: [{ title: 'One or two words', body: 'Overview, Invoices.' }, { title: 'Nouns', body: 'Tabs name content, not actions.' }, { title: 'Sentence case', body: 'Payment methods, not Payment Methods.' }] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves focus into the tab list (to the selected tab), then to the panel.' },
      { keys: ['←', '→'], action: 'Moves between tabs and selects (↑ ↓ in vertical).' },
      { keys: ['Home', 'End'], action: 'First and last tab.' },
    ],
    notes: ['role="tablist", "tab" and "tabpanel" with aria-controls and aria-labelledby wired.', 'Disabled tabs are skipped.', 'Give the TabList an aria-label.', 'Tabs are at least 32px tall; use md for touch.'],
    reducedMotion: 'The indicator moves without sliding.',
  },
  props: [
    { name: 'Tabs.variant', type: "'line' | 'pill'", default: "'line'", description: 'Underline or segmented.' },
    { name: 'Tabs.size', type: "'sm' | 'md'", default: "'md'", description: '32px or 36px min height.' },
    { name: 'Tabs.selectedKey / defaultSelectedKey', type: 'Key', description: 'Controlled or initial tab.' },
    { name: 'Tabs.onSelectionChange', type: '(key: Key) => void', description: 'Fires on change.' },
    { name: 'Tabs.orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout and arrow keys.' },
    { name: 'Tabs.keyboardActivation', type: "'automatic' | 'manual'", default: "'automatic'", description: 'Select on focus or on Enter.' },
    { name: 'TabList.aria-label', type: 'string', description: 'Name of the list.' },
    { name: 'Tab.id', type: 'Key', description: 'Required. Links the tab to its panel.' },
    { name: 'Tab.count', type: 'number | string', description: 'Small badge.' },
    { name: 'Tab.icon', type: 'ReactNode', description: 'Leading icon.' },
    { name: 'Tab.isDisabled', type: 'boolean', description: 'Disables the tab.' },
    { name: 'TabPanel.id / shouldForceMount', type: 'Key / boolean', description: 'Matches a tab; keep mounted when hidden.' },
  ],
  related: ['segmented-control', 'stepper', 'navbar', 'breadcrumbs'],
};
export default page;
