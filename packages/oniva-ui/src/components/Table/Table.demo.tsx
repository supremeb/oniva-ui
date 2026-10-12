import { useState } from 'react';
import type { Selection, SortDescriptor } from 'react-aria-components';
import type { DemoModule } from '../../internal/demo';
import { Badge } from '../Badge';
import { Cell, Column, Row, Table, TableBody, TableHeader } from './Table';

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  due: string;
}

const invoices: Invoice[] = [
  { id: 'INV-2041', client: 'Northwind Traders', amount: 4280, status: 'Paid', due: '2026-09-14' },
  {
    id: 'INV-2042',
    client: 'Lumen Analytics',
    amount: 1150.5,
    status: 'Pending',
    due: '2026-10-02',
  },
  { id: 'INV-2043', client: 'Acme Logistics', amount: 9720, status: 'Overdue', due: '2026-08-29' },
  { id: 'INV-2044', client: 'Helios Energy', amount: 2315.75, status: 'Paid', due: '2026-09-21' },
  { id: 'INV-2045', client: 'Blue Harbor Co.', amount: 640, status: 'Pending', due: '2026-10-11' },
  { id: 'INV-2046', client: 'Orbit Studio', amount: 3890, status: 'Paid', due: '2026-09-30' },
  { id: 'INV-2047', client: 'Fable & Finch', amount: 1760, status: 'Overdue', due: '2026-08-17' },
  { id: 'INV-2048', client: 'Kestrel Labs', amount: 5400, status: 'Pending', due: '2026-10-19' },
];

const tone = { Paid: 'success', Pending: 'warning', Overdue: 'danger' } as const;
const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function useSorted() {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'due', direction: 'ascending' });
  const rows = [...invoices].sort((a, b) => {
    const k = sort.column as keyof Invoice;
    const r = a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0;
    return sort.direction === 'descending' ? -r : r;
  });
  return { sort, setSort, rows };
}

function Basic({ density }: { density?: 'sm' | 'md' }) {
  const { sort, setSort, rows } = useSorted();
  return (
    <Table aria-label="Invoices" density={density} sortDescriptor={sort} onSortChange={setSort}>
      <TableHeader>
        <Column id="id" isRowHeader allowsSorting>
          Invoice
        </Column>
        <Column id="client" allowsSorting>
          Client
        </Column>
        <Column id="status">Status</Column>
        <Column id="due" allowsSorting>
          Due date
        </Column>
        <Column id="amount" allowsSorting>
          Amount
        </Column>
      </TableHeader>
      <TableBody items={rows}>
        {(r) => (
          <Row id={r.id}>
            <Cell>{r.id}</Cell>
            <Cell>{r.client}</Cell>
            <Cell>
              <Badge variant={tone[r.status]} dot>
                {r.status}
              </Badge>
            </Cell>
            <Cell>{r.due}</Cell>
            <Cell>{usd(r.amount)}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}

function Selectable() {
  const [selected, setSelected] = useState<Selection>(new Set(['INV-2042']));
  return (
    <Table
      aria-label="Invoices with selection"
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={setSelected}
      stickyHeader
    >
      <TableHeader>
        <Column isRowHeader>Invoice</Column>
        <Column>Client</Column>
        <Column>Amount</Column>
      </TableHeader>
      <TableBody items={invoices}>
        {(r) => (
          <Row id={r.id}>
            <Cell>{r.id}</Cell>
            <Cell>{r.client}</Cell>
            <Cell>{usd(r.amount)}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Table',
    slug: 'table',
    category: 'Data display',
    description:
      'Accessible data table on React Aria Table: sortable columns with a caret, multi-row selection, sticky header, hover rows and two densities.',
  },
  demos: [
    {
      name: 'Sortable columns',
      code: `const [sort, setSort] = useState<SortDescriptor>({ column: 'due', direction: 'ascending' });

<Table aria-label="Invoices" sortDescriptor={sort} onSortChange={setSort}>
  <TableHeader>
    <Column id="id" isRowHeader allowsSorting>Invoice</Column>
    <Column id="client" allowsSorting>Client</Column>
    <Column id="status">Status</Column>
    <Column id="due" allowsSorting>Due date</Column>
    <Column id="amount" allowsSorting>Amount</Column>
  </TableHeader>
  <TableBody items={rows}>
    {(r) => (
      <Row id={r.id}>
        <Cell>{r.id}</Cell>
        <Cell>{r.client}</Cell>
        <Cell><Badge variant={tone[r.status]} dot>{r.status}</Badge></Cell>
        <Cell>{r.due}</Cell>
        <Cell>{usd(r.amount)}</Cell>
      </Row>
    )}
  </TableBody>
</Table>`,
      Component: () => <Basic />,
    },
    {
      name: 'Row selection + sticky header',
      code: `<Table aria-label="Invoices" selectionMode="multiple" selectedKeys={selected}
  onSelectionChange={setSelected} stickyHeader>
  <TableHeader>
    <Column isRowHeader>Invoice</Column>
    <Column>Client</Column>
    <Column>Amount</Column>
  </TableHeader>
  <TableBody items={invoices}>
    {(r) => (
      <Row id={r.id}>
        <Cell>{r.id}</Cell><Cell>{r.client}</Cell><Cell>{usd(r.amount)}</Cell>
      </Row>
    )}
  </TableBody>
</Table>`,
      Component: Selectable,
    },
    {
      name: 'Compact density',
      code: `<Table aria-label="Invoices" density="sm"> ... </Table>`,
      Component: () => <Basic density="sm" />,
    },
  ],
};

export default demo;
