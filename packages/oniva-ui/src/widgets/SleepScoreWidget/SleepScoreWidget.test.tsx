import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SleepScoreWidget, type SleepNight } from './SleepScoreWidget';

const nights: SleepNight[] = [
  {
    label: 'Sun, 4 Jul',
    score: 72,
    factors: [{ label: 'Duration', detail: '6h 10m', score: 36, max: 50 }],
  },
  {
    label: 'Mon, 5 Jul',
    score: 98,
    factors: [
      { label: 'Duration', detail: '7h 50m', score: 49, max: 50 },
      { label: 'Interruptions', detail: '5m awake', score: 20, max: 20 },
    ],
  },
];

describe('SleepScoreWidget', () => {
  it('shows verdict, score and factor rows', () => {
    render(<SleepScoreWidget nights={nights} />);
    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Sleep score 98 out of 100' })).toBeInTheDocument();
    expect(screen.getByText('49/50')).toBeInTheDocument();
    expect(screen.getByText('20/20')).toBeInTheDocument();
  });

  it('navigates between nights and forwards ref', async () => {
    let el: HTMLElement | null = null;
    const user = userEvent.setup();
    render(
      <SleepScoreWidget
        nights={nights}
        ref={(n) => {
          el = n;
        }}
        className="extra"
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Previous night' }));
    expect(screen.getByText('Fair')).toBeInTheDocument();
    expect(screen.getByText('36/50')).toBeInTheDocument();
    expect(el).toBeInstanceOf(HTMLElement);
  });
});
