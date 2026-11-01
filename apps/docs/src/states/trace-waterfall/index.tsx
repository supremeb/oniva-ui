import { TraceWaterfall } from 'oniva-ui';
import type { TraceSpan } from 'oniva-ui';
import type { StateModule } from '../types';

const finished: TraceSpan = {
  id: 'run', name: 'Orchestrator', kind: 'agent', status: 'done', start: 0, end: 22800, detail: 'Atlas 2', input: 'Launch the new pricing page by Friday',
  children: [
    { id: 'plan', name: 'Plan the launch', kind: 'llm', model: 'Atlas 2', detail: 'Atlas 2', status: 'done', start: 900, end: 7800, tokensIn: 3240, tokensOut: 880, cost: 0.115, input: 'Goal: launch the new pricing page by Friday.', output: '1. Audit current copy\n2. Draft tiers\n3. Review with legal' },
    { id: 'research', name: 'Researcher', kind: 'subagent', status: 'done', start: 8000, end: 22000, detail: 'Nova Pro', children: [
      { id: 's1', name: 'web_search', kind: 'tool', detail: 'competitor plans', status: 'done', start: 8200, end: 13600, cost: 0.005 },
      { id: 's2', name: 'web_search', kind: 'tool', detail: 'tier benchmarks', status: 'done', start: 8600, end: 15800, cost: 0.005 },
      { id: 's3', name: 'Query plan usage', kind: 'tool', detail: 'warehouse', status: 'done', start: 9000, end: 12500 },
      { id: 's4', name: 'Read review sites', kind: 'tool', detail: '12 pages', status: 'done', start: 14400, end: 22000 },
    ] },
    { id: 'copy', name: 'Writer', kind: 'subagent', status: 'done', start: 10000, end: 21000, detail: 'Nova Pro', cost: 0.04, children: [
      { id: 'draft', name: 'Read brand voice', kind: 'tool', detail: 'Docs', status: 'done', start: 10200, end: 13800 },
      { id: 'frames', name: 'Read pricing frames', kind: 'tool', detail: 'Design', status: 'done', start: 10900, end: 16000 },
      { id: 'check', name: 'check_claims', kind: 'tool', status: 'failed', start: 16100, end: 16900, error: '3 claims have no source' },
      { id: 'redo', name: 'Draft plan copy', kind: 'llm', model: 'Nova Pro', detail: 'Nova Pro', status: 'done', start: 17000, end: 21000, tokensIn: 5600, tokensOut: 1900, cost: 0.04 },
    ] },
    { id: 'coder', name: 'Coder', kind: 'subagent', status: 'done', start: 15500, end: 22600, detail: 'Lumen Fast', children: [
      { id: 'branch', name: 'Create branch', kind: 'tool', detail: 'Repo', status: 'done', start: 15600, end: 17700 },
      { id: 'page', name: 'Write pricing page', kind: 'llm', model: 'Lumen Fast', detail: 'Lumen Fast', status: 'done', start: 18000, end: 22600, tokensIn: 4100, tokensOut: 2300, cost: 0.06 },
    ] },
  ],
};

const live: TraceSpan = {
  id: 'run', name: 'Research agent', kind: 'agent', status: 'running', start: 0, input: 'Summarise the Q3 churn drivers',
  children: [
    { id: 'a', name: 'Plan', kind: 'llm', model: 'Lumen Fast', detail: 'Lumen Fast', status: 'done', start: 400, end: 3100, tokensIn: 1800, tokensOut: 420, cost: 0.012 },
    { id: 'b', name: 'query_warehouse', kind: 'tool', detail: 'churn by plan', status: 'done', start: 3200, end: 6900 },
    { id: 'c', name: 'Write summary', kind: 'llm', model: 'Quill Reasoner', detail: 'Quill Reasoner', status: 'running', start: 7000, tokensIn: 6400, tokensOut: 300, cost: 0.09 },
  ],
};

const failedRun: TraceSpan = {
  id: 'run', name: 'Support agent', kind: 'agent', status: 'failed', start: 0, end: 14200, input: 'Refund order #4821',
  error: 'Run stopped: refund tool failed twice',
  children: [
    { id: 'f1', name: 'lookup_order', kind: 'tool', status: 'done', start: 300, end: 2100 },
    { id: 'f2', name: 'Draft reply', kind: 'llm', model: 'Atlas 2', detail: 'Atlas 2', status: 'done', start: 2200, end: 7400, tokensIn: 2100, tokensOut: 640, cost: 0.06 },
    { id: 'f3', name: 'issue_refund', kind: 'tool', detail: 'payments', status: 'failed', start: 7500, end: 11000, error: '502 Bad Gateway from payments.northwind.example\nRetry 1 of 2 failed after 3.5s' },
    { id: 'f4', name: 'issue_refund', kind: 'tool', detail: 'payments, retry', status: 'failed', start: 11100, end: 14200, error: '502 Bad Gateway from payments.northwind.example' },
  ],
};

