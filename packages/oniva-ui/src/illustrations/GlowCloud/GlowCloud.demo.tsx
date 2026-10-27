import type { DemoModule } from '../../internal/demo';
import { GlowCloud } from './GlowCloud';

const demo: DemoModule = {
  meta: {
    title: "Glow cloud illustration",
    slug: "glow-cloud",
    category: 'Illustrations',
    description: "A glowing cloud with white eyes in blue or red-orange. It floats, looks around, blinks, follows the pointer and bounces with a wink when clicked.",
  },
  demos: [
    {
      name: "Blue sky",
      code: `<GlowCloud />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <GlowCloud />
        </div>
      ),
    },
    {
      name: "Orange sky",
      code: `<GlowCloud color="orange" />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <GlowCloud color="orange" />
        </div>
      ),
    },
    {
      name: "No background",
      code: `<GlowCloud background={false} />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <GlowCloud background={false} />
        </div>
      ),
    },
  ],
};

export default demo;
