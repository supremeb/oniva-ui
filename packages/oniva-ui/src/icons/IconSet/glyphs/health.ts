import { createIcon } from '../createIcon';
import {
  arc,
  body,
  circle,
  cut,
  dot,
  ellipse,
  join,
  LINED,
  poly,
  polar,
  rect,
  roundPolygon,
  seg,
  SOLID,
  stroke,
} from '../shapes';

// Health and medical.

const r3 = (v: number) => {
  const r = Math.round(v * 1000) / 1000;
  return String(Object.is(r, -0) ? 0 : r);
};

/** Local frame for diagonal glyphs: `u` runs along the axis (toward `deg`, 0 = up, 90 = right), `v` across it. */
function axis(cx: number, cy: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return (u: number, v: number): [number, number] => [cx + u * c - v * s, cy + u * s + v * c];
}
type Frame = ReturnType<typeof axis>;

/** Point as an SVG path coordinate pair. */
const P = (f: Frame, u: number, v: number) => {
  const [x, y] = f(u, v);
  return `${r3(x)} ${r3(y)}`;
};
/** Straight segment in a local frame. */
const ln = (f: Frame, u1: number, v1: number, u2: number, v2: number) => {
  const a = f(u1, v1);
  const b = f(u2, v2);
  return seg(a[0], a[1], b[0], b[1]);
};
/** Rounded polygon in a local frame (u,v pairs). */
const rp = (f: Frame, r: number, ...c: number[]) => {
  const out: number[] = [];
  for (let i = 0; i + 1 < c.length; i += 2) out.push(...f(c[i]!, c[i + 1]!));
  return roundPolygon(r, ...out);
};
/** Plus sign centered at cx,cy with arms of length `a`. */
const plusAt = (cx: number, cy: number, a: number) =>
  join(seg(cx - a, cy, cx + a, cy), seg(cx, cy - a, cx, cy + a));

/** Crescent: circle 1 with circle 2 bitten out of it. */
function crescent(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.hypot(dx, dy);
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(r1 * r1 - a * a);
  const px = x1 + (a * dx) / d;
  const py = y1 + (a * dy) / d;
  const ax = px - (h * dy) / d;
  const ay = py + (h * dx) / d;
  const bx = px + (h * dy) / d;
  const by = py - (h * dx) / d;
  const cosT = (d * d + r2 * r2 - r1 * r1) / (2 * d * r2);
  const large = cosT < 0 ? 1 : 0;
  return `M${r3(ax)} ${r3(ay)}A${r1} ${r1} 0 1 1 ${r3(bx)} ${r3(by)}A${r2} ${r2} 0 ${large} 0 ${r3(ax)} ${r3(ay)}Z`;
}

const HEART =
  'M9 15.25C5.5 13 2.25 10.5 2.25 6.75A3.4 3.4 0 0 1 9 5.25A3.4 3.4 0 0 1 15.75 6.75C15.75 10.5 12.5 13 9 15.25Z';

// ---- crosses and hearts -------------------------------------------------------

export const MedicalCrossIcon = /*#__PURE__*/ createIcon('MedicalCross', () => [
  body(rect(2.5, 2.5, 13, 13, 3), { tint: true }),
  cut(plusAt(9, 9, 2.75)),
]);

export const HeartPlusIcon = /*#__PURE__*/ createIcon('HeartPlus', () => [
  body(HEART, { tint: true }),
  cut(plusAt(9, 9.75, 2)),
]);

export const PulseCircleIcon = /*#__PURE__*/ createIcon('PulseCircle', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(poly(4.5, 9.5, 6.75, 9.5, 8, 6.5, 10, 12, 11.25, 9.5, 13.5, 9.5)),
]);

export const ActivityRingIcon = /*#__PURE__*/ createIcon('ActivityRing', () => [
  stroke(circle(9, 9, 7), { soft: true, only: ['duo', 'fill-duo'] }),
  stroke(circle(9, 9, 3.5), { soft: true, only: ['duo', 'fill-duo'] }),
  stroke(arc(9, 9, 7, 0, 290)),
  stroke(arc(9, 9, 3.5, 0, 210)),
]);

// ---- treatment ----------------------------------------------------------------

