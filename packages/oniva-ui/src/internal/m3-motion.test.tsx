import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MessageActions } from '../ai/MessageActions';
import { Composer } from '../ai/Composer';

// Loops (mic ring, trace) only mount while listening; reduced motion is handled by media-query
// branches in the StyleX rules (animationName none / iteration 0), which jsdom cannot evaluate,
// so this checks the components render the static structure without throwing when matchMedia says "reduce".
describe('m3 motion under reduced motion', () => {
  it('renders actions and composer with prefers-reduced-motion', () => {
    window.matchMedia = ((q: string) => ({
      matches: q.includes('reduce'),
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
    const a = render(<MessageActions text="hi" versions={3} onRegenerate={() => {}} />);
    expect(a.getByRole('group', { name: 'Response versions' })).toBeInTheDocument();
    const c = render(<Composer defaultValue="x" />);
    expect(c.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
  });
});
