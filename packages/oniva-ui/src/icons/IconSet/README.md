# Oniva icon set: drawing spec

Oniva draws its own icons. Every glyph is built in code from the geometry helpers in `shapes.ts` and follows the rules
below. These rules are the whole spec: keep new glyphs inside them, or change the spec first.

## Using the glyphs

```tsx
import { BellIcon, Icon } from 'oniva-ui';

<BellIcon size={16} />                          // decorative, aria-hidden
<BellIcon variant="duo" />                      // outline + soft secondary layer
<BellIcon variant="fill" title="Alerts" />      // solid, exposed as role="img"
<BellIcon variant="fill-duo" />                 // solid with a 40% secondary layer
<Icon icon={BellIcon} size="sm" tone="muted" /> // token sizes and tones
```

Props: `size` (px or CSS length, default 24), `variant` (`outline` | `duo` | `fill` | `fill-duo`, default `outline`), `strokeWidth`
(grid units, default 1.5), `title`, `xstyle`, `className`, `style`, `ref`, and any SVG attribute. Color is
`currentColor` in every style, so icons follow text color and themes with no extra work.

## Grid

- Canvas 18 x 18 units (`viewBox="0 0 18 18"`). Coordinates use quarter units (x.0, x.25, x.5, x.75).
- Live area: stroke centerlines stay inside 2 to 16, so the stroke's outer edge stays inside 1.25 to 16.75 and nothing
  touches the canvas edge. Small overshoots (arrow tips, star points) may reach 1.75 to 16.25 at the centerline.
- Keyline shapes (centerline), so a circle, a square and a page look the same size:
  - circle: center 9,9, radius 7
  - square: 2.5 to 15.5, corner radius 2.5
  - landscape: x 2 to 16, y 3.75 to 14.25, corner radius 2.5
  - portrait: x 3.25 to 14.75, y 2 to 16, corner radius 2
- Center on visual mass, not the bounding box (a play triangle shifts right; a bell sits a little high to leave room
  for its clapper).

## Stroke

- One weight per glyph: 1.5 units. No hairlines, no mixed weights.
- Round caps and round joins everywhere (set once on the root `<svg>`).
- Clear space between parallel strokes is at least one stroke width: centerlines 3 units apart or more.
- Details inside a container keep at least 1.5 units of clear space from its inner edge.

## Corners and angles

- Containers use corner radius 2 to 2.5. Small inner rectangles use 1. Sharp outer corners appear only where the point
  is the meaning (arrowheads, chevrons, a pen tip).
- Polygons (triangles, shields, stars) round their corners with `roundPolygon` (radius 1 to 1.5).
- Prefer 0, 45 and 90 degree lines. Free curves are for organic subjects (hearts, clouds, brains, drops).

## Recurring parts

- Arrowhead: `head(x, y, deg, 4.5)`, arms 4.5 long at 45 degrees; the shaft ends on the tip. Use 3.5 arms on small or
  secondary arrows (inside a box, beside a line).
- Chevron: 9 wide, 4.5 tall (`poly(4.5, 6.75, 9, 11.25, 13.5, 6.75)`); double chevrons use 6.5 wide, 3.25 tall.
- Dot: radius 1 (it reads as the same weight as a stroke cap). Dots that stand alone (more, grip) use radius 1.25.
- Modifiers (plus, check, x, slash) sit in the bottom-right 7 x 7 zone (x 11 to 18, y 11 to 18 at the outer edge). The
  base shape is drawn as an open path that stops 1.5 units short of the modifier, so the gap is real in every style.
- "Off" slash: from 2.75,2.75 to 15.25,15.25; the base glyph breaks 1.5 units either side of it.

## Styles

Every glyph is drawn once from parts; the renderer derives the four styles:

| Part     | outline | duo                                       | fill                                   | fill-duo                                        |
| -------- | ------- | ----------------------------------------- | -------------------------------------- | ----------------------------------------------- |
| `body`   | stroke  | stroke, plus a 30% fill when `tint: true` | solid                                  | 40% when `tint: true`, else solid               |
| `stroke` | stroke  | stroke (45% when `soft: true`)            | stroke                                 | stroke (40% when `soft: true`)                  |
| `cut`    | stroke  | stroke                                    | knocked out of the solid, stroke width | solid inside tinted bodies, knocked out elsewhere |
| `dot`    | solid   | solid (45% when `soft: true`, 30% when `tint: true`) | solid                                  | solid (40% when `soft: true`)                   |
| `hole`   | solid   | solid                                     | knocked out                            | solid inside tinted bodies, knocked out elsewhere |

- **Duo** keeps the outline at full strength and adds one secondary layer: the inside of the main shape (a screen, a
  page, an envelope, a bubble) or the second subject (the back person in a group). Tint one area, not everything.
  Glyphs with nothing to tint (chevrons, x, check) render the same as outline.
- **Fill** turns bodies solid and knocks every detail out of them at the stroke width. A cut that crosses a wall splits
  the solid into pieces on purpose (a calendar header, database bands). When the solid needs different geometry, use
  `{ only: SOLID }` and `{ only: LINED }` to swap parts per style.
- Overlapping shapes are drawn as the front shape plus an open "peek" stroke of the shape behind (copy, layers), never
  as two closed shapes on top of each other.
- **Fill-duo** is the solid counterpart of duo: the tinted area drops to 40% and the details inside it turn solid, so
  a status mark reads as a soft disc with a crisp check. Parts marked `only: SOLID` apply to both solid styles.
- No hard-coded colors. Opacity is the only device for the secondary layer.

## Compact drawings (12px optical size)

Common glyphs also have a compact drawing in `compact/`, used automatically at 14px and below (`optical="auto"`; force
with `optical="compact"` or `"regular"`). Compact drawings are redrawn, not shrunk: fewer details, bigger counters.

- Grid 12 × 12 (`viewBox="0 0 12 12"`), stroke 1.25 units (heavier than 1.5/18 for small-size legibility).
- Live area: centerlines inside 1.5 to 10.5. Keylines: circle r 4.75 at 6,6; square 1.75 to 10.25, radius 1.5;
  landscape x 1.25 to 10.75, y 2.5 to 9.5, radius 1.5; portrait x 2.25 to 9.75, y 1.25 to 10.75, radius 1.5.
- Clear space between strokes at least 1 unit (centerlines 2.25 apart). Dots radius 0.75.
- Arrowheads arms 3 at 45 degrees; chevrons 6 wide, 3 tall.
- Drop secondary details first (text lines, inner rings, small ticks); keep the silhouette identical in meaning to the
  18-grid glyph so the two read as one icon. Same parts model and the same four styles.
- Variants generated with `withModifier` derive their compact drawing from the base's: the modifier zone and mark are
  scaled by 2/3 (centre 9.17, cleared radius 3.5).

## Naming

PascalCase subject plus `Icon`; modifiers trail the subject (`BellOffIcon`, `CalendarPlusIcon`, `UserPlusIcon`).
Shape-first names for status marks (`CircleCheckIcon`, `TriangleAlertIcon`). The `data-icon` attribute carries the
kebab-case name.

## Adding a glyph

1. Pick the category file in `glyphs/` and add
   `export const FooIcon = /*#__PURE__*/ createIcon('Foo', () => [ ...parts ]);`
2. Draw with `shapes.ts` helpers (`circle`, `rect`, `seg`, `poly`, `roundPolygon`, `arc`, `head`, `star`, `sparkle`) or a
   hand-written path on the grid.
3. Review it at large size on the grid and at 16 / 24 px in every style:
   `node --experimental-strip-types packages/oniva-ui/scripts/icon-sheet.mjs --file <category> --png sheet.png`.
4. Draw from the subject and this spec only. Never trace, copy or adapt another icon set's paths or distinctive designs.
