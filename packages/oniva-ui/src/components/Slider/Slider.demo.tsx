import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Slider } from './Slider';

const col = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: '100%',
  maxWidth: 380,
} as const;

function Range() {
  const [v, setV] = useState([250, 1800]);
  return (
    <div style={col}>
      <Slider
        label="Invoice amount"
        minValue={0}
        maxValue={5000}
        step={50}
        value={v}
        onChange={setV}
        formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
      />
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Slider',
    slug: 'slider',
    category: 'Forms',
    description: 'Single-value and range slider with accent gradient fill and live output.',
  },
  demos: [
    {
      name: 'Single',
      code: `<Slider label="Monthly spend limit" defaultValue={3500} minValue={0} maxValue={10000} step={100}
  formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }} />`,
      Component: () => (
        <div style={col}>
          <Slider
            label="Monthly spend limit"
            defaultValue={3500}
            minValue={0}
            maxValue={10000}
            step={100}
            formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
          />
        </div>
      ),
    },
    {
      name: 'Range',
      code: `const [v, setV] = useState([250, 1800]);
<Slider label="Invoice amount" minValue={0} maxValue={5000} step={50} value={v} onChange={setV} />`,
      Component: Range,
    },
    {
      name: 'Disabled',
      code: `<Slider label="Risk score" defaultValue={42} isDisabled />`,
      Component: () => (
        <div style={col}>
          <Slider label="Risk score" defaultValue={42} isDisabled />
        </div>
      ),
    },
  ],
};

export default demo;
