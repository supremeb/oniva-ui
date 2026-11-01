import { AudioWaveform } from 'oniva-ui';
import type { StateModule } from '../types';

/** Minimal analyser stand-in with a fixed spectrum, passed through the real `analyser` prop. */
function fakeAnalyser(level: (i: number, n: number) => number): AnalyserNode {
  const n = 128;
  return {
    frequencyBinCount: n,
    getByteFrequencyData(out: Uint8Array) {
      for (let i = 0; i < n; i++) out[i] = Math.round(255 * level(i, n));
    },
  } as unknown as AnalyserNode;
}

const speech = fakeAnalyser((i, n) => Math.max(0.02, 0.9 * Math.exp(-i / (n / 6)) * (0.6 + 0.4 * Math.abs(Math.sin(i * 1.3)))));
const silent = fakeAnalyser(() => 0);
const clipped = fakeAnalyser(() => 1);

const mod: StateModule = {
  slug: 'audio-waveform',
  title: 'Audio waveform',
  width: 420,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'simulated', label: 'simulated, active', render: () => <AudioWaveform /> },
        { id: 'idle', label: 'idle baseline', render: () => <AudioWaveform active={false} /> },
        { id: 'live-speech', label: 'live analyser, speech', render: () => <AudioWaveform analyser={speech} bars={32} /> },
        { id: 'live-silent', label: 'live analyser, silent', render: () => <AudioWaveform analyser={silent} bars={32} /> },
        { id: 'live-clipped', label: 'live analyser, clipped', render: () => <AudioWaveform analyser={clipped} bars={32} /> },
        { id: 'analyser-null', label: 'analyser null', render: () => <AudioWaveform analyser={null} bars={32} /> },
        { id: 'idle-with-analyser', label: 'idle despite analyser', render: () => <AudioWaveform analyser={speech} active={false} bars={32} /> },
      ],
    },
    {
      label: 'Bars',
      states: [
        { id: 'one-bar', label: '1 bar', render: () => <AudioWaveform bars={1} /> },
        { id: 'few-bars', label: '8 bars', render: () => <AudioWaveform bars={8} /> },
        { id: 'default-bars', label: '24 bars (default)', render: () => <AudioWaveform /> },
        { id: 'many-bars', label: '64 bars, overflows', render: () => <AudioWaveform bars={64} /> },
        { id: 'zero-bars', label: '0 bars', render: () => <AudioWaveform bars={0} /> },
      ],
    },
    {
      label: 'Composition',
      states: [
        {
          id: 'in-recorder',
          label: 'in a recorder row',
          render: () => (
            <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>0:42</span>
              <AudioWaveform bars={20} />
            </div>
          ),
        },
      ],
    },
  ],
  missing: [
    'Listening / transcribing / error status: the component has no status prop, only active and idle',
    'Size or tone variants: the component has none',
    'Permission denied / no microphone: handled by the caller, not the component',
    'Accessible label or live-level announcement: the component is aria-hidden by design',
  ],
};

export default mod;
