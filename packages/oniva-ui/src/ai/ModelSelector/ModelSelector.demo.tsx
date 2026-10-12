import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { ModelSelector } from './ModelSelector';

const models = [
  { id: 'sonnet-5', name: 'Sonnet 5', description: 'Fast and capable for everyday work' },
  { id: 'opus-5', name: 'Opus 5', description: 'Most intelligent, slower' },
  { id: 'haiku-5', name: 'Haiku 5', description: 'Lightweight and instant' },
];

const demo: DemoModule = {
  meta: {
    title: 'Model Selector',
    slug: 'model-selector',
    category: 'AI & Agent',
    description: 'Compact model picker with descriptions, built on DropdownMenu.',
  },
  demos: [
    {
      name: 'Default',
      code: `<ModelSelector models={models} value={model} onChange={setModel} />`,
      Component: function Default() {
        const [model, setModel] = useState('sonnet-5');
        return <ModelSelector models={models} value={model} onChange={setModel} />;
      },
    },
  ],
};

export default demo;
