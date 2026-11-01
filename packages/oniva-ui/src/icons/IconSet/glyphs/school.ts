import { createIcon } from '../createIcon';
import {
  arc,
  body,
  circle,
  cut,
  dot,
  hole,
  poly,
  polar,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  SOLID,
  LINED,
  stroke,
} from '../shapes';

// School and education.

const r3 = (v: number) => Math.round(v * 1000) / 1000;

/** Point `u` right and `v` down from a pivot, turned by `deg` clockwise. */
function turn(cx: number, cy: number, deg: number, u: number, v: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [r3(cx + u * Math.cos(a) - v * Math.sin(a)), r3(cy + u * Math.sin(a) + v * Math.cos(a))];
}

/** Ellipse turned by `deg` about its center. */
function tiltedEllipse(cx: number, cy: number, rx: number, ry: number, deg: number): string {
  const [x1, y1] = turn(cx, cy, deg, -rx, 0);
  const [x2, y2] = turn(cx, cy, deg, rx, 0);
  return `M${x1} ${y1}A${rx} ${ry} ${deg} 1 0 ${x2} ${y2}A${rx} ${ry} ${deg} 1 0 ${x1} ${y1}Z`;
}

export const GraduationCapIcon = /*#__PURE__*/ createIcon('GraduationCap', () => [
  stroke('M5.25 8.5V11.75Q9 15 12.75 11.75V8.5'),
  body(roundPolygon(1, 9, 3, 16, 6.5, 9, 10, 2, 6.5), { tint: true }),
  stroke(seg(16, 6.5, 16, 11.5)),
]);

export const BookIcon = /*#__PURE__*/ createIcon('Book', () => [
  body(rect(3.5, 2, 11, 14, 2), { tint: true }),
  cut(seg(6.75, 2, 6.75, 16)),
  cut(seg(9.5, 6, 12, 6)),
  cut(seg(9.5, 9, 12, 9)),
]);

export const BooksIcon = /*#__PURE__*/ createIcon('Books', () => [
  body(
    'M2.5 15.5V4Q2.5 3 3.5 3H5.5Q6.5 3 6.5 4V6Q6.5 5 7.5 5H9.5Q10.5 5 10.5 6V4.5Q10.5 3.5 11.5 3.5H13.5Q14.5 3.5 14.5 4.5V15.5Z',
    { tint: true },
  ),
  cut(seg(6.5, 6.5, 6.5, 15.5)),
  cut(seg(10.5, 6.5, 10.5, 15.5)),
  cut(seg(2.5, 7, 6.5, 7)),
  cut(seg(10.5, 7.5, 14.5, 7.5)),
]);

export const LibraryIcon = /*#__PURE__*/ createIcon('Library', () => [
  body(roundPolygon(1, 9, 2.5, 15.75, 5.5, 2.25, 5.5), { tint: true }),
  stroke(seg(4.5, 8.5, 4.5, 12)),
  stroke(seg(9, 8.5, 9, 12)),
  stroke(seg(13.5, 8.5, 13.5, 12)),
  stroke(seg(2.25, 15, 15.75, 15)),
]);

export const BackpackIcon = /*#__PURE__*/ createIcon('Backpack', () => [
  stroke('M7 5.5V4.25Q7 2.25 9 2.25Q11 2.25 11 4.25V5.5'),
  body(rect(3.5, 5.25, 11, 10.75, [4.5, 4.5, 2.5, 2.5]), { tint: true }),
  cut(seg(3.5, 9.5, 14.5, 9.5)),
  cut('M6.5 16V12.75A1 1 0 0 1 7.5 11.75H10.5A1 1 0 0 1 11.5 12.75V16'),
]);

export const SchoolIcon = /*#__PURE__*/ createIcon('School', () => [
  body(roundPolygon(1.25, 2.5, 15.5, 2.5, 8.5, 9, 4.5, 15.5, 8.5, 15.5, 15.5), { tint: true }),
  stroke('M9 4.5V2'),
  stroke(roundPoly(0.5, 9, 2, 12, 3, 9, 4)),
  cut('M7.25 15.5V12.75A1.75 1.75 0 0 1 10.75 12.75V15.5'),
  hole(9, 8.75, 1.25),
]);

export const CertificateIcon = /*#__PURE__*/ createIcon('Certificate', () => [
  body(rect(2, 2.75, 14, 12.5, 2.5), { tint: true }),
  cut(seg(5.25, 6, 12.75, 6)),
  cut(seg(5.25, 9, 8, 9)),
  hole(12, 11.5, 1.75),
]);

export const RadicalIcon = /*#__PURE__*/ createIcon('Radical', () => [
  stroke(roundPoly(1, 2.25, 10, 4.25, 8.75, 7, 14.5, 10.5, 3.5, 15.75, 3.5)),
]);

export const AtomIcon = /*#__PURE__*/ createIcon('Atom', () => [
  stroke(tiltedEllipse(9, 9, 7.25, 2.75, 0)),
  stroke(tiltedEllipse(9, 9, 7.25, 2.75, 60)),
  stroke(tiltedEllipse(9, 9, 7.25, 2.75, 120)),
  dot(9, 9, 1.25),
]);

