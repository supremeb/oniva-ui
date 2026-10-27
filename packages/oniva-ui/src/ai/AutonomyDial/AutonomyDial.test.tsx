import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { AutonomyDial, asksFirst, type AgentAction } from './AutonomyDial';

const actions: AgentAction[] = [
  { id: 'read', label: 'Read files', risk: 'safe' },
  { id: 'send', label: 'Send emails', risk: 'risky' },
  { id: 'del', label: 'Delete files', risk: 'destructive' },
];

describe('AutonomyDial', () => {
  it('applies the asksFirst rule', () => {
    expect(asksFirst(actions[0]!, 0)).toBe(true);
    expect(asksFirst(actions[0]!, 1)).toBe(false);
    expect(asksFirst(actions[1]!, 1)).toBe(true);
    expect(asksFirst(actions[1]!, 2)).toBe(false);
    expect(asksFirst(actions[1]!, 2, ['send'])).toBe(true);
  });

  it('groups actions by level and reports changes', () => {
    const onLevelChange = vi.fn();
    render(<AutonomyDial actions={actions} onLevelChange={onLevelChange} />);
    const own = screen.getByRole('region', { name: 'Runs on its own' });
    expect(own).toHaveTextContent('Read files');
    fireEvent.click(screen.getByRole('radio', { name: 'Full auto' }));
    expect(onLevelChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('region', { name: 'Runs on its own' })).toHaveTextContent('Delete files');
  });

  it('toggles locks and moves the action to Asks you first', () => {
    const onPinnedChange = vi.fn();
    render(<AutonomyDial actions={actions} defaultLevel={2} onPinnedChange={onPinnedChange} />);
    const lock = screen.getByRole('button', { name: 'Always ask before: Delete files' });
    expect(lock).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(lock);
    expect(onPinnedChange).toHaveBeenCalledWith(['del']);
    expect(screen.getByRole('region', { name: 'Asks you first' })).toHaveTextContent('Delete files');
  });

  it('moves the level with arrow keys', () => {
    render(<AutonomyDial actions={actions} />);
    const r = screen.getByRole('radio', { name: 'If risky' });
    r.focus();
    fireEvent.keyDown(r, { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'Full auto' })).toBeChecked();
  });

  it('forwards ref and className and has no a11y violations', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<AutonomyDial ref={ref} className="x" actions={actions} />);
    expect(ref.current).toHaveClass('x');
    await expectNoA11yViolations(container);
  });
});
