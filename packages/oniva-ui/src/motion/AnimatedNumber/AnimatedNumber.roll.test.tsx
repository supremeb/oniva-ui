import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnimatedNumber } from './AnimatedNumber';

type Frames = Keyframe[];
const proto = HTMLElement.prototype as unknown as { animate?: unknown };

afterEach(() => {
  delete proto.animate;
  vi.unstubAllGlobals();
});

describe('AnimatedNumber direction', () => {
  it('rolls up when the value grows past a wrap (9 -> 0 carries forward)', () => {
    const calls: Frames[] = [];
    proto.animate = vi.fn((f: Frames) => (calls.push(f), {}));
    const { rerender } = render(<AnimatedNumber value={9} />);
    rerender(<AnimatedNumber value={10} />);
    const rolls = calls.filter((f) => String(f[0]!.transform).includes('calc'));
    // ones column: 9 -> 0 while growing animates 9 -> 10 (never rolling backwards through 8..1)
    expect(rolls.some((f) => String(f[0]!.transform).includes('9 *') && String(f[1]!.transform).includes('10 *'))).toBe(true);
  });
  it('rolls down when the value shrinks', () => {
    const calls: Frames[] = [];
    proto.animate = vi.fn((f: Frames) => (calls.push(f), {}));
    const { rerender } = render(<AnimatedNumber value={5} />);
    rerender(<AnimatedNumber value={3} />);
    const roll = calls.find((f) => String(f[0]!.transform).includes('5 *'));
    expect(roll && String(roll[1]!.transform)).toContain('3 *');
  });
  it('slides a new column in (9 -> 10 adds a tens digit)', () => {
    const calls: Frames[] = [];
    proto.animate = vi.fn((f: Frames) => (calls.push(f), {}));
    const { rerender } = render(<AnimatedNumber value={9} />);
    rerender(<AnimatedNumber value={10} />);
    expect(calls.some((f) => f[0]!.opacity === 0)).toBe(true);
  });
  it('does not animate under reduced motion', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
    const spy = vi.fn();
    proto.animate = spy;
    const { rerender } = render(<AnimatedNumber value={5} />);
    rerender(<AnimatedNumber value={8} />);
    expect(spy).not.toHaveBeenCalled();
  });
});
