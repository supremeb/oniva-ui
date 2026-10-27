import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { TextReveal } from './TextReveal';

const TEXT = 'Motion should explain what changed, not decorate it. Each word eases in with a small blur so streamed answers feel alive without stealing focus.';

const demo: DemoModule = {
  meta: {
    title: 'Text reveal',
    slug: 'text-reveal',
    category: 'Motion',
    description: 'Per-word blur-in for streamed text: 350ms ease-out, 60ms stagger, append-safe (only new words animate).',
  },
  demos: [
    {
      name: 'Streaming',
      code: `<TextReveal text={streamedText} />`,
      Component: () => {
        const [n, setN] = useState(0);
        const [run, setRun] = useState(1);
        const words = TEXT.split(' ');
        useEffect(() => {
          setN(0);
          const id = setInterval(() => setN((x) => (x >= words.length ? x : x + 1)), 140);
          return () => clearInterval(id);
        }, [run, words.length]);
        return (
          <div style={{ maxWidth: 440 }}>
            <Button onPress={() => setRun((r) => r + 1)}>Restart stream</Button>
            <p style={{ minHeight: 96 }}>
              <TextReveal key={run} text={words.slice(0, n).join(' ')} />
            </p>
          </div>
        );
      },
    },
    {
      name: 'Letters on scroll',
      code: `<TextReveal as="h2" by="char" onView rise={0.4} durationMs={700} staggerMs={28} text="Words that arrive one at a time." />`,
      Component: () => (
        <TextReveal as="h2" by="char" onView rise={0.4} durationMs={700} staggerMs={28} maxDelayMs={1400} text="Letters rise out of a soft blur." />
      ),
    },
    {
      name: 'Words on scroll',
      code: `<TextReveal as="p" onView once={false} rise={0.35} durationMs={700} staggerMs={40} text="..." />`,
      Component: () => (
        <TextReveal
          as="p"
          onView
          once={false}
          rise={0.35}
          durationMs={700}
          staggerMs={40}
          text="Release notes read in order: each word lifts out of a blur once the paragraph is a third of the way into view."
        />
      ),
    },
  ],
};
export default demo;
