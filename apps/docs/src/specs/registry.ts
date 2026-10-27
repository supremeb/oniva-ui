import type { ComponentType } from 'react';
import { checkAccentsEven, SPEC_ACCENTS as KIT_ACCENTS, type Swatch } from './kit/spec-kit';
import type { SpecProps } from './types';
import { CheckboxSpec } from './checkbox/CheckboxSpec';
import { CopyButtonSpec } from './_example/CopyButtonSpec';
import { SegmentedControlSpec } from './segmented-control/SegmentedControlSpec';
import { ButtonSpec } from './button/ButtonSpec';
import { SwitchSpec } from './switch/SwitchSpec';
import { TooltipSpec } from './tooltip/TooltipSpec';
import { PopoverSpec } from './popover/PopoverSpec';
import { TabsSpec } from './tabs/TabsSpec';

export interface Poster {
  /** URL slug: `#/specs/<slug>`. Matches the component's docs slug where there is one. */
  slug: string;
  /** Display name. */
  name: string;
  /** Apple system colour from the kit's SYSTEM, unique per poster (see docs/solutions/blueprints-setup.md). */
  accent: Swatch;
  Component: ComponentType<SpecProps>;
}

// Accent per poster, keyed by the `accent="<key>"` string each poster passes to SpecPage. Pre-assigned for the first
// ten; the two unused swatches (red, brown) are for the next posters, then the least-used one.
export const SPEC_ACCENTS: Record<string, Swatch> = {
  button: 'blue',
  switch: 'green',
  checkbox: 'mint',
  'segmented-control': 'indigo',
  tabs: 'teal',
  tooltip: 'orange',
  popover: 'purple',
  dialog: 'pink',
  accordion: 'cyan',
  toast: 'yellow',
  // The pipeline-proof poster (specs/_example, route only). Red is free; give it up when a real poster needs it.
  copy: 'red',
};
Object.assign(KIT_ACCENTS, SPEC_ACCENTS);
checkAccentsEven();

// Ordered list of posters shown on `#/specs`. Workers: import your component and add ONE entry here.
export const posters: Poster[] = [
  { slug: 'checkbox', name: 'Checkbox', accent: 'mint', Component: CheckboxSpec },
  { slug: 'button', name: 'Button', accent: 'blue', Component: ButtonSpec },
  { slug: 'switch', name: 'Switch', accent: 'green', Component: SwitchSpec },
  { slug: 'segmented-control', name: 'Segmented control', accent: 'indigo', Component: SegmentedControlSpec },
  { slug: 'tooltip', name: 'Tooltip', accent: 'orange', Component: TooltipSpec },
  { slug: 'popover', name: 'Dropdown menu', accent: 'purple', Component: PopoverSpec },
  { slug: 'tabs', name: 'Tabs', accent: 'teal', Component: TabsSpec },
];

// Route-only posters (not in the strip): reachable at `#/specs/<slug>`.
export const routeOnly: Poster[] = [{ slug: '_example', name: 'Copy button (pipeline proof)', accent: 'red', Component: CopyButtonSpec }];

export const findPoster = (slug: string) => [...posters, ...routeOnly].find((p) => p.slug === slug);
