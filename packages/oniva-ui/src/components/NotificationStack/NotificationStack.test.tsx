import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NotificationStack, type Notice } from './NotificationStack';

const notices: Notice[] = [
  { id: 'a', badge: 'Notice', title: 'Scheduled maintenance', text: 'Offline Sunday 02:00.', action: { label: 'View status', onClick: vi.fn() } },
  { id: 'b', title: 'New export format', text: 'Parquet is available.' },
  { id: 'c', title: 'Invite accepted', text: 'Mara joined the workspace.' },
];

afterEach(() => vi.useRealTimers());

describe('NotificationStack', () => {
  it('is a labelled region and only exposes the front card', () => {
    render(<NotificationStack notices={notices} />);
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Scheduled maintenance' })).toBeInTheDocument();
    expect(screen.queryByRole('article', { name: 'New export format' })).toBeNull();
    expect(screen.getAllByRole('button', { name: /Dismiss/ })).toHaveLength(1);
  });

  it('dismisses the front card and reveals the next', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<NotificationStack notices={notices} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss Scheduled maintenance' }));
    expect(onDismiss).toHaveBeenCalledWith(notices[0]);
    act(() => void vi.advanceTimersByTime(400));
    expect(screen.queryByRole('article', { name: 'Scheduled maintenance' })).toBeNull();
    expect(screen.getByRole('article', { name: 'New export format' })).toBeInTheDocument();
  });

  it('runs the action', () => {
    render(<NotificationStack notices={notices} />);
    fireEvent.click(screen.getByRole('button', { name: 'View status' }));
    expect(notices[0]!.action!.onClick).toHaveBeenCalled();
  });

  it('dismisses immediately under reduced motion', () => {
    const mm = window.matchMedia;
    window.matchMedia = ((q: string) => ({
      matches: q.includes('reduce'), media: q, addEventListener: () => {}, removeEventListener: () => {},
      addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false, onchange: null,
    })) as typeof window.matchMedia;
    render(<NotificationStack notices={notices} />);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss Scheduled maintenance' }));
    expect(screen.queryByRole('article', { name: 'Scheduled maintenance' })).toBeNull();
    window.matchMedia = mm;
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLElement>();
    render(<NotificationStack notices={notices} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
