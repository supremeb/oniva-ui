import { ArrowUp } from 'lucide-react';
import { useState } from 'react';
import { IconButton } from '../../components/IconButton';
import type { DemoModule } from '../../internal/demo';
import { ModelSelector, type ModelOption } from './ModelSelector';

const models: ModelOption[] = [
  { id: 'atlas-2', name: 'Atlas 2', description: 'Hardest problems', speed: 2, quality: 5, cost: 5, latencyMs: 2100, pricePerM: 25 },
  { id: 'nova-pro', name: 'Nova Pro', description: 'Everyday work', speed: 4, quality: 4, cost: 3, latencyMs: 900, pricePerM: 15 },
  { id: 'lumen-fast', name: 'Lumen Fast', description: 'Quick and light', speed: 5, quality: 3, cost: 1, latencyMs: 400, pricePerM: 4 },
  { id: 'auto', name: 'Auto', description: 'Picks per request' },
];

const demo: DemoModule = {
  meta: {
    title: 'Model selector',
    slug: 'model-selector',
    category: 'AI & Agent',
    description: 'Compact model picker with strengths, first-token time and price, plus optional extended thinking, effort and web search.',
  },
  demos: [
    {
      name: 'In a composer (detailed)',
      code: `<ModelSelector variant="detailed" models={models} defaultValue="nova-pro" onThinkingChange={…} onWebSearchChange={…} />`,
      Component: function Composed() {
        const [model, setModel] = useState('nova-pro');
        return (
          <div style={{ border: '1px solid var(--oniva-color-border)', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 440, padding: 12, width: '100%' }}>
            <span style={{ color: 'var(--oniva-color-text-muted)', fontSize: 14, paddingInline: 6, paddingBlockStart: 4 }}>Ask anything…</span>
            <span style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
              <ModelSelector variant="detailed" models={models} value={model} onChange={setModel} onThinkingChange={() => {}} onWebSearchChange={() => {}} />
              <IconButton variant="primary" size="sm" aria-label="Send"><ArrowUp size={16} /></IconButton>
            </span>
          </div>
        );
      },
    },
    {
      name: 'Default',
      code: `<ModelSelector models={models} value={model} onChange={setModel} />`,
      Component: function Default() {
        const [model, setModel] = useState('nova-pro');
        return <ModelSelector models={models} value={model} onChange={setModel} />;
      },
    },
    {
      name: 'With thinking, effort and web search',
      code: `<ModelSelector models={models} defaultValue="nova-pro" onThinkingChange={…} onWebSearchChange={…} onEffortChange={…} />`,
      Component: () => (
        <ModelSelector models={models} defaultValue="nova-pro" onThinkingChange={() => {}} onWebSearchChange={() => {}} />
      ),
    },
  ],
};

export default demo;
