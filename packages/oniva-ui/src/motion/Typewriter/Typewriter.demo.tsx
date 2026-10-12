import type { DemoModule } from '../../internal/demo';
import { Typewriter } from './Typewriter';

const demo: DemoModule = {
  meta: {
    title: "Typewriter",
    slug: "typewriter",
    category: 'Motion',
    description: "Types text in once when scrolled into view with a blinking caret. Full text under reduced motion.",
  },
  demos: [
    {
      name: "Prompt",
      code: "<div style={{ fontSize: 18 }}><Typewriter text=\"Summarize last quarter's churn by plan.\" /></div>",
      Component: () => (
        <div style={{ fontSize: 18 }}><Typewriter text="Summarize last quarter's churn by plan." /></div>
      ),
    },
  ],
};
export default demo;
