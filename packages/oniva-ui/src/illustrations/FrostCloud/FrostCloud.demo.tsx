import type { DemoModule } from '../../internal/demo';
import { FrostCloud } from './FrostCloud';

const demo: DemoModule = {
  meta: {
    title: "Frost cloud illustration",
    slug: "frost-cloud",
    category: 'Illustrations',
    description: "A frosted white cloud with eyes cut out of it, on a red-orange or blue sky. It floats, looks around, blinks, follows the pointer and bounces with a wink when clicked.",
  },
  demos: [
    {
      name: "Orange sky",
      code: `<FrostCloud />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <FrostCloud />
        </div>
      ),
    },
    {
      name: "Blue sky",
      code: `<FrostCloud color="blue" />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <FrostCloud color="blue" />
        </div>
      ),
    },
    {
      name: "No background",
      code: `<FrostCloud color="blue" background={false} />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <FrostCloud color="blue" background={false} />
        </div>
      ),
    },
  ],
};

export default demo;
