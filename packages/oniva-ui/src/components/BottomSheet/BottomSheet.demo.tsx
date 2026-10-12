import { Button } from '../Button';
import { DialogDescription, DialogTitle } from '../Dialog';
import type { DemoModule } from '../../internal/demo';
import { BottomSheet, BottomSheetTrigger } from './BottomSheet';

const txns = [
  ['Stripe payout', 'Oct 9', '+$12,480.00'],
  ['AWS', 'Oct 8', '-$1,904.22'],
  ['Figma', 'Oct 7', '-$75.00'],
  ['Northwind Traders', 'Oct 7', '+$3,260.00'],
  ['Gusto payroll', 'Oct 5', '-$18,430.10'],
  ['Notion', 'Oct 4', '-$96.00'],
  ['Linear', 'Oct 3', '-$160.00'],
  ['Mercury interest', 'Oct 1', '+$214.37'],
] as const;

function Sheet() {
  return (
    <BottomSheetTrigger>
      <Button variant="secondary">Recent transactions</Button>
      <BottomSheet aria-label="Recent transactions" snapPoints={[0.4, 0.9]}>
        <div style={{ padding: '4px 24px 24px', overflow: 'auto' }}>
          <DialogTitle>Recent transactions</DialogTitle>
          <DialogDescription>Drag the handle to expand, or flick down to dismiss.</DialogDescription>
          <div style={{ display: 'grid', gap: 14, marginTop: 16, fontVariantNumeric: 'tabular-nums' }}>
            {txns.map(([name, date, amt]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  {name} <span style={{ color: 'var(--oniva-color-text-muted)' }}>· {date}</span>
                </span>
                <span>{amt}</span>
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>
    </BottomSheetTrigger>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'BottomSheet',
    slug: 'bottom-sheet',
    category: 'Overlays',
    description:
      'Modal bottom sheet with snap points. Drag between snaps (velocity aware), rubber-band past the top, flick down from the lowest snap to dismiss. Content scrolls only at the top snap.',
  },
  demos: [
    {
      name: 'Snap points',
      code: `<BottomSheetTrigger>
  <Button variant="secondary">Recent transactions</Button>
  <BottomSheet aria-label="Recent transactions" snapPoints={[0.4, 0.9]}>
    …
  </BottomSheet>
</BottomSheetTrigger>`,
      Component: Sheet,
    },
  ],
};

export default demo;
