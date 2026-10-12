import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { ImageGenGrid, type ImageGenTile } from './ImageGenGrid';

/** Inline SVG gradients stand in for generated pictures (no network). */
const art = (a: string, b: string, c: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><circle cx="140" cy="60" r="28" fill="${c}" opacity=".85"/><path d="M0 150 Q60 100 110 140 T200 120 V200 H0Z" fill="${b}" opacity=".6"/></svg>`,
  )}`;

const base: Omit<ImageGenTile, 'progress'>[] = [
  { id: '1', src: art('#fdba74', '#7c3aed', '#fde68a'), alt: 'Sunrise over a coastal city' },
  { id: '2', src: art('#93c5fd', '#1e3a8a', '#e0f2fe'), alt: 'Blue hour skyline' },
  { id: '3', src: art('#86efac', '#065f46', '#fef9c3'), alt: 'Misty pine valley' },
  { id: '4', src: art('#f9a8d4', '#831843', '#ffe4e6'), alt: 'Rose dusk over the harbor' },
];

function Live() {
  const [run, setRun] = useState(0);
  const [prog, setProg] = useState([0, 0, 0, 0]);
  useEffect(() => {
    setProg([0, 0, 0, 0]);
    const speeds = [9, 6, 4.5, 3];
    const id = setInterval(() => setProg((p) => p.map((v, i) => Math.min(100, v + speeds[i]!))), 250);
    return () => clearInterval(id);
  }, [run]);
  const tiles = base.map((t, i) => ({ ...t, progress: prog[i] }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360, width: '100%' }}>
      <ImageGenGrid tiles={tiles} prompt="Sunrise over a coastal city, soft film grain" onRegenerate={() => setRun((r) => r + 1)} />
      <Button size="sm" variant="secondary" onPress={() => setRun((r) => r + 1)}>Restart generation</Button>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Image generation grid',
    slug: 'image-gen-grid',
    category: 'AI & Agent',
    description:
      'Four-up image results that resolve from dot noise to a blurred preview to a sharp image, with per-tile progress and regenerate / upscale actions.',
  },
  demos: [
    {
      name: 'Progressive reveal',
      code: `<ImageGenGrid tiles={tiles} prompt="Sunrise over a coastal city" onRegenerate={regen} onUpscale={up} />`,
      Component: Live,
    },
    {
      name: 'Finished',
      code: `<ImageGenGrid tiles={tiles.map((t) => ({ ...t, progress: 100 }))} />`,
      Component: () => (
        <div style={{ maxWidth: 360, width: '100%' }}>
          <ImageGenGrid tiles={base.map((t) => ({ ...t, progress: 100 }))} />
        </div>
      ),
    },
  ],
};

export default demo;
