import { createIcon, type IconGlyph } from './createIcon';
import { arc, body, circle, clear, cut, dot, head, LINED, mark, poly, roundPolygon, seg, SOLID, star, stroke, transformParts, type Part } from './shapes';

/**
 * Modifier marks: small badges drawn in the bottom-right zone (centre 13.75, 13.75). `withModifier` erases a
 * radius-5.25 disc from the base glyph first, so the gap is real in every style. Marks stay within radius ~3.25
 * so at least 1.5 units of clear space remain between mark and base.
 */
const C = 13.75;

/** A mark's body: soft-tinted in duo, but always primary (never the 40% layer) in the solid styles. */
const badge = (d: string): Part[] => [body(d, { tint: true, only: LINED }), body(d, { only: SOLID })];

export const MODIFIERS = {
  Plus: () => [stroke(seg(C, C - 2.25, C, C + 2.25)), stroke(seg(C - 2.25, C, C + 2.25, C))],
  Minus: () => [stroke(seg(C - 2.25, C, C + 2.25, C))],
  X: () => [stroke(seg(C - 1.75, C - 1.75, C + 1.75, C + 1.75)), stroke(seg(C + 1.75, C - 1.75, C - 1.75, C + 1.75))],
  Check: () => [stroke(poly(C - 2.25, C + 0.1, C - 0.6, C + 1.75, C + 2.25, C - 1.5))],
  Alert: () => [stroke(seg(C, C - 2.5, C, C + 0.25)), dot(C, C + 2.15, 0.85)],
  Info: () => [stroke(seg(C, C - 0.5, C, C + 2.5)), dot(C, C - 2.4, 0.85)],
  Clock: () => [...badge(circle(C, C, 2.75)), cut(poly(C, C - 1.35, C, C, C + 1, C + 0.75))],
  Lock: () => [
    stroke(`M${C - 1.25} ${C - 0.5}V${C - 1.5}A1.25 1.25 0 0 1 ${C + 1.25} ${C - 1.5}V${C - 0.5}`),
    ...badge(`M${C - 2.25} ${C - 0.5}H${C + 2.25}V${C + 2.75}H${C - 2.25}Z`),
  ],
  Star: () => [...badge(star(C, C + 0.2, 3, 1.4, 5, 0.45))],
  Heart: () => [
    ...badge(`M${C} ${C + 2.6}C${C - 1.9} ${C + 1.45} ${C - 2.9} ${C + 0.35} ${C - 2.9} ${C - 0.95}A1.45 1.45 0 0 1 ${C} ${C - 1.7}A1.45 1.45 0 0 1 ${C + 2.9} ${C - 0.95}C${C + 2.9} ${C + 0.35} ${C + 1.9} ${C + 1.45} ${C} ${C + 2.6}Z`),
  ],
  Search: () => [...badge(circle(C - 0.6, C - 0.6, 1.9)), stroke(seg(C + 0.85, C + 0.85, C + 2.4, C + 2.4))],
  Settings: () => [
    ...badge(circle(C, C, 1.6)),
    ...[0, 60, 120, 180, 240, 300].map((a) => {
      const r = (a * Math.PI) / 180;
      return stroke(seg(C + Math.sin(r) * 2.6, C - Math.cos(r) * 2.6, C + Math.sin(r) * 3, C - Math.cos(r) * 3));
    }),
  ],
  Up: () => [stroke(seg(C, C + 2.6, C, C - 2.4)), stroke(head(C, C - 2.4, 0, 2.4))],
  Down: () => [stroke(seg(C, C - 2.6, C, C + 2.4)), stroke(head(C, C + 2.4, 180, 2.4))],
  Arrow: () => [stroke(seg(C - 2.6, C, C + 2.4, C)), stroke(head(C + 2.4, C, 90, 2.4))],
  Sync: () => [stroke(arc(C, C, 2.5, 30, 300)), stroke(head(C - 2.17, C - 1.25, 30, 1.75))],
  Play: () => [...badge(roundPolygon(0.5, C - 1.5, C - 2.4, C + 2.6, C, C - 1.5, C + 2.4))],
  Pause: () => [stroke(seg(C - 1.1, C - 2.1, C - 1.1, C + 2.1)), stroke(seg(C + 1.1, C - 2.1, C + 1.1, C + 2.1))],
  Edit: () => [...badge(roundPolygon(0.35, C - 2.6, C + 2.6, C - 2.2, C + 0.9, C + 1.2, C - 2.5, C + 2.6, C - 1.1, C - 0.9, C + 2.2))],
  Bolt: () => [...badge(roundPolygon(0.3, C + 0.6, C - 3, C - 2, C + 0.6, C - 0.1, C + 0.6, C - 0.6, C + 3, C + 2, C - 0.6, C + 0.1, C - 0.6))],
  Share: () => [stroke(seg(C - 2.1, C + 2.1, C + 2.1, C - 2.1)), stroke(poly(C - 0.4, C - 2.1, C + 2.1, C - 2.1, C + 2.1, C + 0.4))],
  Dot: () => [mark(circle(C, C, 2.25))],
} satisfies Record<string, () => Part[]>;

export type ModifierName = keyof typeof MODIFIERS;

/**
 * Builds `<Base><Modifier>` from an existing glyph: the base, a cleared disc, then the mark on top. When the base has a
 * compact (12-grid) drawing, the variant gets one too, with the mark and cleared disc scaled by 2/3.
 */
export function withModifier(name: string, base: IconGlyph, mod: ModifierName): IconGlyph {
  const zone = () => [clear(circle(C, C, 5.25)), ...MODIFIERS[mod]()];
  const compactBase = base.compactParts;
  return createIcon(name, () => [...base.parts(), ...zone()], {
    compact: compactBase ? () => [...compactBase(), ...transformParts(zone(), 2 / 3)] : undefined,
  });
}
