import type { DemoModule } from '../../internal/demo';
import { PromptLibrary, type SavedPrompt } from './PromptLibrary';

const prompts: SavedPrompt[] = [
  { id: '1', name: 'Weekly status update', tags: ['reporting', 'team'], template: 'Write a concise status update for {{team}} covering {{period}}. Lead with blockers, then wins, then next steps.' },
  { id: '2', name: 'Customer escalation summary', tags: ['support'], template: 'Summarize the escalation from {{customer}} (ticket {{ticket}}) in five bullets and propose a next action for the account owner.' },
  { id: '3', name: 'SQL review', tags: ['engineering'], template: 'Review this {{dialect}} query for correctness and performance. Suggest indexes if needed.' },
  { id: '4', name: 'Contract red-flag scan', tags: ['legal'], template: 'List unusual clauses in the attached {{contract_type}} agreement, flagging auto-renewal, liability caps and termination terms.' },
];

const demo: DemoModule = {
  meta: {
    title: 'Prompt library',
    slug: 'prompt-library',
    category: 'AI & Agent',
    description: 'Saved prompts with search, {{variable}} inputs and a live-filled preview before use.',
  },
  demos: [
    {
      name: 'Saved prompts',
      code: `<PromptLibrary prompts={prompts} onUse={(prompt, filled) => insert(filled)} />`,
      Component: () => (
        <div style={{ maxWidth: 560, width: '100%' }}>
          <PromptLibrary prompts={prompts} />
        </div>
      ),
    },
  ],
};

export default demo;
