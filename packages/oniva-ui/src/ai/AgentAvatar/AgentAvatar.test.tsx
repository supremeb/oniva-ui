import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { AgentAvatar, initials } from './AgentAvatar';

describe('AgentAvatar', () => {
  it('labels with name and status and shows initials', () => {
    render(<AgentAvatar name="Research Scout" status="working" />);
    expect(screen.getByRole('img', { name: 'Research Scout, working' })).toHaveTextContent('RS');
  });

  it('labels with the name alone when there is no status', () => {
    render(<AgentAvatar name="Atlas Ops" />);
    expect(screen.getByRole('img', { name: 'Atlas Ops' })).toBeInTheDocument();
  });

  it('keeps whole characters for initials and ignores extra whitespace', () => {
    expect(initials('  lumen   fast  ')).toBe('LF');
    expect(initials('Northwind Labs Release Bot')).toBe('NL');
    expect(initials('\u{1F916} Bot')).toBe('\u{1F916}B');
  });

  it('falls back to a named glyph avatar when the name is empty', () => {
    const { container } = render(<AgentAvatar name="  " status="idle" />);
    expect(screen.getByRole('img', { name: 'Agent, idle' })).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('scales the status dot and initials with the diameter', () => {
    const { rerender } = render(<AgentAvatar name="Atlas Ops" status="working" size={16} data-testid="a" />);
    const style = () => screen.getByTestId('a').style;
    expect(style().getPropertyValue('--av-dot')).toBe('6px');
    expect(style().getPropertyValue('--av-fs')).toBe('9px');
    rerender(<AgentAvatar name="Atlas Ops" status="working" size={96} data-testid="a" />);
    expect(style().getPropertyValue('--av-dot')).toBe('16px');
    expect(style().getPropertyValue('--av-fs')).toBe('36px');
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<AgentAvatar name="Atlas Ops" ref={ref} className="extra" />);
    expect(ref.current).toHaveClass('extra');
  });
});
