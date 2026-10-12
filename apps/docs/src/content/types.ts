import type { ComponentType, ReactNode } from 'react';

export type Status = 'Stable' | 'Beta' | 'New';
export type PlayProps = Record<string, string | number | boolean>;

/** `group` (optional) overrides the panel section label: segmented/select default to "State", text/number to "Content", toggle to "Options". */
export type ControlDef = { group?: string } & (
  | { kind: 'segmented'; key: string; label: string; options: string[] }
  | { kind: 'select'; key: string; label: string; options: string[] }
  | { kind: 'text'; key: string; label: string; presets?: string[] }
  | { kind: 'toggle'; key: string; label: string }
  | { kind: 'number'; key: string; label: string; min?: number; max?: number; step?: number }
);

export interface AnatomyPart {
  name: string;
  /** 1 to 2 lines, with exact measurements from tokens. */
  description: string;
  /** CSS selector resolved inside the stage's component root. Prefer roles and data attributes. */
  selector: string;
  /** Used when the selector matches nothing. Percent of the stage. */
  fallback?: { x: number; y: number };
}

export interface RuleItem {
  title: string;
  body: ReactNode;
}
export interface DoDontItem {
  kind: 'do' | 'dont';
  caption: string;
  example?: ComponentType;
  text?: string;
}

export type Section =
  | { type: 'rules'; id: string; title: string; intro?: string; items: RuleItem[] }
  | { type: 'numbered'; id: string; title: string; intro?: string; items: RuleItem[] }
  | { type: 'dodont'; id: string; title: string; intro?: string; items: DoDontItem[] }
  | { type: 'text'; id: string; title: string; body: ReactNode }
  | { type: 'itemTypes'; id: string; title: string; intro?: string; items: { name: string; description: string; Render: ComponentType }[] }
  | { type: 'custom'; id: string; title: string; Render: ComponentType };

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface DocPage {
  slug: string;
  status: Status;
  version: string;
  since?: string;
  importName: string;
  /** e.g. ['Components', 'Navigation'] */
  group: string[];
  /** Folder under packages/oniva-ui/src, e.g. 'components/CommandPalette'. */
  sourcePath: string;
  lede: string;
  anatomy: { intro: string; Render: ComponentType; parts: AnatomyPart[] };
  usage: { use: string[]; avoid: { text: string; instead?: { slug: string; label: string } }[] };
  playground: {
    controls: ControlDef[];
    initial: PlayProps;
    render: (props: PlayProps, onEvent: (name: string) => void) => ReactNode;
    code: (props: PlayProps) => string;
  };
  states: { name: string; description: string; Render: ComponentType }[];
  sections: Section[];
  content?: { title?: string; rules: RuleItem[] };
  accessibility: {
    keyboard: { keys: string[]; action: string }[];
    notes: string[];
    reducedMotion?: string;
  };
  props: PropDef[];
  related: string[];
}
