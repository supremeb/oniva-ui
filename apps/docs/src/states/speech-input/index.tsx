import { SpeechInput } from 'oniva-ui';
import type { StateModule } from '../types';

const longLabel =
  'Select to dictate a reply to the Northwind Labs quarterly planning thread, including action items and owners';

const mod: StateModule = {
  slug: 'speech-input',
  title: 'Speech input',
  width: 420,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'idle', label: 'idle', render: () => <SpeechInput /> },
        { id: 'idle-demo', label: 'idle, demo mode', render: () => <SpeechInput demo /> },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'custom-label',
          label: 'custom idle label',
          render: () => <SpeechInput demo idleLabel="Dictate your reply" />,
        },
        { id: 'long-label', label: 'long idle label', render: () => <SpeechInput demo idleLabel={longLabel} /> },
        { id: 'empty-label', label: 'empty idle label', render: () => <SpeechInput demo idleLabel="" /> },
      ],
    },
  ],
  missing: [
    'recording (no default* prop; reaching it needs a press, and the elapsed timer ticks)',
    'recording with a long idle label (same)',
    'recording past one minute / one hour (time is internal; no prop to seed elapsed seconds)',
    'permission denied / microphone unavailable (falls back to a simulated recording silently; no visible error state)',
    'disabled (no isDisabled prop)',
    'live-microphone waveform (needs a real AnalyserNode)',
  ],
};

export default mod;
