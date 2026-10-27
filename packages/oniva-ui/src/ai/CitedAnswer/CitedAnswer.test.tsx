import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { markQuote } from '../../internal/w3-answer-text';
import { CitedAnswer } from './CitedAnswer';

const sources = [
  { id: 'a', site: 'Docs', title: 'Caching', quote: 'A cached prefix is read instead of recomputed.', highlight: ['read instead of recomputed'] },
  { id: 'b', site: 'Blog', title: 'Streaming', quote: 'Streaming feels faster.' },
];
const segments = [
  { text: 'Caching reuses prefixes.', cite: ['a', 'missing'] },
  { text: ' Streaming helps.', cite: ['b'] },
];

describe('CitedAnswer', () => {
  it('marks highlight phrases and skips unknown ids', () => {
    expect(markQuote('A cached prefix is read', ['cached prefix'], []).filter((p) => p.mark)[0]!.text).toBe('cached prefix');
    render(<CitedAnswer segments={segments} sources={sources} />);
    expect(screen.getAllByRole('button', { name: /^Source 1: Docs/ })).toHaveLength(2);
  });

  it('opens the preview on press and closes on Escape returning focus to the chip', () => {
    const onPreviewChange = vi.fn();
    render(<CitedAnswer segments={segments} sources={sources} onPreviewChange={onPreviewChange} />);
    const [marker] = screen.getAllByRole('button', { name: /^Source 1: Docs/ });
    fireEvent.click(marker!);
    expect(marker).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Source 1 preview' })).toBeInTheDocument();
    expect(onPreviewChange).toHaveBeenCalledWith('a');
    fireEvent.keyDown(marker!, { key: 'Escape' });
    expect(onPreviewChange).toHaveBeenLastCalledWith(null);
  });

  it('moves between chips with arrow keys', () => {
    render(<CitedAnswer segments={segments} sources={sources} />);
    const chips = screen.getAllByRole('button', { name: /^Source 1: Docs/ });
    const chip = chips[chips.length - 1]!;
    chip.focus();
    fireEvent.keyDown(chip, { key: 'ArrowRight' });
    expect(screen.getAllByRole('button', { name: /^Source 2/ }).pop()).toHaveFocus();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<CitedAnswer ref={ref} className="extra" segments={segments} sources={sources} />);
    expect(ref.current).toHaveClass('extra');
  });
});
