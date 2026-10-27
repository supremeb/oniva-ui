import type { DemoModule } from '../../internal/demo';
import { ReactionBar } from './ReactionBar';

const demo: DemoModule = {
  meta: {
    title: 'Reaction bar',
    slug: 'reaction-bar',
    category: 'Actions',
    description: 'Like, comment, repost and share as a row of quiet chips. Icons spring and fill, counts roll digit by digit.',
  },
  demos: [
    {
      name: 'Default',
      code: `<ReactionBar
  reactions={{
    like: { count: 128, active: true },
    comment: { count: 24 },
    repost: { count: 9 },
    share: { count: 0 },
  }}
  onReact={(key, state) => console.log(key, state)}
/>`,
      Component: () => (
        <ReactionBar
          reactions={{
            like: { count: 128, active: true },
            comment: { count: 24 },
            repost: { count: 9 },
            share: { count: 0 },
          }}
        />
      ),
    },
    {
      name: 'Subset of actions',
      code: `<ReactionBar actions={['like', 'share']} reactions={{ like: { count: 0 } }} />`,
      Component: () => <ReactionBar actions={['like', 'share']} reactions={{ like: { count: 0 } }} />,
    },
  ],
};

export default demo;
