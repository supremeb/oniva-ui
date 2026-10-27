import type { DemoModule } from '../../internal/demo';
import { WritingAssistant } from './WritingAssistant';

const demo: DemoModule = {
  meta: {
    title: 'Writing assistant',
    slug: 'writing-assistant',
    category: 'AI & Agent',
    description: 'A small AI chat card with a drifting glow, suggestion chips, streamed replies and live voice dictation.',
  },
  demos: [
    {
      name: 'With suggestions',
      code: `<WritingAssistant
  name="Quill"
  suggestions={['Polish my email', 'Make it shorter', 'Fix the tone', 'Draft a reply']}
  respond={async (message) => (await fetch('/api/write', { method: 'POST', body: message })).text()}
/>`,
      Component: () => (
        <WritingAssistant
          name="Quill"
          suggestions={['Polish my email', 'Make it shorter', 'Fix the tone', 'Draft a reply']}
          respond={(m) => `Done. Here is a tighter version of “${m}”:\n\nThanks for your patience. The invoice for $4,820 will be paid by Oct 30.`}
        />
      ),
    },
    {
      name: 'Simulated dictation',
      code: `<WritingAssistant speech="simulate" dictation="Remind the team that the review moves to Thursday at 3 pm." />`,
      Component: () => <WritingAssistant speech="simulate" dictation="Remind the team that the review moves to Thursday at 3 pm." />,
    },
  ],
};

export default demo;
