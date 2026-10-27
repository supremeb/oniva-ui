import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { AnimatedNumber } from './AnimatedNumber';

const demo: DemoModule = {
  meta: {
    title: 'Animated number',
    slug: 'animated-number',
    category: 'Motion',
    description:
      'Per-digit rolling counter. Formats with Intl.NumberFormat (currency, percent, compact), tabular numerals, transform-only, reduced-motion aware.',
  },
  demos: [
    {
      name: 'Currency',
      code: `<AnimatedNumber value={value} format={{ style: 'currency', currency: 'USD' }} />`,
      Component: () => {
        const [v, setV] = useState(12480.5);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 40, fontWeight: 600 }}>
              <AnimatedNumber value={v} format={{ style: 'currency', currency: 'USD' }} />
            </span>
            <Button onPress={() => setV(Math.round(Math.random() * 2_000_000) / 100)}>Randomize</Button>
          </div>
        );
      },
    },
    {
      name: 'Percent & counter',
      code: `<AnimatedNumber value={n} />
<AnimatedNumber value={0.734} format={{ style: 'percent' }} />`,
      Component: () => {
        const [n, setN] = useState(41);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28 }}>
            <AnimatedNumber value={n} />
            <AnimatedNumber value={n / 100} format={{ style: 'percent' }} />
            <Button onPress={() => setN((x) => x + 1)}>+1</Button>
            <Button onPress={() => setN((x) => x + 137)}>+137</Button>
          </div>
        );
      },
    },
    {
      name: 'Odometer count-in',
      code: `<AnimatedNumber value={segment} countIn duration={900} digitStagger={60}
  format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }} />`,
      Component: () => {
        const [v, setV] = useState(184_920);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 44, fontWeight: 600 }}>
              <AnimatedNumber
                value={v}
                countIn
                duration={900}
                digitStagger={60}
                format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
              />
            </span>
            <Button onPress={() => setV(Math.round(Math.random() * 900_000))}>Roll</Button>
          </div>
        );
      },
    },
  ],
};
export default demo;
