import type { DemoModule } from '../../internal/demo';
import { WordRotate } from './WordRotate';

const demo: DemoModule = {
  meta: {
    title: "Word rotate",
    slug: "word-rotate",
    category: 'Motion',
    description: "Vertical word swap with blur. Pauses on hover and offscreen; shows the first word under reduced motion.",
  },
  demos: [
    {
      name: "Headline",
      code: "<div style={{ fontSize: 28, fontWeight: 600 }}>Invoicing for <WordRotate words={['startups', 'agencies', 'studios', 'freelancers']} /></div>",
      Component: () => (
        <div style={{ fontSize: 28, fontWeight: 600 }}>Invoicing for <WordRotate words={['startups', 'agencies', 'studios', 'freelancers']} /></div>
      ),
    },
  ],
};
export default demo;
