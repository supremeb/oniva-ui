import { createIcon } from '../createIcon';
import {
  LINED,
  SOLID,
  body,
  circle,
  cut,
  dot,
  ellipse,
  hole,
  mark,
  polar,
  poly,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  stroke,
  type Part,
} from '../shapes';

// Games and sport.

const holeShape = (d: string): Part => ({ k: 'hole', d });

type Pt = readonly [number, number];

/** Point on a 45 degree axis: `a` runs toward the top right, `b` toward the bottom right. */
const diag = (a: number, b: number, cx = 9, cy = 9): Pt => {
  const k = Math.SQRT1_2;
  return [cx + (a + b) * k, cy + (b - a) * k];
};
const flat = (...p: Pt[]) => p.flatMap(([x, y]) => [x, y]);

/** Corners (top-left, top-right, bottom-right, bottom-left) of a rectangle rotated clockwise by `deg`. */
function tilt(cx: number, cy: number, w: number, h: number, deg: number): [Pt, Pt, Pt, Pt] {
  const t = (deg * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const m = ([dx, dy]: Pt): Pt => [cx + dx * c - dy * s, cy + dx * s + dy * c];
  return [m([-w / 2, -h / 2]), m([w / 2, -h / 2]), m([w / 2, h / 2]), m([-w / 2, h / 2])];
}

/** Intersection of the infinite lines p1-p2 and p3-p4. */
function lineX(p1: Pt, p2: Pt, p3: Pt, p4: Pt): Pt {
  const d1x = p2[0] - p1[0];
  const d1y = p2[1] - p1[1];
  const d2x = p4[0] - p3[0];
  const d2y = p4[1] - p3[1];
  const t = ((p3[0] - p1[0]) * d2y - (p3[1] - p1[1]) * d2x) / (d1x * d2y - d1y * d2x);
  return [p1[0] + d1x * t, p1[1] + d1y * t];
}

// ---- dice and cards -------------------------------------------------------

export const DiceIcon = /*#__PURE__*/ createIcon('Dice', () => [
  body(rect(2.5, 2.5, 13, 13, 3), { tint: true }),
  hole(6, 6, 1),
  hole(12, 6, 1),
  hole(9, 9, 1),
  hole(6, 12, 1),
  hole(12, 12, 1),
]);

export const DicesIcon = /*#__PURE__*/ createIcon('Dices', () => [
  body(rect(2, 7, 9, 9, 2.25), { tint: true }),
  stroke('M7 7V4.25A2.25 2.25 0 0 1 9.25 2H13.75A2.25 2.25 0 0 1 16 4.25V8.75A2.25 2.25 0 0 1 13.75 11H11'),
  hole(5.25, 10.25, 1),
  hole(7.75, 12.75, 1),
  dot(13.5, 6.5, 1),
]);

export const CardsIcon = /*#__PURE__*/ createIcon('Cards', () => {
  const back = tilt(7, 9.25, 8, 11, -12);
  const front = tilt(11.25, 9, 7.5, 10.5, 12);
  const p = lineX(front[0], front[3], back[0], back[1]);
  const q = lineX(front[0], front[3], back[3], back[2]);
  return [
    body(roundPolygon(1.25, ...flat(...front)), { tint: true }),
    stroke(roundPoly(1.25, ...flat(p, back[0], back[3], q))),
    hole(11.25, 9, 1.25),
  ];
});

export const SpadeIcon = /*#__PURE__*/ createIcon('Spade', () => [
  body(
    'M9 2.25C7.5 4.25 3 6.75 3 10.5A3 3 0 0 0 8.1 12.64Q8.3 14.4 6.5 15.75H11.5Q9.7 14.4 9.9 12.64A3 3 0 0 0 15 10.5C15 6.75 10.5 4.25 9 2.25Z',
    { tint: true },
  ),
]);

export const ClubIcon = /*#__PURE__*/ createIcon('Club', () => [
  body(
    'M6.87 6.99A2.75 2.75 0 1 0 8.1 10.93Q8.3 13.8 6.5 15.75H11.5Q9.7 13.8 9.9 10.93A2.75 2.75 0 1 0 11.13 6.99A2.75 2.75 0 1 0 6.87 6.99Z',
    { tint: true },
  ),
]);

export const DiamondSuitIcon = /*#__PURE__*/ createIcon('DiamondSuit', () => [
  body(roundPolygon(1, 9, 2, 13.75, 9, 9, 16, 4.25, 9), { tint: true }),
]);

// ---- board and arcade -------------------------------------------------------

export const ChessPawnIcon = /*#__PURE__*/ createIcon('ChessPawn', () => [
  body('M7.5 7.5H10.5C10.5 10.25 11.75 12.5 13 15H5C6.25 12.5 7.5 10.25 7.5 7.5Z', { tint: true }),
  body(circle(9, 4.75, 2.75)),
  stroke(seg(6.25, 7.5, 11.75, 7.5)),
]);

export const ChessRookIcon = /*#__PURE__*/ createIcon('ChessRook', () => [
  body(
    roundPolygon(0.8, 4.5, 2.5, 7.25, 2.5, 7.25, 4.75, 10.75, 4.75, 10.75, 2.5, 13.5, 2.5, 13.5, 6, 12, 7.5, 12, 12, 13.75, 13.5, 13.75, 15.5, 4.25, 15.5, 4.25, 13.5, 6, 12, 6, 7.5, 4.5, 6),
    { tint: true },
  ),
]);

export const ChessBoardIcon = /*#__PURE__*/ createIcon('ChessBoard', () => {
  const lo = 3.25;
  const s = 11.5 / 3;
  const sq = (c: number, r: number) => rect(lo + c * s, lo + r * s, s, s, 0);
  const dark: [number, number][] = [
    [0, 0],
    [2, 0],
    [1, 1],
    [0, 2],
    [2, 2],
  ];
  const light: [number, number][] = [
    [1, 0],
    [0, 1],
    [2, 1],
    [1, 2],
  ];
  return [
    body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
    ...dark.map(([c, r]) => mark(sq(c, r), { only: LINED })),
    ...light.map(([c, r]) => ({ ...holeShape(sq(c, r)), only: SOLID })),
  ];
});

export const JoystickIcon = /*#__PURE__*/ createIcon('Joystick', () => [
  body(rect(3, 11.5, 12, 4.5, 2), { tint: true }),
  stroke(seg(9, 8, 9, 11.5)),
  body(circle(9, 5, 3)),
  hole(12.5, 13.75, 1),
  cut(seg(5.5, 13.75, 8, 13.75)),
]);

export const SwordIcon = /*#__PURE__*/ createIcon('Sword', () => [
  body(roundPolygon(0.6, ...flat(diag(-1, -1.5), diag(6.5, -1.5), diag(9.25, 0), diag(6.5, 1.5), diag(-1, 1.5))), { tint: true }),
  stroke(seg(...diag(-1, -3.5), ...diag(-1, 3.5))),
  stroke(seg(...diag(-1, 0), ...diag(-6, 0))),
  dot(...diag(-7.5, 0), 1.25),
]);

// ---- balls ------------------------------------------------------------------

const tennisArcs = (): Part[] => {
  const [ax, ay] = polar(9, 9, 7, -40);
  const [bx, by] = polar(9, 9, 7, 220);
  return [
    cut(`M${ax} ${ay}Q9.5 9 ${bx} ${by}`),
    cut(`M${18 - ax} ${ay}Q8.5 9 ${18 - bx} ${by}`),
  ];
};

export const SoccerBallIcon = /*#__PURE__*/ createIcon('SoccerBall', () => {
  const pent: number[] = [];
  const seams: Part[] = [];
  for (let i = 0; i < 5; i++) {
    const [x, y] = polar(9, 9, 3, i * 72);
    const [fx, fy] = polar(9, 9, 5, i * 72);
    const [ax, ay] = polar(9, 9, 7, i * 72 - 36);
    const [bx, by] = polar(9, 9, 7, i * 72 + 36);
    pent.push(x, y);
    seams.push(cut(seg(x, y, fx, fy)), cut(poly(ax, ay, fx, fy, bx, by)));
  }
  return [body(circle(9, 9, 7), { tint: true }), ...seams, holeShape(roundPolygon(0.5, ...pent))];
});

export const BasketballIcon = /*#__PURE__*/ createIcon('Basketball', () => {
  const [ax, ay] = polar(9, 9, 7, -45);
  const [bx, by] = polar(9, 9, 7, 225);
  return [
    body(circle(9, 9, 7), { tint: true }),
    cut(seg(9, 2, 9, 16)),
    cut(seg(2, 9, 16, 9)),
    cut(`M${ax} ${ay}Q6.4 9 ${bx} ${by}`),
    cut(`M${18 - ax} ${ay}Q11.6 9 ${18 - bx} ${by}`),
  ];
});

export const TennisBallIcon = /*#__PURE__*/ createIcon('TennisBall', () => [
  body(circle(9, 9, 7), { tint: true }),
  ...tennisArcs(),
]);

export const BaseballIcon = /*#__PURE__*/ createIcon('Baseball', () => {
  const [ax, ay] = polar(9, 9, 7, -40);
  const [bx, by] = polar(9, 9, 7, 220);
  const ticks: Part[] = [];
  for (const t of [0.28, 0.5, 0.72]) {
    const x = (1 - t) * (1 - t) * ax + 2 * t * (1 - t) * 9.5 + t * t * bx;
    const y = (1 - t) * (1 - t) * ay + 2 * t * (1 - t) * 9 + t * t * by;
    ticks.push(cut(seg(x, y, x - 1.6, y)));
    ticks.push(cut(seg(18 - x, y, 18 - x + 1.6, y)));
  }
  return [
    body(circle(9, 9, 7), { tint: true }),
    cut(`M${ax} ${ay}Q9.5 9 ${bx} ${by}`),
    cut(`M${18 - ax} ${ay}Q8.5 9 ${18 - bx} ${by}`),
    ...ticks,
  ];
});

export const AmericanFootballIcon = /*#__PURE__*/ createIcon('AmericanFootball', () => [
  body('M3 15Q4 4 15 3Q14 14 3 15Z', { tint: true }),
  cut(seg(...diag(-4, 0), ...diag(4, 0))),
  cut(seg(...diag(-1.8, -1.1), ...diag(-1.8, 1.1))),
  cut(seg(...diag(1.8, -1.1), ...diag(1.8, 1.1))),
]);

export const BowlingBallIcon = /*#__PURE__*/ createIcon('BowlingBall', () => [
  body(circle(9, 9, 7), { tint: true }),
  hole(7.25, 6.75, 1),
  hole(10.75, 6.75, 1),
  hole(9, 10.5, 1),
]);

export const BowlingPinIcon = /*#__PURE__*/ createIcon('BowlingPin', () => [
  body(
    'M9 2C10.4 2 11 3.1 11 4.2C11 6 10 6.75 10.25 8C10.75 9.75 13 11 13 13.25C13 15 11.5 16 9 16C6.5 16 5 15 5 13.25C5 11 7.25 9.75 7.75 8C8 6.75 7 6 7 4.2C7 3.1 7.6 2 9 2Z',
    { tint: true },
  ),
]);

export const PingPongIcon = /*#__PURE__*/ createIcon('PingPong', () => [
  body(circle(8, 6.75, 4.75), { tint: true }),
  body(rect(6.5, 11.5, 3, 4.5, 1)),
  dot(14.5, 12.5, 1.5),
]);

export const GolfIcon = /*#__PURE__*/ createIcon('Golf', () => [
  body(roundPolygon(0.8, 10, 2.75, 15, 5.25, 10, 7.75), { tint: true }),
  stroke(seg(10, 2.75, 10, 14)),
  stroke(ellipse(9, 14.25, 6.5, 1.75)),
]);

// ---- gym and water ------------------------------------------------------------

export const DumbbellIcon = /*#__PURE__*/ createIcon('Dumbbell', () => [
  body(rect(3.75, 4, 3.25, 10, 1.5), { tint: true }),
  body(rect(11, 4, 3.25, 10, 1.5), { tint: true }),
  stroke(seg(7, 9, 11, 9)),
  stroke(seg(2, 9, 3.75, 9)),
  stroke(seg(14.25, 9, 16, 9)),
]);

export const KettlebellIcon = /*#__PURE__*/ createIcon('Kettlebell', () => [
  body('M3.75 11A5.25 5.25 0 0 1 14.25 11C14.25 13.75 13 15.5 11.25 15.5H6.75C5 15.5 3.75 13.75 3.75 11Z', { tint: true }),
  stroke('M6.25 6.5V4.75A2.75 2.75 0 0 1 11.75 4.75V6.5'),
]);

export const SwimIcon = /*#__PURE__*/ createIcon('Swim', () => [
  dot(13, 5, 1.5),
  stroke('M3.5 9.5Q6.5 5 10 7.25'),
  stroke('M2 12.5Q3.75 10.75 5.5 12.5T9 12.5T12.5 12.5T16 12.5'),
  stroke('M2 15.75Q3.75 14 5.5 15.75T9 15.75T12.5 15.75T16 15.75'),
]);

export const WhistleIcon = /*#__PURE__*/ createIcon('Whistle', () => [
  body(
    'M7.67 7H3.75A1 1 0 0 0 2.75 8V9.5A1 1 0 0 0 3.75 10.5H6A4.5 4.5 0 1 0 7.67 7Z',
    { tint: true },
  ),
  hole(10.5, 10.5, 1.25),
  stroke(seg(10.5, 6, 10.5, 4)),
]);

export const GoalIcon = /*#__PURE__*/ createIcon('Goal', () => [
  body(rect(2.5, 3.5, 13, 11, 2), { tint: true }),
  cut(seg(6.85, 3.5, 6.85, 14.5)),
  cut(seg(11.15, 3.5, 11.15, 14.5)),
  cut(seg(2.5, 9, 15.5, 9)),
]);

// ---- gear -------------------------------------------------------------------

export const SkateboardIcon = /*#__PURE__*/ createIcon('Skateboard', () => [
  stroke('M2 6C2.5 6 3 8.25 5 8.25H13C15 8.25 15.5 6 16 6'),
  stroke(seg(5.5, 8.25, 5.5, 10.5)),
  stroke(seg(12.5, 8.25, 12.5, 10.5)),
  body(circle(5.5, 13, 2)),
  body(circle(12.5, 13, 2)),
]);

export const SkiIcon = /*#__PURE__*/ createIcon('Ski', () => {
  const ski = (b: number) =>
    roundPolygon(0.8, ...flat(diag(-6, b - 1.25), diag(3.5, b - 1.25), diag(6.5, b), diag(3.5, b + 1.25), diag(-6, b + 1.25)));
  const bind = (b: number) => cut(seg(...diag(-1.25, b - 1.25), ...diag(-1.25, b + 1.25)));
  return [body(ski(-2.75), { tint: true }), body(ski(2.75), { tint: true }), bind(-2.75), bind(2.75)];
});

export const HelmetIcon = /*#__PURE__*/ createIcon('Helmet', () => [
  body('M2.5 12.5C2.5 7 5.25 3.5 9.25 3.5C13 3.5 15.5 6.25 15.5 10V12.5Z', { tint: true }),
  cut(seg(10.5, 8, 15.5, 8)),
  stroke(seg(5.5, 12.5, 5.5, 15)),
  stroke(seg(12.5, 12.5, 12.5, 15)),
]);

export const ScoreboardIcon = /*#__PURE__*/ createIcon('Scoreboard', () => [
  body(rect(2, 2.75, 14, 9.75, 2.5), { tint: true }),
  cut(poly(4.75, 6.75, 6, 5.5, 6, 9.75)),
  cut(rect(10.5, 5.5, 3, 4.5, 1.25)),
  stroke(seg(5.5, 12.5, 5.5, 15.5)),
  stroke(seg(12.5, 12.5, 12.5, 15.5)),
]);
