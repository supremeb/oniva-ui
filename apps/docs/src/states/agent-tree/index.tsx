import { AgentTree, DatabaseIcon, FileTextIcon, BranchIcon, GlobeIcon, PaletteIcon, SearchIcon } from 'oniva-ui';
import type { TreeAgent } from 'oniva-ui';
import type { StateModule } from '../types';

const NOW = 1_760_000_000_000;
const ago = (s: number) => NOW - s * 1000;

const leaf = (over: Partial<TreeAgent> & Pick<TreeAgent, 'id' | 'name' | 'task' | 'status'>): TreeAgent => over;

const run: TreeAgent = {
  id: 'lead',
  name: 'Orchestrator',
  model: 'Atlas 2',
  task: 'Launch the new pricing page by Friday',
  status: 'running',
  cost: 0.04,
  started: ago(94),
  tools: [<FileTextIcon key="a" size={11} />, <PaletteIcon key="b" size={11} />, <BranchIcon key="c" size={11} />],
  children: [
    {
      id: 'research',
      name: 'Researcher',
      model: 'Nova Pro',
      task: 'Compare the pricing of five competitors',
      status: 'running',
      cost: 0.05,
      started: ago(82),
      tools: [<SearchIcon key="s" size={11} />, <GlobeIcon key="g" size={11} />],
      children: [
        leaf({ id: 'scrape', name: 'Scraper', model: 'Lumen Fast', task: 'Read the pricing pages of the five sites', status: 'running', cost: 0.02, started: ago(61), tools: [<GlobeIcon key="g" size={11} />] }),
        leaf({ id: 'analyst', name: 'Analyst', model: 'Nova Pro', task: 'Summarize 120 reviews that mention price', status: 'done', cost: 0.03, started: ago(70), ended: ago(22), tools: [<FileTextIcon key="f" size={11} />] }),
      ],
    },
    leaf({ id: 'writer', name: 'Writer', model: 'Nova Pro', task: 'Write the copy for the three plans', status: 'done', cost: 0.07, started: ago(80), ended: ago(31), tools: [<FileTextIcon key="f" size={11} />] }),
    {
      id: 'build',
      name: 'Coder',
      model: 'Quill Reasoner',
      task: 'Build the page and wire up checkout',
      status: 'running',
      cost: 0.09,
      started: ago(55),
      tools: [<BranchIcon key="g" size={11} />, <DatabaseIcon key="d" size={11} />],
      children: [
        leaf({ id: 'tester', name: 'Tester', model: 'Lumen Fast', task: 'Write and run the checkout tests', status: 'queued' }),
      ],
    },
  ],
};

const allDone: TreeAgent = {
  id: 'lead',
  name: 'Orchestrator',
  model: 'Atlas 2',
  task: 'Launch the new pricing page by Friday',
  status: 'done',
  cost: 0.04,
  started: ago(412),
  ended: ago(18),
  children: [
    leaf({ id: 'r', name: 'Researcher', model: 'Nova Pro', task: 'Compare the pricing of five competitors', status: 'done', cost: 0.12, started: ago(405), ended: ago(260) }),
    leaf({ id: 'w', name: 'Writer', model: 'Nova Pro', task: 'Write the copy for the three plans', status: 'done', cost: 0.07, started: ago(400), ended: ago(190) }),
    leaf({ id: 'c', name: 'Coder', model: 'Quill Reasoner', task: 'Build the page and wire up checkout', status: 'done', cost: 0.31, started: ago(250), ended: ago(40) }),
  ],
};

const waiting: TreeAgent = {
  ...run,
  children: run.children!.map((c) =>
    c.id === 'build'
      ? { ...c, children: [leaf({ id: 'tester', name: 'Tester', model: 'Lumen Fast', task: 'Write and run the checkout tests', status: 'waiting', ask: 'Run the tests against the live checkout?', cost: 0.01, started: ago(9) })] }
      : c,
  ),
};

const failed: TreeAgent = {
  ...run,
  status: 'running',
  children: run.children!.map((c) =>
    c.id === 'research'
      ? { ...c, status: 'failed', error: 'Two of the five pricing pages blocked the request (HTTP 429).', children: [
          leaf({ id: 'scrape', name: 'Scraper', model: 'Lumen Fast', task: 'Read the pricing pages of the five sites', status: 'failed', error: 'Rate limited after 3 retries.', cost: 0.02, started: ago(61), ended: ago(30) }),
          leaf({ id: 'analyst', name: 'Analyst', model: 'Nova Pro', task: 'Summarize 120 reviews that mention price', status: 'stopped', started: ago(70), ended: ago(30) }),
        ] }
      : c,
  ),
};

