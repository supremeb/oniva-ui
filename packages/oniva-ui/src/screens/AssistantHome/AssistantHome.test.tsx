import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AssistantHome } from './AssistantHome';

describe('AssistantHome', () => {
  it('renders greeting as the only h1, with nav, composer and suggestions', () => {
    render(<AssistantHome greeting="Hello Alex" />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Hello Alex' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New chat' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Plan the Q3 campaign' })).toBeInTheDocument();
  });

  it('fills the prompt from a suggestion and sends it', async () => {
    const onSubmit = vi.fn();
    const onSuggestion = vi.fn();
    render(<AssistantHome onSubmit={onSubmit} onSuggestion={onSuggestion} />);
    await userEvent.click(screen.getByRole('button', { name: 'Plan the Q3 campaign' }));
    expect(onSuggestion).toHaveBeenCalledWith('Plan the Q3 campaign');
    const box = screen.getByPlaceholderText('Help me brainstorm ideas for…') as HTMLTextAreaElement;
    expect(box.value).toBe('Plan the Q3 campaign');
    box.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('Plan the Q3 campaign');
  });

  it('forwards navigation events, ref, and className', async () => {
    const onNavigate = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<AssistantHome ref={ref} className="x" onNavigate={onNavigate} />);
    expect(ref.current).toHaveClass('x');
    await userEvent.click(screen.getByRole('button', { name: 'Folders' }));
    expect(onNavigate).toHaveBeenCalledWith('Folders');
  });
});
