import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  it('renders and forwards props', () => {
    render(<CopyButton value="abc" aria-label="Copy it" />);
    expect(screen.getByRole('button', { name: 'Copy it' })).toBeInTheDocument();
  });
});
