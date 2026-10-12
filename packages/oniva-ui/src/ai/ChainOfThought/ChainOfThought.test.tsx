import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChainOfThought } from './ChainOfThought';

const steps = [
  { id: 'a', label: 'Read diff', status: 'complete' as const, results: [{ title: 'Docs', url: 'https://example.com/x' }] },
  { id: 'b', label: 'Write summary', status: 'active' as const },
];

describe('ChainOfThought', () => {
  it('renders steps with status and marks the active one', () => {
    render(<ChainOfThought steps={steps} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Write summary').closest('li')).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('link', { name: /Docs/ })).toHaveAttribute('href', 'https://example.com/x');
  });
  it('toggles', () => {
    render(<ChainOfThought steps={steps} />);
    const b = screen.getByRole('button', { name: /Chain of thought/ });
    fireEvent.click(b);
    expect(b).toHaveAttribute('aria-expanded', 'false');
  });
});
