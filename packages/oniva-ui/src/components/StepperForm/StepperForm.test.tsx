import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  StepperForm,
  StepperFormChoices,
  StepperFormInput,
  StepperFormReview,
  type StepperFormStep,
} from './StepperForm';

type V = { name: string; plan: string };

const steps: StepperFormStep<V>[] = [
  {
    id: 'workspace',
    title: 'Workspace',
    heading: 'Name your workspace',
    render: () => <StepperFormInput<V> name="name" label="Workspace name" />,
    validate: (v) => ({ name: v.name.trim() ? undefined : 'Give your workspace a name' }),
  },
  {
    id: 'plan',
    title: 'Plan',
    render: ({ values, setValues }) => (
      <StepperFormChoices
        label="Plan"
        value={values.plan}
        onChange={(plan) => setValues({ plan })}
        options={[
          { value: 'free', title: 'Starter' },
          { value: 'pro', title: 'Team' },
        ]}
      />
    ),
  },
  {
    id: 'review',
    title: 'Review',
    render: ({ values, goTo }) => (
      <StepperFormReview
        onEdit={goTo}
        rows={[
          { label: 'Workspace', value: values.name, step: 'workspace' },
          { label: 'Plan', value: values.plan },
        ]}
      />
    ),
  },
];

const setup = (props: object = {}) =>
  render(<StepperForm<V> steps={steps} initialValues={{ name: '', plan: 'free' }} submitLabel="Create workspace" {...props} />);

describe('StepperForm', () => {
  it('blocks Continue with an inline error, then advances and completes', async () => {
    const onComplete = vi.fn();
    setup({ onComplete });
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect((await screen.findAllByText('Give your workspace a name')).length).toBeGreaterThan(0);
    expect(screen.getByRole('textbox', { name: 'Workspace name' })).toHaveAttribute('aria-invalid', 'true');
    await userEvent.type(screen.getByRole('textbox', { name: 'Workspace name' }), 'Acme Ops');
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await userEvent.click(await screen.findByRole('radio', { name: /Team/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByText('Acme Ops')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Create workspace' }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith({ name: 'Acme Ops', plan: 'pro' }));
    expect(await screen.findByText('All set')).toBeInTheDocument();
  });

  it('Back keeps values, Edit jumps to a step, step is announced and heading focused', async () => {
    setup({ initialValues: { name: 'Kept', plan: 'free' } });
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('textbox', { name: 'Workspace name' })).toHaveValue('Kept');
    expect(screen.getByRole('status')).toHaveTextContent('Step 1 of 3: Workspace');
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await userEvent.click(screen.getByRole('button', { name: 'Edit Workspace' }));
    expect(screen.getByRole('heading', { name: 'Name your workspace' })).toHaveFocus();
  });

  it('shows the thrown error from onComplete and forwards ref/className', async () => {
    const ref = { current: null as HTMLDivElement | null };
    setup({
      ref,
      className: 'extra',
      initialValues: { name: 'x', plan: 'free' },
      initialStep: 2,
      onComplete: () => Promise.reject(new Error('Name already taken')),
    });
    expect(ref.current).toHaveClass('extra');
    await userEvent.click(screen.getByRole('button', { name: 'Create workspace' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Name already taken');
  });
});
