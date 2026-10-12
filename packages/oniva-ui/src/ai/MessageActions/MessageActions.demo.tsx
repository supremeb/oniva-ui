import type { DemoModule } from '../../internal/demo';
import { MessageActions } from './MessageActions';

const text = 'NRR rose to 112% in Q3, driven by Team plan upgrades.';

const demo: DemoModule = {
  meta: {
    title: 'Message actions',
    slug: 'message-actions',
    category: 'AI & Agent',
    description: 'Copy, regenerate, feedback, share and branch actions for an assistant message.',
  },
  demos: [
    {
      name: 'Full set',
      code: `<MessageActions text={answer} onRegenerate={…} onShare={…} onBranch={…} />`,
      Component: () => <MessageActions text={text} onRegenerate={() => {}} onShare={() => {}} onBranch={() => {}} />,
    },
    {
      name: 'Copy and feedback only',
      code: `<MessageActions text={answer} />`,
      Component: () => <MessageActions text={text} />,
    },
  ],
};

export default demo;
