import { CalendarDays, Columns3, Inbox, LayoutGrid, List, Star } from 'lucide-react';
import { Badge } from '../Badge';
import type { DemoModule } from '../../internal/demo';
import { SegmentedControl, SegmentedControlItem } from './SegmentedControl';

const col = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  maxWidth: 380,
  alignItems: 'flex-start',
} as const;

const lbl = { color: 'var(--oniva-color-text-muted)', fontSize: 13 } as const;
const section = { display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' } as const;
const rule = { borderTop: '1px solid var(--oniva-color-border)', width: '100%' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Segmented control',
    slug: 'segmented-control',
    category: 'Forms',
    description: 'Inset track with a white selected pill. Single choice, arrow-key navigation.',
  },
  demos: [
    {
      name: 'Dashboard sections',
      code: `<SegmentedControl aria-label="Dashboard" defaultValue="reports">
  <SegmentedControlItem value="overview">Overview</SegmentedControlItem>
  <SegmentedControlItem value="notifications" count={3}>Notifications</SegmentedControlItem>
</SegmentedControl>
<SegmentedControl size="sm" aria-label="Layout" defaultValue="board">...</SegmentedControl>
<SegmentedControl variant="underline" aria-label="Billing" defaultValue="yearly">
  <SegmentedControlItem value="yearly" badge={<Badge variant="info">Save 20%</Badge>}>Yearly</SegmentedControlItem>
</SegmentedControl>`,
      Component: () => (
        <div
          style={{
            ...col,
            maxWidth: 480,
            gap: 20,
            padding: 20,
            border: '1px solid var(--oniva-color-border)',
            borderRadius: 16,
            background: 'var(--oniva-color-surface)',
          }}
        >
          <div style={section}>
            <span style={lbl}>Dashboard</span>
            <SegmentedControl aria-label="Dashboard" defaultValue="reports">
              <SegmentedControlItem value="overview">Overview</SegmentedControlItem>
              <SegmentedControlItem value="analytics">Analytics</SegmentedControlItem>
              <SegmentedControlItem value="reports">Reports</SegmentedControlItem>
              <SegmentedControlItem value="notifications" count={3}>
                Notifications
              </SegmentedControlItem>
            </SegmentedControl>
          </div>
          <div style={rule} />
          <div style={section}>
            <span style={lbl}>Layout</span>
            <SegmentedControl size="sm" aria-label="Layout" defaultValue="board">
              <SegmentedControlItem value="list" icon={<List size={14} />}>
                List
              </SegmentedControlItem>
              <SegmentedControlItem value="board" icon={<Columns3 size={14} />}>
                Board
              </SegmentedControlItem>
              <SegmentedControlItem value="calendar" icon={<CalendarDays size={14} />}>
                Calendar
              </SegmentedControlItem>
            </SegmentedControl>
          </div>
          <div style={rule} />
          <div style={section}>
            <span style={lbl}>Billing</span>
            <SegmentedControl variant="underline" aria-label="Billing" defaultValue="yearly">
              <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
              <SegmentedControlItem value="yearly" badge={<Badge variant="info">Save 20%</Badge>}>
                Yearly
              </SegmentedControlItem>
            </SegmentedControl>
          </div>
        </div>
      ),
    },
    {
      name: 'Time range',
      code: `<SegmentedControl aria-label="Time range" defaultValue="30d">
  <SegmentedControlItem value="7d">7 days</SegmentedControlItem>
  <SegmentedControlItem value="30d">30 days</SegmentedControlItem>
  <SegmentedControlItem value="90d">90 days</SegmentedControlItem>
</SegmentedControl>`,
      Component: () => (
        <div style={col}>
          <SegmentedControl aria-label="Time range" defaultValue="30d">
            <SegmentedControlItem value="7d">7 days</SegmentedControlItem>
            <SegmentedControlItem value="30d">30 days</SegmentedControlItem>
            <SegmentedControlItem value="90d">90 days</SegmentedControlItem>
          </SegmentedControl>
        </div>
      ),
    },
    {
      name: 'With icons, small, full width',
      code: `<SegmentedControl size="sm" aria-label="Layout" defaultValue="list">...</SegmentedControl>
<SegmentedControl fullWidth aria-label="Billing" defaultValue="monthly">...</SegmentedControl>`,
      Component: () => (
        <div style={{ ...col, alignItems: 'stretch' }}>
          <SegmentedControl size="sm" aria-label="Layout" defaultValue="list">
            <SegmentedControlItem value="list">
              <List size={14} /> List
            </SegmentedControlItem>
            <SegmentedControlItem value="grid">
              <LayoutGrid size={14} /> Grid
            </SegmentedControlItem>
          </SegmentedControl>
          <SegmentedControl fullWidth aria-label="Billing" defaultValue="monthly">
            <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
            <SegmentedControlItem value="yearly">Yearly (save 20%)</SegmentedControlItem>
          </SegmentedControl>
        </div>
      ),
    },
    {
      name: 'Underline with counts',
      code: `<SegmentedControl variant="underline" aria-label="Inbox view" defaultValue="all">
  <SegmentedControlItem value="all" icon={<Inbox size={14} />} count={128}>All</SegmentedControlItem>
  <SegmentedControlItem value="starred" icon={<Star size={14} />} count={9}>Starred</SegmentedControlItem>
  <SegmentedControlItem value="archived">Archived</SegmentedControlItem>
</SegmentedControl>`,
      Component: () => (
        <div style={{ ...col, alignItems: 'stretch' }}>
          <SegmentedControl variant="underline" aria-label="Inbox view" defaultValue="all">
            <SegmentedControlItem value="all" icon={<Inbox size={14} />} count={128}>
              All
            </SegmentedControlItem>
            <SegmentedControlItem value="starred" icon={<Star size={14} />} count={9}>
              Starred
            </SegmentedControlItem>
            <SegmentedControlItem value="archived">Archived</SegmentedControlItem>
          </SegmentedControl>
        </div>
      ),
    },
  ],
};

export default demo;
