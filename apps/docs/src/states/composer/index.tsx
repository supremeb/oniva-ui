import { Composer, MailIcon, MessageSquareIcon, CalendarDaysIcon } from 'oniva-ui';
import type { AttachmentFile, ModelOption } from 'oniva-ui';
import type { StateModule } from '../types';

const models: ModelOption[] = [
  { id: 'nova-pro', name: 'Nova Pro', description: 'Fast and capable for everyday work', speed: 4, quality: 4, cost: 3, latencyMs: 420, pricePerM: 3 },
  { id: 'atlas-2', name: 'Atlas 2', description: 'Most intelligent, slower', speed: 2, quality: 5, cost: 5, latencyMs: 1100, pricePerM: 15 },
  { id: 'lumen-fast', name: 'Lumen Fast', description: 'Lightweight and instant', speed: 5, quality: 3, cost: 1, latencyMs: 180, pricePerM: 0.8 },
];

const files: AttachmentFile[] = [
  { id: 'a1', name: 'q3_revenue_by_segment.csv', size: 48_200, type: 'text/csv', status: 'done' },
  { id: 'a2', name: 'board-deck-october.pdf', size: 2_400_000, type: 'application/pdf', status: 'uploading', progress: 58 },
  { id: 'a3', name: 'churn-export-northwind.xlsx', size: 912_000, type: 'application/vnd.ms-excel', status: 'error' },
];

const longText =
  'Summarize the open invoices for October and flag anything overdue. Group them by customer, include the payment terms and the contact at each account, and note which ones were already escalated to finance. ' +
  'Then compare the totals with September and explain the biggest movements. Draft a short note for the account owners with the three accounts that need a call this week, and list what we would need from each of them to close the gap before month end. ' +
  'Finally, propose a reminder schedule for the remaining invoices that respects each customer\'s time zone and any holidays that fall inside the window. Keep the tone polite but direct, and avoid repeating the invoice numbers in the summary.';

const longUrl = 'https://reports.northwind-labs.example/finance/2026/q3/exports/open-invoices-by-customer-segment-and-region-with-payment-terms-and-escalation-status.csv?token=abcdef0123456789abcdef0123456789';

const longLabelModes = [
  { id: 'ask', label: 'Ask before acting on every single tool call in this workspace' },
  { id: 'auto', label: 'Run freely' },
];

