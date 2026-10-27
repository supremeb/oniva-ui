import type { DemoModule } from '../../internal/demo';
import { GlowKeyboard } from './GlowKeyboard';

const demo: DemoModule = {
  meta: {
    title: "Glow keyboard",
    slug: "glow-keyboard",
    category: 'Illustrations',
    description: "An AI chat input that types itself over a glass keyboard. Every key press sinks the key, sends a wave up the gradient floor and flashes the input glow. Typing yourself works too.",
  },
  demos: [
    {
      name: "Default",
      code: `<GlowKeyboard />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <GlowKeyboard />
        </div>
      ),
    },
    {
      name: "Custom prompts",
      code: `<GlowKeyboard
  placeholder="Ask about your account…"
  prompts={['Summarise last month\\'s invoices', 'Which plan am I on?']}
  onSubmit={(text) => console.log(text)}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <GlowKeyboard
            placeholder="Ask about your account…"
            prompts={['Summarise last month\'s invoices', 'Which plan am I on?']}
            onSubmit={(text) => console.log(text)}
          />
        </div>
      ),
    },
  ],
};

export default demo;
