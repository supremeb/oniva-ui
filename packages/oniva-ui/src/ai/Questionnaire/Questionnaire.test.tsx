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
});
