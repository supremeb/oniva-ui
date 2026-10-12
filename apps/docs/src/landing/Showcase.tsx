import * as stylex from '@stylexjs/stylex';
import { Activity, DollarSign, Users } from 'lucide-react';
import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AgentProgress,
  AgentThinking,
  AreaChart,
  BarChart,
  ChartCard,
  Composer,
  CustomerCell,
  DataTable,
  PriceCell,
  StatCard,
  StatusBadgeCell,
  ToolApproval,
  type TaskItem,
} from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';
import { revenueByMonth } from '../../../../packages/oniva-ui/src/charts/_data/datasets';
import {
  customers,
  type Customer,
} from '../../../../packages/oniva-ui/src/components/DataTable/sample-data';
import { ShaderLayer } from './ShaderLayer';
import { useMedia, usePrefersReducedMotion } from './gate';
import { ui } from './ui';
import { mq } from './mq.stylex';

const PROMPT = 'Build a Q3 revenue dashboard from the warehouse. Flag anything soft.';
const REASONING = `Revenue sits in the warehouse, so query it first.
Group deals by segment, then compare against Q2 and plan.
Self-serve churn is the soft spot; surface it in the table.`;
const STEPS = [
  'Query the revenue warehouse',
  'Group deals by segment',
  'Compare against Q2 and plan',
  'Compose the dashboard',
];
const models = [{ id: 'sonnet-5', name: 'Sonnet 5', description: 'Fast and capable' }];

const cols: ColumnDef<Customer>[] = [
  { accessorKey: 'name', header: 'Customer', cell: ({ row }) => <CustomerCell name={row.original.name} /> },
  {
    accessorKey: 'fulfilment',
    header: 'Status',
    enableSorting: false,
    cell: ({ getValue }) => {
      const v = getValue<Customer['fulfilment']>();
      return (
        <StatusBadgeCell
          label={v}
          variant={v === 'Shipped' ? 'success' : v === 'Waiting' ? 'warning' : 'danger'}
        />
      );
    },
  },
  { accessorKey: 'total', header: 'Total', cell: ({ getValue }) => <PriceCell value={getValue<number>()} /> },
];

const enter = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(14px)', filter: 'blur(4px)' },
  to: { opacity: 1, transform: 'none', filter: 'blur(0)' },
});

const s = stylex.create({
  // Tall runway; the stage inside is sticky and scrubbed by scroll.
  runway: {
    height: { default: 'calc(100svh * 3.4)', [mq.BP]: 'calc(100svh * 3.4)' },
    position: 'relative',
  },
  runwayStatic: { height: 'auto' },
  stage: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100svh - 57px)',
    insetBlockStart: 57,
    isolation: 'isolate',
    minHeight: 560,
    overflow: 'hidden',
    position: 'sticky',
  },
  stageStatic: { height: 'auto', minHeight: 0, position: 'relative', paddingBlock: 72 },
  bg: { inset: 0, position: 'absolute', zIndex: 0 },
  vignette: {
    backgroundImage: `linear-gradient(to bottom, ${colors['--oniva-color-bg']} 0%, color-mix(in srgb, ${colors['--oniva-color-bg']} 52%, transparent) 20%, color-mix(in srgb, ${colors['--oniva-color-bg']} 52%, transparent) 80%, ${colors['--oniva-color-bg']} 100%)`,
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    gap: { default: 14, [mq.BP]: 20 },
    minHeight: 0,
    paddingBlock: { default: '20px 16px', [mq.BP]: '28px 24px' },
    position: 'relative',
    zIndex: 2,
  },
  head: { alignItems: 'flex-end', display: 'flex', gap: 24, justifyContent: 'space-between' },
  title: { margin: 0 },
  h2: {
    color: colors['--oniva-color-text'],
    fontSize: { default: 'clamp(26px, 7vw, 32px)', [mq.BP]: 'clamp(32px, 3.4vw, 44px)' },
    fontWeight: 500,
    letterSpacing: '-0.035em',
    lineHeight: 1.05,
    margin: 0,
    marginBlockStart: 8,
    textWrap: 'balance',
  },
  meter: {
    color: colors['--oniva-color-text-muted'],
    display: { default: 'none', [mq.BP]: 'block' },
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-12'],
    letterSpacing: '0.04em',
    textAlign: 'end',
  },
  grid: {
    alignItems: 'stretch',
    display: 'grid',
    flexGrow: 1,
    gap: { default: 12, [mq.BP]: 20 },
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [mq.BP]: 'minmax(300px, 360px) minmax(0, 1fr)' },
    minHeight: 0,
  },
  agent: { display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, minWidth: 0 },
  agentHidden: { display: 'none' },
  dash: {
    display: 'grid',
    gap: { default: 10, [mq.BP]: 14 },
    gridAutoRows: 'min-content',
    gridTemplateColumns: { default: 'repeat(2, minmax(0, 1fr))', [mq.BP]: 'repeat(6, minmax(0, 1fr))' },
    minHeight: 0,
    minWidth: 0,
  },
  dashHidden: { display: 'none' },
  slot: {
    borderColor: `color-mix(in srgb, ${colors['--oniva-color-text']} 14%, transparent)`,
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'dashed',
    borderWidth: 1,
    minWidth: 0,
    position: 'relative',
  },
  slotFilled: { borderColor: 'transparent' },
  fill: {
    animationDuration: '520ms',
    animationFillMode: 'backwards',
    animationName: { default: enter, [mq.RM]: 'none' },
    animationTimingFunction: mq.EASE,
    height: '100%',
  },
  span2: { gridColumn: { default: 'span 2', [mq.BP]: 'span 2' } },
  span3: { gridColumn: { default: 'span 2', [mq.BP]: 'span 3' } },
  span6: { gridColumn: { default: 'span 2', [mq.BP]: 'span 6' } },
  hideSm: { display: { default: 'none', [mq.BP]: 'block' } },
  tableSlot: { minHeight: { default: 0, [mq.BP]: 200 } },
  pop: {
    animationDuration: '420ms',
    animationFillMode: 'backwards',
    animationName: { default: enter, [mq.RM]: 'none' },
    animationTimingFunction: mq.EASE,
  },
  sr: {
    clip: 'rect(0 0 0 0)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
});

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

