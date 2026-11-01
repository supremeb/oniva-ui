import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResponseStream } from './ResponseStream';

afterEach(() => vi.useRealTimers());

describe('ResponseStream', () => {
  it('reveals text progressively and calls onComplete', () => {
    vi.useFakeTimers();
    const done = vi.fn();
    render(
      <ResponseStream
        data-testid="r"
        text="Revenue grew 12%"
        speed={4}
        intervalMs={10}
        onComplete={done}
      />,
    );
    expect(screen.getByTestId('r')).not.toHaveTextContent('Reve');
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByTestId('r')).toHaveTextContent('Reve');
    for (let i = 0; i < 6; i++) {
      act(() => {
        vi.advanceTimersByTime(10);
      });
    }
    expect(screen.getByTestId('r')).toHaveTextContent('Revenue grew 12%');
    expect(done).toHaveBeenCalled();
  });

  it('shows everything when instant', () => {
    render(<ResponseStream text="Done" instant />);
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('shows plain wrapping text when a token is too long to reveal word by word', () => {
    const url = 'https://api.northwind.example/v2/workspaces/ws_8f3a91c2d7/projects/prj_44b1e0a9/artifacts';
    render(<ResponseStream data-testid="r" text={`Failed at ${url}`} instant />);
    const root = screen.getByTestId('r');
    expect(root).toHaveTextContent(url);
    expect(root.querySelector('[data-reveal]')).toBeNull();
  });

  it('reveals normal text word by word', () => {
    render(<ResponseStream data-testid="r" text="Short words only" instant />);
    expect(screen.getByTestId('r').querySelector('[data-reveal]')).not.toBeNull();
  });

  it('reports busy and announces progress, then completion', () => {
    vi.useFakeTimers();
    render(<ResponseStream data-testid="r" text="Hello there" speed={20} intervalMs={10} />);
    expect(screen.getByTestId('r')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Generating response');
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByTestId('r')).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByRole('status')).toHaveTextContent('Response complete');
  });
});
