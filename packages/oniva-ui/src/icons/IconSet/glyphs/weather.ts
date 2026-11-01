import { createIcon } from '../createIcon';
import type { Part } from '../shapes';
import { body, circle, cut, dot, head, hole, join, poly, polar, seg, sparkle, stroke } from '../shapes';

// Weather and sky.

// ---- helpers -------------------------------------------------------------------

type Pt = [number, number];
type Lobe = readonly [cx: number, cy: number, r: number];

const r3 = (v: number) => {
  const r = Math.round(v * 100) / 100;
  return String(Object.is(r, -0) ? 0 : r);
};

/** Local frame: `u` runs along the axis (toward `deg`, 0 = up, 90 = right), `v` is perpendicular. */
function frame(cx: number, cy: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return (u: number, v: number) => `${r3(cx + u * c - v * s)} ${r3(cy + u * s + v * c)}`;
}

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

/** Points of the crescent outline (outer arc, then the bite arc back), in order. */
function crescentPts(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): Pt[] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.hypot(dx, dy);
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(r1 * r1 - a * a);
  const px = x1 + (a * dx) / d;
  const py = y1 + (a * dy) / d;
  const A: Pt = [px - (h * dy) / d, py + (h * dx) / d];
  const B: Pt = [px + (h * dy) / d, py - (h * dx) / d];
  const ang = (cx: number, cy: number, p: Pt) => (Math.atan2(p[0] - cx, cy - p[1]) * 180) / Math.PI;
  const sweepCw = (from: number, to: number) => (((to - from) % 360) + 360) % 360;
  const out: Pt[] = [];
  // outer arc A -> B the long way (clockwise in screen terms)
  const a0 = ang(x1, y1, A);
  const s1 = sweepCw(a0, ang(x1, y1, B));
  for (let i = 0; i <= 60; i++) out.push(polar(x1, y1, r1, a0 + (s1 * i) / 60));
  // bite arc B -> A, counter-clockwise around circle 2
  const b0 = ang(x2, y2, B);
  const s2 = sweepCw(ang(x2, y2, A), b0);
  const large = sweepCw(b0, ang(x2, y2, A));
  const sweep = large <= s2 ? large : s2;
  const dir = large <= s2 ? 1 : -1;
  for (let i = 1; i < 40; i++) out.push(polar(x2, y2, r2, b0 + dir * ((sweep * i) / 40)));
  return out;
}

// ---- cloud ---------------------------------------------------------------------

const bearing = (cx: number, cy: number, x: number, y: number) =>
  ((Math.atan2(x - cx, cy - y) * 180) / Math.PI + 360) % 360;

/** Upper crossing point of two lobes. */
function meet([ax, ay, ar]: Lobe, [bx, by, br]: Lobe): Pt {
  const d = Math.hypot(bx - ax, by - ay);
  const a = (ar * ar - br * br + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, ar * ar - a * a));
  const mx = ax + ((bx - ax) * a) / d;
  const my = ay + ((by - ay) * a) / d;
  const p1: Pt = [mx + ((by - ay) * h) / d, my - ((bx - ax) * h) / d];
  const p2: Pt = [mx - ((by - ay) * h) / d, my + ((bx - ax) * h) / d];
  return p1[1] < p2[1] ? p1 : p2;
}

type Lobes = readonly [Lobe, Lobe, Lobe];

function cloudCorners([left, top, right]: Lobes): Pt[] {
  return [
    [left[0], left[1] + left[2]],
    meet(left, top),
    meet(top, right),
    [right[0], right[1] + right[2]],
  ];
}

/** Closed cloud outline from three lobes with a flat base. */
function cloud(lobes: Lobes): string {
  const pts = cloudCorners(lobes);
  let d = `M${r3(pts[0]![0])} ${r3(pts[0]![1])}`;
  lobes.forEach(([cx, cy, r], i) => {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    const sweep = (bearing(cx, cy, x1, y1) - bearing(cx, cy, x0, y0) + 360) % 360;
    d += `A${r3(r)} ${r3(r)} 0 ${sweep > 180 ? 1 : 0} 1 ${r3(x1)} ${r3(y1)}`;
  });
  return `${d}Z`;
}

