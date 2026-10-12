import * as stylex from '@stylexjs/stylex';
import type { DemoModule } from '../../internal/demo';
import { demoStyles } from '../../internal/nav-demo';
import { Separator } from './Separator';

const demo: DemoModule = {
  meta: {
    title: 'Separator',
    slug: 'separator',
    category: 'Layout',
    description: 'A hairline divider between content groups, horizontal or vertical. Built on React Aria Separator.',
  },
  demos: [
    {
      name: 'Horizontal',
      code: `<Separator />`,
      Component: () => (
        <div style={{ maxWidth: 360 }} {...stylex.props(demoStyles.panel)}>
          <div style={{ fontWeight: 500 }}>Invoice INV-2041</div>
          <div style={{ margin: '4px 0 12px' }} {...stylex.props(demoStyles.muted)}>Due Nov 14, 2026</div>
          <Separator />
          <div style={{ marginTop: 12 }}>Total: $4,280.00</div>
        </div>
      ),
    },
    {
      name: 'Vertical',
      code: `<div style={{ display: 'flex', gap: 12, height: 20 }}>
  <span>Overview</span><Separator orientation="vertical" /><span>Activity</span><Separator orientation="vertical" /><span>Billing</span>
</div>`,
      Component: () => (
        <div style={{ display: 'flex', gap: 12, height: 20, alignItems: 'center' }} {...stylex.props(demoStyles.panel)}>
          <span>Overview</span>
          <Separator orientation="vertical" />
          <span>Activity</span>
          <Separator orientation="vertical" />
          <span>Billing</span>
        </div>
      ),
    },
  ],
};
export default demo;
