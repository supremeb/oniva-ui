import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { ToolCallCard, ToolCallGroup } from './ToolCallCard';

describe('ToolCallCard', () => {
  it('shows name, summarized args, and expands to the result', () => {
    render(
      <ToolCallCard name="query_warehouse" args={{ table: 'deals' }} duration="1.2s">
        412 rows
      </ToolCallCard>,
    );
    const btn = screen.getByRole('button', { name: /query_warehouse/ });
    expect(btn).toHaveTextContent('query_warehouse');
    expect(btn).toHaveTextContent('table="deals"');
    fireEvent.click(btn);
    expect(screen.getByText('412 rows')).toBeVisible();
  });

  it('exposes the running status', () => {
    render(<ToolCallCard name="web_search" status="running" />);
    expect(screen.getByRole('status', { name: 'Running' })).toBeInTheDocument();
  });

  it('runs a live timer from startedAt and shows the final duration after', () => {
    vi.useFakeTimers();
    const { rerender } = render(<ToolCallCard name="web_search" status="running" startedAt={Date.now() - 2000} />);
    expect(screen.getByText('2.0s')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('3.0s')).toBeInTheDocument();
    rerender(<ToolCallCard name="web_search" status="success" durationMs={3400} />);
    expect(screen.getByText('3.4s')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('highlights JSON arguments and result, with copy buttons', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<ToolCallCard name="q" args={{ table: 'deals' }} result={{ rows: 412 }} defaultExpanded />);
    expect(screen.getByLabelText('Arguments').querySelector('span')).toHaveTextContent('"table"');
    fireEvent.click(screen.getByRole('button', { name: 'Copy result' }));
    expect(writeText).toHaveBeenCalledWith(JSON.stringify({ rows: 412 }, null, 2));
  });

  it('opens on error, shows the message and retries', async () => {
    const onRetry = vi.fn();
    const { container } = render(<ToolCallCard name="send_email" status="error" error="SMTP 550" onRetry={onRetry} />);
    expect(screen.getByText('SMTP 550')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Retry/ }));
    expect(onRetry).toHaveBeenCalled();
    await expectNoA11yViolations(container);
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ToolCallCard name="x" ref={ref} className="c" />);
    expect(ref.current).toHaveClass('c');
  });
});

describe('ToolCallGroup', () => {
  it('summarises its cards and opens to show them', () => {
    render(
      <ToolCallGroup>
        <ToolCallCard name="a" durationMs={1000} />
        <ToolCallCard name="b" durationMs={1400} status="error" error="boom" />
      </ToolCallGroup>,
    );
    const head = screen.getByRole('button', { name: /Used 2 tools/ });
    expect(head).toHaveTextContent('1 failed');
    expect(head).toHaveTextContent('2.4s');
    expect(head).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(head);
    expect(head).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows the running label while any call runs', () => {
    render(
      <ToolCallGroup>
        <ToolCallCard name="a" status="running" />
      </ToolCallGroup>,
    );
    expect(screen.getByRole('button', { name: /Using tools/ })).toBeInTheDocument();
  });
});
