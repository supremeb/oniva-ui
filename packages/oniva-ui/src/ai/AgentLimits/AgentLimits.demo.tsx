import type { DemoModule } from '../../internal/demo';
import { AgentLimits } from './AgentLimits';

const context = {
  max: 1_000_000,
  segments: [
    { id: 'sys', label: 'System', value: 42_000, display: '42k', color: 'c5' as const },
    { id: 'msg', label: 'Messages', value: 468_000, display: '468k', color: 'c4' as const },
    { id: 'tool', label: 'Tool results', value: 270_000, display: '270k', color: 'c1' as const },
    { id: 'files', label: 'Files', value: 40_000, display: '40k', color: 'c8' as const },
  ],
};
const limits = [
  { id: '5h', label: '5-hour limit', resetsIn: 'Resets in 2 hr 46 min', percent: 38 },
  { id: 'wk', label: 'Weekly limit', resetsIn: 'Resets Fri 9:00 AM', percent: 74 },
  { id: 'opus', label: 'Opus weekly limit', resetsIn: 'Resets Fri 9:00 AM', percent: 93 },
];

const demo: DemoModule = {
  meta: {
    title: 'Agent Limits',
    slug: 'agent-limits',
    category: 'AI & Agent',
    description: 'Context window usage as a segmented bar, plus plan usage limits with reset times.',
  },
  demos: [
    {
      name: 'Context + plan limits',
      code: `<AgentLimits plan="Max (5x)" context={{ max: 1_000_000, segments }} limits={limits} />`,
      Component: () => (
        <div style={{ maxWidth: 420 }}>
          <AgentLimits plan="Max (5x)" context={context} limits={limits} />
        </div>
      ),
    },
    {
      name: 'Limits only',
      code: `<AgentLimits plan="Pro" limits={limits.slice(0, 2)} />`,
      Component: () => (
        <div style={{ maxWidth: 420 }}>
          <AgentLimits plan="Pro" limits={limits.slice(0, 2)} />
        </div>
      ),
    },
  ],
};

export default demo;
