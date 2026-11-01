import type { ReactNode } from 'react';

/** Throwaway state workbench. One folder per component: `states/<slug>/index.tsx` default-exports a `StateModule`. */
export interface StateEntry {
  /** URL value for `__state`, kebab-case in the product's words: `empty`, `streaming`, `tool-error`. */
  id: string;
  label: string;
  /** Renders the real component with fixture data for this state. Remounted on every switch. */
  render: () => ReactNode;
}

export interface StateGroup {
  /** What changes across this group: `Data`, `Run`, `Access`, `Size`. */
  label: string;
  states: StateEntry[];
}

export interface StateModule {
  /** Matches the component's demo slug. */
  slug: string;
  title: string;
  /** Container width the component has in production. Defaults to 720. */
  width?: number | string;
  groups: StateGroup[];
  /** States the design implies but the code cannot reach; listed, not rendered. */
  missing?: string[];
}
