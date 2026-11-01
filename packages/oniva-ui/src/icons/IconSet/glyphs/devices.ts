import { createIcon } from '../createIcon';
import {
  arc,
  body,
  circle,
  cut,
  dot,
  hole,
  join,
  LINED,
  mark,
  polar,
  poly,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  SOLID,
  stroke,
} from '../shapes';

// Technology and devices.

/** Local frame for diagonal glyphs: `u` runs toward `deg` (0 = up, 90 = right), `v` across it. */
function frame(cx: number, cy: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return (u: number, v: number): [number, number] => [cx + u * c - v * s, cy + u * s + v * c];
}

// ---- screens --------------------------------------------------------------

export const SmartphoneIcon = /*#__PURE__*/ createIcon('Smartphone', () => [
  body(rect(4.5, 2, 9, 14, 2.5), { tint: true }),
  cut(seg(7.5, 4.75, 10.5, 4.75)),
  hole(9, 13.25, 1),
]);

export const TabletIcon = /*#__PURE__*/ createIcon('Tablet', () => [
  body(rect(3, 2, 12, 14, 2.5), { tint: true }),
  hole(9, 13.25, 1),
]);

export const LaptopIcon = /*#__PURE__*/ createIcon('Laptop', () => [
  body(rect(3.75, 3, 10.5, 8.5, 2), { tint: true }),
  stroke(seg(2, 14.25, 16, 14.25)),
]);

export const MonitorIcon = /*#__PURE__*/ createIcon('Monitor', () => [
  body(rect(2, 2.75, 14, 9.25, 2.5), { tint: true }),
  stroke(join(seg(9, 12, 9, 15.25), seg(6, 15.25, 12, 15.25))),
]);

export const TvIcon = /*#__PURE__*/ createIcon('Tv', () => [
  body(rect(2, 5.25, 14, 10, 2.5), { tint: true }),
  stroke(poly(6.25, 2.25, 9, 5.25, 11.75, 2.25)),
]);

export const SmartwatchIcon = /*#__PURE__*/ createIcon('Smartwatch', () => [
  body(rect(4.25, 5.25, 9.5, 7.5, 2.5), { tint: true }),
  stroke(roundPoly(1, 6.75, 5.25, 7.25, 2.5, 10.75, 2.5, 11.25, 5.25)),
  stroke(roundPoly(1, 6.75, 12.75, 7.25, 15.5, 10.75, 15.5, 11.25, 12.75)),
  cut(poly(9, 7.5, 9, 9.25, 10.5, 9.25)),
]);

export const DesktopTowerIcon = /*#__PURE__*/ createIcon('DesktopTower', () => [
  body(rect(4.5, 2, 9, 14, 2.5), { tint: true }),
  cut(seg(7.5, 5.25, 10.5, 5.25)),
  cut(seg(7.5, 8, 10.5, 8)),
  hole(9, 12.5, 1),
]);

export const ProjectorIcon = /*#__PURE__*/ createIcon('Projector', () => [
  body(rect(2, 5.5, 14, 8, 2.5), { tint: true }),
  stroke(seg(5.25, 13.5, 5.25, 15.75)),
  stroke(seg(12.75, 13.5, 12.75, 15.75)),
  cut(seg(4.75, 9.5, 8, 9.5)),
  hole(12.25, 9.5, 1.5),
]);

export const MonitorSmartphoneIcon = /*#__PURE__*/ createIcon('MonitorSmartphone', () => [
  stroke(
    'M8 12H4.5A2.5 2.5 0 0 1 2 9.5V5.5A2.5 2.5 0 0 1 4.5 3H13.5A2.5 2.5 0 0 1 16 5.5',
  ),
  stroke(join(seg(5.25, 12, 5.25, 15.25), seg(3, 15.25, 7.5, 15.25))),
  body(rect(11, 8.5, 5, 7.5, 1.75), { tint: true }),
  hole(13.5, 13.75, 0.8),
]);

// ---- audio, imaging and peripherals ---------------------------------------

export const HeadphonesIcon = /*#__PURE__*/ createIcon('Headphones', () => [
  stroke('M3.75 10V8.5A5.25 5.25 0 0 1 14.25 8.5V10'),
  body(rect(2, 10, 3.5, 6, 1.75), { tint: true }),
  body(rect(12.5, 10, 3.5, 6, 1.75), { tint: true }),
]);

export const SpeakerIcon = /*#__PURE__*/ createIcon('Speaker', () => [
  body(rect(3.5, 2, 11, 14, 2.5), { tint: true }),
  hole(9, 5, 0.9),
  cut(circle(9, 10.75, 2.25)),
]);

