import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TokenCounter } from './TokenCounter';

describe('TokenCounter', () => {
  it('exposes the formatted count to assistive tech', () => {
    render(<TokenCounter tokens={48210} max={200000} />);
    expect(screen.getByText('48,210')).toBeInTheDocument();
    expect(screen.getByText(/200,000/)).toBeInTheDocument();
  });
});
