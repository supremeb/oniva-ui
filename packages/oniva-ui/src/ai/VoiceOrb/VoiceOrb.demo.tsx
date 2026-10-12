import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { VoiceOrb, type VoiceOrbState } from './VoiceOrb';

function Playground() {
  const [state, setState] = useState<VoiceOrbState>('listening');
  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <VoiceOrb name="Atlas" state={state} size={112} />
      <div style={{ display: 'flex', gap: 8 }}>
        {(['idle', 'listening', 'thinking', 'speaking'] as const).map((s) => (
          <Button key={s} size="sm" variant={state === s ? 'soft' : 'secondary'} onPress={() => setState(s)}>
            {s}
          </Button>
        ))}
      </div>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Voice orb',
    slug: 'voice-orb',
    category: 'AI & Agent',
    description:
      'Agent persona orb with idle, listening, thinking and speaking states. Pure CSS gradients; static when reduced motion is on.',
  },
  demos: [
    {
      name: 'States',
      code: `<VoiceOrb name="Atlas" state="listening" size={112} />`,
      Component: Playground,
    },
    {
      name: 'All at a glance',
      code: `{states.map((s) => <VoiceOrb key={s} state={s} size={64} />)}`,
      Component: () => (
        <div style={{ display: 'flex', gap: 28 }}>
          {(['idle', 'listening', 'thinking', 'speaking'] as const).map((s) => (
            <VoiceOrb key={s} state={s} size={64} />
          ))}
        </div>
      ),
    },
  ],
};

export default demo;
