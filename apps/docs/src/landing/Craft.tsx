import { useRef } from 'react';
import type { AccentName } from 'oniva-ui';
import { Detail } from './craft/Detail';
import { Foundations } from './craft/Foundations';
import { Principles } from './craft/Principles';
import { useVars } from './craft/live';

export interface CraftProps {
  accent: AccentName;
  isDark: boolean;
}

/**
 * Right after the hero: the six principles with a live proof each, the foundations as details on real components
 * (they re-read on theme and accent), and the level of detail as counts.
 */
export function Craft({ accent, isDark }: CraftProps) {
  const root = useRef<HTMLDivElement>(null);
  const vars = useVars(root, `${accent}:${isDark ? 'dark' : 'light'}`);
  return (
    <div ref={root}>
      <Principles vars={vars} />
      <Foundations vars={vars} />
      <Detail />
    </div>
  );
}