/** Scroll progress of a tall runway (0 at its top, 1 when the sticky stage is about to release). Quantized. */
function useRunwayProgress(ref: React.RefObject<HTMLElement | null>, enabled: boolean): number {
  const [p, setP] = useState(enabled ? 0 : 1);
  useEffect(() => {
    if (!enabled) {
      setP(1);
      return;
    }
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const run = r.height - (window.innerHeight - 57);
      const next = Math.round(clamp((57 - r.top) / Math.max(1, run)) * 240) / 240;
      setP((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, enabled]);
  return p;
}

function Slot({ on, className, children }: { on: boolean; className: stylex.StyleXStyles[]; children: ReactNode }) {
  return (
    <div {...stylex.props(s.slot, on && s.slotFilled, ...className)}>
      {on ? <div {...stylex.props(s.fill)}>{children}</div> : null}
    </div>
  );
}

const Revenue = memo(function Revenue() {
  return (
    <ChartCard title="Revenue" value="$68.7k" unit="Aug">
      <AreaChart
        data={revenueByMonth}
        index="month"
        valueFormat="currency"
        series={[{ key: 'revenue', label: 'Revenue', tone: 1 }]}
        height={104}
      />
    </ChartCard>
  );
});
const Spend = memo(function Spend() {
  return (
    <ChartCard title="Expenses" value="$41.3k" unit="Aug">
      <BarChart
        data={revenueByMonth.slice(-6)}
        index="month"
        valueFormat="currency"
        series={[{ key: 'expenses', label: 'Expenses', tone: 6 }]}
        height={104}
      />
    </ChartCard>
  );
});

const Table = memo(function Table({ rows }: { rows: number }) {
  // DataTable copies `data` into state on mount, so the parent keys it by row count to stream rows.
  const data = useMemo(() => customers.slice(0, rows), [rows]);
  return (
    <DataTable
      aria-label="Customers"
      title="Customers"
      data={data}
      columns={cols}
      itemLabel="customers"
      pageSize={3}
      density="sm"
      searchable={false}
      selectable={false}
      getRowId={(r) => r.id}
    />
  );
});

export interface ShowcaseProps {
  /** Reports the 0..1 "how lit is the stage" so tests/QA can read it. */
  onEnergy?: (e: number) => void;
}

export function Showcase() {
  const reduced = usePrefersReducedMotion();
  const wide = useMedia('(min-width: 800px)', true);
  const tall = useMedia('(min-height: 860px)', true);
  const runway = useRef<HTMLDivElement>(null);
  const scrub = !reduced;
  const p = useRunwayProgress(runway, scrub);

  const typed = Math.round(seg(p, 0.02, 0.2) * PROMPT.length);
  const sent = p >= 0.21;
  const thinking = p >= 0.23 && p < 0.5;
  const reasoningChars = Math.round(seg(p, 0.23, 0.42) * REASONING.length);
  const askTool = p >= 0.36;
  const approved = p >= 0.5;
  const doneSteps = Math.floor(seg(p, 0.5, 0.86) * STEPS.length + 0.0001);
  const dashPhase = p >= 0.5;
  const energy = Math.round((0.25 + 0.75 * Math.sin(seg(p, 0.1, 0.8) * Math.PI) * 0.8 + 0.2 * seg(p, 0.8, 1)) * 10) / 10;

  const plan: TaskItem[] = STEPS.map((label, i) => ({
    id: String(i),
    label,
    status: i < doneSteps ? 'done' : i === doneSteps && p < 0.96 && sent ? 'running' : i < doneSteps ? 'done' : 'pending',
  }));
  const stats = [0.52, 0.56, 0.6].map((t) => p >= t);
  const charts = [p >= 0.64, p >= 0.7];
  const rows = Math.ceil(seg(p, 0.76, 0.94) * 3);
  const phaseLabel = !sent ? 'Prompt' : !approved ? 'Reasoning' : p < 0.96 ? 'Assembling' : 'Done';

  const showAgent = wide || !dashPhase;
  const showDash = wide || dashPhase;

  return (
    <section aria-labelledby="show-title" data-testid="landing-showcase">
      <div ref={runway} {...stylex.props(s.runway, !scrub && s.runwayStatic)}>
        <div {...stylex.props(s.stage, !scrub && s.stageStatic)}>
          <div {...stylex.props(s.bg)}>
            <ShaderLayer kind="stage" energy={energy} />
          </div>
          <div {...stylex.props(s.vignette)} aria-hidden="true" />
          <div {...stylex.props(ui.wrap, s.inner)}>
            <div {...stylex.props(s.head)}>
              <div {...stylex.props(s.title)}>
                <p {...stylex.props(ui.eyebrow, ui.eyebrowAccent)}>Real components · no screenshots</p>
                <h2 id="show-title" {...stylex.props(s.h2)}>
                  Describe it. Watch it assemble.
                </h2>
              </div>
              <p {...stylex.props(s.meter)} aria-hidden="true">
                {phaseLabel} · {String(Math.round(p * 100)).padStart(2, '0')}%
              </p>
            </div>
            <p {...stylex.props(s.sr)}>
              Demonstration: a prompt is typed into the Composer, the agent reasons and asks for tool
              approval, then a dashboard of stat cards, charts and a data table assembles itself from
              oniva/ui components.
            </p>
            <div aria-hidden="true" inert {...stylex.props(s.grid)}>
              <div {...stylex.props(s.agent, !showAgent && s.agentHidden)}>
                <Composer
                  placeholder="Ask the agent…"
                  models={models}
                  model="sonnet-5"
                  value={sent && !approved ? '' : sent ? '' : PROMPT.slice(0, typed)}
                  onValueChange={() => {}}
                  isStreaming={sent && p < 0.96}
                  hideEffort
                  hidePermissions
                />
                {sent ? (
                  <div {...stylex.props(s.pop)}>
                    <AgentThinking isThinking={thinking} seconds={thinking ? undefined : 6} defaultExpanded>
                      {REASONING.slice(0, reasoningChars)}
                    </AgentThinking>
                  </div>
                ) : null}
                {askTool ? (
                  <div {...stylex.props(s.pop)}>
                    <ToolApproval
                      toolName="warehouse.query"
                      description="Read q3_revenue grouped by segment"
                      args={{ table: 'q3_revenue', groupBy: 'segment', limit: 500 }}
                      status={approved ? 'approved' : 'pending'}
                      result="Read 3 tables · 1.2s"
                    />
                  </div>
                ) : null}
                {approved ? (
                  <div {...stylex.props(s.pop)}>
                    <AgentProgress items={plan} />
                  </div>
                ) : null}
              </div>
              <div {...stylex.props(s.dash, !showDash && s.dashHidden)}>
                <Slot on={!!stats[0]} className={[s.span2]}>
                  <StatCard
                    label="Revenue"
                    value={68700}
                    valueFormat={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
                    delta={8.2}
                    deltaLabel="vs Q2"
                    icon={<DollarSign size={16} />}
                    trend={[31, 34, 33, 38, 41, 40, 46, 48]}
                  />
                </Slot>
                <Slot on={!!stats[1]} className={[s.span2]}>
                  <StatCard
                    label="Customers"
                    value={2940}
                    delta={-1.4}
                    deltaLabel="vs Q2"
                    icon={<Users size={16} />}
                    tone={5}
                    trend={[29, 30, 31, 31, 30, 29, 30, 29]}
                  />
                </Slot>
                <Slot on={!!stats[2]} className={[s.span2, s.hideSm]}>
                  <StatCard
                    label="Net retention"
                    value="112%"
                    delta={3.1}
                    deltaLabel="vs plan"
                    icon={<Activity size={16} />}
                    tone={3}
                    trend={[21, 22, 24, 23, 26, 27, 29, 31]}
                  />
                </Slot>
                <Slot on={!!charts[0]} className={[s.span3]}>
                  {charts[0] ? <Revenue /> : null}
                </Slot>
                <Slot on={!!charts[1]} className={[s.span3, s.hideSm]}>
                  {charts[1] ? <Spend /> : null}
                </Slot>
                <Slot on={rows > 0 && tall} className={[s.span6, s.tableSlot, s.hideSm]}>
                  {rows > 0 && tall ? <Table key={rows} rows={rows} /> : null}
                </Slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
