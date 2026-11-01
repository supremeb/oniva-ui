import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Artifact } from './Artifact';

describe('Artifact', () => {
  it('renders title, version and fires actions', () => {
    const onClose = vi.fn();
    const onDownload = vi.fn();
    render(
      <Artifact open title="Retention memo" version="v2" onClose={onClose} onDownload={onDownload}>
        body
      </Artifact>,
    );
    expect(screen.getByRole('complementary', { name: 'Retention memo' })).toBeInTheDocument();
    expect(screen.getByText('v2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Download artifact' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close artifact' }));
    expect(onDownload).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
  it('renders nothing when closed', () => {
    render(<Artifact open={false} title="x" />);
    expect(screen.queryByRole('complementary')).toBeNull();
  });
  it('exposes the full title on hover for truncated headings', () => {
    render(<Artifact open title="A very long retention summary title" />);
    expect(screen.getByRole('heading', { name: 'A very long retention summary title' })).toHaveAttribute('title', 'A very long retention summary title');
  });
  it('announces a successful copy', () => {
    render(<Artifact open title="Memo" copyText="hello" />);
    expect(screen.getByRole('status')).toHaveTextContent('');
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
  it('makes the content region keyboard-focusable only when it overflows', () => {
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight');
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, get: () => 400 });
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get: () => 200 });
    try {
      render(<Artifact open title="Memo">long body</Artifact>);
      act(() => undefined);
      const region = screen.getByRole('region', { name: 'Memo content' });
      expect(region).toHaveAttribute('tabindex', '0');
    } finally {
      if (original) Object.defineProperty(HTMLElement.prototype, 'scrollHeight', original);
      else delete (HTMLElement.prototype as unknown as Record<string, unknown>).scrollHeight;
      delete (HTMLElement.prototype as unknown as Record<string, unknown>).clientHeight;
    }
  });
  it('does not add a tab stop when the content fits', () => {
    render(<Artifact open title="Memo">short</Artifact>);
    expect(screen.queryByRole('region')).toBeNull();
  });
  it('forwards ref and className', () => {
    let el: HTMLElement | null = null;
    render(<Artifact open title="Memo" className="x" ref={(n) => { el = n; }} />);
    expect(el).toBeInstanceOf(HTMLElement);
    expect(screen.getByRole('complementary')).toHaveClass('x');
  });
});
