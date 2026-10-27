import type { DemoModule } from '../../internal/demo';
import { AnimatedGradientText } from './AnimatedGradientText';

const demo: DemoModule = {
  meta: {
    title: "Animated gradient text",
    slug: "animated-gradient-text",
    category: 'Motion',
    description: "Headline text with a slow accent gradient flow. Pauses offscreen.",
  },
  demos: [
    {
      name: "Headline",
      code: "<h2 style={{ fontSize: 36, fontWeight: 600, margin: 0 }}>Ship <AnimatedGradientText>faster</AnimatedGradientText> with agents</h2>",
      Component: () => (
        <h2 style={{ fontSize: 36, fontWeight: 600, margin: 0 }}>Ship <AnimatedGradientText>faster</AnimatedGradientText> with agents</h2>
      ),
    },
    {
      name: 'Custom colours with sweep',
      code: `<h2>Interfaces people actually <AnimatedGradientText sweep speed={8} colors={['#c026d3', '#4f46e5', '#f472b6']}>feel.</AnimatedGradientText></h2>`,
      Component: () => (
        <h2 style={{ fontSize: 36, fontWeight: 600, margin: 0 }}>
          Interfaces people actually{' '}
          <AnimatedGradientText sweep speed={8} colors={['#c026d3', '#4f46e5', '#f472b6']}>
            feel.
          </AnimatedGradientText>
        </h2>
      ),
    },
  ],
};
export default demo;
