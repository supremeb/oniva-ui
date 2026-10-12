import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('keeps content in the accessibility tree', () => {
    render(
      <button type="button">
        <VisuallyHidden>Notifications</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
  });
  it('renders a custom element', () => {
    render(<VisuallyHidden elementType="div">Skip</VisuallyHidden>);
    expect(screen.getByText('Skip').tagName).toBe('DIV');
  });
});