/** The cloud outline as a dense point loop. */
function cloudPts(lobes: Lobes): Pt[] {
  const c = cloudCorners(lobes);
  const out: Pt[] = [];
  lobes.forEach(([cx, cy, r], i) => {
    const [x0, y0] = c[i]!;
    const [x1, y1] = c[i + 1]!;
    const b0 = bearing(cx, cy, x0, y0);
    const sweep = (bearing(cx, cy, x1, y1) - b0 + 360) % 360;
    const steps = Math.max(8, Math.round((sweep * r) / 14));
    for (let k = 0; k < steps; k++) out.push(polar(cx, cy, r, b0 + (sweep * k) / steps));
  });
  const end = c[3]!;
  const start = c[0]!;
  const n = Math.round(Math.hypot(end[0] - start[0], end[1] - start[1]) / 0.5);
  for (let k = 0; k <= n; k++) out.push([end[0] + ((start[0] - end[0]) * k) / n, end[1]]);
  return out;
}

function inPoly(p: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]!;
    const [xj, yj] = poly[j]!;
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function polyDist(p: Pt, poly: Pt[]): number {
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]!;
    const b = poly[(i + 1) % poly.length]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
    best = Math.min(best, Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy)));
  }
  return best;
}

/** Test: point is farther than `margin` from the cloud and not inside it. */
const clearOf = (lobes: Lobes, margin: number) => {
  const loop = cloudPts(lobes);
  return (p: Pt) => !inPoly(p, loop) && polyDist(p, loop) > margin;
};

/** The parts of a point loop that lie outside `isOut`, as open stroke paths. */
function runs(pts: Pt[], closed: boolean, isOut: (p: Pt) => boolean): string[] {
  const flags = pts.map(isOut);
  const path = (seq: Pt[]) => `M${seq.map(([x, y]) => `${r3(x)} ${r3(y)}`).join('L')}`;
  if (closed && flags.every(Boolean)) return [`${path(pts)}Z`];
  let seq = pts;
  let fl = flags;
  if (closed) {
    const i0 = flags.indexOf(false);
    seq = [...pts.slice(i0 + 1), ...pts.slice(0, i0 + 1)];
    fl = [...flags.slice(i0 + 1), ...flags.slice(0, i0 + 1)];
  }
  const out: string[] = [];
  let cur: Pt[] = [];
  seq.forEach((p, i) => {
    if (fl[i]) cur.push(p);
    else {
      if (cur.length > 1) out.push(path(cur));
      cur = [];
    }
  });
  if (cur.length > 1) out.push(path(cur));
  return out;
}

const circlePts = (cx: number, cy: number, r: number): Pt[] =>
  Array.from({ length: 72 }, (_, i) => polar(cx, cy, r, i * 5));

/** Compact cloud that leaves room for precipitation below. */
const CLOUD_TOP: Lobes = [
  [4.75, 7.25, 2.25],
  [9, 6, 3.75],
  [13.25, 7.25, 2.25],
];

/** Small cloud in the lower right, in front of a sun, moon or second cloud. */
const CLOUD_FRONT: Lobes = [
  [7.75, 12.75, 2.25],
  [11.25, 10.75, 3.5],
  [14, 13, 2.25],
];

const MARGIN = 2.5;

const topCloud = (...below: Part[]): Part[] => [body(cloud(CLOUD_TOP), { tint: true }), ...below];

const plusAt = (cx: number, cy: number, h: number) => join(seg(cx, cy - h, cx, cy + h), seg(cx - h, cy, cx + h, cy));

// ---- clouds with a companion ---------------------------------------------------

