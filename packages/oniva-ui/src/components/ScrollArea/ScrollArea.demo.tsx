import * as stylex from '@stylexjs/stylex';
import type { DemoModule } from '../../internal/demo';
import { demoStyles } from '../../internal/nav-demo';
import { ScrollArea } from './ScrollArea';

const events = [
  ['Invoice INV-2041 paid', '$4,280.00'],
  ['Payout to Northwind Ltd', '$12,900.00'],
  ['Subscription renewed', '$249.00'],
  ['Refund issued to J. Alvarez', '$68.50'],
  ['Invoice INV-2042 sent', '$1,150.00'],
  ['Card ending 4242 added', ''],
  ['Payout to Helix Labs', '$7,320.00'],
  ['Invoice INV-2043 overdue', '$890.00'],
  ['Member Priya Nair invited', ''],
  ['Tax report generated', ''],
];

const demo: DemoModule = {
  meta: {
    title: 'Scroll Area',
    slug: 'scroll-area',
    category: 'Layout',
    description: 'Scroll container with slim themed scrollbars; keyboard focusable.',
  },
  demos: [
    {
      name: 'Vertical',
      code: `<ScrollArea aria-label="Recent activity" maxHeight={200}>…</ScrollArea>`,
      Component: () => (
        <ScrollArea aria-label="Recent activity" maxHeight={200} xstyle={undefined}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingInlineEnd: 8 }}>
            {events.map(([t, a]) => (
              <div key={t} {...stylex.props(demoStyles.tile)} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t}</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      ),
    },
    {
      name: 'Horizontal',
      code: `<ScrollArea aria-label="Pipeline" orientation="horizontal">…</ScrollArea>`,
      Component: () => (
        <ScrollArea aria-label="Pipeline" orientation="horizontal" maxWidth={420}>
          <div style={{ display: 'flex', gap: 8, paddingBottom: 8, width: 'max-content' }}>
            {['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'].map((s) => (
              <div key={s} {...stylex.props(demoStyles.tile)} style={{ width: 140 }}>
                {s}
              </div>
            ))}
          </div>
        </ScrollArea>
      ),
    },
  ],
};
export default demo;
