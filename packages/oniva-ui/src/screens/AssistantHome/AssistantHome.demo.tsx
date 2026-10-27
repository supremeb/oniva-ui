import type { DemoModule } from '../../internal/demo';
import { ScreenFrame } from '../../internal/s1-frame';
import { AssistantHome } from './AssistantHome';

const demo: DemoModule = {
  meta: {
    title: 'Assistant home',
    slug: 'assistant-home',
    category: 'Screens',
    description:
      'AI assistant start page inside the app shell: greeting, prompt box with model picker, connected apps and suggestions that fill the prompt.',
  },
  demos: [
    {
      name: 'Inset',
      code: `<AssistantHome
  workspace="Northwind Labs"
  user={{ name: 'Alex Morgan' }}
  onSubmit={(prompt) => startChat(prompt)}
  onNavigate={(label) => router.push(routes[label])}
/>`,
      Component: () => (
        <ScreenFrame>
          <AssistantHome headingLevel={2} />
        </ScreenFrame>
      ),
    },
    {
      name: 'Flat',
      code: `<AssistantHome layout="flat" greeting="Good morning, Alex. What are we building?" />`,
      Component: () => (
        <ScreenFrame>
          <AssistantHome layout="flat" headingLevel={2} greeting="Good morning, Alex. What are we building?" />
        </ScreenFrame>
      ),
    },
  ],
};
export default demo;
