// jsdom lacks AnimationEvent; React then ignores `onAnimationEnd`/`onAnimationStart`.
// Must be imported before react-dom (event-name detection happens at module load).
if (typeof window !== 'undefined' && !('AnimationEvent' in window)) {
  (window as unknown as { AnimationEvent: typeof Event }).AnimationEvent = class AnimationEvent extends Event {};
}
export {};