const stopped: TreeAgent = {
  ...allDone,
  status: 'stopped',
  children: [
    ...allDone.children!.slice(0, 1),
    leaf({ id: 'w', name: 'Writer', model: 'Nova Pro', task: 'Write the copy for the three plans', status: 'stopped', cost: 0.03, started: ago(400), ended: ago(190) }),
    leaf({ id: 'c', name: 'Coder', model: 'Quill Reasoner', task: 'Build the page and wire up checkout', status: 'queued' }),
  ],
};

const deep: TreeAgent = {
  id: 'd0',
  name: 'Orchestrator',
  model: 'Atlas 2',
  task: 'Migrate the billing service to the new ledger',
  status: 'running',
  cost: 0.02,
  started: ago(300),
  children: [
    {
      id: 'd1',
      name: 'Planner',
      model: 'Quill Reasoner',
      task: 'Split the migration into reversible steps',
      status: 'running',
      cost: 0.06,
      started: ago(280),
      children: [
        {
          id: 'd2',
          name: 'Schema writer',
          model: 'Nova Pro',
          task: 'Draft the ledger tables and indexes',
          status: 'running',
          cost: 0.04,
          started: ago(200),
          children: [
            {
              id: 'd3',
              name: 'Reviewer',
              model: 'Lumen Fast',
              task: 'Check the draft against the audit requirements',
              status: 'running',
              cost: 0.01,
              started: ago(90),
              children: [leaf({ id: 'd4', name: 'Linter', model: 'Lumen Fast', task: 'Run the SQL linter on 14 files', status: 'done', cost: 0.012, started: ago(60), ended: ago(41) })],
            },
            leaf({ id: 'd3b', name: 'Fixture builder', model: 'Lumen Fast', task: 'Generate 2,000 sample invoices', status: 'done', cost: 0.01, started: ago(150), ended: ago(80) }),
          ],
        },
      ],
    },
  ],
};

const names = ['Scout', 'Indexer', 'Summarizer', 'Translator', 'Auditor', 'Formatter', 'Publisher', 'Notifier'];
const wide: TreeAgent = {
  id: 'w0',
  name: 'Orchestrator',
  model: 'Atlas 2',
  task: 'Localize the help center into eight languages',
  status: 'running',
  cost: 0.08,
  started: ago(150),
  children: names.map((n, i) =>
    leaf({
      id: `w${i + 1}`,
      name: n,
      model: i % 2 ? 'Lumen Fast' : 'Nova Pro',
      task: `Handle batch ${i + 1} of the help center articles`,
      status: i < 3 ? 'done' : i < 6 ? 'running' : 'queued',
      cost: i < 6 ? 0.01 + i * 0.004 : undefined,
      started: i < 6 ? ago(140 - i * 8) : undefined,
      ended: i < 3 ? ago(70 - i * 8) : undefined,
    }),
  ),
};

const longPath = 'packages/northwind-ledger/src/migrations/2025_10_04_backfill_invoice_line_items_with_tax_jurisdiction.sql';

const longText: TreeAgent = {
  id: 'l0',
  name: 'Quarterly close orchestrator for Northwind Labs finance operations',
  model: 'Quill Reasoner with extended context window and tool use',
  task: `Reconcile every open invoice in ${longPath} against the purchase orders exported from the procurement system and flag variances above two percent for the controller`,
  status: 'running',
  cost: 1.2837,
  started: ago(3720),
  children: [
    leaf({ id: 'l1', name: 'Supercalifragilistic-reconciliation-agent-with-a-very-long-name', model: 'Atlas 2', task: longPath, status: 'failed', error: `Could not open ${longPath}: permission denied for role finance_readonly.`, cost: 0.4, started: ago(3000), ended: ago(2100) }),
    leaf({ id: 'l2', name: 'Auditor', model: 'Nova Pro', task: 'https://northwind-labs.example/reports/2025/q3/close/variance-summary?currency=EUR&region=emea&include=drafts', status: 'waiting', ask: 'Include draft invoices from the last three days of the quarter in the variance summary and the controller export?', cost: 0.12, started: ago(600) }),
  ],
};

