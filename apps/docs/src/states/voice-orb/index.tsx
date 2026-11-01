import { VoiceOrb } from 'oniva-ui';
import type { StateModule } from '../types';

const mod: StateModule = {
  slug: 'voice-orb',
  title: 'Voice orb',
  width: 320,
  groups: [
    {
      label: 'State',
      states: [
        { id: 'idle', label: 'idle', render: () => <VoiceOrb name="Atlas 2" state="idle" /> },
        { id: 'listening', label: 'listening', render: () => <VoiceOrb name="Atlas 2" state="listening" /> },
        { id: 'thinking', label: 'thinking', render: () => <VoiceOrb name="Atlas 2" state="thinking" /> },
        { id: 'speaking', label: 'speaking', render: () => <VoiceOrb name="Atlas 2" state="speaking" /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'no-name', label: 'no name (default)', render: () => <VoiceOrb /> },
        { id: 'hide-label', label: 'label hidden', render: () => <VoiceOrb name="Atlas 2" state="listening" hideLabel /> },
        {
          id: 'long-name',
          label: 'long agent name',
          render: () => <VoiceOrb name="Northwind Labs support concierge for enterprise onboarding" state="speaking" />,
        },
      ],
    },
    {
      label: 'Size',
      states: [
        { id: 'size-small', label: 'size 40', render: () => <VoiceOrb name="Nova Pro" state="listening" size={40} /> },
        { id: 'size-large', label: 'size 220', render: () => <VoiceOrb name="Nova Pro" state="thinking" size={220} /> },
      ],
    },
  ],
  missing: ['Muted / error / disconnected states (state only accepts idle, listening, thinking, speaking)', 'Audio level reactivity (no amplitude prop)'],
};
export default mod;
