import type { DemoModule } from '../../internal/demo';
import { ImageGenerationLoader } from './ImageGenerationLoader';

const demo: DemoModule = {
  meta: {
    title: 'Image Generation Loader',
    slug: 'image-generation-loader',
    category: 'AI & Agent',
    description: 'Placeholder for images being generated.',
  },
  demos: [
    {
      name: 'Square and wide',
      code: `<ImageGenerationLoader prompt="Isometric dashboard, soft gradients" />
<ImageGenerationLoader aspectRatio="16 / 9" />`,
      Component: () => (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ width: 260 }}>
            <ImageGenerationLoader prompt="Isometric dashboard, soft gradients" />
          </div>
          <div style={{ width: 360 }}>
            <ImageGenerationLoader aspectRatio="16 / 9" />
          </div>
        </div>
      ),
    },
  ],
};

export default demo;