export const CloudSunIcon = /*#__PURE__*/ createIcon('CloudSun', () => {
  const ok = clearOf(CLOUD_FRONT, MARGIN);
  const sun: Part[] = runs(circlePts(7, 7, 2), true, ok).map((d) => stroke(d));
  const rays = [270, 315, 0, 45, 90, 135, 180].flatMap((a) => {
    const [x0, y0] = polar(7, 7, 4, a);
    const [x1, y1] = polar(7, 7, 5.25, a);
    return ok([x0, y0]) && ok([x1, y1]) ? [stroke(seg(x0, y0, x1, y1))] : [];
  });
  return [...sun, ...rays, body(cloud(CLOUD_FRONT), { tint: true })];
});

export const CloudMoonIcon = /*#__PURE__*/ createIcon('CloudMoon', () => {
  const ok = clearOf(CLOUD_FRONT, MARGIN);
  const moon = runs(crescentPts(6.5, 6.75, 4.5, 9.25, 5.25, 3.75), true, ok).map((d) => stroke(d));
  return [...moon, body(cloud(CLOUD_FRONT), { tint: true })];
});

export const CloudsIcon = /*#__PURE__*/ createIcon('Clouds', () => {
  const back: Lobes = [
    [4.5, 7.5, 2],
    [7.25, 5.25, 3],
    [10.5, 7, 2],
  ];
  const ok = clearOf(CLOUD_FRONT, MARGIN);
  const peek = runs(cloudPts(back), true, ok).map((d) => stroke(d));
  return [...peek, body(cloud(CLOUD_FRONT), { tint: true })];
});

// ---- clouds with precipitation -------------------------------------------------

export const CloudRainIcon = /*#__PURE__*/ createIcon('CloudRain', () =>
  topCloud(...[6, 9, 12].map((x) => stroke(seg(x, 12.5, x, 15)))),
);

export const CloudDrizzleIcon = /*#__PURE__*/ createIcon('CloudDrizzle', () =>
  topCloud(stroke(seg(6, 12.75, 6, 14)), stroke(seg(9, 12.75, 9, 14)), stroke(seg(12, 12.75, 12, 14))),
);

export const CloudSnowIcon = /*#__PURE__*/ createIcon('CloudSnow', () =>
  topCloud(stroke(plusAt(6.25, 14, 1.5)), stroke(plusAt(11.75, 14, 1.5))),
);

export const CloudHailIcon = /*#__PURE__*/ createIcon('CloudHail', () =>
  topCloud(dot(6, 13, 1.25), dot(12, 13, 1.25), dot(9, 15.25, 1.25)),
);

export const CloudLightningIcon = /*#__PURE__*/ createIcon('CloudLightning', () =>
  topCloud(stroke(poly(10.5, 11.75, 7.75, 14, 10.25, 14, 7.75, 16.25))),
);

export const CloudFogIcon = /*#__PURE__*/ createIcon('CloudFog', () =>
  topCloud(stroke(seg(3.5, 12.5, 14.5, 12.5)), stroke(seg(6, 15.5, 12, 15.5))),
);

// ---- sky -----------------------------------------------------------------------

export const RainIcon = /*#__PURE__*/ createIcon('Rain', () =>
  [
    [8.5, 2.5],
    [14.5, 2.5],
    [5.5, 8.25],
    [11.5, 8.25],
    [8.5, 14],
    [14.5, 14],
  ].map(([x, y]) => stroke(seg(x!, y!, x! - 2.25, y! + 2.25))),
);

export const SnowflakeIcon = /*#__PURE__*/ createIcon('Snowflake', () => [
  stroke(
    join(
      ...[0, 60, 120].map((a) => {
        const [x0, y0] = polar(9, 9, 7, a);
        const [x1, y1] = polar(9, 9, 7, a + 180);
        return seg(x0, y0, x1, y1);
      }),
    ),
  ),
  ...[0, 60, 120, 180, 240, 300].map((a) => {
    const [x, y] = polar(9, 9, 4.75, a);
    return stroke(head(x, y, a + 180, 1.5, 55));
  }),
]);

export const WindIcon = /*#__PURE__*/ createIcon('Wind', () => [
  stroke('M2.5 6H11.25A2 2 0 1 0 9.25 4'),
  stroke('M2.5 9H15'),
  stroke('M2.5 12H11.25A1.9 1.9 0 1 1 9.35 13.9'),
]);

