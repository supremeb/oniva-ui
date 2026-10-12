import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SourceChip } from './SourceChip';

describe('SourceChip', () => {
  it('links to the source with safe rel and shows the host', () => {
    render(<SourceChip title="SaaS benchmarks 2026" url="https://www.bvp.com/atlas" />);
    const a = screen.getByRole('link');
    expect(a).toHaveAttribute('href', 'https://www.bvp.com/atlas');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    expect(a).toHaveTextContent('bvp.com');
  });

  it('drops unsafe URLs', () => {
    render(<SourceChip title="x" url="javascript:alert(1)" />);
    expect(screen.getByText('x').closest('a')).not.toHaveAttribute('href');
  });
});
