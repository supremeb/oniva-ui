import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';
import { ProgressSegments } from './ProgressSegments';

describe('ProgressBar', () => {
  it('exposes progressbar semantics with label and value', () => {
    render(<ProgressBar label="Storage" value={64} showValue />);
    const pb = screen.getByRole('progressbar', { name: 'Storage' });
    expect(pb).toHaveAttribute('aria-valuenow', '64');
    expect(screen.getByText('64%')).toBeInTheDocument();
  });
  it('supports indeterminate', () => {
    render(<ProgressBar aria-label="Syncing" isIndeterminate />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });
  it('tone changes classes and ref forwards', () => {
    let el: HTMLDivElement | null = null;
    render(
      <ProgressBar
        aria-label="x"
        value={5}
        tone="danger"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(el).toBeInstanceOf(HTMLDivElement);
  });
});

describe('ProgressSegments', () => {
  const segments = [
    { id: 'sys', label: 'System', value: 120_000, display: '120k' },
    { id: 'chat', label: 'Messages', value: 500_000, display: '500k' },
    { id: 'files', label: 'Files', value: 200_000, display: '200k' },
  ];
  it('auto summary, widths and legend', () => {
    const { container } = render(
      <ProgressSegments title="Context window" segments={segments} max={1_000_000} />,
    );
    expect(screen.getByText('820,000 / 1,000,000 (82%)')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Context window' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    const widths = Array.from(container.querySelectorAll<HTMLElement>('[role=img] > div')).map(
      (d) => d.style.getPropertyValue('--oniva-p'),
    );
    expect(widths).toEqual(['0.12', '0.5', '0.2']);
  });
  it('hides legend on request', () => {
    render(<ProgressSegments segments={segments} showLegend={false} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
