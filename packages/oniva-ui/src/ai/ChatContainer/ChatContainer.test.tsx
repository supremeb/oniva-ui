import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChatContainer } from './ChatContainer';

function setMetrics(
  el: HTMLElement,
  m: { scrollHeight: number; clientHeight: number; scrollTop: number },
) {
  Object.defineProperty(el, 'scrollHeight', { value: m.scrollHeight, configurable: true });
  Object.defineProperty(el, 'clientHeight', { value: m.clientHeight, configurable: true });
  el.scrollTop = m.scrollTop;
}

describe('ChatContainer', () => {
  it('renders a labelled log with messages', () => {
    render(
      <ChatContainer>
        <p>Hello</p>
      </ChatContainer>,
    );
    expect(screen.getByRole('log', { name: 'Conversation' })).toHaveTextContent('Hello');
    expect(screen.queryByRole('button', { name: 'Scroll to bottom' })).toBeNull();
  });

  it('shows the jump button when scrolled away and hides it after pressing', () => {
    render(
      <ChatContainer>
        <p>Hello</p>
      </ChatContainer>,
    );
    const log = screen.getByRole('log');
    setMetrics(log, { scrollHeight: 2000, clientHeight: 400, scrollTop: 100 });
    fireEvent.scroll(log);
    const btn = screen.getByRole('button', { name: 'Scroll to bottom' });
    act(() => {
      fireEvent.click(btn);
    });
    setMetrics(log, { scrollHeight: 2000, clientHeight: 400, scrollTop: 1600 });
    fireEvent.scroll(log);
    expect(screen.queryByRole('button', { name: 'Scroll to bottom' })).toBeNull();
  });
});
