import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ResizablePanel, ResizablePanels } from './ResizablePanels';

function Example(props: {
  onResize?: (s: number[]) => void;
  direction?: 'horizontal' | 'vertical';
}) {
  return (
    <ResizablePanels {...props} aria-label="Editor" className="x">
      <ResizablePanel defaultSize={30} aria-label="Files">
        Files
      </ResizablePanel>
      <ResizablePanel aria-label="Editor pane">Editor</ResizablePanel>
    </ResizablePanels>
  );
}

describe('ResizablePanels', () => {
  it('renders panels and a labelled separator with the current size', () => {
    render(<Example />);
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByText('Editor')).toBeInTheDocument();
    const sep = screen.getByRole('separator', { name: 'Resize Files' });
    expect(sep).toHaveAttribute('aria-valuenow', '30');
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
  });
  it('resizes with arrow keys and respects bounds', async () => {
    const onResize = vi.fn();
    render(<Example onResize={onResize} />);
    const sep = screen.getByRole('separator');
    sep.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(Number(sep.getAttribute('aria-valuenow'))).toBeGreaterThan(30);
    expect(onResize).toHaveBeenCalled();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    expect(Number(sep.getAttribute('aria-valuenow'))).toBeLessThan(30);
    for (let i = 0; i < 40; i++) await userEvent.keyboard('{ArrowLeft}');
    expect(Number(sep.getAttribute('aria-valuenow'))).toBeGreaterThanOrEqual(10);
  });
  it('vertical direction uses a horizontal separator', () => {
    render(<Example direction="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });
});
