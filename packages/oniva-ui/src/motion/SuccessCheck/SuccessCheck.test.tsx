import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SuccessCheck } from './SuccessCheck';

describe('SuccessCheck', () => {
  it('renders and forwards props', () => {
    render(<SuccessCheck status="success" />);
    expect(screen.getByRole('status', { name: 'Success' })).toHaveAttribute('data-status', 'success');
  });
});
