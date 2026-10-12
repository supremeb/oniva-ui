import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../Button';
import { Stepper } from './Stepper';

const steps = [
  { id: 'account', title: 'Account', description: 'Create your login' },
  { id: 'company', title: 'Company', description: 'Acme Finance, Inc.' },
  { id: 'billing', title: 'Billing', description: 'Add a payment method' },
  { id: 'launch', title: 'Launch' },
];

const demo: DemoModule = {
  meta: {
    title: 'Stepper',
    slug: 'stepper',
    category: 'Navigation',
    description: 'Multi-step progress, horizontal or vertical. Completed steps get the accent gradient; steps can be pressable.',
  },
  demos: [
    {
      name: 'Horizontal, interactive',
      code: `const [step, setStep] = useState(1);
<Stepper steps={steps} currentStep={step} onStepPress={setStep} />
<Button onPress={() => setStep((s) => Math.min(s + 1, steps.length - 1))}>Continue</Button>`,
      Component: function H() {
        const [step, setStep] = useState(1);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Stepper steps={steps} currentStep={step} onStepPress={setStep} />
            <div>
              <Button size="sm" onPress={() => setStep((s) => Math.min(s + 1, steps.length - 1))}>
                Continue
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      name: 'Vertical',
      code: `<Stepper orientation="vertical" steps={steps} currentStep={2} />`,
      Component: () => <Stepper orientation="vertical" steps={steps} currentStep={2} />,
    },
  ],
};
export default demo;