export const MicroscopeIcon = /*#__PURE__*/ createIcon('Microscope', () => {
  const p = (u: number, v: number) => turn(9, 6.25, -20, u, v);
  const c = [p(-1.5, -4), p(1.5, -4), p(1.5, 4), p(-1.5, 4)].flat();
  return [
    body(roundPolygon(0.75, ...c), { tint: true }),
    stroke(arc(8.5, 10, 5.25, 25, 160)),
    stroke(seg(3.5, 12, 9.25, 12)),
    stroke(seg(3.5, 15.5, 14.5, 15.5)),
  ];
});

export const DnaIcon = /*#__PURE__*/ createIcon('Dna', () => [
  stroke('M5.5 2C5.5 6 12.5 5 12.5 9C12.5 13 5.5 12 5.5 16'),
  stroke('M12.5 2C12.5 6 5.5 5 5.5 9C5.5 13 12.5 12 12.5 16'),
  stroke(seg(7.75, 9, 10.25, 9)),
]);

export const BeakerIcon = /*#__PURE__*/ createIcon('Beaker', () => [
  body('M5 2.75H13V13.75A1.75 1.75 0 0 1 11.25 15.5H6.75A1.75 1.75 0 0 1 5 13.75Z', { tint: true }),
  stroke(seg(3.5, 2.75, 5, 2.75)),
  stroke(seg(13, 2.75, 14.5, 2.75)),
  cut(seg(13, 6, 10.5, 6)),
  cut(seg(13, 9, 11.5, 9)),
  cut(seg(13, 12, 10.5, 12)),
]);

/** Tube from the open mouth at `mx, my`, `len` long and `hw` half-wide, leaning `deg`. */
function tube(mx: number, my: number, deg: number, len: number, hw: number): string {
  const p = (u: number, v: number) => turn(mx, my, deg, u, v);
  const [a, b, c, d] = [p(-hw, 0), p(hw, 0), p(hw, len - hw), p(-hw, len - hw)];
  return `M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${c[0]} ${c[1]}A${hw} ${hw} 0 0 1 ${d[0]} ${d[1]}Z`;
}

export const TestTubeIcon = /*#__PURE__*/ createIcon('TestTube', () => {
  const p = (u: number, v: number) => turn(12.25, 3.25, 40, u, v);
  const [l1, l2] = [p(-1.75, 5), p(1.75, 5)];
  const [r1, r2] = [p(-3.25, 0), p(3.25, 0)];
  return [
    body(tube(12.25, 3.25, 40, 12, 1.75), { tint: true }),
    cut(seg(l1[0], l1[1], l2[0], l2[1])),
    stroke(seg(r1[0], r1[1], r2[0], r2[1])),
  ];
});

export const TestTubesIcon = /*#__PURE__*/ createIcon('TestTubes', () => [
  body('M3.5 3H7.5V12.5A2 2 0 0 1 3.5 12.5Z', { tint: true }),
  body('M10.5 3H14.5V12.5A2 2 0 0 1 10.5 12.5Z'),
  cut(seg(3.5, 8.5, 7.5, 8.5)),
  cut(seg(10.5, 10, 14.5, 10)),
]);

export const BlackboardIcon = /*#__PURE__*/ createIcon('Blackboard', () => [
  body(rect(2.25, 2.5, 13.5, 9.5, 2), { tint: true }),
  cut('M5.25 8.25Q6.75 5.25 8.25 8.25T11.25 8.25'),
  stroke(poly(5.5, 12, 4.25, 15.75)),
  stroke(poly(12.5, 12, 13.75, 15.75)),
]);

export const AbacusIcon = /*#__PURE__*/ createIcon('Abacus', () => {
  const beads: [number, number][] = [
    [6, 6.75],
    [9, 6.75],
    [9.5, 11.25],
    [12.5, 11.25],
  ];
  return [
    body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
    cut(seg(2.5, 6.75, 15.5, 6.75)),
    cut(seg(2.5, 11.25, 15.5, 11.25)),
    ...beads.map(([x, y]) => dot(x, y, 1.5, { only: LINED })),
    ...beads.map(([x, y]) => hole(x, y, 1.5, { only: SOLID })),
  ];
});

export const GlobeStandIcon = /*#__PURE__*/ createIcon('GlobeStand', () => [
  stroke(arc(9, 7, 7, 100, 260)),
  body(circle(9, 7, 4), { tint: true }),
  cut(seg(5, 7, 13, 7)),
  stroke(seg(9, 14, 9, 15.5)),
  stroke(seg(6.5, 15.75, 11.5, 15.75)),
]);

export const PuzzlePieceIcon = /*#__PURE__*/ createIcon('PuzzlePiece', () => [
  body(
    'M2.75 5.75H7.5A2 2 0 1 1 10.5 5.75H12.75V8.5A2 2 0 1 1 12.75 11.5V15.75H10.5A2 2 0 1 0 7.5 15.75H2.75V12.5A2 2 0 1 0 2.75 9.5Z',
    { tint: true },
  ),
]);

