import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock } from './CodeBlock';

function mockClipboard(writeText: (t: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

describe('CodeBlock', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
  });

  it('renders code, filename and language', () => {
    render(<CodeBlock code="print(1)" filename="rev.py" language="python" />);
    expect(screen.getByText('print(1)')).toBeInTheDocument();
    expect(screen.getByText('rev.py')).toBeInTheDocument();
    expect(screen.getByText('python')).toBeInTheDocument();
  });

  it('copies to clipboard, shows confirmation and announces it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(<CodeBlock code="select 1" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(writeText).toHaveBeenCalledWith('select 1');
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard');
  });

  it('does not claim success when the clipboard rejects or is missing', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    mockClipboard(writeText);
    const { unmount } = render(<CodeBlock code="select 1" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
    unmount();

    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    render(<CodeBlock code="select 1" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    await Promise.resolve();
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument();
  });

  it('labels the scrollable code region and titles a truncated filename', () => {
    render(<CodeBlock code="x" filename="very/long/path/worker.ts" language="typescript" />);
    expect(screen.getByRole('group', { name: 'very/long/path/worker.ts' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByText('very/long/path/worker.ts')).toHaveAttribute('title', 'very/long/path/worker.ts');
  });

  it('falls back to language, then a generic label, for the region name', () => {
    const { rerender } = render(<CodeBlock code="x" language="python" />);
    expect(screen.getByRole('group', { name: 'python' })).toBeInTheDocument();
    rerender(<CodeBlock code="x" />);
    expect(screen.getByRole('group', { name: 'Code' })).toBeInTheDocument();
  });
});
