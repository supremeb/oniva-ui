import { LayoutGrid, List } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { SegmentedControl, SegmentedControlItem } from './SegmentedControl';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 380, alignItems: 'flex-start' } as const;

const demo: DemoModule = {
  meta: {
    title: 'SegmentedControl',
    slug: 'segmented-control',
    category: 'Forms',
    description: 'Inset track with a white selected pill. Single choice, arrow-key navigation.',
  },
  demos: [
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
            <SegmentedControlItem value="list"><List size={14} /> List</SegmentedControlItem>
            <SegmentedControlItem value="grid"><LayoutGrid size={14} /> Grid</SegmentedControlItem>
          </SegmentedControl>
          <SegmentedControl fullWidth aria-label="Billing" defaultValue="monthly">
            <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
            <SegmentedControlItem value="yearly">Yearly (save 20%)</SegmentedControlItem>
          </SegmentedControl>
        </div>
      ),
    },
  ],
};

export default demo;