export const PrinterIcon = /*#__PURE__*/ createIcon('Printer', () => [
  body(rect(2, 6.25, 14, 6.5, 2.5), { tint: true }),
  stroke(roundPoly(1, 5.5, 6.25, 5.5, 2.5, 12.5, 2.5, 12.5, 6.25)),
  stroke(roundPoly(1, 5.5, 12.75, 5.5, 15.5, 12.5, 15.5, 12.5, 12.75)),
  hole(13, 9.5, 0.9),
]);

export const CameraIcon = /*#__PURE__*/ createIcon('Camera', () => [
  body(
    'M4.5 5.5H6.25L7.1 3.75Q7.25 3.5 7.5 3.5H10.5Q10.75 3.5 10.9 3.75L11.75 5.5H13.5A2.5 2.5 0 0 1 16 8V12.5A2.5 2.5 0 0 1 13.5 15H4.5A2.5 2.5 0 0 1 2 12.5V8A2.5 2.5 0 0 1 4.5 5.5Z',
    { tint: true },
  ),
  cut(circle(9, 10.25, 2)),
]);

export const GamepadIcon = /*#__PURE__*/ createIcon('Gamepad', () => [
  body(roundPolygon(1.5, 5, 4.5, 13, 4.5, 16, 9, 15.5, 13.5, 12.75, 13.5, 11, 11.25, 7, 11.25, 5.25, 13.5, 2.5, 13.5, 2, 9), {
    tint: true,
  }),
  cut(seg(4.25, 8.25, 6.75, 8.25)),
  cut(seg(5.5, 7, 5.5, 9.5)),
  hole(11.5, 9.25, 0.9),
  hole(13.75, 7.5, 0.9),
]);

export const MemoryCardIcon = /*#__PURE__*/ createIcon('MemoryCard', () => [
  body('M5.5 2H11.5L14.5 5V14A2 2 0 0 1 12.5 16H5.5A2 2 0 0 1 3.5 14V4A2 2 0 0 1 5.5 2Z', { tint: true }),
  cut(seg(6.25, 4.75, 6.25, 7)),
  cut(seg(8.75, 4.75, 8.75, 7)),
  cut(seg(11.25, 4.75, 11.25, 7)),
]);

// ---- power ----------------------------------------------------------------

/** Battery shell with its terminal nub built into the outline. */
const BATTERY =
  'M4.5 4H11.5A2.5 2.5 0 0 1 14 6.5V7.5H14.75A0.75 0.75 0 0 1 15.5 8.25V9.75A0.75 0.75 0 0 1 14.75 10.5H14V11.5A2.5 2.5 0 0 1 11.5 14H4.5A2.5 2.5 0 0 1 2 11.5V6.5A2.5 2.5 0 0 1 4.5 4Z';

const batteryBars = (count: number) =>
  [5, 8, 11].slice(0, count).map((x) => cut(seg(x, 7.5, x, 10.5)));

export const BatteryIcon = /*#__PURE__*/ createIcon('Battery', () => [body(BATTERY, { tint: true }), ...batteryBars(2)]);

export const BatteryLowIcon = /*#__PURE__*/ createIcon('BatteryLow', () => [body(BATTERY, { tint: true }), ...batteryBars(1)]);

export const BatteryFullIcon = /*#__PURE__*/ createIcon('BatteryFull', () => [body(BATTERY, { tint: true }), ...batteryBars(3)]);

export const BatteryChargingIcon = /*#__PURE__*/ createIcon('BatteryCharging', () => [
  body(BATTERY, { tint: true }),
  cut(poly(9.75, 6.75, 7.25, 9.25, 10.75, 9.25, 8.25, 11.5)),
]);

export const ChargerIcon = /*#__PURE__*/ createIcon('Charger', () => [
  stroke(seg(7, 2.25, 7, 7)),
  stroke(seg(11, 2.25, 11, 7)),
  body(rect(4, 7, 10, 9, 2.5), { tint: true }),
  cut(seg(7.5, 11.5, 10.5, 11.5)),
]);

export const CableIcon = /*#__PURE__*/ createIcon('Cable', () => [
  body(rect(2.5, 2, 5, 4, 1.25), { tint: true }),
  body(rect(11, 12, 5, 4, 1.25), { tint: true }),
  stroke(roundPoly(2.5, 5, 6, 5, 9, 13, 9, 13, 12)),
]);

