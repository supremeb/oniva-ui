import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AgentChatScreen } from './AgentChat';

describe('AgentChatScreen', () => {
  it('renders one h1, a navigation landmark and a main landmark', () => {
    render(<AgentChatScreen />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Renewal brief');
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the title as h2 with headingLevel={2}', () => {
    render(<AgentChatScreen headingLevel={2} />);
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });

  it('reports sidebar navigation', () => {
    const onNavigate = vi.fn();
    render(<AgentChatScreen onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole('button', { name: 'Analytics' }));
    expect(onNavigate).toHaveBeenCalledWith('Analytics');
  });

  it('handles its main interaction', () => {
    const onSend = vi.fn();
    render(<AgentChatScreen onSend={onSend} />);
    const box = screen.getByPlaceholderText('Ask the orchestrator…');
    fireEvent.change(box, { target: { value: 'Add the second workspace' } });
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledWith('Add the second workspace');
    expect(screen.getByText('Add the second workspace')).toBeInTheDocument();
  });

  it('saves the brief', () => {
    render(<AgentChatScreen />);
    fireEvent.click(screen.getByRole('button', { name: 'Save brief' }));
    expect(screen.getByText('Brief saved')).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<AgentChatScreen ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('custom');
  });
});
