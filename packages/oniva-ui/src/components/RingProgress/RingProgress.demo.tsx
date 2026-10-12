import type { DemoModule } from '../../internal/demo';
import { Text } from '../Text';
import { RingProgress } from './RingProgress';

const row = { display: 'flex', gap: 16, alignItems: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'RingProgress',
    slug: 'ring-progress',
    category: 'Feedback',
    description: 'Circular determinate loader with centre label, like a "4 steps left" setup indicator.',
  },
  demos: [
    {
      name: 'Steps left',
      code: `<RingProgress aria-label="Setup progress" value={3} maxValue={7}>4</RingProgress>
<Text>4 steps left to finish setup</Text>`,
      Component: () => (
        <div style={row}>
          <RingProgress aria-label="Setup progress" value={3} maxValue={7}>
            4
          </RingProgress>
          <div>
            <Text as="div" variant="headline">Finish setting up</Text>
            <Text tone="muted" variant="caption">4 steps left</Text>
          </div>
        </div>
      ),
    },
    {
      name: 'Tones and sizes',
      code: `<RingProgress aria-label="Storage" value={42} size={48} />
<RingProgress aria-label="Budget" value={88} tone="warning" size={48} />
<RingProgress aria-label="Quota" value={100} tone="success" size={48} />`,
      Component: () => (
        <div style={row}>
          <RingProgress aria-label="Storage" value={42} size={48} />
          <RingProgress aria-label="Budget" value={88} tone="warning" size={48} />
          <RingProgress aria-label="Quota" value={100} tone="success" size={48} />
          <RingProgress aria-label="Errors" value={25} tone="danger" size={28} strokeWidth={3} />
        </div>
      ),
    },
  ],
};
export default demo;
