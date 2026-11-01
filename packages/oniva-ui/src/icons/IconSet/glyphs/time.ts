import { createIcon } from '../createIcon';
import type { Part, PartOptions } from '../shapes';
import {
  arc,
  body,
  circle,
  cut,
  dot,
  head,
  hole,
  LINED,
  mark,
  polar,
  poly,
  rect,
  roundPolygon,
  sector,
  seg,
  SOLID,
  star,
  stroke,
} from '../shapes';

// Time: clocks, timers and calendars.

const f = (v: number) => String(Math.round(v * 100) / 100);

/** A solid-in-fill mark of any shape: solid in outline/duo, knocked out of the solid in fill. */
const holeShape = (d: string, o?: PartOptions): Part => ({ k: 'hole', d, ...o });

/**
 * A circle with a round bite taken out toward a modifier at mx,my (bite radius `br`).
 * `lined` is an open path (the duo tint closes on a chord clear of the modifier); `solid` is closed around the bite.
 */
function bitten(cx: number, cy: number, r: number, mx: number, my: number, br: number) {
  const dx = mx - cx;
  const dy = my - cy;
  const d = Math.hypot(dx, dy);
  const deg = (rad: number) => (rad * 180) / Math.PI;
  const th = deg(Math.atan2(dx, -dy));
  const phi = deg(Math.acos((r * r + d * d - br * br) / (2 * r * d)));
  const psi = deg(Math.acos((br * br + d * d - r * r) / (2 * br * d)));
  const a0 = th + phi;
  const a1 = th - phi + 360;
  const lined = arc(cx, cy, r, a0, a1);
  const [sx, sy] = polar(cx, cy, r, a0);
  const solid = `${lined}A${f(br)} ${f(br)} 0 ${psi > 90 ? 1 : 0} 0 ${f(sx)} ${f(sy)}Z`;
  return { lined, solid };
}

const MX = 13.75;
const MY = 13.75;

// ---- modifiers (bottom-right 7 x 7 zone) -------------------------------------

const plusMod = () => [stroke(seg(13.75, 11.5, 13.75, 16)), stroke(seg(11.5, 13.75, 16, 13.75))];
const minusMod = () => [stroke(seg(11.5, 13.75, 16, 13.75))];
const checkMod = () => [stroke(poly(11.75, 13.75, 13.25, 15.25, 16, 12))];
const xMod = () => [stroke(seg(11.75, 11.75, 15.75, 15.75)), stroke(seg(15.75, 11.75, 11.75, 15.75))];
const alertMod = () => [stroke(seg(13.75, 11.5, 13.75, 14)), dot(13.75, 15.75, 1)];
const upMod = () => [stroke(seg(13.75, 11.5, 13.75, 16)), stroke(head(13.75, 11.5, 0, 3.2))];
const downMod = () => [stroke(seg(13.75, 11.5, 13.75, 16)), stroke(head(13.75, 16, 180, 3.2))];
const rightMod = () => [stroke(seg(11.5, 13.75, 16, 13.75)), stroke(head(16, 13.75, 90, 3.2))];
const miniClock = () => [
  body(circle(MX, MY, 3), { tint: true }),
  cut(poly(MX, MY - 1.25, MX, MY, MX + 1.1, MY + 0.9)),
];
const miniSearch = () => [
  body(circle(12.9, 12.9, 1.9)),
  stroke(seg(14.4, 14.4, 15.75, 15.75)),
];

// ---- clock family -------------------------------------------------------------

/** The clock face, bitten toward the bottom-right modifier. Hands point away from the bite. */
function clockWith(mod: Part[]): Part[] {
  const b = bitten(9, 9, 7, MX, MY, 5.25);
  return [
    body(b.lined, { tint: true, only: LINED }),
    body(b.solid, { tint: true, only: SOLID }),
    cut(poly(9, 5.25, 9, 9, 6.25, 10.5)),
    ...mod,
  ];
}

export const ClockPlusIcon = /*#__PURE__*/ createIcon('ClockPlus', () => clockWith(plusMod()));
export const ClockMinusIcon = /*#__PURE__*/ createIcon('ClockMinus', () => clockWith(minusMod()));
export const ClockCheckIcon = /*#__PURE__*/ createIcon('ClockCheck', () => clockWith(checkMod()));
export const ClockXIcon = /*#__PURE__*/ createIcon('ClockX', () => clockWith(xMod()));
export const ClockAlertIcon = /*#__PURE__*/ createIcon('ClockAlert', () => clockWith(alertMod()));
export const ClockArrowUpIcon = /*#__PURE__*/ createIcon('ClockArrowUp', () => clockWith(upMod()));
export const ClockArrowDownIcon = /*#__PURE__*/ createIcon('ClockArrowDown', () => clockWith(downMod()));