const mod: StateModule = {
  slug: 'composer',
  title: 'Composer',
  width: 720,
  groups: [
    {
      label: 'Content',
      states: [
        { id: 'empty', label: 'empty', render: () => <Composer models={models} onAttach={() => undefined} /> },
        { id: 'one-line', label: 'one line typed', render: () => <Composer models={models} onAttach={() => undefined} defaultValue="Analyze Q3 revenue by segment" /> },
        {
          id: 'multi-line',
          label: 'several lines',
          render: () => (
            <Composer
              models={models}
              onAttach={() => undefined}
              defaultValue={'Write the October close checklist:\n- reconcile open invoices\n- chase the three overdue accounts\n- send the summary to #finance'}
            />
          ),
        },
        { id: 'long-text', label: 'long text scrolls (max 220px)', render: () => <Composer models={models} onAttach={() => undefined} defaultValue={longText} /> },
        { id: 'long-unbroken', label: 'long unbroken URL', render: () => <Composer models={models} onAttach={() => undefined} defaultValue={longUrl} /> },
        { id: 'custom-placeholder', label: 'custom placeholder', render: () => <Composer placeholder="Analyze Q3 revenue by segment…" models={models} /> },
      ],
    },
    {
      label: 'Run',
      states: [
        { id: 'streaming', label: 'streaming (orbiting border, Stop)', render: () => <Composer isStreaming models={models} onAttach={() => undefined} showMic defaultValue="Summarize churn drivers for self-serve" onStop={() => undefined} /> },
        { id: 'streaming-empty', label: 'streaming, empty field', render: () => <Composer isStreaming models={models} onStop={() => undefined} /> },
      ],
    },
    {
      label: 'Access',
      states: [
        { id: 'disabled', label: 'disabled', render: () => <Composer isDisabled models={models} onAttach={() => undefined} showMic /> },
        { id: 'disabled-with-text', label: 'disabled with text', render: () => <Composer isDisabled models={models} onAttach={() => undefined} showMic defaultValue="Analyze Q3 revenue by segment" /> },
      ],
    },
    {
      label: 'Attachments',
      states: [
        { id: 'one-file', label: 'one file', render: () => <Composer models={models} onAttach={() => undefined} attachments={files.slice(0, 1)} onRemoveAttachment={() => undefined} /> },
        { id: 'mixed-files', label: 'done, uploading, error', render: () => <Composer models={models} onAttach={() => undefined} attachments={files} onRemoveAttachment={() => undefined} /> },
        {
          id: 'many-files',
          label: 'many files',
          render: () => (
            <Composer
              models={models}
              onAttach={() => undefined}
              onRemoveAttachment={() => undefined}
              attachments={Array.from({ length: 9 }, (_, i): AttachmentFile => ({
                id: `m${i}`,
                name: ['q3_revenue_by_segment.csv', 'board-deck-october.pdf', 'churn-export.xlsx', 'invoice-0412.pdf', 'notes.md'][i % 5]!,
                size: 20_000 + i * 310_000,
                type: i % 2 ? 'application/pdf' : 'text/csv',
                status: 'done',
              }))}
            />
          ),
        },
        {
          id: 'long-file-name',
          label: 'long file name',
          render: () => (
            <Composer
              models={models}
              onAttach={() => undefined}
              onRemoveAttachment={() => undefined}
              attachments={[{ id: 'l1', name: 'northwind-labs-finance-q3-2026-open-invoices-by-customer-segment-and-region-final-v7-reviewed.csv', size: 1_480_000, type: 'text/csv' }]}
            />
          ),
        },
        { id: 'file-only-send', label: 'attachment, no text (send enabled)', render: () => <Composer attachments={files.slice(0, 1)} onRemoveAttachment={() => undefined} /> },
      ],
    },
    {
      label: 'Controls',
      states: [
        { id: 'bare', label: 'defaults (no models, no attach)', render: () => <Composer /> },
        { id: 'minimal', label: 'minimal (hideEffort, hidePermissions)', render: () => <Composer hideEffort hidePermissions placeholder="Message the assistant" /> },
        { id: 'with-mic', label: 'with mic', render: () => <Composer showMic hideEffort hidePermissions models={models} /> },
        { id: 'model-settings', label: 'thinking and web search on', render: () => <Composer models={models} model="atlas-2" thinking webSearch modelEffort="high" onThinkingChange={() => undefined} onWebSearchChange={() => undefined} onModelEffortChange={() => undefined} /> },
        { id: 'effort-faster', label: 'effort: faster', render: () => <Composer models={models} effort="faster" /> },
        { id: 'effort-smarter', label: 'effort: smarter', render: () => <Composer models={models} effort="smarter" /> },
        { id: 'long-mode-label', label: 'long permission label', render: () => <Composer models={models} onAttach={() => undefined} permissionModes={longLabelModes} showMic /> },
        { id: 'extra-actions', label: 'extra actions', render: () => <Composer models={models} actions={<button type="button">Templates</button>} /> },
      ],
    },
    {
      label: 'Variant',
      states: [
        { id: 'tray', label: 'tray', render: () => <Composer variant="tray" placeholder="Start by typing…" onAttach={() => undefined} showMic permissionModes={[{ id: 'approval', label: 'Request approval' }, { id: 'auto', label: 'Run freely' }]} /> },
        {
          id: 'tray-footer',
          label: 'tray with footer',
          render: () => (
            <Composer
              variant="tray"
              placeholder="Start by typing…"
              onAttach={() => undefined}
              showMic
              footer={
                <>
                  <MailIcon size={16} aria-hidden="true" />
                  <MessageSquareIcon size={16} aria-hidden="true" />
                  <CalendarDaysIcon size={16} aria-hidden="true" />
                  <span>Connect apps</span>
                </>
              }
            />
          ),
        },
        { id: 'tray-streaming', label: 'tray streaming', render: () => <Composer variant="tray" isStreaming defaultValue="Draft the October close note" onAttach={() => undefined} /> },
        { id: 'tray-files', label: 'tray with files and text', render: () => <Composer variant="tray" attachments={files} onRemoveAttachment={() => undefined} onAttach={() => undefined} defaultValue="Compare these against last quarter" models={models} /> },
      ],
    },
    {
      label: 'Size',
      states: [
        { id: 'narrow', label: 'narrow container (320px, hint hidden)', render: () => <div style={{ maxWidth: 320 }}><Composer models={models} onAttach={() => undefined} showMic defaultValue="Analyze Q3 revenue" /></div> },
      ],
    },
  ],
  missing: [
    'Listening (dictation active): reached only by pressing the mic, no prop',
    'Open model, effort and permission menus: popovers have no default-open prop',
    'Error / failed send: the component has no error state',
    'Over-limit input or character counter: not implemented',
  ],
};
export default mod;
