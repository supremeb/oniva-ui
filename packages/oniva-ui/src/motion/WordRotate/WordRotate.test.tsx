import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WordRotate } from './WordRotate';

describe('WordRotate', () => {
  it('renders and forwards props', () => {
    render(<WordRotate words={['one', 'two']} />);
    expect(screen.getByText('one')).toBeInTheDocument();
  });
});
