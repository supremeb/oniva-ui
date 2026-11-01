import { cleanup, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CostBadge, UsageMeter } from './CostBadge';

describe('CostBadge / UsageMeter', () => {
  it('shows tokens and exposes the meter', () => {
    render(
      <>
        <CostBadge cost={0.043} tokens={12400} />
        <UsageMeter spent={412.5} budget={500} breakdown={[{ label: 'Atlas 2', value: 301.2 }]} />
      </>,
    );
    expect(screen.getByText('12.4k tokens')).toBeInTheDocument();
    expect(screen.getByRole('meter', { name: 'API spend usage' })).toHaveAttribute('aria-valuenow', '412.5');
    expect(screen.getByText('Atlas 2 $301.20')).toBeInTheDocument();
  });

  it('does not show a real sub-tenth-of-a-cent cost as free', () => {
    const { container } = render(<CostBadge cost={0.0004} tokens={212} />);
    expect(container).toHaveTextContent('<$0.001');
    expect(container).not.toHaveTextContent('$0.000');
  });

  it('keeps a true zero as zero and singularises one token', () => {
    const { container } = render(
      <>
        <CostBadge cost={0} tokens={0} />
        <CostBadge cost={0.0001} tokens={1} />
      </>,
    );
    expect(container).toHaveTextContent('0 tokens');
    expect(container).toHaveTextContent('1 token');
    expect(container).not.toHaveTextContent('1 tokens');
  });

  it('uses the locale for token compaction and currency', () => {
    const { container } = render(<CostBadge cost={1284.5} tokens={2400000} locale="de-DE" currency="EUR" />);
    expect(container).toHaveTextContent('1.284,50');
    expect(container).toHaveTextContent('2,4 Mio.');
  });

  it('meter: formats the breakdown with the currency and locale', () => {
    render(<UsageMeter spent={80} budget={100} currency="EUR" locale="de-DE" breakdown={[{ label: 'Atlas 2', value: 80210.4 }]} />);
    expect(screen.getByText('Atlas 2 80.210,40 €')).toBeInTheDocument();
  });

  it('meter: over budget is stated in text, not only colour, and valuenow stays within range', () => {
    render(<UsageMeter spent={538.9} budget={500} />);
    expect(screen.getByText(/\$38\.90 over/)).toBeInTheDocument();
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '500');
    expect(meter.getAttribute('aria-valuetext')).toContain('over budget');
  });

  it('meter: a zero budget does not produce a NaN bar', () => {
    render(<UsageMeter spent={12.4} budget={0} />);
    const fill = screen.getByRole('meter').firstElementChild as HTMLElement;
    expect(fill.style.transform).toBe('scaleX(1)');
    cleanup();
    render(<UsageMeter spent={0} budget={0} />);
    expect((screen.getByRole('meter').firstElementChild as HTMLElement).style.transform).toBe('scaleX(0)');
  });
});
