import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Suggestions } from './Suggestions';

const prompts = [
  'Summarize this PR',
  'Find risky changes',
  'Draft review comments',
  'Compare p95 latency',
  'Explain the retry logic',
  'Suggest tests',
];

function Demo() {
  const [last, setLast] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420 }}>
      <Suggestions aria-label="Suggested prompts" suggestions={prompts} onSelect={setLast} />
      <span style={{ fontSize: 12, opacity: 0.7 }}>{last ? `Selected: ${last}` : 'Scroll or pick a prompt'}</span>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Suggestions',
    slug: 'suggestions',
    category: 'AI & Agent',
    description: 'Scrollable prompt chips that stagger in.',
  },
  demos: [
    {
      name: 'Prompt chips',
      code: `<Suggestions suggestions={prompts} onSelect={(p) => send(p)} />`,
      Component: Demo,
    },
  ],
};

export default demo;
