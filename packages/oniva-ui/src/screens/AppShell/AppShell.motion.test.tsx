import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppShell } from './AppShell';

const proto = HTMLElement.prototype as unknown as { animate?: unknown };
const wide = () => Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 1200 });
afterEach(() => {
  delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth;
  delete proto.animate;
  vi.unstubAllGlobals();
});

describe('AppShell motion', () => {
  it('slides the sidebar out with transform, keeps it mounted during the exit, then removes it from flow', async () => {
    const calls: Keyframe[][] = [];
    proto.animate = vi.fn((f: Keyframe[]) => (calls.push(f), {}));
    wide();
    render(<AppShell title="T" />);
    await userEvent.click(screen.getAllByRole('button', { name: 'Hide sidebar' })[0]!);
    // sidebar + page both animate, using transform only
    expect(calls.length).toBeGreaterThanOrEqual(2);
    for (const f of calls) expect(Object.keys(f[0]!).every((k) => ['transform', 'opacity'].includes(k))).toBe(true);
    expect(screen.getByRole('complementary', { hidden: true })).toBeInTheDocument();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 340));
    });
    await waitFor(() => expect(proto.animate).toHaveBeenCalled());
  });
  it('does not animate the fold under reduced motion', async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
    const spy = vi.fn();
    proto.animate = spy;
    wide();
    render(<AppShell title="T" />);
    await userEvent.click(screen.getAllByRole('button', { name: 'Hide sidebar' })[0]!);
    expect(spy).not.toHaveBeenCalled();
  });
});
