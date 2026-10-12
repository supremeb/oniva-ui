import type { DemoModule } from '../../internal/demo';
import { ChainOfThought, type ChainOfThoughtStep } from './ChainOfThought';

const svg = (a: string, b: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="192" height="128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="192" height="128" fill="url(#g)"/></svg>`)}`;

const steps: ChainOfThoughtStep[] = [
  {
    id: 's1',
    label: 'Read the diff for PR #482',
    status: 'complete',
    description: '6 files changed, +214 / −58. Touches retry.ts and the queue consumer.',
  },
  {
    id: 's2',
    label: 'Search for backoff best practices',
    status: 'complete',
    results: [
      { title: 'Exponential backoff and jitter', url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter' },
      { title: 'Webhook retry policies', url: 'https://stripe.com/docs/webhooks' },
    ],
  },
  {
    id: 's3',
    label: 'Compare queue latency before and after',
    status: 'active',
    description: 'Rendering p95 latency charts from the staging traces.',
    images: [
      { src: svg('#c7d2fe', '#a5b4fc'), alt: 'p95 latency before the change' },
      { src: svg('#bbf7d0', '#86efac'), alt: 'p95 latency after the change' },
    ],
  },
  { id: 's4', label: 'Write review summary', status: 'pending' },
];

const demo: DemoModule = {
  meta: {
    title: 'Chain of thought',
    slug: 'chain-of-thought',
    category: 'AI & Agent',
    description: 'Collapsible timeline of reasoning steps with status dots, sources and images.',
  },
  demos: [
    {
      name: 'Code review agent',
      code: `<ChainOfThought steps={steps} />`,
      Component: () => <ChainOfThought steps={steps} />,
    },
    {
      name: 'Collapsed',
      code: `<ChainOfThought steps={steps} defaultOpen={false} title="4 steps" />`,
      Component: () => <ChainOfThought steps={steps} defaultOpen={false} title="4 steps" />,
    },
  ],
};

export default demo;
