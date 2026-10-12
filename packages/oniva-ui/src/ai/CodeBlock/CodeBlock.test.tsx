import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock', () => {
  it('renders code, filename and language', () => {
    render(<CodeBlock code="print(1)" filename="rev.py" language="python" />);
    expect(screen.getByText('print(1)')).toBeInTheDocument();
    expect(screen.getByText('rev.py')).toBeInTheDocument();
    expect(screen.getByText('python')).toBeInTheDocument();
  });

  it('copies to clipboard and shows confirmation', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<CodeBlock code="select 1" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(writeText).toHaveBeenCalledWith('select 1');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});
