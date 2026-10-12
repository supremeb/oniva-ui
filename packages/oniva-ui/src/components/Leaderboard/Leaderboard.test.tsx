import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Leaderboard } from './Leaderboard';
import { expectNoA11yViolations } from '../../internal/test-a11y';

const entries = [
  { id: 'a', name: 'Ann Lee', score: 10, previousRank: 1 },
  { id: 'b', name: 'Bo Chen', score: 30, previousRank: 2 },
];

describe('Leaderboard', () => {
  it('sorts by score and shows rank change', () => {
    render(<Leaderboard entries={entries} aria-label="Board" className="x" />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Bo Chen');
    expect(items[1]).toHaveTextContent('Down');
    expect(screen.getByRole('list')).toHaveClass('x');
  });
  it('has no a11y violations', async () => {
    const { container } = render(<Leaderboard entries={entries} aria-label="Board" />);
    await expectNoA11yViolations(container);
  });
});
