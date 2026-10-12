import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Confetti } from './Confetti';

describe('Confetti', () => {
  it('renders and forwards props', () => {
    render(<Confetti trigger={0} data-testid="r" />);
    expect(screen.getByTestId('r').tagName).toBe('CANVAS');
  });
});
