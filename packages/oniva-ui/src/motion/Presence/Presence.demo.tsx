import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { Presence } from './Presence';

function Box({ preset }: { preset: 'fade' | 'scale' | 'slide' | 'blur' }) {
  const [on, setOn] = useState(true);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, minHeight: 64 }}>
      <Button onPress={() => setOn((v) => !v)}>{on ? 'Hide' : 'Show'} ({preset})</Button>
      <Presence isPresent={on} preset={preset}>
        <div style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--oniva-color-border)' }}>
          Interruptible: toggle mid-animation.
        </div>
      </Presence>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Presence',
    slug: 'presence',
    category: 'Motion',
    description:
      'Keeps an element mounted through its exit animation. Presets: fade, scale (0.96), slide (8px), blur (2px). Enter 200ms ease-out, exit 100ms.',
  },
  demos: [
    {
      name: 'Presets',
      code: `<Presence isPresent={open} preset="scale">…</Presence>`,
      Component: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Box preset="fade" />
          <Box preset="scale" />
          <Box preset="slide" />
          <Box preset="blur" />
        </div>
      ),
    },
  ],
};
export default demo;
