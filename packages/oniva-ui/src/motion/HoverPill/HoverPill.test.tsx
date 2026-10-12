import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HoverPill, HoverPillItem } from './HoverPill';

describe('HoverPill', () => {
  it('renders and forwards props', () => {
    render(<HoverPill data-testid="r"><HoverPillItem>One</HoverPillItem></HoverPill>);
    expect(screen.getByText('One')).toHaveAttribute('data-hover-pill-item');
  });
});
