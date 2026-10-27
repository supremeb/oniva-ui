import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import {
  StepperForm,
  StepperFormChoices,
  StepperFormInput,
  StepperFormReview,
  StepperFormSuccess,
  type StepperFormStep,
} from './StepperForm';

type Values = { name: string; slug: string; email: string; plan: string };

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const steps: StepperFormStep<Values>[] = [
  {
    id: 'workspace',
    title: 'Workspace',
    heading: 'Name your workspace',
    description: "This is where your team's projects live.",
    render: ({ setValues }) => (
      <>
        <StepperFormInput<Values>
          name="name"
          label="Workspace name"
          placeholder="Northwind Studio"
          onValueChange={(name) => setValues({ slug: slugify(name) })}
        />
        <StepperFormInput<Values> name="slug" label="Workspace URL" prefix="oniva.app/" description="Lowercase letters, numbers and dashes" />
      </>
    ),
    validate: (v) => ({
      name: v.name.trim() ? undefined : 'Give your workspace a name',
      slug: v.slug.trim() ? undefined : 'Pick a URL',
    }),
  },
  {
    id: 'team',
    title: 'Team',
    heading: 'Invite your team',
    description: 'Add a teammate now or skip this and do it later.',
    render: () => <StepperFormInput<Values> name="email" label="Teammate email" type="email" placeholder="maya@northwind.studio" isOptional />,
  },
  {
    id: 'plan',
    title: 'Plan',
    heading: 'Choose a plan',
    render: ({ values, setValues }) => (
      <StepperFormChoices
        label="Plan"
        value={values.plan}
        onChange={(plan) => setValues({ plan })}
        options={[
          { value: 'starter', title: 'Starter', aside: '$0', description: 'Up to 3 agents' },
          { value: 'team', title: 'Team', aside: '$29', description: 'Unlimited agents', badge: 'Popular' },
        ]}
      />
    ),
  },
  {
    id: 'review',
    title: 'Review',
    heading: 'Review and create',
    render: ({ values, goTo }) => (
      <StepperFormReview
        onEdit={goTo}
        rows={[
          { label: 'Workspace', value: values.name || 'Not set', step: 'workspace' },
          { label: 'URL', value: `oniva.app/${values.slug}`, step: 'workspace' },
          { label: 'Plan', value: values.plan, step: 'plan' },
        ]}
      />
    ),
  },
];

function Flow() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <StepperForm<Values>
        steps={steps}
        initialValues={{ name: 'Northwind Studio', slug: 'northwind-studio', email: '', plan: 'team' }}
        submitLabel="Create workspace"
        onComplete={() => new Promise((r) => setTimeout(r, 900))}
        renderSuccess={(v, reset) => (
          <StepperFormSuccess title={`${v.name} is ready`} description={`oniva.app/${v.slug}`}>
            <button type="button" onClick={reset}>
              Start over
            </button>
          </StepperFormSuccess>
        )}
      />
    </div>
  );
}

function Controlled() {
  const [step, setStep] = useState(1);
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <StepperForm<Values>
        steps={steps}
        step={step}
        onStepChange={setStep}
        initialValues={{ name: 'Northwind Ops', slug: 'northwind-ops', email: '', plan: 'starter' }}
      />
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Stepper form',
    slug: 'stepper-form',
    category: 'Forms',
    description:
      'Multi-step flow with shared values, per-step validation, sliding steps, a review step and a success state.',
  },
  demos: [
    {
      name: 'Workspace setup',
      code: `<StepperForm<Values>
  steps={steps}
  initialValues={{ name: 'Northwind Studio', slug: 'northwind-studio', email: '', plan: 'team' }}
  submitLabel="Create workspace"
  onComplete={(values) => api.create(values)}
/>`,
      Component: Flow,
    },
    {
      name: 'Controlled step',
      code: `const [step, setStep] = useState(1);
<StepperForm steps={steps} step={step} onStepChange={setStep} initialValues={values} />`,
      Component: Controlled,
    },
  ],
};

export default demo;