export const TornadoIcon = /*#__PURE__*/ createIcon('Tornado', () => [
  stroke(seg(2.5, 3, 15.5, 3)),
  stroke(seg(4.75, 6, 14.25, 6)),
  stroke(seg(6.5, 9, 12.5, 9)),
  stroke(seg(8, 12, 11.5, 12)),
  dot(10.25, 15, 1),
]);

export const RainbowIcon = /*#__PURE__*/ createIcon('Rainbow', () => [
  body('M2 12.75A7 7 0 0 1 16 12.75Z', { tint: true }),
  cut('M5.25 12.75A3.75 3.75 0 0 1 12.75 12.75'),
]);

export const UmbrellaIcon = /*#__PURE__*/ createIcon('Umbrella', () => [
  body('M2.25 9.25A6.75 6.75 0 0 1 15.75 9.25A2.25 2.25 0 0 0 11.25 9.25A2.25 2.25 0 0 0 6.75 9.25A2.25 2.25 0 0 0 2.25 9.25Z', {
    tint: true,
  }),
  cut('M9 2.5Q6.25 5.25 6.75 9.25'),
  cut('M9 2.5Q11.75 5.25 11.25 9.25'),
  stroke('M9 11.5V14A1.75 1.75 0 0 1 5.5 14'),
]);

// ---- sun and moon --------------------------------------------------------------

const sunHalf = (down: boolean): Part[] => {
  const cx = 9;
  const cy = 13.5;
  const rays = [315, 45].map((a) => {
    const [x0, y0] = polar(cx, cy, 5.5, a);
    const [x1, y1] = polar(cx, cy, 7, a);
    return stroke(seg(x0, y0, x1, y1));
  });
  return [
    body('M5.75 13.5A3.25 3.25 0 0 1 12.25 13.5Z', { tint: true }),
    stroke(seg(2, 13.5, 16, 13.5)),
    ...rays,
    stroke(seg(9, 2.5, 9, 7.25)),
    stroke(down ? head(9, 7.25, 180, 3.5) : head(9, 2.5, 0, 3.5)),
  ];
};

export const SunriseIcon = /*#__PURE__*/ createIcon('Sunrise', () => sunHalf(false));
export const SunsetIcon = /*#__PURE__*/ createIcon('Sunset', () => sunHalf(true));

export const SunDimIcon = /*#__PURE__*/ createIcon('SunDim', () => [
  body(circle(9, 9, 2.75), { tint: true }),
  ...[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
    const [x, y] = polar(9, 9, 6, a);
    return dot(x, y, 1);
  }),
]);

export const SunMediumIcon = /*#__PURE__*/ createIcon('SunMedium', () => [
  body(circle(9, 9, 2.75), { tint: true }),
  ...[0, 90, 180, 270].map((a) => {
    const [x0, y0] = polar(9, 9, 5.5, a);
    const [x1, y1] = polar(9, 9, 7.25, a);
    return stroke(seg(x0, y0, x1, y1));
  }),
  ...[45, 135, 225, 315].map((a) => {
    const [x, y] = polar(9, 9, 6, a);
    return dot(x, y, 1);
  }),
]);

export const MoonStarIcon = /*#__PURE__*/ createIcon('MoonStar', () => [
  body(crescent(7.5, 10.5, 5.5, 11.5, 7.25, 4.75), { tint: true }),
  body(sparkle(13.5, 4.5, 2.5, 0.2)),
]);

export const StarsIcon = /*#__PURE__*/ createIcon('Stars', () => [
  body(sparkle(7.5, 10, 5.25, 0.2), { tint: true }),
  body(sparkle(13.75, 4.5, 2.5, 0.2)),
  body(sparkle(14, 14, 1.75, 0.2)),
]);

// ---- water and temperature -----------------------------------------------------

