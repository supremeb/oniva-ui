import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RadialChart } from './RadialChart';

describe('RadialChart', () => {
  it('renders centre content and focusable rings', () => {
    render(
      <RadialChart
        items={[
          { label: 'Duration', value: 49, max: 50 },
          { label: 'Bedtime', value: 29, max: 30 },
        ]}
        centerValue="98"
      />,
    );
    expect(screen.getByText('98')).toBeInTheDocument();
    fireEvent.focus(screen.getByLabelText(/^Duration:/));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Duration');
  });
});
