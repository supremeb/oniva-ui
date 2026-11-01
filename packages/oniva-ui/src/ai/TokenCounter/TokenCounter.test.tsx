import { render, screen } from '@testing-library/react';
import { I18nProvider } from 'react-aria';
import { describe, expect, it } from 'vitest';
import { TokenCounter } from './TokenCounter';

describe('TokenCounter', () => {
  it('exposes the formatted count to assistive tech', () => {
    render(<TokenCounter tokens={48210} max={200000} />);
    expect(screen.getByText('48,210')).toBeInTheDocument();
    expect(screen.getByText(/200,000/)).toBeInTheDocument();
  });
});

describe('TokenCounter locale', () => {
  it('formats the limit and cost with the active locale', () => {
    render(
      <I18nProvider locale="de-DE">
        <TokenCounter tokens={48210} max={200000} cost={0.14463} />
      </I18nProvider>,
    );
    expect(screen.getByText('48.210')).toBeInTheDocument();
    expect(screen.getByText(/200\.000/)).toBeInTheDocument();
    expect(screen.getByText(/0,145/)).toBeInTheDocument();
  });

  it('shows the cost with three decimals', () => {
    render(<TokenCounter tokens={842} cost={0.0025} />);
    expect(screen.getByText('$0.003')).toBeInTheDocument();
  });
});
