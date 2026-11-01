import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Questionnaire } from './Questionnaire';

const questions = [
  {
    id: 'scope',
    prompt: 'Which period?',
    options: [
      { id: 'q3', label: 'Q3 only' },
      { id: 'ytd', label: 'Year to date' },
    ],
  },
  {
    id: 'cuts',
    prompt: 'Break down by',
    multiple: true,
    options: [
      { id: 'seg', label: 'Segment' },
      { id: 'reg', label: 'Region' },
    ],
  },
];

describe('Questionnaire', () => {
  it('requires every question before submit and returns answers', () => {
    const onSubmit = vi.fn();
    render(<Questionnaire questions={questions} onSubmit={onSubmit} />);
    const submit = screen.getByRole('button', { name: 'Continue' });
    expect(submit).toBeDisabled();
    fireEvent.click(screen.getByRole('radio', { name: 'Q3 only' }));
    expect(screen.getByText('1 of 2 answered')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Segment' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Region' }));
    expect(submit).toBeEnabled();
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith({ scope: ['q3'], cuts: ['seg', 'reg'] });
  });

  it('announces the answered count as a status', () => {
    render(<Questionnaire questions={questions} />);
    expect(screen.getByRole('status')).toHaveTextContent('0 of 2 answered');
    fireEvent.click(screen.getByRole('radio', { name: 'Q3 only' }));
    expect(screen.getByRole('status')).toHaveTextContent('1 of 2 answered');
  });

  it('hides the answered count when there are no questions', () => {
    render(<Questionnaire questions={[]} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
  });

  it('forwards ref and uses the title as the group name', () => {
    let el: HTMLDivElement | null = null;
    render(
      <Questionnaire
        title="Before I draft the plan"
        questions={questions}
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(el).toBe(screen.getByRole('group', { name: 'Before I draft the plan' }));
  });
});
