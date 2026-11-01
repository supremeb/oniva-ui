import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContextMeter } from './ContextMeter';

describe('ContextMeter', () => {
  it('shows percent and opens a breakdown', () => {
    render(<ContextMeter max={100000} cost={0.1} breakdown={[{ label: 'Conversation', tokens: 25000 }, { label: 'Tools', tokens: 5000 }]} />);
    const b = screen.getByRole('button', { name: 'Context 30% used' });
    fireEvent.click(b);
    expect(screen.getByText('Conversation')).toBeInTheDocument();
    expect(screen.getByText('25,000')).toBeInTheDocument();
  });

  it('keeps the ring out of the button name and shows the percentage once', () => {
    render(<ContextMeter max={100} breakdown={[{ label: 'Conversation', tokens: 57 }]} />);
    const b = screen.getByRole('button', { name: 'Context 57% used' });
    expect(b.querySelector('[role="progressbar"]')?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(b.textContent).toBe('57%');
  });

  it('clamps at 100% and scales segments to the total when over the window', () => {
    render(<ContextMeter max={100} breakdown={[{ label: 'A', tokens: 100 }, { label: 'B', tokens: 100 }]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Context 100% used' }));
    const segs = Array.from(document.querySelectorAll<HTMLElement>('[aria-hidden="true"] > span[style]'));
    expect(segs.map((s) => s.style.width)).toEqual(['50%', '50%']);
  });

  it('does not produce NaN when max is zero or the breakdown is empty', () => {
    render(<ContextMeter max={0} breakdown={[]} />);
    expect(screen.getByRole('button', { name: 'Context 0% used' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Nothing in context yet.')).toBeInTheDocument();
  });

  it('treats usage with a zero window as full', () => {
    render(<ContextMeter max={0} breakdown={[{ label: 'Conversation', tokens: 500 }]} />);
    expect(screen.getByRole('button', { name: 'Context 100% used' })).toBeInTheDocument();
  });

  it('skips zero-token segments and exposes the full label as a title', () => {
    render(<ContextMeter max={1000} breakdown={[{ label: 'Attached files', tokens: 0 }, { label: 'Conversation', tokens: 500 }]} />);
    fireEvent.click(screen.getByRole('button'));
    expect(document.querySelectorAll('[aria-hidden="true"] > span[style]')).toHaveLength(1);
    expect(screen.getByText('Attached files')).toHaveAttribute('title', 'Attached files');
  });

  it('forwards className and ref to the root', () => {
    let el: HTMLDivElement | null = null;
    render(<ContextMeter className="x" ref={(n) => { el = n; }} max={10} breakdown={[]} />);
    expect(el).not.toBeNull();
    expect(el!.className).toContain('x');
  });
});
