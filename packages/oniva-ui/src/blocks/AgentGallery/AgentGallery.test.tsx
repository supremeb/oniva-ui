import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AgentGallery } from './AgentGallery';

describe('AgentGallery', () => {
  it('is a carousel that opens the middle item first', () => {
    render(<AgentGallery />);
    expect(screen.getByRole('region', { name: 'Agents that fit your workflow' })).toHaveAttribute('aria-roledescription', 'carousel');
    expect(screen.getByRole('heading', { level: 3, name: 'Ticket triage' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show Reconciler' })).toBeInTheDocument();
  });
  it('clicking a side panel opens it and announces the caption', async () => {
    render(<AgentGallery />);
    await userEvent.click(screen.getByRole('button', { name: 'Show Weekly brief' }));
    expect(screen.getByRole('heading', { level: 3, name: 'Weekly brief' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Weekly brief, 3 of 4');
  });
  it('arrow keys and the arrow buttons step through panels and wrap', async () => {
    render(<AgentGallery defaultIndex={0} />);
    screen.getByRole('button', { name: 'Show Ticket triage' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('heading', { level: 3, name: 'Ticket triage' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Previous agent' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous agent' }));
    expect(screen.getByRole('heading', { level: 3, name: 'Renewal watch' })).toBeInTheDocument();
  });
  it('forwards ref and className', () => {
    const ref = vi.fn();
    render(<AgentGallery ref={ref} className="x" data-testid="g" />);
    expect(ref).toHaveBeenCalled();
    expect(screen.getByTestId('g')).toHaveClass('x');
  });
});
