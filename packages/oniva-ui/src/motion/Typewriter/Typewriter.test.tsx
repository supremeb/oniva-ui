import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Typewriter } from './Typewriter';

describe('Typewriter', () => {
  it('renders and forwards props', () => {
    render(<Typewriter text="Hi there" />);
    expect(screen.getByText('Hi there')).toBeInTheDocument();
  });
});
