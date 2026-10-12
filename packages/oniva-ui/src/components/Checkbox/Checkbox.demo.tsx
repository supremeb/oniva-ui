import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Checkbox } from './Checkbox';

const col = { display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 380 } as const;

function SelectAll() {
  const [items, setItems] = useState({ inv: true, pay: false, rec: false });
  const n = Object.values(items).filter(Boolean).length;
  return (
    <div style={col}>
      <Checkbox
        isSelected={n === 3}
        isIndeterminate={n > 0 && n < 3}
        onChange={(v) => setItems({ inv: v, pay: v, rec: v })}
      >
        All notifications
      </Checkbox>
      <div style={{ ...col, paddingLeft: 26 }}>
        <Checkbox isSelected={items.inv} onChange={(v) => setItems({ ...items, inv: v })}>
          Invoice paid
        </Checkbox>
        <Checkbox isSelected={items.pay} onChange={(v) => setItems({ ...items, pay: v })}>
          Payout sent
        </Checkbox>
        <Checkbox isSelected={items.rec} onChange={(v) => setItems({ ...items, rec: v })}>
          Reconciliation ready
        </Checkbox>
      </div>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Checkbox',
    slug: 'checkbox',
    category: 'Forms',
    description: 'Checkbox with accent gradient checked state, indeterminate and description support.',
  },
  demos: [
    {
      name: 'With description',
      code: `<Checkbox defaultSelected description="Get notified when an invoice is paid.">Payment alerts</Checkbox>
<Checkbox description="Weekly digest every Monday, 9:00 AM.">Weekly summary</Checkbox>`,
      Component: () => (
        <div style={col}>
          <Checkbox defaultSelected description="Get notified when an invoice is paid.">
            Payment alerts
          </Checkbox>
          <Checkbox description="Weekly digest every Monday, 9:00 AM.">Weekly summary</Checkbox>
        </div>
      ),
    },
    {
      name: 'Indeterminate parent',
      code: `// parent isIndeterminate when some children are selected`,
      Component: SelectAll,
    },
    {
      name: 'States',
      code: `<Checkbox isDisabled>Disabled</Checkbox>
<Checkbox isDisabled defaultSelected>Disabled checked</Checkbox>
<Checkbox isInvalid>I accept the terms</Checkbox>`,
      Component: () => (
        <div style={col}>
          <Checkbox isDisabled>Disabled</Checkbox>
          <Checkbox isDisabled defaultSelected>
            Disabled checked
          </Checkbox>
          <Checkbox isInvalid>I accept the terms</Checkbox>
        </div>
      ),
    },
  ],
};

export default demo;
