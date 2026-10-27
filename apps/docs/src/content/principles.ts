import { counts } from '../lib/site';

/** The six principles. One source: the Principles docs page and the landing's Craft section both read this. */
export interface Principle {
  /** Stable key the landing uses to attach a live proof. */
  id: 'tokens' | 'aria' | 'motion' | 'contrast' | 'names' | 'docs';
  title: string;
  body: string;
}

export const principles: Principle[] = [
  { id: 'tokens', title: 'Tokens, not values', body: 'No hex, no pixel radius in a component. If a token is missing, add the token.' },
  { id: 'aria', title: 'Behavior from React Aria', body: 'Focus, keyboard and ARIA come from react-aria-components. We style it, we do not rebuild it.' },
  { id: 'motion', title: 'Under 300ms', body: 'UI motion stays under 300ms with ease-out. Keyboard-driven actions do not animate.' },
  { id: 'contrast', title: 'Contrast is a token problem', body: 'Fix a failing ratio at the token, then every component inherits the fix.' },
  { id: 'names', title: 'One name per idea', body: `size, tone, variant and is* booleans mean the same on all ${counts.total} components.` },
  { id: 'docs', title: 'Docs are part of the component', body: 'A component ships with anatomy, usage, states, keyboard and props, or it is not done.' },
];