export const SyringeIcon = /*#__PURE__*/ createIcon('Syringe', () => {
  const f = axis(9, 9, 45);
  return [
    body(rp(f, 1, -5, -2.25, 3.5, -2.25, 3.5, 2.25, -5, 2.25), { tint: true }),
    cut(ln(f, 0.5, -2.25, 0.5, 2.25)),
    stroke(ln(f, -5, 0, -8, 0)),
    stroke(ln(f, 3.5, -4.25, 3.5, 4.25)),
    stroke(ln(f, 3.5, 0, 7, 0)),
    stroke(ln(f, 7, -2.5, 7, 2.5)),
  ];
});

export const VaccineIcon = /*#__PURE__*/ createIcon('Vaccine', () => [
  body(rect(6, 2, 6, 3, 1.25)),
  body('M7 5V6.5Q5.5 7.25 5.5 9V14A2 2 0 0 0 7.5 16H10.5A2 2 0 0 0 12.5 14V9Q12.5 7.25 11 6.5V5Z', { tint: true }),
  cut(seg(7, 5, 11, 5), { only: SOLID }),
  cut(seg(5.5, 10.5, 12.5, 10.5)),
]);

export const DropperIcon = /*#__PURE__*/ createIcon('Dropper', () => {
  const f = axis(9.25, 8.75, 45);
  const R = (r: number, ...c: number[]) => rp(f, r, ...c);
  return [
    body(R(0.75, 2.25, -1.5, 2.25, 1.5, -3.25, 1.5, -5.5, 0.5, -5.5, -0.5, -3.25, -1.5), {
      tint: true,
    }),
    body(
      `M${P(f, 2.25, -2.25)}L${P(f, 4.75, -2.25)}A2.25 2.25 0 0 1 ${P(f, 4.75, 2.25)}L${P(f, 2.25, 2.25)}Z`,
    ),
    cut(ln(f, 2.25, -2.25, 2.25, 2.25), { only: SOLID }),
    stroke(ln(f, -5.5, 0, -7.25, 0)),
  ];
});

export const BandageIcon = /*#__PURE__*/ createIcon('Bandage', () => {
  const f = axis(9, 9, 45);
  return [
    body(
      `M${P(f, -4.25, -3)}L${P(f, 4.25, -3)}A3 3 0 0 1 ${P(f, 4.25, 3)}L${P(f, -4.25, 3)}A3 3 0 0 1 ${P(f, -4.25, -3)}Z`,
      {
        tint: true,
      },
    ),
    cut(ln(f, -2.5, -3, -2.5, 3)),
    cut(ln(f, 2.5, -3, 2.5, 3)),
  ];
});

export const PillBottleIcon = /*#__PURE__*/ createIcon('PillBottle', () => [
  body(rect(4, 2, 10, 3.5, 1.25)),
  body('M5 5.5V14A2 2 0 0 0 7 16H11A2 2 0 0 0 13 14V5.5Z', { tint: true }),
  cut(seg(5, 5.5, 13, 5.5), { only: SOLID }),
  cut(plusAt(9, 10.75, 2)),
]);

export const PillsIcon = /*#__PURE__*/ createIcon('Pills', () => {
  const f = axis(11.75, 11.75, 45);
  return [
    body(circle(5.5, 5.5, 3), { tint: true }),
    cut(seg(2.5, 5.5, 8.5, 5.5)),
    body(
      `M${P(f, 0, -2.5)}L${P(f, -1.75, -2.5)}A2.5 2.5 0 0 0 ${P(f, -1.75, 2.5)}L${P(f, 0, 2.5)}Z`,
      { tint: true },
    ),
    body(`M${P(f, 0, -2.5)}L${P(f, 1.75, -2.5)}A2.5 2.5 0 0 1 ${P(f, 1.75, 2.5)}L${P(f, 0, 2.5)}Z`),
    cut(ln(f, 0, -2.5, 0, 2.5), { only: SOLID }),
  ];
});

export const InhalerIcon = /*#__PURE__*/ createIcon('Inhaler', () => [
  body(roundPolygon(1.5, 5, 2.5, 10.5, 2.5, 10.5, 9, 15.5, 9, 15.5, 15.5, 5, 15.5), { tint: true }),
  cut(seg(5, 6, 10.5, 6)),
  cut(seg(10.5, 12.25, 15.5, 12.25)),
]);

