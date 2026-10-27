import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ContextWindow } from '../ai/ContextWindow';
import { PermissionRequest } from '../ai/PermissionRequest';
import { PlanCard } from '../ai/PlanCard';

const mm = (reduce: boolean) =>
  ((q: string) => ({ matches: reduce && q.includes('reduce'), media: q, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, onchange: null, dispatchEvent: () => false })) as unknown as typeof window.matchMedia;
const original = window.matchMedia;

afterEach(() => {
  window.matchMedia = original;
});

// Fold-away rows, ghost lists and the fold-to-one-line card keep their ghosts only while animation is possible;
// under prefers-reduced-motion (and in jsdom) everything switches at once.
describe('R3 motion pass: reduced motion switches at once', () => {
  it('PlanCard removes a step immediately', () => {
    window.matchMedia = mm(true);
    render(<PlanCard steps={[{ id: 'a', title: 'First' }, { id: 'b', title: 'Second' }]} />);
    fireEvent.click(screen.getByRole('button', { name: /Edit/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove step 1' }));
    expect(screen.queryByDisplayValue('First')).toBeNull();
  });

  it('PermissionRequest shows the status line at once', () => {
    window.matchMedia = mm(true);
    render(<PermissionRequest agent={{ name: 'Coder' }} action="push to main" />);
    fireEvent.click(screen.getByRole('button', { name: /Allow/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Allowed');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('ContextWindow drops a removed file at once', () => {
    window.matchMedia = mm(true);
    render(<ContextWindow limit={1000} parts={[{ id: 'f', label: 'Files', items: [{ id: 'x', label: 'a.ts', tokens: 100 }, { id: 'y', label: 'b.ts', tokens: 100 }] }]} />);
    fireEvent.click(screen.getByRole('button', { name: /Files/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove a.ts' }));
    expect(screen.queryByText('a.ts')).toBeNull();
  });
});