export const Clock3Icon = /*#__PURE__*/ createIcon('Clock3', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(poly(9, 5.25, 9, 9, 12.25, 9)),
]);

export const ClockFastIcon = /*#__PURE__*/ createIcon('ClockFast', () => {
  // The face opens on the left; its rim streams out as two speed lines with a short one between them.
  const cx = 10.75;
  const [ux, uy] = polar(cx, 9, 5.75, 300);
  const [, ly] = polar(cx, 9, 5.75, 240);
  return [
    body(arc(cx, 9, 5.75, 300, 600), { tint: true }),
    stroke(seg(2.5, uy, ux, uy)),
    stroke(seg(2.5, ly, ux, ly)),
    stroke(seg(2.5, 9, 4.25, 9)),
    cut(poly(cx, 5.75, cx, 9, cx + 2.25, 10.25)),
  ];
});

// ---- alarm clock, stopwatch, timer, watch ----------------------------------------

const ACX = 9;
const ACY = 9.75;
const ears = () => [stroke(seg(2.5, 4.5, 4.5, 2.5)), stroke(seg(13.5, 2.5, 15.5, 4.5))];

export const AlarmClockIcon = /*#__PURE__*/ createIcon('AlarmClock', () => [
  body(circle(ACX, ACY, 5.25), { tint: true }),
  cut(poly(9, 7, 9, ACY, 11, 11)),
  ...ears(),
]);

function alarmWith(mod: Part[]): Part[] {
  const b = bitten(ACX, ACY, 5.25, MX, MY, 4.5);
  return [
    body(b.lined, { tint: true, only: LINED }),
    body(b.solid, { tint: true, only: SOLID }),
    cut(poly(9, 7, 9, ACY, 7, 11)),
    ...ears(),
    ...mod,
  ];
}

export const AlarmPlusIcon = /*#__PURE__*/ createIcon('AlarmPlus', () => alarmWith(plusMod()));
export const AlarmCheckIcon = /*#__PURE__*/ createIcon('AlarmCheck', () => alarmWith(checkMod()));

const knob = () => [stroke(seg(7.25, 2.5, 10.75, 2.5)), stroke(seg(9, 2.5, 9, 4.25))];

export const StopwatchIcon = /*#__PURE__*/ createIcon('Stopwatch', () => [
  body(circle(9, 10, 5.75), { tint: true }),
  ...knob(),
  stroke(seg(13.4, 5.6, 14.9, 4.1)),
  cut(seg(9, 10, 11.25, 7.75)),
]);

export const StopwatchPlayIcon = /*#__PURE__*/ createIcon('StopwatchPlay', () => [
  body(circle(9, 10, 5.75), { tint: true }),
  ...knob(),
  stroke(seg(13.4, 5.6, 14.9, 4.1)),
  holeShape(roundPolygon(0.6, 7.75, 7.75, 11.5, 10, 7.75, 12.25)),
]);

export const TimerIcon = /*#__PURE__*/ createIcon('Timer', () => [
  body(circle(9, 10, 5.75), { tint: true }),
  ...knob(),
  holeShape(sector(9, 10, 3.25, 0, 120)),
]);

export const WatchIcon = /*#__PURE__*/ createIcon('Watch', () => [
  body(circle(9, 9, 5), { tint: true }),
  stroke('M6.9 4.5L7.6 2.25H10.4L11.1 4.5'),
  stroke('M6.9 13.5L7.6 15.75H10.4L11.1 13.5'),
  cut(poly(9, 7, 9, 9, 10.5, 10)),
]);

// ---- calendar family ----------------------------------------------------------

const CAL_LINED =
  'M15.75 7.25V8.9V6A2.5 2.5 0 0 0 13.25 3.5H4.75A2.5 2.5 0 0 0 2.25 6V13.25A2.5 2.5 0 0 0 4.75 15.75H8.9H7.25';
const CAL_SOLID =
  'M15.75 8.9V6A2.5 2.5 0 0 0 13.25 3.5H4.75A2.5 2.5 0 0 0 2.25 6V13.25A2.5 2.5 0 0 0 4.75 15.75H8.9A5.25 5.25 0 0 1 15.75 8.9Z';
const pins = () => [stroke(seg(6, 2, 6, 4.75)), stroke(seg(12, 2, 12, 4.75))];
const header = () => cut(seg(2.25, 7.25, 15.75, 7.25));

