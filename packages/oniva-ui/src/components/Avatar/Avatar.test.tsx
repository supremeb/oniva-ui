import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar, AvatarGroup, getInitials } from './Avatar';

describe('Avatar', () => {
  it('derives initials', () => {
    expect(getInitials('Bala Chander Rallabandi')).toBe('BR');
    expect(getInitials('divya')).toBe('D');
    expect(getInitials()).toBe('');
  });

  it('shows initials with an accessible name when no image', () => {
    render(<Avatar name="Ada Lovelace" />);
    const el = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(el).toHaveTextContent('AL');
  });

  it('renders an image and falls back to initials on error', () => {
    const { container } = render(<Avatar name="Ada Lovelace" src="/missing.png" />);
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();
    fireEvent.error(img);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
  });

  it('AvatarGroup truncates with an overflow avatar', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="A B" />
        <Avatar name="C D" />
        <Avatar name="E F" />
        <Avatar name="G H" />
      </AvatarGroup>,
    );
    expect(screen.getByRole('img', { name: '2 more' })).toHaveTextContent('+2');
    expect(screen.queryByRole('img', { name: 'E F' })).toBeNull();
  });
});
