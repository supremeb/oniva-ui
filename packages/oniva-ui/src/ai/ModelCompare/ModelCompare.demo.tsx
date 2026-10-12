import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { ModelCompare, type ModelResponse } from './ModelCompare';

const responses: ModelResponse[] = [
  { id: 'sonnet', model: 'Claude Sonnet 4.5', latencyMs: 2100, cost: 0.012, tokens: 1840, text: 'Q3 revenue was $4.82M, up 11.3% QoQ. The increase came mostly from the Scale tier (+$310K). Churn held at 1.9%.\n\nRisk: two enterprise renewals ($420K ARR) slip into Q4.' },
  { id: 'gpt', model: 'GPT-5', latencyMs: 3400, cost: 0.031, tokens: 2210, text: 'Revenue reached $4.82M in Q3 (+11.3% QoQ), driven by Scale-tier expansion. Churn was steady at 1.9%.\n\nWatch item: renewals worth $420K ARR may close in Q4 rather than Q3.' },
  { id: 'gemini', model: 'Gemini 2.5 Pro', latencyMs: 2900, cost: 0.018, tokens: 1990, text: 'Q3: $4.82M revenue (11.3% growth). Scale tier added $310K. Churn 1.9%. Two renewals ($420K) are delayed to Q4.' },
];

function Controlled() {
  const [sel, setSel] = useState<string | undefined>();
  return <ModelCompare prompt="Summarize Q3 results for the board in three lines." responses={responses} selectedId={sel} onSelect={setSel} />;
}

const demo: DemoModule = {
  meta: {
    title: 'Model compare',
    slug: 'model-compare',
    category: 'AI & Agent',
    description: 'Side-by-side responses from different models with latency and cost, flagging the fastest and cheapest.',
  },
  demos: [
    {
      name: 'Three models',
      code: `<ModelCompare prompt="..." responses={responses} selectedId={sel} onSelect={setSel} />`,
      Component: Controlled,
    },
  ],
};

export default demo;
