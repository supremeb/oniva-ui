import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnimatedGradientText } from './AnimatedGradientText';

describe('AnimatedGradientText', () => {
  it('renders and forwards props', () => {
    render(<AnimatedGradientText className="x">hi</AnimatedGradientText>);
    expect(screen.getByText('hi')).toHaveClass('x');
  });
});
