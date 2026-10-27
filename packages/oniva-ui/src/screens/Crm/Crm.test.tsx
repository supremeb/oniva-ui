import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CrmScreen } from './Crm';

describe('CrmScreen', () => {
  it('renders one h1, a navigation landmark and a main landmark', () => {
    render(<CrmScreen />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Companies');
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the title as h2 with headingLevel={2}', () => {
    render(<CrmScreen headingLevel={2} />);
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });

  it('reports sidebar navigation', () => {
    const onNavigate = vi.fn();
    render(<CrmScreen onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole('button', { name: 'Analytics' }));
    expect(onNavigate).toHaveBeenCalledWith('Analytics');
  });

  it('handles its main interaction', () => {
    const onChange = vi.fn();
    render(<CrmScreen onCompaniesChange={onChange} />);
    expect(screen.getByRole('tab', { name: /All companies/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Harbor & Vale')).toBeInTheDocument();
  });

  it('switches views', async () => {
    render(<CrmScreen />);
    await userEvent.click(screen.getByRole('tab', { name: /Customers/ }));
    expect(screen.getByText('Harbor & Vale')).toBeInTheDocument();
    expect(screen.queryByText('Lumen Freight')).toBeNull();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<CrmScreen ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('custom');
  });
});