const longRun: TraceSpan = {
  id: 'run', name: 'Nightly reconciliation agent for the Northwind Labs billing warehouse and every downstream ledger export', kind: 'agent', status: 'done', start: 0, end: 412_000,
  input: 'Reconcile the March invoices against the ledger exports in s3://northwind-billing.example/exports/2026/03/ledger-export-0001-through-4096-final-v2.parquet and flag every mismatch above the threshold',
  detail: 'Atlas 2 with a very long configuration label that keeps going',
  children: [
    { id: 'l1', name: 'load_ledger_export_from_s3://northwind-billing.example/exports/2026/03/ledger-export-0001-through-4096-final-v2.parquet', kind: 'tool', detail: 'streaming 4,096 partitions from the cold storage tier with checksum verification', status: 'done', start: 2000, end: 96_000, cost: 0.021 },
    { id: 'l2', name: 'Compare totals', kind: 'llm', model: 'Quill Reasoner', detail: 'Quill Reasoner', status: 'done', start: 97_000, end: 352_000, tokensIn: 184_300, tokensOut: 21_900, cost: 1.482, input: 'Compare invoice totals with ledger totals for 4,096 partitions and list every mismatch above 0.5%.', output: 'Found 17 mismatches. Largest: partition 2217, invoice 48,210.00 vs ledger 47,960.00 (0.52%).' },
    { id: 'l3', name: 'write_report', kind: 'tool', detail: 'reports/2026-03-reconciliation.md', status: 'done', start: 353_000, end: 412_000 },
  ],
};

const deep: TraceSpan = {
  id: 'd0', name: 'Orchestrator', kind: 'agent', status: 'done', start: 0, end: 30_000,
  children: [{
    id: 'd1', name: 'Planner', kind: 'subagent', status: 'done', start: 500, end: 29_000, children: [{
      id: 'd2', name: 'Researcher', kind: 'subagent', status: 'done', start: 1000, end: 28_000, children: [{
        id: 'd3', name: 'Source checker', kind: 'subagent', status: 'done', start: 1500, end: 27_000, children: [{
          id: 'd4', name: 'Citation verifier', kind: 'subagent', status: 'done', start: 2000, end: 26_000, children: [
            { id: 'd5', name: 'fetch_page', kind: 'tool', detail: 'docs.northwind.example', status: 'done', start: 2200, end: 9000 },
            { id: 'd6', name: 'Judge claim', kind: 'llm', model: 'Nova Pro', detail: 'Nova Pro', status: 'done', start: 9500, end: 25_000, tokensIn: 7200, tokensOut: 900, cost: 0.071 },
          ],
        }],
      }],
    }],
  }],
};

const many: TraceSpan = {
  id: 'run', name: 'Batch enrichment', kind: 'agent', status: 'done', start: 0, end: 58_400, input: 'Enrich 36 leads from the Q3 webinar list',
  children: Array.from({ length: 36 }, (_, i): TraceSpan => {
    const start = 400 + i * 1500;
    const llm = i % 3 === 0;
    return {
      id: `m${i}`, name: llm ? `Summarise lead ${i + 1}` : `lookup_company_${i + 1}`, kind: llm ? 'llm' : 'tool', model: llm ? 'Lumen Fast' : undefined,
      detail: llm ? 'Lumen Fast' : `lead-${i + 1}@northwind.example`, status: 'done', start, end: start + 900 + ((i * 397) % 1800),
      tokensIn: llm ? 900 + i * 40 : undefined, tokensOut: llm ? 180 + i * 6 : undefined, cost: llm ? 0.004 + i * 0.0001 : undefined,
    };
  }),
};

const bare: TraceSpan = { id: 'solo', name: 'Reply agent', kind: 'agent', status: 'done', start: 0, end: 1800, input: 'Say hello to the new teammate' };

