import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Loader } from './Loaders';

describe('Loaders', () => {
  it('renders and forwards props', () => {
    render(<Loader variant="matrix" label="Syncing" />);
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'matrix');
  });
});
