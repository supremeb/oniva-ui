import type { DemoModule } from '../../internal/demo';
import { FeedbackBar } from './FeedbackBar';

const demo: DemoModule = {
  meta: {
    title: 'Feedback bar',
    slug: 'feedback-bar',
    category: 'AI & Agent',
    description: 'Inline response rating. A thumbs-down follows up with a reason.',
  },
  demos: [
    {
      name: 'Default',
      code: `<FeedbackBar onSubmit={(v) => console.log(v)} />`,
      Component: () => <FeedbackBar />,
    },
  ],
};

export default demo;
