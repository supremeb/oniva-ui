import { ModelSelector } from 'oniva-ui';
import type { ModelOption } from 'oniva-ui';
import type { StateModule } from '../types';

const models: ModelOption[] = [
  { id: 'atlas-2', name: 'Atlas 2', description: 'Hardest problems', speed: 2, quality: 5, cost: 5, latencyMs: 2100, pricePerM: 25 },
  { id: 'nova-pro', name: 'Nova Pro', description: 'Everyday work', speed: 4, quality: 4, cost: 3, latencyMs: 900, pricePerM: 15 },
  { id: 'lumen-fast', name: 'Lumen Fast', description: 'Quick and light', speed: 5, quality: 3, cost: 1, latencyMs: 400, pricePerM: 4 },
  { id: 'auto', name: 'Auto', description: 'Picks per request' },
];

const longName: ModelOption[] = [
  {
    id: 'quill-long',
    name: 'Quill Reasoner Extended Context Preview (northwind-labs/quill-reasoner-2026-10-31-long-context)',
    description: 'Long documents',
    speed: 2,
    quality: 5,
    cost: 4,
    latencyMs: 2600,
    pricePerM: 32,
  },
  ...models,
];

const mod: StateModule = {
  slug: 'model-selector',
  title: 'Model selector',
  width: 420,
  groups: [
    {
      label: 'Variant',
      states: [
        { id: 'default', label: 'default, closed', render: () => <ModelSelector models={models} defaultValue="nova-pro" /> },
        { id: 'detailed', label: 'detailed, closed', render: () => <ModelSelector variant="detailed" models={models} defaultValue="nova-pro" /> },
        { id: 'router', label: 'router (Auto) selected', render: () => <ModelSelector variant="detailed" models={models} defaultValue="auto" /> },
      ],
    },
    {
      label: 'Settings',
      states: [
        {
          id: 'thinking-on',
          label: 'extended thinking on',
          render: () => <ModelSelector models={models} defaultValue="atlas-2" defaultThinking onThinkingChange={() => {}} onWebSearchChange={() => {}} />,
        },
        {
          id: 'thinking-on-detailed',
          label: 'thinking on, detailed',
          render: () => (
            <ModelSelector variant="detailed" models={models} defaultValue="atlas-2" defaultThinking defaultEffort="high" onThinkingChange={() => {}} onWebSearchChange={() => {}} />
          ),
        },
        {
          id: 'web-search',
          label: 'web search on',
          render: () => <ModelSelector models={models} defaultValue="lumen-fast" defaultWebSearch onThinkingChange={() => {}} onWebSearchChange={() => {}} />,
        },
      ],
    },
    {
      label: 'Access',
      states: [
        { id: 'disabled', label: 'disabled', render: () => <ModelSelector models={models} defaultValue="nova-pro" isDisabled /> },
        { id: 'disabled-detailed', label: 'disabled, detailed', render: () => <ModelSelector variant="detailed" models={models} defaultValue="nova-pro" isDisabled /> },
      ],
    },
    {
      label: 'Data',
      states: [
        { id: 'single-model', label: 'one model', render: () => <ModelSelector models={models.slice(1, 2)} /> },
        { id: 'no-models', label: 'no models', render: () => <ModelSelector models={[]} /> },
        { id: 'unknown-value', label: 'unknown value falls back to first', render: () => <ModelSelector models={models} value="retired-model" /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-name', label: 'long model name', render: () => <ModelSelector models={longName} defaultValue="quill-long" /> },
        { id: 'long-name-detailed', label: 'long model name, detailed', render: () => <ModelSelector variant="detailed" models={longName} defaultValue="quill-long" /> },
      ],
    },
  ],
  missing: [
    'open menu (no isOpen / defaultOpen prop; the popover only opens by click, so list rows, header, footer, toggles and effort rows cannot be shown)',
    'loading models (no pending prop)',
    'error / unavailable model row (no per-model disabled flag)',
  ],
};

export default mod;
