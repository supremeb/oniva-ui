import { ImageGenGrid } from 'oniva-ui';
import type { ImageGenTile } from 'oniva-ui';
import type { StateModule } from '../types';

/** Inline SVG scenes stand in for generated pictures (no network). */
const art = (a: string, b: string, c: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><circle cx="140" cy="60" r="28" fill="${c}" opacity=".85"/><path d="M0 150 Q60 100 110 140 T200 120 V200 H0Z" fill="${b}" opacity=".6"/></svg>`,
  )}`;

const base: ImageGenTile[] = [
  { id: 'n1', src: art('#fdba74', '#7c3aed', '#fde68a'), alt: 'Sunrise over a coastal city' },
  { id: 'n2', src: art('#93c5fd', '#1e3a8a', '#e0f2fe'), alt: 'Blue hour skyline' },
  { id: 'n3', src: art('#86efac', '#065f46', '#fef9c3'), alt: 'Misty pine valley' },
  { id: 'n4', src: art('#f9a8d4', '#831843', '#ffe4e6'), alt: 'Rose dusk over the harbor' },
  { id: 'n5', src: art('#fcd34d', '#9a3412', '#fff7ed'), alt: 'Amber desert road' },
];

const withProgress = (progress: (number | undefined)[], count = 4): ImageGenTile[] =>
  base.slice(0, count).map((t, i) => ({ ...t, progress: progress[i] }));

const prompt = 'Sunrise over a coastal city, soft film grain, wide lens';
const longPrompt =
  'Aerial view of the Northwind Labs research campus at sunrise, glass atria reflecting a violet sky, cyclists on the boardwalk, soft film grain, wide lens, muted palette, volumetric haze over the harbor, 35mm';
const unbrokenPrompt = 'northwind-labs_campus_sunrise_coastal-city_filmgrain_widelens_muted-palette_volumetric-haze_harbor_35mm_v4';
const noop = () => {};

const mod: StateModule = {
  slug: 'image-gen-grid',
  title: 'Image generation grid',
  width: 420,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'no tiles', render: () => <ImageGenGrid tiles={[]} prompt={prompt} /> },
        { id: 'one-tile', label: 'one tile, done', render: () => <ImageGenGrid tiles={withProgress([100], 1)} prompt={prompt} /> },
        { id: 'three-tiles', label: 'three tiles, done', render: () => <ImageGenGrid tiles={withProgress([100, 100, 100], 3)} prompt={prompt} /> },
        { id: 'five-tiles', label: 'five tiles (capped at four)', render: () => <ImageGenGrid tiles={withProgress([100, 100, 100, 100, 100], 5)} prompt={prompt} /> },
      ],
    },
    {
      label: 'Run',
      states: [
        { id: 'queued', label: 'all queued (0%)', render: () => <ImageGenGrid tiles={withProgress([0, 0, 0, 0])} prompt={prompt} /> },
        { id: 'noise-stage', label: 'noise stage (under 35%)', render: () => <ImageGenGrid tiles={withProgress([8, 18, 27, 34])} prompt={prompt} /> },
        { id: 'blur-stage', label: 'blurred preview (35-99%)', render: () => <ImageGenGrid tiles={withProgress([35, 52, 74, 99])} prompt={prompt} /> },
        { id: 'mixed', label: 'done, blurred, noise, queued', render: () => <ImageGenGrid tiles={withProgress([100, 64, 21, 0])} prompt={prompt} onRegenerate={noop} onUpscale={noop} /> },
        { id: 'fractional', label: 'fractional progress', render: () => <ImageGenGrid tiles={withProgress([12.4, 47.6, 88.5, 99.5])} prompt={prompt} /> },
        { id: 'out-of-range', label: 'progress clamped (-10, 140)', render: () => <ImageGenGrid tiles={withProgress([-10, 140, undefined, 50])} prompt={prompt} /> },
        { id: 'done', label: 'all done', render: () => <ImageGenGrid tiles={withProgress([100, 100, 100, 100])} prompt={prompt} onRegenerate={noop} onUpscale={noop} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'no-prompt', label: 'no prompt caption', render: () => <ImageGenGrid tiles={withProgress([100, 100, 100, 100])} /> },
        { id: 'long-prompt', label: 'long prompt', render: () => <ImageGenGrid tiles={withProgress([100, 100, 100, 100])} prompt={longPrompt} /> },
        { id: 'unbroken-prompt', label: 'long unbroken prompt', render: () => <ImageGenGrid tiles={withProgress([100, 100, 100, 100])} prompt={unbrokenPrompt} /> },
        {
          id: 'long-alt',
          label: 'long alt text (names)',
          render: () => (
            <ImageGenGrid
              tiles={[
                { ...base[0]!, alt: 'Sunrise over the Northwind Labs coastal research campus with glass atria and cyclists on the boardwalk', progress: 100 },
                { ...base[1]!, alt: 'Blue hour skyline', progress: 45 },
              ]}
              prompt={prompt}
            />
          ),
        },
      ],
    },
    {
      label: 'Size',
      states: [
        { id: 'narrow', label: 'narrow (240px)', render: () => (
          <div style={{ width: 240 }}>
            <ImageGenGrid tiles={withProgress([100, 70, 20, 0])} prompt={prompt} />
          </div>
        ) },
      ],
    },
  ],
  missing: [
    'Failed or cancelled tile (the component has no error/cancelled status; a stalled tile just stays at its progress)',
    'Per-tile loading state for a broken image URL (no onError handling or fallback)',
    'Disabled / read-only actions (regenerate and upscale are always rendered on finished tiles)',
    'Selected or focused tile (tiles are not selectable)',
  ],
};

export default mod;