const solo = (over: Partial<TreeAgent> = {}): TreeAgent => ({
  id: 'solo',
  name: 'Orchestrator',
  model: 'Atlas 2',
  task: 'Draft the release notes for version 4.2',
  status: 'running',
  cost: 0.03,
  started: ago(24),
  ...over,
});

const manyTools = [<FileTextIcon key="1" size={11} />, <PaletteIcon key="2" size={11} />, <BranchIcon key="3" size={11} />, <DatabaseIcon key="4" size={11} />, <GlobeIcon key="5" size={11} />];

const mod: StateModule = {
  slug: 'agent-tree',
  title: 'Agent tree',
  width: 1000,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'running', label: 'running (typical)', render: () => <AgentTree root={run} now={NOW} /> },
        { id: 'all-done', label: 'all done', render: () => <AgentTree root={allDone} now={NOW} /> },
        { id: 'waiting', label: 'needs you', render: () => <AgentTree root={waiting} now={NOW} onResolve={() => undefined} /> },
        { id: 'failed', label: 'failed branch', render: () => <AgentTree root={failed} now={NOW} onResolve={() => undefined} /> },
        { id: 'stopped-queued', label: 'stopped and queued', render: () => <AgentTree root={stopped} now={NOW} /> },
        { id: 'solo-running', label: 'single agent, running', render: () => <AgentTree root={solo()} now={NOW} /> },
        { id: 'solo-queued', label: 'single agent, queued', render: () => <AgentTree root={solo({ status: 'queued', started: undefined, cost: undefined })} now={NOW} /> },
      ],
    },
    {
      label: 'Shape',
      states: [
        { id: 'deep', label: 'five levels deep', render: () => <AgentTree root={deep} now={NOW} /> },
        { id: 'wide', label: 'eight sub-agents wrap', render: () => <AgentTree root={wide} now={NOW} /> },
        {
          id: 'one-child',
          label: 'one sub-agent',
          render: () => <AgentTree root={solo({ children: [leaf({ id: 'c1', name: 'Editor', model: 'Nova Pro', task: 'Tighten the wording of the changelog', status: 'running', cost: 0.01, started: ago(10) })] })} now={NOW} />,
        },
        {
          id: 'two-children',
          label: 'two sub-agents',
          render: () => <AgentTree root={{ ...allDone, children: allDone.children!.slice(0, 2) }} now={NOW} />,
        },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-text', label: 'long names, paths and URLs', render: () => <AgentTree root={longText} now={NOW} onResolve={() => undefined} /> },
        { id: 'many-tools', label: 'five tools (3 shown)', render: () => <AgentTree root={solo({ tools: manyTools })} now={NOW} /> },
        { id: 'custom-avatar', label: 'custom avatar', render: () => <AgentTree root={solo({ avatar: <PaletteIcon size={28} aria-hidden="true" /> })} now={NOW} /> },
        { id: 'bare', label: 'no model, tools, cost or time', render: () => <AgentTree root={solo({ model: undefined, cost: undefined, started: undefined, status: 'done' })} now={NOW} /> },
        { id: 'long-running', label: 'hours of runtime', render: () => <AgentTree root={solo({ started: NOW - 3 * 3600_000 - 14 * 60_000 })} now={NOW} /> },
        { id: 'custom-cost', label: 'custom cost format', render: () => <AgentTree root={run} now={NOW} formatCost={(n) => `${Math.round(n * 1000)} credits`} title="Pricing launch" /> },
      ],
    },
    {
      label: 'Disclosure',
      states: [
        { id: 'folded-root', label: 'root folded', render: () => <AgentTree root={run} now={NOW} defaultCollapsed={['lead']} /> },
        { id: 'folded-branch', label: 'one branch folded', render: () => <AgentTree root={run} now={NOW} defaultCollapsed={['research']} /> },
        { id: 'selectable', label: 'names selectable', render: () => <AgentTree root={run} now={NOW} onSelect={() => undefined} /> },
      ],
    },
  ],
  missing: [
    'Empty tree (root is required; there is no no-agents branch)',
    'Loading / skeleton (no loading prop)',
    'Disabled / read-only (no such prop; resolve chips only appear when an agent waits or fails)',
    'Open waiting/failed popover (internal DialogTrigger; no defaultOpen)',
  ],
};
export default mod;
