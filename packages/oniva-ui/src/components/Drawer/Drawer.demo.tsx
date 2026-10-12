import { Button } from '../Button';
import { DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../Dialog';
import type { DemoModule } from '../../internal/demo';
import { Drawer, DrawerTrigger, type DrawerSide } from './Drawer';

const rows = [
  ['Starter plan', '$29.00'],
  ['Extra seats (3)', '$27.00'],
  ['Tax (Georgia, 7%)', '$3.92'],
] as const;

function Panel({ side, label }: { side: DrawerSide; label: string }) {
  return (
    <DrawerTrigger>
      <Button variant="secondary">{label}</Button>
      <Drawer side={side}>
        {({ close }) => (
          <>
            <DialogHeader>
              <DialogTitle>Order #48213</DialogTitle>
              <DialogDescription>Placed Oct 9, 2026 by Priya Nair</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div style={{ display: 'grid', gap: 10, fontVariantNumeric: 'tabular-nums' }}>
                {rows.map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>Total</span>
                  <span>$59.92</span>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="secondary" onPress={close}>
                Close
              </Button>
              <Button onPress={close}>Refund</Button>
            </DialogFooter>
          </>
        )}
      </Drawer>
    </DrawerTrigger>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Drawer',
    slug: 'drawer',
    category: 'Overlays',
    description:
      'Sheet that slides in from the left, right or bottom edge on the 0.32/0.72/0/1 curve (400ms in, 300ms out). Drag it toward its edge to dismiss: pointer plus velocity, rubber-banding the other way, backdrop tied to the drag. Same focus trap and Esc handling as Dialog.',
  },
  demos: [
    {
      name: 'Right sheet',
      code: `<DrawerTrigger>
  <Button variant="secondary">Order details</Button>
  <Drawer side="right">
    {({ close }) => (<>
      <DialogHeader><DialogTitle>Order #48213</DialogTitle></DialogHeader>
      <DialogBody>…</DialogBody>
      <DialogFooter><Button onPress={close}>Close</Button></DialogFooter>
    </>)}
  </Drawer>
</DrawerTrigger>`,
      Component: () => <Panel side="right" label="Order details" />,
    },
    {
      name: 'Left and bottom',
      code: `<Drawer side="left">…</Drawer>
<Drawer side="bottom">…</Drawer>`,
      Component: () => (
        <div style={{ display: 'flex', gap: 12 }}>
          <Panel side="left" label="Open left" />
          <Panel side="bottom" label="Open bottom" />
        </div>
      ),
    },
  ],
};

export default demo;
