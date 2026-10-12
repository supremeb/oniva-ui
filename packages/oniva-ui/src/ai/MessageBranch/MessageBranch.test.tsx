import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MessageBranch } from './MessageBranch';

describe('MessageBranch', () => {
  it('switches versions and disables at the ends', () => {
    const onIndexChange = vi.fn();
    render(<MessageBranch branches={['one', 'two', 'three']} onIndexChange={onIndexChange} />);
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('1/3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous version' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Next version' }));
    expect(screen.getByText('two')).toBeInTheDocument();
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });
});
