import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { AudioWaveform } from './AudioWaveform';

function Toggle() {
  const [on, setOn] = useState(true);
  return (
    <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
      <Button variant="secondary" size="sm" onPress={() => setOn((v) => !v)}>
        {on ? 'Pause' : 'Resume'}
      </Button>
      <AudioWaveform active={on} bars={32} />
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Audio waveform',
    slug: 'audio-waveform',
    category: 'AI & Agent',
    description:
      'Live level bars driven by an AnalyserNode, or a simulated voice envelope. Bars animate with scaleY only.',
  },
  demos: [
    {
      name: 'Simulated',
      code: `<AudioWaveform bars={32} active={on} />`,
      Component: Toggle,
    },
    {
      name: 'Idle baseline',
      code: `<AudioWaveform active={false} bars={20} />`,
      Component: () => <AudioWaveform active={false} bars={20} />,
    },
  ],
};

export default demo;
