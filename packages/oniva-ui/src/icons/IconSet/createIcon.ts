import * as stylex from '@stylexjs/stylex';
import { createElement, useId, type ReactElement, type Ref, type SVGAttributes } from 'react';
import { mergeSx } from '../../internal/sx';
import { COMPACT } from './compact';
import { OPTICAL } from './glyphs/optical';
import { buildIcon, type IconNode } from './render';
import { transformParts, type IconVariant, type Part } from './shapes';

export type { IconVariant } from './shapes';

export interface IconGlyphProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'strokeWidth'> {
  /** Rendered width and height (px number or any CSS length). Default 24. */
  size?: number | string;
  /** Drawing style. Default `outline`. */
  variant?: IconVariant;
  /** Stroke width in grid units (the grid is 18). Default 1.5. Knock-outs in `fill` follow it. */
  strokeWidth?: number;
  /**
   * Optical size. `auto` (default) switches to the glyph's 12-unit compact drawing at 14px and below, when it has one;
   * `compact` and `regular` force either drawing.
   */
  optical?: 'auto' | 'compact' | 'regular';
  /** Accessible name. Turns the icon into `role="img"`; without a name (or aria-label) it is hidden. */
  title?: string;
  /** StyleX overrides, applied last. */
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<SVGSVGElement>;
}

/** A drawn glyph component, e.g. `CheckIcon`. */
export interface IconGlyph {
  (props: IconGlyphProps): ReactElement;
  displayName: string;
  /** Glyph name in kebab case, e.g. `chevron-down`. Also set as `data-icon` on the svg. */
  iconName: string;
  /** The glyph's parts on the 18-unit grid. */
  parts: () => readonly Part[];
  /** The glyph's 12-unit compact drawing for small sizes, when it has one. */
  compactParts?: () => readonly Part[];
}

/** Stroke of compact drawings on their 12-unit grid: a little heavier than 18-grid strokes at the same size. */
const COMPACT_STROKE = 1.25;
const COMPACT_MAX_SIZE = 14;

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function toElement(node: IconNode, key: number): ReactElement {
  return createElement(node.tag, { key, ...node.attrs }, ...(node.children ?? []).map(toElement));
}

/**
 * Makes a glyph component from parts drawn on the 18-unit grid. The parts are built on first render
 * and cached, so unused glyphs cost nothing at import time.
 */
export function createIcon(name: string, draw: () => Part[], options: { compact?: () => Part[] } = {}): IconGlyph {
  let cache: readonly Part[] | undefined;
  // Optical scale (generated, see scripts/gen-icon-optical.mjs) brings small drawings up to the spec size.
  const k = OPTICAL[name];
  const parts = () => (cache ??= k ? transformParts(draw(), k, 9 - 9 * k, 9 - 9 * k) : draw());
  const drawCompact = options.compact ?? COMPACT[name];
  let compactCache: readonly Part[] | undefined;
  const compactParts = drawCompact ? () => (compactCache ??= drawCompact()) : undefined;
  const iconName = kebab(name);

  function Glyph({
    size = 24,
    variant = 'outline',
    strokeWidth,
    optical = 'auto',
    title,
    xstyle,
    className,
    style,
    ref,
    ...rest
  }: IconGlyphProps): ReactElement {
    const uid = useId();
    const named = Boolean(title || rest['aria-label'] || rest['aria-labelledby']);
    // Name + width + useId: unique within a root, and harmless if two roots repeat an id (same mask).
    const compact =
      compactParts !== undefined &&
      (optical === 'compact' || (optical === 'auto' && typeof size === 'number' && size <= COMPACT_MAX_SIZE));
    const grid = compact ? 12 : 18;
    // A custom width is given in 18-grid terms; compact drawings keep their slightly heavier ratio to it.
    const sw = compact ? ((strokeWidth ?? 1.5) * COMPACT_STROKE) / 1.5 : (strokeWidth ?? 1.5);
    const maskId = `oniva-${iconName}-${grid}-${String(sw).replace('.', '_')}-${uid.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const nodes = buildIcon(compact ? compactParts() : parts(), variant, maskId, grid);
    return createElement(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: `0 0 ${grid} ${grid}`,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: sw,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        focusable: 'false',
        'aria-hidden': named ? undefined : true,
        role: named ? 'img' : undefined,
        'data-icon': iconName,
        'data-variant': variant,
        'data-optical': compact ? 'compact' : undefined,
        ...rest,
        ref,
        ...mergeSx(stylex.props(xstyle), className, style),
      },
      title ? createElement('title', { key: 't' }, title) : null,
      ...nodes.map(toElement),
    );
  }
  Glyph.displayName = `${name}Icon`;
  Glyph.iconName = iconName;
  Glyph.parts = parts;
  if (compactParts) Glyph.compactParts = compactParts;
  return Glyph;
}