export const SanitizerIcon = /*#__PURE__*/ createIcon('Sanitizer', () => [
  body(rect(4.5, 7, 9, 9, 2.25), { tint: true }),
  stroke(poly(9, 7, 9, 3.75)),
  stroke(poly(6.25, 3.75, 13.25, 3.75, 13.25, 5.5)),
  cut('M9 9.75Q7.25 11.5 7.25 12.5A1.75 1.75 0 0 0 10.75 12.5Q10.75 11.5 9 9.75Z'),
]);

export const FirstAidKitIcon = /*#__PURE__*/ createIcon('FirstAidKit', () => [
  stroke('M6.5 5.5V4A1.5 1.5 0 0 1 8 2.5H10A1.5 1.5 0 0 1 11.5 4V5.5'),
  body(rect(2, 5.5, 14, 10.5, 2.5), { tint: true }),
  cut(plusAt(9, 10.75, 2.5)),
]);

export const PrescriptionIcon = /*#__PURE__*/ createIcon('Prescription', () => [
  body(rect(3.25, 2, 11.5, 14, 2), { tint: true }),
  cut(poly(6.5, 12.5, 6.5, 5.5)),
  cut('M6.5 5.5H8.5A1.75 1.75 0 0 1 8.5 9H6.5'),
  cut(poly(8.5, 9, 11.5, 12.5)),
]);

// ---- places and transport -----------------------------------------------------

export const ClinicIcon = /*#__PURE__*/ createIcon('Clinic', () => [
  body(rect(2.5, 2.5, 13, 13.5, 2.5), { tint: true }),
  cut(plusAt(9, 7, 2.25)),
  cut('M7.5 16V13.5A1.5 1.5 0 0 1 10.5 13.5V16'),
]);

export const AmbulanceIcon = /*#__PURE__*/ createIcon('Ambulance', () => [
  body(roundPolygon(1, 2, 3.5, 10.75, 3.5, 10.75, 6.5, 13.5, 6.5, 16, 9.5, 16, 12, 2, 12), {
    only: SOLID,
  }),
  cut(circle(5.5, 13.75, 3), { only: SOLID }),
  cut(circle(12.75, 13.75, 3), { only: SOLID }),
  stroke(
    'M3.06 12H3A1 1 0 0 1 2 11V4.5A1 1 0 0 1 3 3.5H9.75A1 1 0 0 1 10.75 4.5V6.5H13.2A1 1 0 0 1 14 6.9' +
      'L15.8 9.3A1 1 0 0 1 16 9.9V11A1 1 0 0 1 15.19 12',
    { only: LINED },
  ),
  stroke(seg(7.94, 12, 10.31, 12), { only: LINED }),
  stroke(seg(10.75, 6.5, 10.75, 12), { only: LINED }),
  cut(plusAt(6.4, 7.75, 2)),
  body(circle(5.5, 13.75, 1.5)),
  body(circle(12.75, 13.75, 1.5)),
]);

export const HospitalBedIcon = /*#__PURE__*/ createIcon('HospitalBed', () => [
  stroke(poly(2.5, 3.5, 2.5, 15.5)),
  stroke(poly(2.5, 13.5, 15.5, 13.5, 15.5, 15.5)),
  body(circle(5.75, 9, 1.75), { tint: true }),
  body('M9 13.5V9.25H13A2.5 2.5 0 0 1 15.5 11.75V13.5Z', { tint: true }),
]);

export const MedicineCabinetIcon = /*#__PURE__*/ createIcon('MedicineCabinet', () => [
  body(rect(3.25, 2, 11.5, 14, 2), { tint: true }),
  cut(plusAt(9, 6.75, 2.25)),
  cut(seg(3.25, 11.5, 14.75, 11.5)),
]);

// ---- body and care ------------------------------------------------------------

export const ToothIcon = /*#__PURE__*/ createIcon('Tooth', () => [
  body(
    'M9 4.4C8 3.2 6.8 2.5 5.5 2.5C3.7 2.5 2.75 4 2.75 5.75C2.75 8 4.25 9 4.75 11.5' +
      'C5.1 13.5 5.3 15.5 6.75 15.5C8 15.5 8 13 9 12.25C10 13 10 15.5 11.25 15.5' +
      'C12.7 15.5 12.9 13.5 13.25 11.5C13.75 9 15.25 8 15.25 5.75C15.25 4 14.3 2.5 12.5 2.5C11.2 2.5 10 3.2 9 4.4Z',
    { tint: true },
  ),
]);