/** The calendar page with its bottom-right corner opened for a modifier. */
function calendarWith(mod: Part[], inside: Part[] = []): Part[] {
  return [
    body(CAL_LINED, { tint: true, only: LINED }),
    body(CAL_SOLID, { tint: true, only: SOLID }),
    ...pins(),
    header(),
    ...inside,
    ...mod,
  ];
}

export const CalendarCheckIcon = /*#__PURE__*/ createIcon('CalendarCheck', () => calendarWith(checkMod()));
export const CalendarXIcon = /*#__PURE__*/ createIcon('CalendarX', () => calendarWith(xMod()));
export const CalendarMinusIcon = /*#__PURE__*/ createIcon('CalendarMinus', () => calendarWith(minusMod()));
export const CalendarArrowRightIcon = /*#__PURE__*/ createIcon('CalendarArrowRight', () => calendarWith(rightMod()));
export const CalendarClockIcon = /*#__PURE__*/ createIcon('CalendarClock', () => calendarWith(miniClock()));
export const CalendarSearchIcon = /*#__PURE__*/ createIcon('CalendarSearch', () => calendarWith(miniSearch()));

export const CalendarRangeIcon = /*#__PURE__*/ createIcon('CalendarRange', () => [
  body(rect(2.25, 3.5, 13.5, 12.25, 2.5), { tint: true }),
  ...pins(),
  header(),
  cut(seg(5.75, 11.5, 12.25, 11.5)),
  hole(5.75, 11.5, 1.25),
  hole(12.25, 11.5, 1.25),
]);

export const CalendarHeartIcon = /*#__PURE__*/ createIcon('CalendarHeart', () => [
  body(rect(2.25, 3.5, 13.5, 12.25, 2.5), { tint: true }),
  ...pins(),
  header(),
  holeShape('M9 13.9C7.6 12.9 6 11.9 6 10.6A1.5 1.5 0 0 1 9 10.1A1.5 1.5 0 0 1 12 10.6C12 11.9 10.4 12.9 9 13.9Z'),
]);

export const CalendarStarIcon = /*#__PURE__*/ createIcon('CalendarStar', () => [
  body(rect(2.25, 3.5, 13.5, 12.25, 2.5), { tint: true }),
  ...pins(),
  header(),
  holeShape(star(9, 11.85, 2.9, 1.3, 5, 0.4)),
]);

export const CalendarOffIcon = /*#__PURE__*/ createIcon('CalendarOff', () => [
  body('M6.68 3.5H13.25A2.5 2.5 0 0 1 15.75 6V12.57', { tint: true }),
  body('M2.25 5.43V13.25A2.5 2.5 0 0 0 4.75 15.75H12.57', { tint: true }),
  stroke(seg(12, 2, 12, 4.75)),
  cut(seg(10.43, 7.25, 15.75, 7.25)),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);

// ---- time zone, schedule, snooze, deadline ----------------------------------------

export const TimeZoneIcon = /*#__PURE__*/ createIcon('TimeZone', () => {
  const b = bitten(9, 9, 7, MX, MY, 5.25);
  return [
    body(b.lined, { tint: true, only: LINED }),
    body(b.solid, { tint: true, only: SOLID }),
    cut(seg(2, 9, 16, 9)),
    cut('M9 2A3 7 0 0 0 9 16'),
    cut('M9 2A3 7 0 0 1 12 9'),
    ...miniClock(),
  ];
});

export const ScheduleIcon = /*#__PURE__*/ createIcon('Schedule', () => [
  stroke(seg(3.75, 4.5, 3.75, 13.5), { soft: true }),
  dot(3.75, 4.5, 1.25),
  dot(3.75, 9, 1.25),
  dot(3.75, 13.5, 1.25),
  stroke(seg(8, 4.5, 15.5, 4.5)),
  stroke(seg(8, 9, 13.5, 9)),
  stroke(seg(8, 13.5, 14.5, 13.5)),
]);

export const SnoozeIcon = /*#__PURE__*/ createIcon('Snooze', () => [
  stroke(poly(2.5, 3, 8.25, 3, 2.5, 10, 8.25, 10)),
  stroke(poly(11.25, 9, 15.5, 9, 11.25, 14.5, 15.5, 14.5), { soft: true }),
]);

export const DeadlineIcon = /*#__PURE__*/ createIcon('Deadline', () => {
  const b = bitten(9, 9, 7, MX, 4.25, 5.25);
  return [
    body(b.lined, { tint: true, only: LINED }),
    body(b.solid, { tint: true, only: SOLID }),
    cut(poly(9, 5.5, 9, 9, 6.25, 10.75)),
    stroke(seg(12.5, 2.5, 12.5, 6.75)),
    mark(roundPolygon(0.4, 12.5, 2.5, 16.5, 4.25, 12.5, 6)),
  ];
});
