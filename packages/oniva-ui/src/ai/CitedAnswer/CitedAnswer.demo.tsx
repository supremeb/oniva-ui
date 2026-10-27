import type { DemoModule } from '../../internal/demo';
import { CitedAnswer, type CitedSegment, type CitedSource } from './CitedAnswer';

const sources: CitedSource[] = [
  { id: 'cache', site: 'Tokenwise', title: 'Prompt caching, explained', url: 'https://tokenwise.example.com/blog/prompt-caching', date: 'Sep 18, 2026', quote: 'A cached prefix is read instead of recomputed, which cuts both latency and cost for long, repeated instructions.', highlight: ['read instead of recomputed'] },
  { id: 'stream', site: 'Latency Notes', title: 'Why streaming feels faster', url: 'https://latency.example.com/streaming', date: 'Aug 2, 2026', quote: 'Perceived latency drops once the first words appear, even when the total generation time is unchanged.' },
  { id: 'batch', site: 'Ops handbook', title: 'Batching offline jobs', quote: 'Non-urgent workloads can run in batches at roughly half the price of interactive requests.' },
];

const segments: CitedSegment[] = [
  { text: 'The biggest win is prompt caching: the provider reuses the processed start of your prompt, so a long system prompt isn\'t recomputed on every call.', cite: ['cache'] },
  { text: ' On prompts over 10K tokens that can cut time to first token by up to 80%.', cite: ['cache'] },
  { text: ' It only works while that start stays identical, so put the system prompt, tools and long documents first and anything that changes per request last.', cite: ['stream', 'cache'] },
  { text: 'For repeated questions, add a semantic cache in front of the model: close matches get a stored answer in about 40 ms,', cite: ['batch'], paragraph: true },
  { text: ' which covered nearly a third of FAQ-style traffic in one production setup.', cite: ['batch'] },
  { text: ' Stream the rest, so people see the first words while the answer is still being written.' },
];

const demo: DemoModule = {
  meta: {
    title: 'Cited answer',
    slug: 'cited-answer',
    category: 'AI & Agent',
    description: 'A finished answer wired to its sources: point at a citation to light up its sentence, press to unfold the quoted passage with matching words marked.',
  },
  demos: [
    {
      name: 'Default',
      code: `<CitedAnswer segments={segments} sources={sources} pagesRead={12} action={{ label: 'Follow up', onPress: () => {} }} />`,
      Component: () => <CitedAnswer segments={segments} sources={sources} pagesRead={12} action={{ label: 'Follow up', onPress: () => {} }} />,
    },
    {
      name: 'Preview open with action',
      code: `<CitedAnswer segments={segments} sources={sources} defaultOpen="stream" action={{ label: 'Follow up', onPress: () => {} }} />`,
      Component: () => <CitedAnswer segments={segments} sources={sources} defaultOpen="stream" action={{ label: 'Follow up', onPress: () => {} }} />,
    },
  ],
};

export default demo;