export const UsbIcon = /*#__PURE__*/ createIcon('Usb', () => [
  body(rect(4, 2, 10, 6.5, 1.5), { tint: true }),
  cut(seg(6.5, 5.25, 11.5, 5.25)),
  body(rect(6, 8.5, 6, 7.5, 1.5)),
]);

// ---- connectivity ---------------------------------------------------------

const WIFI_X = 9;
const WIFI_Y = 14.25;
const WIFI_R = [3.75, 7.25, 10.75] as const;
const WIFI_SPREAD = 40;

export const WifiIcon = /*#__PURE__*/ createIcon('Wifi', () => [
  ...WIFI_R.map((r) => stroke(arc(WIFI_X, WIFI_Y, r, -WIFI_SPREAD, WIFI_SPREAD))),
  dot(WIFI_X, WIFI_Y, 1.25),
]);

export const WifiLowIcon = /*#__PURE__*/ createIcon('WifiLow', () => [
  stroke(arc(WIFI_X, 13.25, 5.5, -45, 45)),
  dot(WIFI_X, 13.25, 1.25),
]);

/** Arc pieces kept at least 3 units from the "off" slash (y = x), so the break is real in every style. */
function arcOffSlash(cx: number, cy: number, r: number, from: number, to: number): string {
  const keep = (a: number) => {
    const [x, y] = polar(cx, cy, r, a);
    return Math.abs(x - y) / Math.SQRT2 >= 3;
  };
  let d = '';
  let start: number | null = null;
  for (let a = from; a <= to + 1e-6; a += 0.5) {
    const ok = keep(a);
    if (ok && start === null) start = a;
    if (!ok && start !== null) {
      d += arc(cx, cy, r, start, a - 0.5);
      start = null;
    }
  }
  if (start !== null) d += arc(cx, cy, r, start, to);
  return d;
}

export const WifiOffIcon = /*#__PURE__*/ createIcon('WifiOff', () => [
  ...WIFI_R.map((r) => stroke(arcOffSlash(WIFI_X, WIFI_Y, r, -WIFI_SPREAD, WIFI_SPREAD))),
  dot(WIFI_X, WIFI_Y, 1.25),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);

export const RouterIcon = /*#__PURE__*/ createIcon('Router', () => [
  body(rect(2, 9, 14, 6.5, 2.5), { tint: true }),
  stroke(seg(5.5, 2.5, 5.5, 9)),
  stroke(seg(12.5, 2.5, 12.5, 9)),
  hole(5.5, 12.25, 0.9),
  hole(9, 12.25, 0.9),
  hole(12.5, 12.25, 0.9),
]);

export const CastIcon = /*#__PURE__*/ createIcon('Cast', () => [
  stroke('M13.5 14.25A2.5 2.5 0 0 0 16 11.75V6.25A2.5 2.5 0 0 0 13.5 3.75H4.5A2.5 2.5 0 0 0 2 6.25'),
  stroke(arc(3, 14, 3.75, 20, 90)),
  stroke(arc(3, 14, 7.5, 25, 80)),
  dot(3, 14, 1.25),
]);

export const SignalIcon = /*#__PURE__*/ createIcon('Signal', () => {
  const xs = [3.375, 7.125, 10.875, 14.625];
  const tops = [12.5, 9.5, 6.5, 3.5];
  return [
    ...xs.map((x, i) => stroke(seg(x, 15.25, x, tops[i]!), { only: LINED })),
    ...xs.map((x, i) => mark(rect(x - 1.25, tops[i]! - 0.75, 2.5, 16 - tops[i]! + 0.75, 1), { only: SOLID })),
  ];
});

export const SatelliteIcon = /*#__PURE__*/ createIcon('Satellite', () => {
  const p = frame(9, 9, 45);
  const poly4 = (u0: number, u1: number, v0: number, v1: number) =>
    roundPolygon(0.75, ...p(u0, v0), ...p(u1, v0), ...p(u1, v1), ...p(u0, v1));
  const line = (u0: number, v0: number, u1: number, v1: number) => {
    const [x0, y0] = p(u0, v0);
    const [x1, y1] = p(u1, v1);
    return seg(x0, y0, x1, y1);
  };
  const [dx, dy] = p(0, -5.25);
  return [
    body(poly4(-7.25, -3.25, -2.75, 2.75), { tint: true }),
    body(poly4(3.25, 7.25, -2.75, 2.75), { tint: true }),
    stroke(line(-3.25, 0, 3.25, 0)),
    body(poly4(-1.5, 1.5, -1.5, 1.5)),
    stroke(line(0, -1.5, 0, -3.5)),
    dot(dx, dy, 1.25),
  ];
});
