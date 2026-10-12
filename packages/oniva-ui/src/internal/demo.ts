import type { ComponentType } from 'react';

/** Demo contract: every `<Name>.demo.tsx` default-exports a `DemoModule`. */
export interface DemoMeta {
  title: string;
  slug: string;
  category: string;
  description: string;
}
export interface Demo {
  name: string;
  /** Source shown in the docs code block. Keep in sync with `Component`. */
  code: string;
  Component: ComponentType;
}
export interface DemoModule {
  meta: DemoMeta;
  demos: Demo[];
}