export const LungsIcon = /*#__PURE__*/ createIcon('Lungs', () => [
  stroke(poly(9, 2.25, 9, 6.5)),
  stroke('M9 6.5Q9 9 6.25 9.5'),
  stroke('M9 6.5Q9 9 11.75 9.5'),
  body('M6 6C4.25 6.5 2.75 10 2.5 13C2.4 14.75 3.5 15.75 4.75 15.75C6 15.75 6.5 14.75 6.5 13.5Z', {
    tint: true,
  }),
  body(
    'M12 6C13.75 6.5 15.25 10 15.5 13C15.6 14.75 14.5 15.75 13.25 15.75C12 15.75 11.5 14.75 11.5 13.5Z',
    {
      tint: true,
    },
  ),
]);

export const BoneIcon = /*#__PURE__*/ createIcon('Bone', () => {
  const f = axis(9, 9, 45);
  const R = 1.75;
  const cu = 4.6;
  const cv = 1.7;
  const h = 1;
  const d1 = Math.sqrt(R * R - (cv - h) ** 2);
  const d2 = Math.sqrt(R * R - cv * cv);
  const a = `A${R} ${R} 0 1 1 `;
  return [
    body(
      `M${P(f, cu - d1, -h)}${a}${P(f, cu + d2, 0)}${a}${P(f, cu - d1, h)}L${P(f, -(cu - d1), h)}` +
        `${a}${P(f, -(cu + d2), 0)}${a}${P(f, -(cu - d1), -h)}Z`,
      { tint: true },
    ),
  ];
});

export const BloodDropIcon = /*#__PURE__*/ createIcon('BloodDrop', () => [
  body('M9 2.25Q3.75 7.5 3.75 10.75A5.25 5.25 0 0 0 14.25 10.75Q14.25 7.5 9 2.25Z', { tint: true }),
  cut(plusAt(9, 11, 2)),
]);

export const BloodPressureIcon = /*#__PURE__*/ createIcon('BloodPressure', () => [
  body(circle(6.5, 6.5, 4.5), { tint: true }),
  cut(seg(6.5, 6.5, 8.25, 4.75)),
  stroke('M11 6.5H12.25Q13.5 6.5 13.5 7.75V10.25'),
  body(ellipse(13.5, 13, 2.25, 2.75), { tint: true }),
]);

export const HeartbeatMonitorIcon = /*#__PURE__*/ createIcon('HeartbeatMonitor', () => [
  body(rect(2, 2.75, 14, 9.25, 2.5), { tint: true }),
  cut(poly(4.5, 7.5, 6.75, 7.5, 8, 5.25, 10, 9.75, 11.25, 7.5, 13.5, 7.5)),
  stroke(join(seg(9, 12, 9, 15.25), seg(6, 15.25, 12, 15.25))),
]);

export const VirusIcon = /*#__PURE__*/ createIcon('Virus', () => [
  body(circle(9, 9, 3.5), { tint: true }),
  ...[0, 45, 90, 135, 180, 225, 270, 315].flatMap((deg) => {
    const a = polar(9, 9, 3.5, deg);
    const b = polar(9, 9, 6.25, deg);
    return [stroke(seg(a[0], a[1], b[0], b[1])), dot(b[0], b[1], 1)];
  }),
]);

export const FaceMaskIcon = /*#__PURE__*/ createIcon('FaceMask', () => [
  stroke('M4.5 7H3.75A1.75 1.75 0 0 0 3.75 10.5H4.5'),
  stroke('M13.5 7H14.25A1.75 1.75 0 0 1 14.25 10.5H13.5'),
  body('M4.5 5.75Q9 3.5 13.5 5.75V11Q9 14.5 4.5 11Z', { tint: true }),
  cut('M7 7.75Q9 8.5 11 7.75'),
  cut('M7 10.25Q9 11 11 10.25'),
]);

export const SleepIcon = /*#__PURE__*/ createIcon('Sleep', () => [
  body(crescent(7.5, 10.5, 5.5, 11.25, 8, 4.5), { tint: true }),
  stroke(poly(10.5, 3.25, 14.5, 3.25, 10.5, 7, 14.5, 7)),
]);
