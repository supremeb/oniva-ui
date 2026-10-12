import type { DemoModule } from '../../internal/demo';
import { Radio, RadioGroup } from './RadioGroup';

const demo: DemoModule = {
  meta: {
    title: 'Radio group',
    slug: 'radio-group',
    category: 'Forms',
    description: 'Single-choice group with plain and card-style radios.',
  },
  demos: [
    {
      name: 'Default',
      code: `<RadioGroup label="Payout schedule" defaultValue="weekly">
  <Radio value="daily" description="Funds arrive next business day.">Daily</Radio>
  <Radio value="weekly" description="Every Friday.">Weekly</Radio>
  <Radio value="monthly">Monthly</Radio>
</RadioGroup>`,
      Component: () => (
        <RadioGroup label="Payout schedule" defaultValue="weekly">
          <Radio value="daily" description="Funds arrive next business day.">
            Daily
          </Radio>
          <Radio value="weekly" description="Every Friday.">
            Weekly
          </Radio>
          <Radio value="monthly">Monthly</Radio>
        </RadioGroup>
      ),
    },
    {
      name: 'Card style',
      code: `<RadioGroup label="Plan" cards defaultValue="growth">
  <Radio variant="card" value="starter" description="Up to 3 seats" trailing="$0">Starter</Radio>
  ...
</RadioGroup>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 400 }}>
          <RadioGroup label="Plan" cards defaultValue="growth">
            <Radio variant="card" value="starter" description="Up to 3 seats" trailing="$0">
              Starter
            </Radio>
            <Radio
              variant="card"
              value="growth"
              description="Up to 25 seats, API access"
              trailing="$49/mo"
            >
              Growth
            </Radio>
            <Radio
              variant="card"
              value="scale"
              description="Unlimited seats, SSO, audit logs"
              trailing="$199/mo"
            >
              Scale
            </Radio>
          </RadioGroup>
        </div>
      ),
    },
    {
      name: 'Horizontal',
      code: `<RadioGroup label="Currency" orientation="horizontal" defaultValue="usd">...</RadioGroup>`,
      Component: () => (
        <RadioGroup label="Currency" orientation="horizontal" defaultValue="usd">
          <Radio value="usd">USD</Radio>
          <Radio value="eur">EUR</Radio>
          <Radio value="inr">INR</Radio>
        </RadioGroup>
      ),
    },
  ],
};

export default demo;
