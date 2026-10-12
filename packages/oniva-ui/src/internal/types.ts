/** Shared prop vocabularies. Import these instead of re-declaring unions inline. */

/** Default control sizes. Narrow with `Extract<ControlSize, 'sm' | 'md'>` when a component supports fewer. */
export type ControlSize = 'sm' | 'md' | 'lg';

/** Button-family sizes (adds the dense `xs`). */
export type ButtonSize = 'xs' | ControlSize;

/** Semantic status palette (Alert, Tag, Badge, Progress). */
export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
