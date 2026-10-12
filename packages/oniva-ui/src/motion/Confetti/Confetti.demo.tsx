import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import type { DemoModule } from '../../internal/demo';
import { Confetti } from './Confetti';

function ConfettiDemo() {
  const [n, setN] = useState(0);
  return (
    <div style={{ position: 'relative', display: 'grid', placeItems: 'center', height: 200, border: '1px solid var(--oniva-color-border)', borderRadius: 16, overflow: 'hidden' }}>
      <Confetti trigger={n} />
      <Button onPress={() => setN((v) => v + 1)}>Celebrate</Button>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: "Confetti",
    slug: "confetti",
    category: 'Motion',
    description: "Canvas burst on trigger. rAF runs only while pieces are alive; nothing under reduced motion.",
  },
  demos: [
    {
      name: "Burst",
      code: "function ConfettiDemo() {\n  const [n, setN] = useState(0);\n  return (\n    <div style={{ position: 'relative', display: 'grid', placeItems: 'center', height: 200, border: '1px solid var(--oniva-color-border)', borderRadius: 16, overflow: 'hidden' }}>\n      <Confetti trigger={n} />\n      <Button onPress={() => setN((v) => v + 1)}>Celebrate</Button>\n    </div>\n  );\n}\n\n<ConfettiDemo />",
      Component: () => (
        <ConfettiDemo />
      ),
    },
  ],
};
export default demo;
