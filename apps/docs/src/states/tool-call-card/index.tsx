import { ToolCallCard, ToolCallGroup, DatabaseIcon, FileTextIcon, MailIcon, SearchIcon } from 'oniva-ui';
import type { StateModule } from '../types';

const STARTED = Date.now() - 4200;

const dealsArgs = { table: 'deals', stage: 'closed_won', since: '2026-07-01', segments: ['enterprise', 'mid-market'], limit: 500 };
const dealsResult = { rows: 412, total_usd: 4820310, segments: ['enterprise', 'mid-market', 'self-serve'], truncated: false };

const longRows = {
  rows: Array.from({ length: 24 }, (_, i) => ({
    id: `deal_${(8400 + i * 7).toString()}`,
    account: ['Northwind Labs', 'Contoso Freight', 'Fabrikam Studio', 'Tailspin Air'][i % 4],
    amount_usd: 12000 + i * 1375,
    owner: `rep${(i % 5) + 1}@northwind.example`,
    closed_at: `2026-0${(i % 3) + 7}-${String((i % 27) + 1).padStart(2, '0')}`,
  })),
  total: 24,
};

const longPath = '/workspace/northwind-queue/packages/scheduler/src/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';
const longUrl = 'https://api.northwind.example/v2/accounts/acct_9f3a21c7e0b44d1a8c5d/billing/invoices?status=open&expand[]=lines&expand[]=customer.tax_ids&limit=100';

const base = { name: 'query_warehouse', icon: <DatabaseIcon size={13} />, summary: 'Queried closed-won deals' };

