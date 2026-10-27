import { Globe, LayoutGrid, Link2, CalendarDays, Table2, Text } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { DataSheet } from './DataSheet';
import type { SheetColumn, SheetRow, TagTone } from './types';

const columns: SheetColumn[] = [
  { key: 'tool', label: 'Tool', type: 'title', icon: <Text size={14} />, width: 200 },
  { key: 'category', label: 'Category', type: 'tag', icon: <LayoutGrid size={14} />, options: ['Design', 'Issue tracking', 'Hosting', 'Website', 'Video'], width: 180 },
  { key: 'website', label: 'Website', type: 'link', icon: <Link2 size={14} />, width: 160 },
  { key: 'renews', label: 'Renews', type: 'date', icon: <CalendarDays size={14} />, width: 150 },
];

const rows: SheetRow[] = [
  { id: 'sketchpad', tool: 'Sketchpad', category: 'Design', website: 'sketchpad.example', renews: '2026-03-12' },
  { id: 'trackline', tool: 'Trackline', category: 'Issue tracking', website: 'trackline.example', renews: '2026-01-04' },
  { id: 'shipyard', tool: 'Shipyard', category: 'Hosting', website: 'shipyard.example', renews: '2026-08-21' },
  { id: 'pagecraft', tool: 'Pagecraft', category: 'Website', website: 'pagecraft.example', renews: '2026-05-02' },
  { id: 'reelbox', tool: 'Reelbox', category: 'Video', website: 'reelbox.example', renews: '2026-11-18' },
];

const tagTones: Record<string, TagTone> = {
  Design: 'violet',
  'Issue tracking': 'blue',
  Hosting: 'gray',
  Website: 'pink',
  Video: 'green',
};

const budgetColumns: SheetColumn[] = [
  { key: 'item', label: 'Item', type: 'title', width: 200 },
  { key: 'owner', label: 'Owner', type: 'text', width: 160 },
  { key: 'amount', label: 'Amount', type: 'number', width: 140, format: (v) => `$${Number(v).toLocaleString('en-US')}` },
];
const budgetRows: SheetRow[] = [
  { id: 'b1', item: 'Design tools', owner: 'Maya', amount: 1200 },
  { id: 'b2', item: 'Hosting', owner: 'Jon', amount: 860 },
  { id: 'b3', item: 'Video editing', owner: 'Priya', amount: 2400 },
  { id: 'b4', item: 'Contractors', owner: 'Maya', amount: 5300 },
];

const demo: DemoModule = {
  meta: {
    title: 'Data sheet',
    slug: 'data-sheet',
    category: 'Data display',
    description: 'A spreadsheet-style grid: select cells and ranges, move with the keyboard, edit in place (type, Enter, Tab), pick tags from a menu, copy and paste with Excel or Google Sheets, undo and redo, sort, and check rows.',
  },
  demos: [
    {
      name: 'Design Stack',
      code: `<DataSheet
  title="Design Stack"
  icon={<Table2 size={14} />}
  columns={columns}
  rows={rows}
  tagTones={tagTones}
/>`,
      Component: () => <DataSheet title="Design Stack" icon={<Table2 size={14} />} columns={columns} rows={rows} tagTones={tagTones} />,
    },
    {
      name: 'Read-only',
      code: `<DataSheet title="Design Stack" columns={columns} rows={rows} tagTones={tagTones} editable={false} />`,
      Component: () => (
        <DataSheet title="Design Stack" icon={<Globe size={14} />} columns={columns} rows={rows} tagTones={tagTones} editable={false} />
      ),
    },
    {
      name: 'Numbers',
      code: `<DataSheet title="Budget" columns={budgetColumns} rows={budgetRows} />`,
      Component: () => <DataSheet title="Budget" icon={<Table2 size={14} />} columns={budgetColumns} rows={budgetRows} />,
    },
  ],
};

export default demo;
