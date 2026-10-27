import * as stylex from '@stylexjs/stylex';
import type { ColumnDef } from '@tanstack/react-table';
import { Building2 } from 'lucide-react';
import { useMemo, useState, type Ref } from 'react';
import { DataTable } from '../../components/DataTable';
import { Tab, TabList, TabPanel, Tabs } from '../../components/Tabs';
import { Badge } from '../../components/Badge';
import { m8 } from '../../internal/m8-motion';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { ScreenFrame, type ScreenUser } from '../../internal/s2-screen-frame';

const styles = stylex.create({
  wrap: { display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 },
  tabList: { maxWidth: '100%', overflowX: 'auto' },
  panel: { minWidth: 0 },
});

export type CrmStage = 'lead' | 'qualified' | 'proposal' | 'won' | 'lost';

export interface CrmCompany {
  id: string;
  name: string;
  domain: string;
  category?: string;
  stage: CrmStage;
  owner: string;
  employees: number;
  arr: number;
  updated: string;
}

export const NORTHWIND_COMPANIES: CrmCompany[] = [
  { id: 'c1', name: 'Harbor & Vale', category: 'Services', domain: 'harborvale.example', stage: 'won', owner: 'Priya Nair', employees: 240, arr: 86400, updated: '2026-10-22' },
  { id: 'c2', name: 'Lumen Freight', category: 'Logistics', domain: 'lumenfreight.example', stage: 'proposal', owner: 'Marcus Webb', employees: 1200, arr: 148000, updated: '2026-10-24' },
  { id: 'c3', name: 'Oakline Health', category: 'Healthcare', domain: 'oaklinehealth.example', stage: 'qualified', owner: 'Priya Nair', employees: 560, arr: 92000, updated: '2026-10-20' },
  { id: 'c4', name: 'Tidewater Labs', category: 'Software', domain: 'tidewaterlabs.example', stage: 'lead', owner: 'Sam Okafor', employees: 85, arr: 24000, updated: '2026-10-19' },
  { id: 'c5', name: 'Fernhill Studio', category: 'Design', domain: 'fernhill.example', stage: 'won', owner: 'Marcus Webb', employees: 32, arr: 18600, updated: '2026-10-15' },
  { id: 'c6', name: 'Brightpath Schools', category: 'Education', domain: 'brightpath.example', stage: 'proposal', owner: 'Sam Okafor', employees: 410, arr: 64500, updated: '2026-10-23' },
  { id: 'c7', name: 'Copperleaf Foods', category: 'Food', domain: 'copperleaf.example', stage: 'lost', owner: 'Priya Nair', employees: 900, arr: 72000, updated: '2026-10-08' },
  { id: 'c8', name: 'Northgate Energy', category: 'Energy', domain: 'northgate.example', stage: 'qualified', owner: 'Marcus Webb', employees: 2100, arr: 210000, updated: '2026-10-25' },
  { id: 'c9', name: 'Pinecrest Legal', category: 'Legal', domain: 'pinecrest.example', stage: 'won', owner: 'Sam Okafor', employees: 120, arr: 41200, updated: '2026-10-11' },
  { id: 'c10', name: 'Quarry Robotics', category: 'Robotics', domain: 'quarryrobotics.example', stage: 'lead', owner: 'Priya Nair', employees: 64, arr: 30000, updated: '2026-10-21' },
];

const stageOptions = [
  { value: 'lead', label: 'Lead', tone: 'neutral' },
  { value: 'qualified', label: 'Qualified', tone: 'info' },
  { value: 'proposal', label: 'Proposal', tone: 'warning' },
  { value: 'won', label: 'Won', tone: 'success' },
  { value: 'lost', label: 'Lost', tone: 'danger' },
] as const;

const STAGE_TONES = { lead: 'gray', qualified: 'blue', proposal: 'amber', won: 'green', lost: 'pink' } as const;

type View = 'all' | 'pipeline' | 'customers';
const VIEWS: { id: View; label: string; match: (c: CrmCompany) => boolean; newStage: CrmStage }[] = [
  { id: 'all', label: 'All companies', match: () => true, newStage: 'lead' },
  { id: 'pipeline', label: 'Pipeline', match: (c) => ['lead', 'qualified', 'proposal'].includes(c.stage), newStage: 'lead' },
  { id: 'customers', label: 'Customers', match: (c) => c.stage === 'won', newStage: 'won' },
];

