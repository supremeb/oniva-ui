import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThinkingTrace, type ThinkingTraceItem } from './ThinkingTrace';

const items: ThinkingTraceItem[] = [
  { kind: 'step', id: 'a', label: 'Reading briefs' },
  { kind: 'query', id: 'b', query: 'waffle cone supplier' },
  { kind: 'source', id: 'c', title: 'Cone Works', url: 'https://conework.example/x' },
  { kind: 'tool', id: 'd', verb: 'Edit', target: 'schedule.tsx', added: 74, removed: 41 },
  { kind: 'more', id: 'e', count: 7 },
];

describe('ThinkingTrace', () => {
  it('starts closed with the duration label and toggles', () => {
    render(<ThinkingTrace items={items} durationSeconds={4} />);
    const b = screen.getByRole('button', { name: /Thought for 4 seconds/ });
    expect(b).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(b);
    expect(b).toHaveAttribute('aria-expanded', 'true');
  });
  it('renders every item kind when open', () => {
    render(<ThinkingTrace items={items} defaultOpen />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByRole('link', { name: /Cone Works/ })).toHaveAttribute('href', 'https://conework.example/x');
    expect(screen.getByText('+74')).toBeInTheDocument();
    expect(screen.getByText('+7 more')).toBeInTheDocument();
  });
  it('shows a live label while streaming', () => {
    render(<ThinkingTrace items={items} isStreaming />);
    expect(screen.getByRole('button', { name: /Thinking/ })).toBeInTheDocument();
  });
  it('does not render unsafe source links', () => {
    render(<ThinkingTrace items={[{ kind: 'source', id: 'x', title: 'Bad', url: 'javascript:alert(1)' }]} defaultOpen />);
    expect(screen.queryByRole('link')).toBeNull();
  });
  it('announces the label through a live region outside the button', () => {
    render(<ThinkingTrace items={items} durationSeconds={4} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Thought for 4 seconds');
    expect(screen.getByRole('button').contains(status)).toBe(false);
  });
  it('falls back to the title initial and omits the host for an unsafe source url', () => {
    render(<ThinkingTrace items={[{ kind: 'source', id: 'x', title: 'Unverified mirror', url: 'javascript:void(0)' }]} defaultOpen />);
    expect(screen.getByText('U')).toBeInTheDocument();
    expect(screen.getByText('Unverified mirror')).toHaveAttribute('title', 'Unverified mirror');
  });
  it('exposes the full tool target on hover when it is truncated', () => {
    render(<ThinkingTrace items={[{ kind: 'tool', id: 't', verb: 'Edit', target: 'packages/a/very/long/path.ts' }]} defaultOpen />);
    expect(screen.getByText('packages/a/very/long/path.ts')).toHaveAttribute('title', 'packages/a/very/long/path.ts');
  });
});
