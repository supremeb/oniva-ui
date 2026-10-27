/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module 'virtual:oniva-craft' {
  /** Build-time facts about the repo, counted from source by the `oniva-craft` plugin in vite.config.ts. */
  const craft: {
    tokens: { total: number; files: number; fontSize: string[]; lineHeight: string[]; space: string[]; radius: string[]; dur: string[]; ease: string[]; ramp: string[]; weight: string[] };
    /** Motion durations as written in the token source (ms), the fallback when reduced motion collapses the live value. */
    durSource: Record<string, number>;
    aria: { components: number; of: number };
    docs: { pages: number; withDemos: number };
    contrast: { checks: number; failing: number; pairs: number; themes: number; accents: number };
    blueprints: { count: number; moments: number };
    tests: { files: number };
    axe: { themes: string[] };
  };
  export default craft;
}
