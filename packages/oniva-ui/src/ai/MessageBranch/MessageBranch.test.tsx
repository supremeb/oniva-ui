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

  it('goes back, and disables Next at the last version', () => {
    render(<MessageBranch branches={['one', 'two']} defaultIndex={1} />);
    expect(screen.getByRole('button', { name: 'Next version' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Previous version' }));
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });

  it('hides the switcher for a single version and renders nothing for none', () => {
    const { rerender } = render(<MessageBranch branches={['only']} />);
    expect(screen.getByText('only')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Response versions' })).toBeNull();
    rerender(<MessageBranch branches={[]} />);
    expect(screen.queryByRole('group', { name: 'Response versions' })).toBeNull();
  });

  it('clamps an out-of-range index', () => {
    render(<MessageBranch branches={['one', 'two', 'three']} defaultIndex={9} />);
    expect(screen.getByText('three')).toBeInTheDocument();
    expect(screen.getByText('3/3')).toBeInTheDocument();
  });

  it('follows the controlled index and reports changes without switching itself', () => {
    const onIndexChange = vi.fn();
    render(<MessageBranch branches={['one', 'two', 'three']} index={1} onIndexChange={onIndexChange} />);
    expect(screen.getByText('two')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next version' }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
    expect(screen.getByText('two')).toBeInTheDocument();
  });
});
