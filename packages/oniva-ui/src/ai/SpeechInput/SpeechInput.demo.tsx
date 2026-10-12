import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { SpeechInput } from './SpeechInput';

function Clips() {
  const [last, setLast] = useState<string>('No clips yet');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SpeechInput demo onRecorded={(_, s) => setLast(`Captured ${s}s voice note`)} />
      <span style={{ fontSize: 13, opacity: 0.7 }} aria-live="polite">
        {last}
      </span>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Speech input',
    slug: 'speech-input',
    category: 'AI & Agent',
    description:
      'Mic button with a pulse ring, elapsed time and live waveform. Uses MediaRecorder when available, otherwise simulates.',
  },
  demos: [
    {
      name: 'Demo mode',
      code: `<SpeechInput demo onRecorded={(blob, seconds) => save(blob, seconds)} />`,
      Component: Clips,
    },
    {
      name: 'Live microphone',
      code: `<SpeechInput idleLabel="Dictate your reply" onError={console.warn} />`,
      Component: () => <SpeechInput idleLabel="Dictate your reply" />,
    },
  ],
};

export default demo;
