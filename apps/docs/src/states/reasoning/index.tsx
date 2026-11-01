import { Reasoning } from 'oniva-ui';
import type { StateModule } from '../types';

const short = `Checked the Q3 revenue table against the ledger export. 3 of 214 rows differ by under $40 (FX rounding), so the totals reconcile.`;

const trace = `Reviewing PR #482 "Retry failed webhooks with backoff".
- retry.ts: delay doubles but never caps, a 12th attempt would wait ~68 min.
- The queue consumer ack()s before the handler resolves, so a crash drops the job.
Plan: flag the missing cap and move ack() after the handler.`;

const long = Array.from(
  { length: 6 },
  (_, i) =>
    `Step ${i + 1}. Compare the settlement batch ${3100 + i} against the Northwind Labs ledger export and note every row where the currency, rounding mode or posting date differs. Rows posted after the 23:59 UTC cutoff move to the next batch, so their totals shift by the sum of the late entries (${(i + 2) * 17} rows, ${(i + 3) * 412} USD).`,
).join('\n\n');

const unbroken = `Source of the mismatch is https://ledger.northwind.example/exports/2026/q3/settlement-batches/3104/reconciliation-report-final-v2-with-fx-adjustments.csv and the mirrored copy at /var/data/northwind/exports/2026/q3/settlement-batches/3104/reconciliation-report-final-v2-with-fx-adjustments.csv`;

const mod: StateModule = {
  slug: 'reasoning',
  title: 'Reasoning',
  width: 720,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'streaming', label: 'streaming', render: () => <Reasoning isStreaming>{trace}</Reasoning> },
        {
          id: 'streaming-empty',
          label: 'streaming, no text yet',
          render: () => <Reasoning isStreaming>{null}</Reasoning>,
        },
        {
          id: 'streaming-with-duration',
          label: 'streaming, duration prop set',
          render: () => (
            <Reasoning isStreaming duration={7}>
              {trace}
            </Reasoning>
          ),
        },
      ],
    },
    {
      label: 'Finished',
      states: [
        { id: 'collapsed', label: 'collapsed, 12s', render: () => <Reasoning duration={12}>{short}</Reasoning> },
        {
          id: 'open',
          label: 'open, 12s',
          render: () => (
            <Reasoning duration={12} defaultOpen>
              {short}
            </Reasoning>
          ),
        },
        {
          id: 'minutes',
          label: 'open, 1m 05s',
          render: () => (
            <Reasoning duration={65} defaultOpen>
              {trace}
            </Reasoning>
          ),
        },
        {
          id: 'no-duration',
          label: 'collapsed, no duration',
          render: () => <Reasoning>{short}</Reasoning>,
        },
        {
          id: 'no-duration-open',
          label: 'open, no duration',
          render: () => <Reasoning defaultOpen>{short}</Reasoning>,
        },
        {
          id: 'open-empty',
          label: 'open, empty body',
          render: () => <Reasoning duration={3} defaultOpen />,
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'multiline',
          label: 'multi-line trace',
          render: () => (
            <Reasoning duration={18} defaultOpen>
              {trace}
            </Reasoning>
          ),
        },
        {
          id: 'long',
          label: 'long, six paragraphs',
          render: () => (
            <Reasoning duration={94} defaultOpen>
              {long}
            </Reasoning>
          ),
        },
        {
          id: 'unbroken',
          label: 'long unbroken URL and path',
          render: () => (
            <Reasoning duration={21} defaultOpen>
              {unbroken}
            </Reasoning>
          ),
        },
      ],
    },
  ],
  missing: [
    'Error or cancelled run (no status prop; an interrupted stream looks the same as a finished one)',
    'Disabled / read-only toggle (no prop)',
    'Streaming but collapsed (streaming always opens the panel)',
  ],
};

export default mod;
