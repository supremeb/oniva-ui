import { render, screen } from '@testing-library/react';
import { BellIcon } from '../../icons/IconSet';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('is decorative by default', () => {
    const { container } = render(<Icon icon={BellIcon} />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('exposes a label as img and maps size tokens', () => {
    render(<Icon icon={BellIcon} label="Alerts" size="xl" className="x" />);
    const el = screen.getByRole('img', { name: 'Alerts' });
    expect(el).toHaveAttribute('width', '24');
    expect(el).toHaveClass('x');
  });
});
