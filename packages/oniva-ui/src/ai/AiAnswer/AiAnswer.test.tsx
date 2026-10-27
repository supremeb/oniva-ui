import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { parseAnswer, trimPartial } from '../../internal/w3-answer-text';
import { AiAnswer } from './AiAnswer';

const sources = [
  { name: 'Wiki', title: 'Q3 close', url: 'https://wiki.example.com/q3' },
  { name: 'Deck', title: 'Board update', url: 'https://docs.example.com/board' },
];
const answer = 'Retention rose to **112%** [1].\n\n- Upgrades [2]\n- Seats [1,2]';

describe('AiAnswer', () => {
  it('parses paragraphs, lists, bold and citations', () => {
    const b = parseAnswer(answer);
    expect(b.map((x) => x.kind)).toEqual(['p', 'ul']);
    expect(trimPartial('Hello **bo')).toBe('Hello ');
    expect(trimPartial('Hello [1')).toBe('Hello ');
  });

  it('renders the finished answer with citations, sources and actions', () => {
    const onFollowUp = vi.fn();
    render(<AiAnswer sources={sources} answer={answer} animate={false} followUps={['Why?']} onFollowUp={onFollowUp} onRegenerate={() => {}} />);
    expect(screen.getAllByRole('link', { name: /Source 1: Q3 close/ }).length).toBeGreaterThan(0);
    expect(screen.getByRole('list', { name: 'Sources' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Regenerate response' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Why?' }));
    expect(onFollowUp).toHaveBeenCalledWith('Why?');
  });

  it('shows Stop while streaming and hides actions', () => {
    const onStop = vi.fn();
    render(<AiAnswer sources={sources} answer="Partial [" isStreaming animate={false} onStop={onStop} />);
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
    expect(onStop).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Copy' })).toBeNull();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<AiAnswer ref={ref} className="extra" answer="Hi" animate={false} />);
    expect(ref.current).toHaveClass('extra');
  });
});
