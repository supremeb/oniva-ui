import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TiltCard } from './TiltCard';

describe('TiltCard', () => {
  it('renders and forwards props', () => {
    render(<TiltCard className="x" data-testid="r">hi</TiltCard>);
    expect(screen.getByTestId('r')).toHaveClass('x');
  });
  it('batches pointer moves with rAF and writes tilt variables, then springs back on leave', () => {
    const cbs: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (f: FrameRequestCallback) => cbs.push(f));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    render(<TiltCard maxTilt={10} scale={1.02} data-testid="r">hi</TiltCard>);
    const outer = screen.getByTestId('r');
    outer.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON() {} });
    const inner = outer.firstElementChild as HTMLElement;
    fireEvent.pointerMove(outer, { clientX: 100, clientY: 50, pointerType: 'mouse' });
    fireEvent.pointerMove(outer, { clientX: 100, clientY: 0, pointerType: 'mouse' });
    expect(cbs).toHaveLength(1); // two moves, one frame
    cbs[0]!(0);
    expect(inner.style.getPropertyValue('--ty')).toBe('10.00deg');
    expect(inner.style.getPropertyValue('--tx')).toBe('10.00deg');
    expect(inner.style.getPropertyValue('--ts')).toBe('1.02');
    fireEvent.pointerLeave(outer);
    cbs[1]!(0);
    expect(inner.style.getPropertyValue('--ty')).toBe('0deg');
    expect(inner.style.getPropertyValue('--tilt-dur')).toBe('1000ms');
    vi.unstubAllGlobals();
  });
  it('ignores touch pointers and omits glare when asked', () => {
    const cbs: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (f: FrameRequestCallback) => cbs.push(f));
    const { container } = render(<TiltCard glare={false} data-testid="r">hi</TiltCard>);
    fireEvent.pointerMove(screen.getByTestId('r'), { clientX: 5, clientY: 5, pointerType: 'touch' });
    expect(cbs).toHaveLength(0);
    expect(container.querySelector('[aria-hidden]')).toBeNull();
    vi.unstubAllGlobals();
  });
  it('sets perspective as a custom property', () => {
    render(<TiltCard perspective={600} data-testid="r">hi</TiltCard>);
    expect(screen.getByTestId('r').style.getPropertyValue('--oniva-tilt-persp')).toBe('600px');
  });
});
