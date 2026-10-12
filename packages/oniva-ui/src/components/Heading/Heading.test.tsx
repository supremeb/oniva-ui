import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders the semantic level', () => {
    render(<Heading level={3}>Team members</Heading>);
    expect(screen.getByRole('heading', { level: 3, name: 'Team members' })).toBeInTheDocument();
  });
  it('visual variant is independent of level', () => {
    const { rerender } = render(<Heading level={2}>A</Heading>);
    const a = screen.getByRole('heading').className;
    rerender(
      <Heading level={2} variant="display">
        A
      </Heading>,
    );
    expect(screen.getByRole('heading').className).not.toBe(a);
    expect(screen.getByRole('heading').tagName).toBe('H2');
  });
});
