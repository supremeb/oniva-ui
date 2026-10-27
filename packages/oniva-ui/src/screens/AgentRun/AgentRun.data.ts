export type RunStepStatus =
  'pending' | 'running' | 'waiting' | 'done' | 'denied' | 'skipped' | 'stopped';

export interface RunToolCall {
  name: string;
  summary: string;
  args?: unknown;
  result?: unknown;
  /** Display duration, e.g. `1.2s`. */
  duration?: string;
}

export interface RunApproval {
  title: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  details?: string[];
}

export interface RunStep {
  id: string;
  title: string;
  detail?: string;
  tool?: string;
  calls?: RunToolCall[];
  approval?: RunApproval;
  /** Only used when `autoRun` is off: drive the step from your own events. */
  status?: RunStepStatus;
}

export interface RunDraft {
  original: string;
  suggested: string;
  label?: string;
}

export const defaultRunSteps: RunStep[] = [
  {
    id: 'numbers',
    title: 'Pull Q3 numbers',
    detail: 'Revenue, churn and runway from the finance warehouse.',
    tool: 'Warehouse',
    calls: [
      {
        name: 'query_warehouse',
        summary: 'Quarterly revenue by segment, Q3 2026',
        args: { table: 'finance.revenue_q', quarter: '2026-Q3', group_by: 'segment' },
        result: { rows: 4, total_usd: 4820000, growth_qoq: 0.124 },
        duration: '1.4s',
      },
      {
        name: 'query_warehouse',
        summary: 'Logo churn and net revenue retention',
        args: { table: 'finance.retention', quarter: '2026-Q3' },
        result: { logo_churn: 0.021, nrr: 1.12 },
        duration: '0.9s',
      },
    ],
  },
  {
    id: 'highlights',
    title: 'Collect customer highlights',
    detail: 'Three wins and one risk from the CRM notes.',
    tool: 'CRM',
    calls: [
      {
        name: 'search_notes',
        summary: 'Closed-won deals above $120k since July 1',
        args: { query: 'closed won', min_value: 120000, since: '2026-07-01' },
        result: { matches: 3 },
        duration: '1.1s',
      },
    ],
  },
  {
    id: 'draft',
    title: 'Write the board memo',
    detail: 'Two pages, plain language, numbers first.',
    tool: 'Docs',
    calls: [
      {
        name: 'create_doc',
        summary: 'Board memo – Q3 2026 (draft)',
        args: { title: 'Board memo – Q3', template: 'board-update' },
        result: { doc_id: 'doc_4f2a', words: 612 },
        duration: '2.3s',
      },
    ],
  },
  {
    id: 'send',
    title: 'Send to the board',
    detail: 'Waits for your approval before anything leaves the workspace.',
    tool: 'Email',
    calls: [
      {
        name: 'send_email',
        summary: 'Board memo to 7 recipients',
        args: { to: 'board@northwindlabs.example', subject: 'Q3 board update', attach: 'doc_4f2a' },
        result: { delivered: 7 },
        duration: '0.6s',
      },
    ],
    approval: {
      title: 'Send the memo to 7 board members?',
      description: 'The email goes out from your address and cannot be recalled.',
      risk: 'high',
      details: [
        'To: board@northwindlabs.example (7 people)',
        'Attachment: Board memo – Q3.pdf',
        'Sent from: you',
      ],
    },
  },
];

export const defaultRunDraft: RunDraft = {
  label: 'Board memo – Q3',
  original:
    'Revenue grew 9% this quarter to $4.4M. Churn was low. We closed two large deals and expect a steady Q4 with hiring on hold until the next review.',
  suggested:
    'Revenue grew 12.4% this quarter to $4.82M. Logo churn fell to 2.1% and net retention reached 112%. We closed three deals above $120k and expect a steady Q4 with two engineering hires approved.',
};
