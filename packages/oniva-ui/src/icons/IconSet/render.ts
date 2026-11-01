import type { IconVariant, Part } from './shapes';

/** Plain element tree for one icon. `createIcon` turns it into React elements. */
export interface IconNode {
  tag: 'path' | 'g' | 'defs' | 'mask' | 'rect' | 'clipPath';
  attrs: Record<string, string | number>;
  children?: IconNode[];
}

/** Opacity of a tinted body's fill in the duo style. */
export const DUO_TINT = 0.3;
/** Opacity of secondary strokes and dots in the duo style. */
export const DUO_SOFT = 0.45;
/** Opacity of the secondary layer in the solid duo style. */
export const SOLID_DUO_TINT = 0.4;

const solid = { fill: 'currentColor', stroke: 'none' } as const;
const path = (d: string, attrs: Record<string, string | number> = {}): IconNode => ({ tag: 'path', attrs: { d, ...attrs } });

// The solid duo style uses the fill geometry unless a part names `fill-duo` itself.
const shows = (p: Part, v: IconVariant) => {
  if (!p.only) return true;
  const only: readonly IconVariant[] = typeof p.only === 'string' ? [p.only] : p.only;
  return only.includes(v) || (v === 'fill-duo' && only.includes('fill'));
};

const knockMask = (id: string, knock: Part[], grid: number): IconNode => ({
  tag: 'mask',
  attrs: { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: grid, height: grid },
  children: [
    { tag: 'rect', attrs: { width: grid, height: grid, fill: 'white', stroke: 'none' } },
    ...knock.map((p) =>
      p.k === 'cut' ? path(p.d, { stroke: 'black', fill: 'none' }) : path(p.d, { fill: 'black', stroke: 'none' }),
    ),
  ],
});

/**
 * Builds the element tree for one style. Stroke color, width, caps and joins are set once on the
 * root `<svg>` and inherited here, so a `strokeWidth` prop scales every stroke and knock-out together.
 */
export function buildIcon(parts: readonly Part[], variant: IconVariant, maskId: string, grid = 18): IconNode[] {
  const ps = parts.filter((p) => shows(p, variant));

  // A run of `clear` parts erases its region from everything before it; later parts draw on top.
  const ci = ps.findIndex((p) => p.k === 'clear');
  if (ci !== -1) {
    let ce = ci;
    while (ce < ps.length && ps[ce]!.k === 'clear') ce++;
    const id = `${maskId}-x`;
    return [
      {
        tag: 'defs',
        attrs: {},
        children: [
          {
            tag: 'mask',
            attrs: { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: grid, height: grid },
            children: [
              { tag: 'rect', attrs: { width: grid, height: grid, fill: 'white', stroke: 'none' } },
              ...ps.slice(ci, ce).map((p) => path(p.d, { fill: 'black', stroke: 'none' })),
            ],
          },
        ],
      },
      { tag: 'g', attrs: { mask: `url(#${id})` }, children: buildIcon(ps.slice(0, ci), variant, `${maskId}-b`, grid) },
      ...buildIcon(ps.slice(ce), variant, `${maskId}-o`, grid),
    ];
  }

  if (variant === 'fill' || variant === 'fill-duo') {
    const tinted = variant === 'fill-duo' ? ps.filter((p) => p.k === 'body' && p.tint) : [];
    const knock = ps.filter((p) => p.k === 'cut' || p.k === 'hole');
    const softly = (p: Part): Record<string, number> => (variant === 'fill-duo' && p.soft ? { opacity: SOLID_DUO_TINT } : {});
    const draw = ps
      .filter((p) => p.k !== 'cut' && p.k !== 'hole' && !tinted.includes(p))
      .map((p) =>
        p.k === 'body'
          ? path(p.d, { fill: 'currentColor' })
          : p.k === 'dot'
            ? path(p.d, { ...solid, ...softly(p) })
            : path(p.d, softly(p)),
      );
    const out: IconNode[] = [];
    const defs: IconNode[] = [];
    // Solid duo: the tinted bodies become the soft secondary layer...
    for (const p of tinted) out.push(path(p.d, { fill: 'currentColor', opacity: SOLID_DUO_TINT }));
    if (knock.length) {
      defs.push(knockMask(maskId, knock, grid));
      out.push({ tag: 'g', attrs: { mask: `url(#${maskId})` }, children: draw });
    } else out.push(...draw);
    // ...and the details inside them turn solid instead of knocked out.
    if (tinted.length && knock.length) {
      const clipId = `${maskId}-c`;
      defs.push({ tag: 'clipPath', attrs: { id: clipId }, children: tinted.map((p) => path(p.d)) });
      out.push({
        tag: 'g',
        attrs: { clipPath: `url(#${clipId})` },
        children: knock.map((p) => (p.k === 'cut' ? path(p.d) : path(p.d, solid))),
      });
    }
    return defs.length ? [{ tag: 'defs', attrs: {}, children: defs }, ...out] : out;
  }

  const out: IconNode[] = [];
  if (variant === 'duo') {
    for (const p of ps) if (p.tint && p.k === 'body') out.push(path(p.d, { ...solid, opacity: DUO_TINT }));
  }
  for (const p of ps) {
    // A tinted dot is a tint area with no outline (used when the outline itself is an open path).
    const soft: Record<string, number> =
      variant !== 'duo' ? {} : p.soft ? { opacity: DUO_SOFT } : p.tint && p.k === 'dot' ? { opacity: DUO_TINT } : {};
    out.push(p.k === 'dot' || p.k === 'hole' ? path(p.d, { ...solid, ...soft }) : path(p.d, soft));
  }
  return out;
}
