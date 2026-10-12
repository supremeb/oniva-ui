import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RollingText } from './RollingText';

describe('RollingText', () => {
  it('renders and forwards props', () => {
    render(<RollingText text="Go" />);
    expect(screen.getByText('Go')).toBeInTheDocument();
  });
});
