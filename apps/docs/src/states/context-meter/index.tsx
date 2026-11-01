import { ContextMeter } from 'oniva-ui';
import type { ContextBreakdownItem } from 'oniva-ui';
import type { StateModule } from '../types';

const session: ContextBreakdownItem[] = [
  { label: 'System prompt', tokens: 4200 },
  { label: 'Tool definitions', tokens: 9800 },
  { label: 'Conversation', tokens: 61400 },
  { label: 'Attached files (orders.csv)', tokens: 38600 },
];

const MODEL = 'Atlas 2';

const mod: StateModule = {
  slug: 'context-meter',
  title: 'Context meter',
  width: 320,
  groups: [
    {
      label: 'Usage',
      states: [
        { id: 'empty-session', label: 'empty session', render: () => <ContextMeter max={200000} breakdown={[]} /> },
        {
          id: 'fresh',
          label: 'fresh, system prompt only',
          render: () => <ContextMeter max={200000} model={MODEL} breakdown={[{ label: 'System prompt', tokens: 4200 }]} />,
        },
        {
          id: 'typical',
          label: 'typical, accent tone',
          render: () => <ContextMeter max={200000} model={MODEL} cost={0.42} breakdown={session} />,
        },
        {
          id: 'warning',
          label: 'warning, 70% and up',
          render: () => (
            <ContextMeter
              max={128000}
              model="Nova Pro"
              cost={1.86}
              breakdown={[
                { label: 'System prompt', tokens: 4200 },
                { label: 'Tool definitions', tokens: 9800 },
                { label: 'Conversation', tokens: 72300 },
              ]}
            />
          ),
        },
        {
          id: 'danger',
          label: 'danger, 90% and up',
          render: () => <ContextMeter max={128000} model="Nova Pro" cost={3.2} breakdown={[{ label: 'Conversation', tokens: 119000 }]} />,
        },
        {
          id: 'over-limit',
          label: 'over the window',
          render: () => (
            <ContextMeter
              max={32000}
              model="Lumen Fast"
              cost={0.07}
              breakdown={[
                { label: 'System prompt', tokens: 4200 },
                { label: 'Conversation', tokens: 31800 },
              ]}
            />
          ),
        },
        { id: 'zero-max', label: 'max is zero', render: () => <ContextMeter max={0} breakdown={session} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'many-sources',
          label: 'more sources than swatch colours',
          render: () => (
            <ContextMeter
              max={1000000}
              model="Quill Reasoner"
              cost={12.48}
              breakdown={[
                { label: 'System prompt', tokens: 4200 },
                { label: 'Tool definitions', tokens: 9800 },
                { label: 'Conversation', tokens: 261400 },
                { label: 'Attached files (orders.csv)', tokens: 138600 },
                { label: 'Retrieved documents', tokens: 92000 },
                { label: 'Memory notes', tokens: 3100 },
                { label: 'Tool results', tokens: 74500 },
              ]}
            />
          ),
        },
        {
          id: 'long-labels',
          label: 'long labels and model name',
          render: () => (
            <ContextMeter
              max={200000}
              model="Atlas 2 Extended Reasoning (preview, 2026-03 snapshot)"
              cost={0.42}
              breakdown={[
                { label: 'Attached file packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts', tokens: 38600 },
                { label: 'Conversation', tokens: 61400 },
              ]}
            />
          ),
        },
        {
          id: 'zero-token-source',
          label: 'source with zero tokens',
          render: () => (
            <ContextMeter
              max={200000}
              breakdown={[
                { label: 'System prompt', tokens: 4200 },
                { label: 'Attached files', tokens: 0 },
                { label: 'Conversation', tokens: 61400 },
              ]}
            />
          ),
        },
        { id: 'no-cost-no-model', label: 'no cost, no model', render: () => <ContextMeter max={200000} breakdown={session} /> },
        { id: 'free-cost', label: 'cost is zero', render: () => <ContextMeter max={200000} cost={0} model={MODEL} breakdown={session} /> },
      ],
    },
    {
      label: 'Window',
      states: [
        {
          id: 'million-window',
          label: 'million-token window',
          render: () => (
            <ContextMeter max={1000000} model="Quill Reasoner" cost={4.1} breakdown={[{ label: 'Conversation', tokens: 412000 }, { label: 'Tool results', tokens: 96000 }]} />
          ),
        },
        {
          id: 'small-window',
          label: 'small window, raw counts',
          render: () => <ContextMeter max={8192} model="Lumen Fast" breakdown={[{ label: 'System prompt', tokens: 640 }, { label: 'Conversation', tokens: 2310 }]} />,
        },
      ],
    },
  ],
  missing: [
    'Popover open (breakdown list, stacked bar, session cost): reachable only by clicking the trigger; ContextMeter exposes no defaultOpen/isOpen prop',
    'Loading / unknown usage: no prop for it; breakdown and max are required',
    'Disabled: no isDisabled prop',
    'Size variants: ring is fixed at 20px',
  ],
};

export default mod;
