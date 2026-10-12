import type { DemoModule } from '../../internal/demo';
import { TextScramble } from './TextScramble';

const demo: DemoModule = {
  meta: {
    title: "Text scramble",
    slug: "text-scramble",
    category: 'Motion',
    description: "Random glyph cycle that settles left to right. Screen readers get the final text.",
  },
  demos: [
    {
      name: "On scroll in",
      code: "<TextScramble text=\"DEPLOYING TO PRODUCTION\" />",
      Component: () => (
        <TextScramble text="DEPLOYING TO PRODUCTION" />
      ),
    },
    {
      name: "On hover",
      code: "<TextScramble text=\"Hover to decode\" trigger=\"hover\" />",
      Component: () => (
        <TextScramble text="Hover to decode" trigger="hover" />
      ),
    },
  ],
};
export default demo;
