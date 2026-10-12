import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AlertsFeed, type AlertItem } from './AlertsFeed';

const alerts: AlertItem[] = [
  { id: '1', title: 'Unusual sign-in', description: 'New device in Austin, TX.', date: 'Oct 9', severity: 'critical' },
  { id: '2', title: 'Invoice overdue', description: 'INV-2041 is 3 days late.', date: 'Oct 8', severity: 'warning' },
];

describe('AlertsFeed', () => {
  it('renders count, titles and date chips', () => {
    render(<AlertsFeed alerts={alerts} />);
    expect(screen.getByText('Important alerts')).toBeInTheDocument();
    expect(screen.getByText('2 this week')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Important alerts' }).children).toHaveLength(2);
    expect(screen.getByText('Oct 9')).toBeInTheDocument();
    expect(screen.getByText('INV-2041 is 3 days late.')).toBeInTheDocument();
  });

  it('forwards ref and className, custom period', () => {
    let el: HTMLElement | null = null;
    render(
      <AlertsFeed
        alerts={alerts}
        period="today"
        className="extra"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(screen.getByText('2 today')).toBeInTheDocument();
    expect(el).toBeInstanceOf(HTMLElement);
    expect((el as unknown as HTMLElement).className).toContain('extra');
  });
});