const foldedMany: TraceSpan = {
  id: 'run', name: 'Release agent', kind: 'agent', status: 'done', start: 0, end: 41_000,
  children: [
    { id: 'g1', name: 'Test suite', kind: 'subagent', status: 'done', start: 500, end: 18_000, children: [
      { id: 'g1a', name: 'run_unit_tests', kind: 'tool', status: 'done', start: 600, end: 9000 },
      { id: 'g1b', name: 'run_e2e_tests', kind: 'tool', status: 'done', start: 9100, end: 17_900 },
    ] },
    { id: 'g2', name: 'Deploy', kind: 'subagent', status: 'done', start: 18_500, end: 40_500, children: [
      { id: 'g2a', name: 'build_image', kind: 'tool', status: 'done', start: 18_600, end: 30_000 },
      { id: 'g2b', name: 'rollout', kind: 'tool', status: 'done', start: 30_100, end: 40_400 },
    ] },
  ],
};

const narrow = (el: React.ReactNode, w: number) => <div style={{ maxWidth: w }}>{el}</div>;

const mod: StateModule = {
  slug: 'trace-waterfall',
  title: 'Trace waterfall',
  width: 1000,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'finished', label: 'finished', render: () => <TraceWaterfall root={finished} /> },
        { id: 'live', label: 'live (running, fixed clock)', render: () => <TraceWaterfall root={live} now={9500} title="Live run" /> },
        { id: 'live-no-clock', label: 'running, no clock', render: () => <TraceWaterfall root={live} title="Live run" /> },
        { id: 'failed', label: 'failed run', render: () => <TraceWaterfall root={failedRun} /> },
        { id: 'single', label: 'single span, no children', render: () => <TraceWaterfall root={bare} /> },
      ],
    },
    {
      label: 'Data',
      states: [
        { id: 'many', label: 'many spans (37)', render: () => <TraceWaterfall root={many} /> },
        { id: 'deep', label: 'deep nesting', render: () => <TraceWaterfall root={deep} /> },
        { id: 'long-run', label: 'minutes-long run, big totals', render: () => <TraceWaterfall root={longRun} /> },
        { id: 'no-slowest', label: 'markSlowest off', render: () => <TraceWaterfall root={finished} markSlowest={false} /> },
        { id: 'custom-cost', label: 'custom formatCost', render: () => <TraceWaterfall root={finished} formatCost={(n) => `${Math.round(n * 1000)} credits`} /> },
        { id: 'min-range', label: 'minRange 30s', render: () => <TraceWaterfall root={bare} minRange={30_000} /> },
        { id: 'custom-title', label: 'custom title', render: () => <TraceWaterfall root={finished} title="Pricing launch trace" /> },
      ],
    },
    {
      label: 'Disclosure',
      states: [
        { id: 'collapsed-sub', label: 'sub-agents folded', render: () => <TraceWaterfall root={finished} defaultCollapsed={['research', 'copy']} /> },
        { id: 'collapsed-all', label: 'everything folded', render: () => <TraceWaterfall root={foldedMany} defaultCollapsed={['run']} /> },
        { id: 'open-llm', label: 'details open, LLM call', render: () => <TraceWaterfall root={finished} defaultOpenId="plan" /> },
        { id: 'open-failed', label: 'details open, failed tool', render: () => <TraceWaterfall root={failedRun} defaultOpenId="f3" /> },
        { id: 'open-running', label: 'details open, running', render: () => <TraceWaterfall root={live} now={9500} defaultOpenId="c" /> },
        { id: 'open-bare', label: 'details open, no tokens/cost', render: () => <TraceWaterfall root={finished} defaultOpenId="s3" /> },
        { id: 'open-long', label: 'details open, long input/output', render: () => <TraceWaterfall root={longRun} defaultOpenId="l2" /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-text', label: 'long names, details and input', render: () => <TraceWaterfall root={longRun} /> },
      ],
    },
    {
      label: 'Width',
      states: [
        { id: 'narrow-480', label: 'narrow (480, stacked rows)', render: () => narrow(<TraceWaterfall root={finished} />, 480) },
        { id: 'tiny-320', label: 'tiny (320, details hidden)', render: () => narrow(<TraceWaterfall root={finished} />, 320) },
        { id: 'narrow-open', label: 'narrow, details open', render: () => narrow(<TraceWaterfall root={finished} defaultOpenId="plan" />, 480) },
      ],
    },
  ],
  missing: [
    'Empty trace (root is required; a root with no children is the lone-span state)',
    'Loading / pending before the first span (no such prop; running root with no clock is the closest)',
    'Disabled or read-only (no prop)',
  ],
};
export default mod;
