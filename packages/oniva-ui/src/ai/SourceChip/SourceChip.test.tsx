import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SourceChip } from './SourceChip';

describe('SourceChip', () => {
  it('links to the source with safe rel and shows the host', () => {
    render(<SourceChip title="SaaS benchmarks 2026" url="https://www.northwind.example/atlas" />);
    const a = screen.getByRole('link');
    expect(a).toHaveAttribute('href', 'https://www.northwind.example/atlas');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    expect(a).toHaveTextContent('northwind.example');
  });

  it('drops unsafe URLs', () => {
    const { container } = render(<SourceChip title="Unsafe link" url="javascript:alert(1)" />);
    expect(container.querySelector('a')).not.toHaveAttribute('href');
  });

  it('falls back to the title initial when the url has no readable host', () => {
    const { container } = render(<SourceChip title="Ask the analyst" url="mailto:analyst@northwind.example" />);
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('A');
    expect(screen.getByRole('link')).toHaveTextContent('Ask the analyst');
  });

  it('uses the host initial and exposes full text for truncated parts', () => {
    const { container } = render(<SourceChip title="Quarterly benchmarks" url="https://www.northwind.example/a" />);
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('n');
    expect(screen.getByText('Quarterly benchmarks')).toHaveAttribute('title', 'Quarterly benchmarks');
    expect(screen.getByText('northwind.example')).toHaveAttribute('title', 'northwind.example');
  });
});
