import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ClientContext } from './ClientContext';

describe('ClientContext', () => {
  it('renders KPI toggle buttons, tabs and the context timeline', () => {
    render(<ClientContext />);
    expect(screen.getByRole('tablist', { name: 'Client sections' })).toBeInTheDocument();
    const kpi = screen.getByRole('button', { name: /Revenue/ });
    expect(kpi).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(/Goal for Q4/)).toBeInTheDocument();
  });
  it('KPI cards toggle pressed state', async () => {
    render(<ClientContext />);
    const kpi = screen.getByRole('button', { name: /Orders/ });
    await userEvent.click(kpi);
    expect(kpi).toHaveAttribute('aria-pressed', 'true');
  });
  it('adds a note with Ctrl+Enter and calls back', async () => {
    const onAddContext = vi.fn();
    render(<ClientContext onAddContext={onAddContext} me={{ name: 'Sam Lee' }} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Add context' }), 'Call moved to Friday');
    await userEvent.keyboard('{Control>}{Enter}{/Control}');
    expect(onAddContext).toHaveBeenCalledWith('harbor', 'Call moved to Friday', []);
    expect(screen.getByText('Call moved to Friday')).toBeInTheDocument();
  });
  it('@ suggests reports and Enter inserts the first', async () => {
    render(<ClientContext />);
    const box = screen.getByRole('textbox', { name: 'Add context' });
    await userEvent.type(box, 'See @Q3');
    expect(screen.getByRole('option', { name: 'Q3 margin review' })).toBeInTheDocument();
    await userEvent.keyboard('{Enter}');
    expect(box).toHaveValue('See @Q3-margin-review ');
  });
  it('search filters entries', async () => {
    render(<ClientContext />);
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search context' }), 'supplier');
    expect(screen.getByText('Supplier-terms.pdf')).toBeInTheDocument();
    expect(screen.queryByText(/Goal for Q4/)).toBeNull();
  });
  it('reports fold open with aria-expanded', async () => {
    render(<ClientContext />);
    await userEvent.click(screen.getByRole('tab', { name: /Reports/ }));
    const btn = screen.getByRole('button', { name: 'Q3 margin review' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });
  it('forwards ref and className', () => {
    const ref = vi.fn();
    render(<ClientContext ref={ref} className="x" data-testid="c" />);
    expect(ref).toHaveBeenCalled();
    expect(screen.getByTestId('c')).toHaveClass('x');
  });
});
