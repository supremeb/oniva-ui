import type { DemoModule } from '../../internal/demo';
import { GhostedChat } from './GhostedChat';

const demo: DemoModule = {
  meta: {
    title: "Ghosted chat illustration",
    slug: "ghosted-chat",
    category: 'Illustrations',
    description: "Three unanswered messages marked as read. Hover to fade the statuses and pop in a thumbs-down reply.",
  },
  demos: [
    {
      name: "Default",
      code: `<GhostedChat />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <GhostedChat />
        </div>
      ),
    },
    {
      name: "Custom messages",
      code: `<GhostedChat
  status="Seen"
  messages={['Checking in on the contract', 'Any questions on section 4?', 'Can we lock this in by Friday?']}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <GhostedChat
            status="Seen"
            messages={['Checking in on the contract', 'Any questions on section 4?', 'Can we lock this in by Friday?']}
          />
        </div>
      ),
    },
  ],
};

export default demo;
