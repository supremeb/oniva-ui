import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

  describe('resize observation', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('drops a stale jump button once nothing overflows any more', () => {
      let trigger: () => void = () => undefined;
      const observed: Element[] = [];
      class RO {
        constructor(cb: () => void) {
          trigger = cb;
        }
        observe(el: Element) {
          observed.push(el);
        }
        disconnect() {}
        unobserve() {}
      }
      vi.stubGlobal('ResizeObserver', RO);
      render(
        <ChatContainer>
          <p>Hello</p>
        </ChatContainer>,
      );
      const log = screen.getByRole('log');
      // Both the content and the scroll viewport are watched.
      expect(observed).toContain(log);
      expect(observed).toHaveLength(2);
      setMetrics(log, { scrollHeight: 2000, clientHeight: 400, scrollTop: 100 });
      fireEvent.scroll(log);
      expect(screen.getByRole('button', { name: 'Scroll to bottom' })).toBeTruthy();
      setMetrics(log, { scrollHeight: 300, clientHeight: 400, scrollTop: 0 });
      act(() => trigger());
      expect(screen.queryByRole('button', { name: 'Scroll to bottom' })).toBeNull();
    });
  });

  it('makes the scroller keyboard-focusable', () => {
    render(<ChatContainer />);
    expect(screen.getByRole('log')).toHaveAttribute('tabindex', '0');
  });
});
