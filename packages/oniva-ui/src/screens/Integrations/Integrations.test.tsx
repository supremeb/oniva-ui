import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { IntegrationsScreen } from './Integrations';

describe('IntegrationsScreen', () => {
  it('renders one h1, a navigation landmark and a main landmark', () => {
    render(<IntegrationsScreen />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Integrations');
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the title as h2 with headingLevel={2}', () => {
    render(<IntegrationsScreen headingLevel={2} />);
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });

  it('reports sidebar navigation', () => {
    const onNavigate = vi.fn();
    render(<IntegrationsScreen onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole('button', { name: 'Analytics' }));
    expect(onNavigate).toHaveBeenCalledWith('Analytics');
  });

  it('handles its main interaction', () => {
    const onConnectionChange = vi.fn();
    render(<IntegrationsScreen onConnectionChange={onConnectionChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Connect Ledgerline' }));
    expect(onConnectionChange).toHaveBeenCalledWith('ledgerline', true);
    expect(screen.getByRole('button', { name: 'Disconnect Ledgerline' })).toBeInTheDocument();
  });

  it('filters by connection state', () => {
    render(<IntegrationsScreen />);
    fireEvent.click(screen.getByRole('tab', { name: 'Available' }));
    expect(screen.getByRole('button', { name: 'Connect Ledgerline' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Relay Mail/ })).toBeNull();
  });

  it('filters by connection state', () => {
    render(<IntegrationsScreen />);
    fireEvent.click(screen.getByRole('tab', { name: 'Available' }));
    expect(screen.getByRole('button', { name: 'Connect Ledgerline' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Relay Mail/ })).toBeNull();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<IntegrationsScreen ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('custom');
  });
});
