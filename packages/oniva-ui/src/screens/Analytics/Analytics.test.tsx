import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AnalyticsScreen } from './Analytics';

describe('AnalyticsScreen', () => {
  it('renders one h1, a navigation landmark and a main landmark', () => {
    render(<AnalyticsScreen />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Revenue');
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the title as h2 with headingLevel={2}', () => {
    render(<AnalyticsScreen headingLevel={2} />);
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });

  it('reports sidebar navigation', () => {
    const onNavigate = vi.fn();
    render(<AnalyticsScreen onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole('button', { name: 'Analytics' }));
    expect(onNavigate).toHaveBeenCalledWith('Analytics');
  });

  it('handles its main interaction', () => {
    const onRefresh = vi.fn();
    render(<AnalyticsScreen onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(onRefresh).toHaveBeenCalled();
  });

  it('renders the key figures and top products', () => {
    render(<AnalyticsScreen />);
    expect(screen.getByRole('region', { name: 'Key figures' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Top products' })).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<AnalyticsScreen ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('custom');
  });
});