export interface CrmScreenProps {
  /** Companies to list. Defaults to the Northwind Labs sample set. */
  companies?: CrmCompany[];
  workspace?: string;
  user?: ScreenUser;
  /** Called with the label of a sidebar item. */
  onNavigate?: (label: string) => void;
  /** Called with the full list after a cell edit or a new row. */
  onCompaniesChange?: (companies: CrmCompany[]) => void;
  /** Render the title as h2 when the screen sits inside a page that already has an h1. */
  headingLevel?: 1 | 2;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Company list with saved views as tabs and an editable, searchable data table. */
export function CrmScreen({
  companies = NORTHWIND_COMPANIES,
  workspace = 'Northwind Labs',
  user = { name: 'Alex Morgan' },
  onNavigate,
  onCompaniesChange,
  headingLevel = 1,
  className,
  xstyle,
  ref,
}: CrmScreenProps) {
  const [rows, setRows] = useState(companies);
  const [view, setView] = useState<View>('all');
  const current = VIEWS.find((v) => v.id === view) ?? VIEWS[0]!;
  const visible = useMemo(() => rows.filter(current.match), [rows, current]);
  const pipelineValue = rows.filter((c) => ['lead', 'qualified', 'proposal'].includes(c.stage)).reduce((s, c) => s + c.arr, 0);

  const columns = useMemo<ColumnDef<CrmCompany>[]>(
    () => [
      { accessorKey: 'name', header: 'Company', meta: { sheet: { type: 'title', width: 220 } } },
      { accessorKey: 'category', header: 'Category', meta: { sheet: { type: 'tag' } } },
      { accessorKey: 'owner', header: 'Owner', meta: { sheet: { type: 'text' } } },
      { accessorKey: 'arr', header: 'Value', meta: { sheet: { type: 'number', format: (v) => (typeof v === 'number' ? `$${v.toLocaleString('en-US')}` : '') } } },
      { accessorKey: 'stage', header: 'Stage', meta: { sheet: { type: 'tag', options: stageOptions.map((o) => o.value) } } },
      { accessorKey: 'updated', header: 'Last contact', meta: { sheet: { type: 'date' } } },
    ],
    [],
  );

  const commit = (changed: CrmCompany[]) => {
    const byId = new Map(changed.map((c) => [c.id, c]));
    setRows((prev) => {
      const kept = prev.map((c) => byId.get(c.id) ?? c);
      const known = new Set(prev.map((c) => c.id));
      const next = [...kept, ...changed.filter((c) => !known.has(c.id)).map((c) => ({ ...({ stage: current.newStage, owner: user.name, domain: '', employees: 0, arr: 0, updated: new Date().toISOString().slice(0, 10) } as Partial<CrmCompany>), ...c }))];
      onCompaniesChange?.(next);
      return next;
    });
  };

  return (
    <ScreenFrame
      ref={ref}
      className={className}
      xstyle={xstyle}
      workspace={workspace}
      user={user}
      active="CRM"
      title="Companies"
      headingLevel={headingLevel}
      onNavigate={onNavigate}
      actions={<Badge variant="info">
          <AnimatedNumber value={pipelineValue} format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }} /> open pipeline
        </Badge>}
    >
      <div {...stylex.props(styles.wrap)}>
        <Tabs variant="pill" size="sm" selectedKey={view} onSelectionChange={(k) => setView(k as View)}>
          <TabList aria-label="Views" xstyle={styles.tabList}>
            {VIEWS.map((v) => (
              <Tab key={v.id} id={v.id} count={rows.filter(v.match).length}>
                {v.label}
              </Tab>
            ))}
          </TabList>
          <TabPanel id={view} xstyle={[styles.panel, m8.view]}>
            <DataTable
              key={view}
              aria-label={`${current.label} table`}
              layout="sheet"
              icon={<Building2 size={14} />}
              title={current.label}
              data={visible}
              columns={columns}
              tagTones={STAGE_TONES}
              getRowId={(r) => r.id}
              onDataChange={commit}
              addRowLabel="Add company"
            />
          </TabPanel>
        </Tabs>
      </div>
    </ScreenFrame>
  );
}
