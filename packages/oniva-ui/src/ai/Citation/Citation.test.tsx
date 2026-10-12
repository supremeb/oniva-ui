import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Citation } from './Citation';

describe('Citation', () => {
  it('renders a numbered link with an accessible name', () => {
    render(<Citation index={2} title="Q3 earnings roundup" url="https://www.reuters.com/markets" />);
    const a = screen.getByRole('link', { name: 'Source 2: Q3 earnings roundup' });
    expect(a).toHaveTextContent('2');
    expect(a).toHaveAttribute('href', 'https://www.reuters.com/markets');
  });
});