export const SetSquareIcon = /*#__PURE__*/ createIcon('SetSquare', () => [
  body(roundPolygon(1.25, 2.5, 2.5, 2.5, 15.5, 15.5, 15.5), { tint: true }),
  cut(roundPolygon(0.5, 5.5, 9.5, 5.5, 12.5, 8.5, 12.5)),
]);

export const ProtractorIcon = /*#__PURE__*/ createIcon('Protractor', () => {
  const tick = (deg: number) => {
    const [x1, y1] = polar(9, 12.5, 3.5, deg);
    const [x2, y2] = polar(9, 12.5, 7, deg);
    return cut(seg(x1, y1, x2, y2));
  };
  return [body('M2 12.5A7 7 0 0 1 16 12.5Z', { tint: true }), tick(-45), tick(0), tick(45)];
});

export const SigmaIcon = /*#__PURE__*/ createIcon('Sigma', () => [
  stroke(roundPoly(1, 13.25, 3.5, 4.75, 3.5, 9.75, 9, 4.75, 14.5, 13.25, 14.5)),
]);

export const PiIcon = /*#__PURE__*/ createIcon('Pi', () => [
  stroke(seg(3, 4, 15, 4)),
  stroke(seg(6.25, 4, 6.25, 14.5)),
  stroke('M11.75 4V12.25Q11.75 14.5 14 14.5'),
]);

export const DivideIcon = /*#__PURE__*/ createIcon('Divide', () => [
  stroke(seg(3.5, 9, 14.5, 9)),
  dot(9, 4.5, 1.25),
  dot(9, 13.5, 1.25),
]);

export const EqualsIcon = /*#__PURE__*/ createIcon('Equals', () => [
  stroke(seg(3.5, 6.5, 14.5, 6.5)),
  stroke(seg(3.5, 11.5, 14.5, 11.5)),
]);

export const PlusMinusIcon = /*#__PURE__*/ createIcon('PlusMinus', () => [
  stroke(seg(5.5, 6, 12.5, 6)),
  stroke(seg(9, 2.5, 9, 9.5)),
  stroke(seg(5.5, 14.5, 12.5, 14.5)),
]);

export const QuizIcon = /*#__PURE__*/ createIcon('Quiz', () => [
  body(rect(3.25, 2, 11.5, 14, 2), { tint: true }),
  cut('M7.25 7.25A1.75 1.75 0 1 1 10.75 7.25C10.75 8.5 9 8.75 9 10.25'),
  hole(9, 12.75, 1),
]);

export const BrainCircuitIcon = /*#__PURE__*/ createIcon('BrainCircuit', () => [
  body(
    'M9 4C8.25 2.5 5.5 2.4 4.75 4.5C2.75 4.75 2.25 7.25 3.25 8.5C2.25 9.75 2.75 12 4.5 12.5C4.5 14.25 6.5 15.25 8 14.5C8.5 14.75 8.75 14.75 9 14.5' +
      'C9.25 14.75 9.5 14.75 10 14.5C11.5 15.25 13.5 14.25 13.5 12.5C15.25 12 15.75 9.75 14.75 8.5C15.75 7.25 15.25 4.75 13.25 4.5C12.5 2.4 9.75 2.5 9 4Z',
    { tint: true },
  ),
  cut(poly(9, 4, 9, 6.5, 6.5, 9)),
  cut(poly(9, 14.5, 9, 12, 11.5, 9.5)),
  hole(6.5, 9, 1),
  hole(11.5, 9.5, 1),
]);

export const LanguageBookIcon = /*#__PURE__*/ createIcon('LanguageBook', () => [
  body(rect(3.25, 2, 11.5, 14, 2), { tint: true }),
  cut(seg(6.5, 2, 6.5, 16)),
  cut(poly(8.5, 12.5, 10.5, 6.5, 12.5, 12.5)),
  cut(seg(9.25, 10.5, 11.75, 10.5)),
]);

export const TeacherIcon = /*#__PURE__*/ createIcon('Teacher', () => [
  body(rect(7.75, 2.5, 8.25, 8.5, 2), { tint: true }),
  cut(seg(10.25, 5.5, 13.5, 5.5)),
  cut(seg(10.25, 8, 12.25, 8)),
  body(circle(4.25, 6.75, 1.75)),
  body('M2 15.5C2 13 3 11.5 4.25 11.5S6.5 13 6.5 15.5Z'),
]);

export const AppleIcon = /*#__PURE__*/ createIcon('Apple', () => [
  body('M9 5.25C7.5 4.25 3.5 4.5 3.5 9.25C3.5 12.5 5.5 15.75 7.5 15.75Q9 15.75 9 15.25Q9 15.75 10.5 15.75C12.5 15.75 14.5 12.5 14.5 9.25C14.5 4.5 10.5 4.25 9 5.25Z', {
    tint: true,
  }),
  stroke('M9 5.25Q9 3.25 10.5 2'),
]);

