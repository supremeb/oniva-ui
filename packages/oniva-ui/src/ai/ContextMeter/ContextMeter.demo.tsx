import type { DemoModule } from '../../internal/demo';
import { ContextMeter } from './ContextMeter';

const breakdown = [
  { label: 'System prompt', tokens: 4200 },
  { label: 'Tool definitions', tokens: 9800 },
  { label: 'Conversation', tokens: 61400 },
  { label: 'Attached files (orders.csv)', tokens: 38600 },
];

const demo: DemoModule = {
  meta: {
    title: 'Context meter',
    slug: 'context-meter',
    category: 'AI & Agent',
    description: 'Context-window ring with a popover breakdown and session cost.',
  },
  demos: [
    {
      name: 'Data analyst session',
      code: `<ContextMeter max={200000} model="Claude Sonnet" cost={0.42} breakdown={breakdown} />`,
      Component: () => <ContextMeter max={200000} model="Claude Sonnet" cost={0.42} breakdown={breakdown} />,
    },
    {
      name: 'Nearly full',
      code: `<ContextMeter max={128000} breakdown={[{ label: 'Conversation', tokens: 119000 }]} />`,
      Component: () => <ContextMeter max={128000} breakdown={[{ label: 'Conversation', tokens: 119000 }]} />,
    },
  ],
};

export default demo;
