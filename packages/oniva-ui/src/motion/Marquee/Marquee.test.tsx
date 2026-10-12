import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Marquee } from './Marquee';

describe('Marquee', () => {
  it('renders and forwards props', () => {
    render(<Marquee data-testid="r"><span>A</span></Marquee>);
    expect(screen.getAllByText('A')).toHaveLength(2);
  });
});
