import { useState } from 'react';
import { Input, TextField, Label } from 'react-aria-components';
import { Button } from '../Button';
import type { DemoModule } from '../../internal/demo';
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Modal,
} from './Dialog';

const field = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: 13,
  fontWeight: 500,
} as const;
const input = {
  height: 36,
  borderRadius: 10,
  border: '1px solid var(--oniva-color-border)',
  padding: '0 12px',
  font: 'inherit',
  fontWeight: 400,
  boxSizing: 'border-box',
} as const;

const demo: DemoModule = {
  meta: {
    title: 'Dialog',
    slug: 'dialog',
    category: 'Overlays',
    description:
      'Modal dialog with animated backdrop, focus trap and restore, and Esc to close. Built on React Aria Modal + Dialog.',
  },
  demos: [
    {
      name: 'Invite teammate',
      code: `<DialogTrigger>
  <Button>Invite teammate</Button>
  <Modal>
    <Dialog>
      {({ close }) => (
        <>
          <DialogHeader>
            <DialogTitle>Invite a teammate</DialogTitle>
            <DialogDescription>They will get access to the Q4 Revenue workspace.</DialogDescription>
          </DialogHeader>
          <DialogBody>…</DialogBody>
          <DialogFooter>
            <Button variant="secondary" onPress={close}>Cancel</Button>
            <Button onPress={close}>Send invite</Button>
          </DialogFooter>
        </>
      )}
    </Dialog>
  </Modal>
</DialogTrigger>`,
      Component: () => (
        <DialogTrigger>
          <Button>Invite teammate</Button>
          <Modal>
            <Dialog>
              {({ close }) => (
                <>
                  <DialogHeader>
                    <DialogTitle>Invite a teammate</DialogTitle>
                    <DialogDescription>
                      They will get access to the Q4 Revenue workspace.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogBody>
                    <TextField style={field} autoFocus>
                      <Label>Work email</Label>
                      <Input style={input} placeholder="maria.chen@acme.co" />
                    </TextField>
                  </DialogBody>
                  <DialogFooter>
                    <Button variant="secondary" onPress={close}>
                      Cancel
                    </Button>
                    <Button onPress={close}>Send invite</Button>
                  </DialogFooter>
                </>
              )}
            </Dialog>
          </Modal>
        </DialogTrigger>
      ),
    },
    {
      name: 'Controlled, large',
      code: `const [open, setOpen] = useState(false);
<Button variant="secondary" onPress={() => setOpen(true)}>Review invoice</Button>
<Modal size="lg" isOpen={open} onOpenChange={setOpen}>
  <Dialog aria-label="Invoice INV-2041">…</Dialog>
</Modal>`,
      Component: function Controlled() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <Button variant="secondary" onPress={() => setOpen(true)}>
              Review invoice
            </Button>
            <Modal size="lg" isOpen={open} onOpenChange={setOpen}>
              <Dialog>
                <DialogHeader>
                  <DialogTitle>Invoice INV-2041</DialogTitle>
                  <DialogDescription>Northwind Traders · issued Oct 3, 2026</DialogDescription>
                </DialogHeader>
                <DialogBody>
                  <div style={{ display: 'grid', gap: 8, fontVariantNumeric: 'tabular-nums' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Platform seats (24)</span>
                      <span>$2,880.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Usage overage</span>
                      <span>$412.50</span>
                    </div>
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}
                    >
                      <span>Total due</span>
                      <span>$3,292.50</span>
                    </div>
                  </div>
                </DialogBody>
                <DialogFooter>
                  <Button variant="secondary" onPress={() => setOpen(false)}>
                    Close
                  </Button>
                  <Button onPress={() => setOpen(false)}>Approve payment</Button>
                </DialogFooter>
              </Dialog>
            </Modal>
          </>
        );
      },
    },
  ],
};

export default demo;
