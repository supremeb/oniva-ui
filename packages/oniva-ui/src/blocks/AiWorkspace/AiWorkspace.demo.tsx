import type { DemoModule } from '../../internal/demo';
import { AiWorkspace } from './AiWorkspace';

const demo: DemoModule = {
  meta: {
    title: 'AI workspace',
    slug: 'ai-workspace',
    category: 'Blocks',
    description: 'A complete assistant app: collapsible sidebar, welcome screen, streaming chat and a projects view, built on the composer. Model-agnostic: bring your own respond().',
  },
  demos: [
    { name: 'Default', code: `<AiWorkspace userName="Lena" />`, Component: () => <AiWorkspace userName="Lena" /> },
    {
      name: 'Custom respond',
      code: `<AiWorkspace height={520} respond={async (q) => \`You asked: \${q}\`} />`,
      Component: () => <AiWorkspace height={520} respond={async (q) => `You asked: ${q}`} />,
    },
  ],
};
export default demo;