const drop = (cx: number, top: number, s: number) => {
  const w = 5.25 * s;
  const h = 8.5 * s;
  return `M${r3(cx)} ${r3(top)}Q${r3(cx - w)} ${r3(top + w)} ${r3(cx - w)} ${r3(top + h)}A${r3(w)} ${r3(w)} 0 0 0 ${r3(cx + w)} ${r3(top + h)}Q${r3(cx + w)} ${r3(top + w)} ${r3(cx)} ${r3(top)}Z`;
};

export const DropletsIcon = /*#__PURE__*/ createIcon('Droplets', () => [
  body(drop(6.5, 6, 0.75), { tint: true }),
  body(drop(13, 2.5, 0.5)),
]);

export const HumidityIcon = /*#__PURE__*/ createIcon('Humidity', () => [
  body(drop(9, 2.25, 1), { tint: true }),
  hole(7.5, 10.5, 1),
  hole(10.5, 13.5, 1),
  cut(seg(10.5, 9.5, 7.5, 14.5)),
]);

const thermometer = (cx: number): Part[] => [
  body(`M${cx - 2} 10.764V4.5A2 2 0 0 1 ${cx + 2} 4.5V10.764A3 3 0 1 1 ${cx - 2} 10.764Z`, { tint: true }),
  hole(cx, 13, 1.25),
  cut(seg(cx, 13, cx, 7.5)),
];

export const ThermometerSunIcon = /*#__PURE__*/ createIcon('ThermometerSun', () => [
  ...thermometer(5),
  stroke(circle(12, 7.5, 2)),
  ...[0, 45, 90, 135, 180].map((a) => {
    const [x0, y0] = polar(12, 7.5, 3.75, a);
    const [x1, y1] = polar(12, 7.5, 5, a);
    return stroke(seg(x0, y0, x1, y1));
  }),
]);

export const ThermometerSnowflakeIcon = /*#__PURE__*/ createIcon('ThermometerSnowflake', () => [
  ...thermometer(5),
  stroke(
    join(
      ...[0, 60, 120].map((a) => {
        const [x0, y0] = polar(12.5, 8.5, 3, a);
        const [x1, y1] = polar(12.5, 8.5, 3, a + 180);
        return seg(x0, y0, x1, y1);
      }),
    ),
  ),
]);

export const WavesIcon = /*#__PURE__*/ createIcon('Waves', () =>
  [4.5, 9, 13.5].map((y) => stroke(`M2 ${y}Q3.75 ${y - 2.2} 5.5 ${y}T9 ${y}T12.5 ${y}T16 ${y}`)),
);

// ---- storms and instruments ----------------------------------------------------

export const HurricaneIcon = /*#__PURE__*/ createIcon('Hurricane', () => {
  const arm = (start: number): Part => {
    const pts: Pt[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      pts.push(polar(9, 9, 3.75 + 3.25 * t, start + 230 * t));
    }
    return stroke(`M${pts.map(([x, y]) => `${r3(x)} ${r3(y)}`).join('L')}`);
  };
  return [arm(0), arm(180), body(circle(9, 9, 1.25), { tint: true })];
});

export const LeafWindIcon = /*#__PURE__*/ createIcon('LeafWind', () => {
  const p = frame(11.5, 6.5, 45);
  return [
    body(`M${p(-4.5, 0)}Q${p(0, -6.5)} ${p(4.5, 0)}Q${p(0, 6.5)} ${p(-4.5, 0)}Z`, { tint: true }),
    cut(`M${p(-2.5, 0)}L${p(2.25, 0)}`),
    stroke(`M${p(-4.5, 0)}L${p(-5.75, 0)}`),
    stroke('M2.5 13H10.5A2 2 0 1 1 8.5 15'),
    stroke('M2.5 9.75H4.75'),
  ];
});

export const BarometerIcon = /*#__PURE__*/ createIcon('Barometer', () => [
  body(circle(9, 9, 7), { tint: true }),
  ...[300, 0, 60].map((a) => {
    const [x, y] = polar(9, 9, 4.5, a);
    return hole(x, y, 0.9);
  }),
  cut(seg(9, 9, 10.25, 6.5)),
  hole(9, 9, 1.25),
]);
