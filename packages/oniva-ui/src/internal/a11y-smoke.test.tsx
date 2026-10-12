import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ColumnDef } from '@tanstack/react-table';
import { describe, it } from 'vitest';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Modal,
} from '../components/Dialog';
import { Select, SelectItem } from '../components/Select';
import { Tab, TabList, TabPanel, Tabs } from '../components/Tabs';
import { expectNoA11yViolations } from './test-a11y';

interface Row {
  id: string;
  name: string;
}
const columns: ColumnDef<Row>[] = [{ accessorKey: 'name', header: 'Name' }];
const data: Row[] = [
  { id: 'a', name: 'Priya Nair' },
  { id: 'b', name: 'Marcus Lee' },
];

describe('a11y smoke (axe)', () => {
  it('Button', async () => {
    const { container } = render(<Button>Save changes</Button>);
    await expectNoA11yViolations(container);
  });
  it('Select', async () => {
    const { container } = render(
      <Select label="Status" defaultSelectedKey="paid">
        <SelectItem id="paid">Paid</SelectItem>
        <SelectItem id="pending">Pending</SelectItem>
      </Select>,
    );
    await expectNoA11yViolations(container);
  });
  it('Dialog (open)', async () => {
    render(
      <DialogTrigger>
        <Button>Open</Button>
        <Modal>
          <Dialog>
            <DialogHeader>
              <DialogTitle>Invite</DialogTitle>
            </DialogHeader>
            <DialogBody>Send an invite.</DialogBody>
          </Dialog>
        </Modal>
      </DialogTrigger>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog', { name: 'Invite' });
    await expectNoA11yViolations(document.body);
  });
  it('Tabs', async () => {
    const { container } = render(
      <Tabs>
        <TabList aria-label="Account">
          <Tab id="a">Overview</Tab>
          <Tab id="b">Billing</Tab>
        </TabList>
        <TabPanel id="a">Overview panel</TabPanel>
        <TabPanel id="b">Billing panel</TabPanel>
      </Tabs>,
    );
    await expectNoA11yViolations(container);
  });
  it('DataTable', async () => {
    const { container } = render(
      <DataTable
        aria-label="People"
        data={data}
        columns={columns}
        itemLabel="people"
        getRowId={(r) => r.id}
      />,
    );
    await expectNoA11yViolations(container);
  });
});
