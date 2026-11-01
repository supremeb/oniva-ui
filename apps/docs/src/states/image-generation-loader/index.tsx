import { ImageGenerationLoader } from 'oniva-ui';
import type { StateModule } from '../types';

const prompt = 'Isometric dashboard for Northwind Labs, soft gradients, pastel palette';
const longPrompt =
  'A wide editorial illustration of a Northwind Labs data center at dusk, rows of glowing server racks reflected in a rain-soaked floor, volumetric light, shallow depth of field, muted teal and amber palette, highly detailed, 35mm film grain, no text, no logos';
const unbrokenPrompt =
  'https://assets.northwind.example/renders/2026/q3/brand-hero/isometric-dashboard-softgradient-pastel-variant-0042-final-final-v7.png?seed=918273645&steps=48';

const mod: StateModule = {
  slug: 'image-generation-loader',
  title: 'Image generation loader',
  width: 420,
  groups: [
    {
      label: 'Aspect ratio',
      states: [
        { id: 'square', label: 'square, no prompt', render: () => <ImageGenerationLoader /> },
        { id: 'wide', label: 'wide 16 / 9', render: () => <ImageGenerationLoader aspectRatio="16 / 9" /> },
        { id: 'portrait', label: 'portrait 3 / 4', render: () => <ImageGenerationLoader aspectRatio="3 / 4" /> },
        { id: 'banner', label: 'banner 3 / 1', render: () => <ImageGenerationLoader aspectRatio="3 / 1" prompt="Wide banner" /> },
      ],
    },
    {
      label: 'Prompt',
      states: [
        { id: 'prompt', label: 'with prompt', render: () => <ImageGenerationLoader prompt={prompt} /> },
        { id: 'long-prompt', label: 'long prompt', render: () => <ImageGenerationLoader prompt={longPrompt} /> },
        {
          id: 'long-prompt-wide',
          label: 'long prompt, wide',
          render: () => <ImageGenerationLoader aspectRatio="16 / 9" prompt={longPrompt} />,
        },
        { id: 'unbroken-prompt', label: 'unbroken URL prompt', render: () => <ImageGenerationLoader prompt={unbrokenPrompt} /> },
      ],
    },
    {
      label: 'Size',
      states: [
        {
          id: 'narrow',
          label: 'narrow (160px) with prompt',
          render: () => (
            <div style={{ width: 160 }}>
              <ImageGenerationLoader prompt={prompt} />
            </div>
          ),
        },
        {
          id: 'narrow-wide',
          label: 'narrow wide 16 / 9 with prompt',
          render: () => (
            <div style={{ width: 200 }}>
              <ImageGenerationLoader aspectRatio="16 / 9" prompt={prompt} />
            </div>
          ),
        },
      ],
    },
  ],
  missing: ['done / error / cancelled (the loader only has the generating state)', 'progress percentage or step count'],
};

export default mod;
