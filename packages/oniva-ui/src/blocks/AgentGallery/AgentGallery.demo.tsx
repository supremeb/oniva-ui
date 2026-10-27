import type { DemoModule } from '../../internal/demo';
import { AgentGallery } from './AgentGallery';

const demo: DemoModule = {
  meta: {
    title: 'Agent gallery',
    slug: 'agent-gallery',
    category: 'Blocks',
    description: 'Slim gradient panels around one open agent screen. Pick a panel, use the arrow keys or the buttons; the new screen slides in from its side.',
  },
  demos: [
    { name: 'Default', code: `<AgentGallery />`, Component: () => <AgentGallery /> },
    { name: 'Starts first, shorter', code: `<AgentGallery defaultIndex={0} height={380} title="Our agents" />`, Component: () => <AgentGallery defaultIndex={0} height={380} title="Our agents" /> },
  ],
};
export default demo;
