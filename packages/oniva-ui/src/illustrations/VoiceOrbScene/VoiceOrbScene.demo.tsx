import type { DemoModule } from '../../internal/demo';
import { VoiceOrbScene } from './VoiceOrbScene';

const demo: DemoModule = {
  meta: {
    title: "Voice orb scene",
    slug: "voice-orb-scene",
    category: 'Illustrations',
    description: "A voice assistant scene: the orb melts through idle, listening, thinking and speaking while a caption follows along. Reuses the Voice orb component and adds a pause control.",
  },
  demos: [
    {
      name: "Automatic",
      code: `<VoiceOrbScene />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <VoiceOrbScene />
        </div>
      ),
    },
    {
      name: "Controlled state",
      code: `<VoiceOrbScene state="thinking" />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <VoiceOrbScene state="thinking" />
        </div>
      ),
    },
  ],
};

export default demo;
