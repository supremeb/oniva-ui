import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AiWorkspace } from './AiWorkspace';

describe('AiWorkspace', () => {
  it('shows the greeting and recent chats', () => {
    render(<AiWorkspace userName="Lena" />);
    expect(screen.getByRole('heading', { name: /Good to see you, Lena/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /October close checklist/ })).toBeInTheDocument();
  });
  it('sends a message with Enter and shows the answer from respond()', async () => {
    const respond = vi.fn().mockResolvedValue('Done: three invoices are overdue.');
    render(<AiWorkspace respond={respond} />);
    const box = screen.getByRole('textbox');
    await userEvent.type(box, 'Which invoices are overdue?{Enter}');
    await waitFor(() => expect(respond).toHaveBeenCalledWith('Which invoices are overdue?', []));
    await waitFor(() => expect(document.body.textContent).toMatch(/Done/), { timeout: 3000 });
    expect(screen.getByRole('log', { name: 'Conversation' })).toHaveAttribute('aria-live', 'polite');
  });
  it('opens an existing conversation and the projects view with the keyboard', async () => {
    render(<AiWorkspace />);
    await userEvent.click(screen.getByRole('button', { name: /October close checklist/ }));
    expect(screen.getByText(/Three items remain/)).toBeInTheDocument();
    const projects = screen.getByRole('button', { name: 'Projects' });
    projects.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('Q4 planning')).toBeInTheDocument();
    expect(projects).toHaveAttribute('aria-current', 'page');
  });
  it('collapses the sidebar and makes it inert', async () => {
    render(<AiWorkspace />);
    const toggle = screen.getByRole('button', { name: 'Collapse sidebar' });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.querySelector('nav[aria-label="Workspace"]')).toHaveAttribute('inert');
  });
  it('forwards ref and className', () => {
    const ref = vi.fn();
    render(<AiWorkspace ref={ref} className="x" data-testid="w" />);
    expect(ref).toHaveBeenCalled();
    expect(screen.getByTestId('w')).toHaveClass('x');
  });
});
