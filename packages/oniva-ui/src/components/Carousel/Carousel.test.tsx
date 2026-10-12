import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Carousel } from './Carousel';
import { expectNoA11yViolations } from '../../internal/test-a11y';

describe('Carousel', () => {
  it('exposes carousel semantics and navigates', async () => {
    const onIndexChange = vi.fn();
    render(
      <Carousel aria-label="Demo" onIndexChange={onIndexChange}>
        <p>A</p>
        <p>B</p>
        <p>C</p>
      </Carousel>,
    );
    expect(screen.getByRole('region', { name: 'Demo' })).toHaveAttribute('aria-roledescription', 'carousel');
    expect(screen.getAllByRole('group', { name: /of 3$/ })).toHaveLength(3);
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole('button', { name: 'Go to slide 2' })).toHaveAttribute('aria-current', 'true');
  });
  it('has no a11y violations', async () => {
    const { container } = render(
      <Carousel aria-label="Demo" autoPlay={3000}>
        <p>A</p>
        <p>B</p>
      </Carousel>,
    );
    await expectNoA11yViolations(container);
  });
});