const mod: StateModule = {
  slug: 'tool-call-card',
  title: 'Tool call card',
  width: 720,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'success', label: 'success, collapsed', render: () => <ToolCallCard {...base} status="success" durationMs={1240} args={dealsArgs} result={dealsResult} /> },
        { id: 'pending', label: 'pending', render: () => <ToolCallCard name="send_email" icon={<MailIcon size={13} />} summary="Waiting to send the renewal reminder" status="pending" args={{ to: 'dana@northwind.example' }} /> },
        { id: 'running', label: 'running, live timer', render: () => <ToolCallCard name="web_search" icon={<SearchIcon size={13} />} summary="Searching competitor pricing…" status="running" startedAt={STARTED} args={{ q: 'crm pricing 2026' }} /> },
        { id: 'running-open', label: 'running, waiting for result', render: () => <ToolCallCard name="web_search" icon={<SearchIcon size={13} />} summary="Searching competitor pricing…" status="running" startedAt={STARTED} args={{ q: 'crm pricing 2026', max_results: 8 }} defaultExpanded /> },
        {
          id: 'error-retry',
          label: 'error, opens itself, retry',
          render: () => <ToolCallCard name="send_email" icon={<MailIcon size={13} />} summary="Could not send the renewal reminder" status="error" args={{ to: 'dana@northwind.example', subject: 'Your plan renews on Nov 3' }} error="SMTP 550: mailbox unavailable" onRetry={() => {}} />,
        },
        { id: 'error-no-retry', label: 'error, no retry', render: () => <ToolCallCard name="send_email" icon={<MailIcon size={13} />} summary="Could not send the renewal reminder" status="error" args={{ to: 'dana@northwind.example' }} error="SMTP 550: mailbox unavailable" /> },
        { id: 'error-no-message', label: 'error, no message', render: () => <ToolCallCard name="send_email" status="error" onRetry={() => {}} /> },
        { id: 'error-closed', label: 'error, openOnError off', render: () => <ToolCallCard name="send_email" icon={<MailIcon size={13} />} summary="Could not send the renewal reminder" status="error" openOnError={false} error="SMTP 550: mailbox unavailable" onRetry={() => {}} /> },
      ],
    },
    {
      label: 'Data',
      states: [
        { id: 'bare', label: 'name only', render: () => <ToolCallCard name="ping" status="success" duration="12ms" /> },
        { id: 'arg-line', label: 'no summary, argument line', render: () => <ToolCallCard name="query_warehouse" status="success" durationMs={1240} args={dealsArgs} /> },
        { id: 'expanded', label: 'expanded, args and result', render: () => <ToolCallCard {...base} status="success" durationMs={1240} args={dealsArgs} result={dealsResult} defaultExpanded /> },
        { id: 'expanded-empty', label: 'expanded, no args or result', render: () => <ToolCallCard name="ping" status="success" duration="12ms" defaultExpanded /> },
        { id: 'text-result', label: 'text result', render: () => <ToolCallCard name="read_file" icon={<FileTextIcon size={13} />} status="success" duration="80ms" args={{ path: 'notes/q3.md' }} defaultExpanded>{'Q3 retention held at 91%.\nTop mover: self-serve annual plans.\nChurn concentrated in accounts under 5 seats.'}</ToolCallCard> },
        {
          id: 'node-result',
          label: 'custom children',
          render: () => (
            <ToolCallCard name="render_table" status="success" durationMs={310} args={{ view: 'pipeline' }} defaultExpanded>
              <table>
                <tbody>
                  <tr><td>Enterprise</td><td>$2.1M</td></tr>
                  <tr><td>Mid-market</td><td>$1.6M</td></tr>
                </tbody>
              </table>
            </ToolCallCard>
          ),
        },
        { id: 'long-result', label: 'long result, capped', render: () => <ToolCallCard {...base} status="success" durationMs={2870} args={dealsArgs} result={longRows} defaultExpanded /> },
        { id: 'long-result-tall', label: 'long result, maxCodeHeight 120', render: () => <ToolCallCard {...base} status="success" durationMs={2870} args={dealsArgs} result={longRows} maxCodeHeight={120} defaultExpanded /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-summary', label: 'long summary', render: () => <ToolCallCard {...base} summary="Queried every closed-won deal from the enterprise and mid-market segments since July and grouped them by owner and quarter" status="success" durationMs={1240} /> },
        { id: 'long-name', label: 'long tool name', render: () => <ToolCallCard name="northwind_billing_reconcile_open_invoices_by_account" status="running" startedAt={STARTED} summary="Reconciling" /> },
        { id: 'long-args-line', label: 'long argument line', render: () => <ToolCallCard name="read_file" status="success" duration="80ms" args={{ path: longPath, encoding: 'utf-8', maxBytes: 1048576 }} /> },
        { id: 'long-unbroken', label: 'long path and URL, expanded', render: () => <ToolCallCard name="fetch_url" status="error" args={{ url: longUrl, path: longPath }} error={`GET ${longUrl} failed: connection reset by peer after 8000ms`} onRetry={() => {}} /> },
        { id: 'long-duration', label: 'long duration', render: () => <ToolCallCard {...base} status="success" durationMs={754000} /> },
      ],
    },
    {
      label: 'Group',
      states: [
        {
          id: 'group-closed',
          label: 'group, collapsed',
          render: () => (
            <ToolCallGroup>
              <ToolCallCard {...base} status="success" durationMs={1240} />
              <ToolCallCard name="web_search" icon={<SearchIcon size={13} />} summary="Searched competitor pricing" status="success" durationMs={900} />
              <ToolCallCard name="read_file" icon={<FileTextIcon size={13} />} summary="Read notes/q3.md" status="success" durationMs={80} />
            </ToolCallGroup>
          ),
        },
        {
          id: 'group-open',
          label: 'group, open, one failed',
          render: () => (
            <ToolCallGroup defaultOpen>
              <ToolCallCard {...base} status="success" durationMs={1240} args={dealsArgs} result={dealsResult} />
              <ToolCallCard name="web_search" icon={<SearchIcon size={13} />} summary="Searched competitor pricing" status="success" durationMs={900} args={{ q: 'crm pricing 2026' }} />
              <ToolCallCard name="send_email" icon={<MailIcon size={13} />} summary="Could not send the summary" status="error" args={{ to: 'dana@northwind.example' }} error="SMTP 550: mailbox unavailable" onRetry={() => {}} />
            </ToolCallGroup>
          ),
        },
        {
          id: 'group-running',
          label: 'group, running',
          render: () => (
            <ToolCallGroup defaultOpen>
              <ToolCallCard {...base} status="success" durationMs={1240} />
              <ToolCallCard name="web_search" icon={<SearchIcon size={13} />} summary="Searching competitor pricing…" status="running" startedAt={STARTED} args={{ q: 'crm pricing 2026' }} />
            </ToolCallGroup>
          ),
        },
        { id: 'group-one', label: 'group, one call', render: () => <ToolCallGroup><ToolCallCard {...base} status="success" durationMs={1240} /></ToolCallGroup> },
        { id: 'group-empty', label: 'group, no calls', render: () => <ToolCallGroup>{null}</ToolCallGroup> },
        {
          id: 'group-no-durations',
          label: 'group, custom label, no durations',
          render: () => (
            <ToolCallGroup label="Checked the pipeline">
              <ToolCallCard {...base} status="success" />
              <ToolCallCard name="web_search" icon={<SearchIcon size={13} />} status="success" duration="0.9s" />
            </ToolCallGroup>
          ),
        },
      ],
    },
  ],
  missing: ['pending shown with live timer (timer only runs for status running)', 'controlled isExpanded on its own (identical to defaultExpanded visually)'],
};

export default mod;
