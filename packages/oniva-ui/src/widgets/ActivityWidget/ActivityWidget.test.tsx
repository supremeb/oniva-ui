import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ActivityWidget } from './ActivityWidget';

const props = {
  move: { value: 486, goal: 600 },
  exercise: { value: 32, goal: 45 },
  running: { value: 5.2, goal: 8 },
};

describe('ActivityWidget', () => {
  it('shows a tile per metric and the rings', () => {
    render(<ActivityWidget {...props} />);
    expect(screen.getAllByText('Move').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Exercise').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Running').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/486/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/5\.2/).length).toBeGreaterThan(0);
    expect(screen.getByRole('img', { name: /Activity rings/ })).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    let el: HTMLElement | null = null;
    render(
      <ActivityWidget
        {...props}
        className="extra"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(el).toBeInstanceOf(HTMLElement);
    expect((el as unknown as HTMLElement).className).toContain('extra');
  });
});
