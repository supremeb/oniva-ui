import { createIcon } from '../createIcon';
import type { Part } from '../shapes';
import {
  arc,
  body,
  circle,
  cut,
  dot,
  ellipse,
  head,
  hole,
  LINED,
  polar,
  poly,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  SOLID,
  stroke,
} from '../shapes';

// Maps, places and navigation.

const f = (v: number) => String(Math.round(v * 100) / 100);

/** Map pin (same construction as MapPin) with its head centered on cx,cy and head radius r. */
function pin(cx: number, cy: number, r: number): string {
  const s = r / 5.5;
  const p = (x: number, y: number) => `${f(cx + x * s)} ${f(cy + y * s)}`;
  return `M${p(0.6, 7.8)}L${p(4.19, 3.56)}A${f(r)} ${f(r)} 0 1 0 ${p(-4.19, 3.56)}L${p(-0.6, 7.8)}Q${p(0, 8.5)} ${p(0.6, 7.8)}Z`;
}

/** Small pin used with a modifier in the bottom-right zone: pin body, head hole. */
const modPin = (): Part[] => [
  body(pin(7.5, 6.75, 4.75), { tint: true }),
  cut(circle(7.5, 6.75, 1.6), { only: LINED }),
  hole(7.5, 6.75, 2.35, { only: SOLID }),
];

const plusMod = () => [stroke(seg(13.75, 11.5, 13.75, 16)), stroke(seg(11.5, 13.75, 16, 13.75))];
const xMod = () => [stroke(seg(11.75, 11.75, 15.75, 15.75)), stroke(seg(15.75, 11.75, 11.75, 15.75))];
const checkMod = () => [stroke(poly(11.5, 14, 13.25, 15.75, 16.25, 12))];

export const MapPinPlusIcon = /*#__PURE__*/ createIcon('MapPinPlus', () => [...modPin(), ...plusMod()]);

export const MapPinXIcon = /*#__PURE__*/ createIcon('MapPinX', () => [...modPin(), ...xMod()]);

export const MapPinCheckIcon = /*#__PURE__*/ createIcon('MapPinCheck', () => [...modPin(), ...checkMod()]);

/**
 * Pin split by the off slash (y = x). Both halves are open bodies whose ends sit 2.5 from the slash, so the
 * implied closing edge runs parallel to it in the tint and the solid.
 */
export const MapPinOffIcon = /*#__PURE__*/ createIcon('MapPinOff', () => {
  const [ax, ay] = polar(9, 7.5, 5.5, 277.9);
  const [bx, by] = polar(9, 7.5, 5.5, 329.9);
  const [cx, cy] = polar(9, 7.5, 5.5, 119.3);
  return [
    body(`M10.6 14.11L9.6 15.3Q9 16 8.4 15.3L4.81 11.06A5.5 5.5 0 0 1 ${f(ax)} ${f(ay)}`, { tint: true }),
    body(`M${f(bx)} ${f(by)}A5.5 5.5 0 0 1 ${f(cx)} ${f(cy)}`, { tint: true }),
    stroke(seg(2.75, 2.75, 15.25, 15.25)),
  ];
});

export const MapPinsIcon = /*#__PURE__*/ createIcon('MapPins', () => [
  body(pin(5.25, 5.75, 3), { tint: true }),
  hole(5.25, 5.75, 1),
  body(pin(12.75, 10.25, 3)),
  hole(12.75, 10.25, 1),
]);

export const PinAreaIcon = /*#__PURE__*/ createIcon('PinArea', () => [
  stroke('M11.5 11.42A6.5 2.25 0 1 1 6.5 11.42'),
  body(pin(9, 6.75, 3.75), { tint: true }),
  hole(9, 6.75, 1.1),
]);

export const RouteIcon = /*#__PURE__*/ createIcon('Route', () => [
  body(circle(4.25, 13.5, 2)),
  body(circle(13.75, 4.5, 2), { tint: true }),
  stroke('M6.25 13.5H10.5A2.25 2.25 0 0 0 10.5 9H7.5A2.25 2.25 0 0 1 7.5 4.5H11.75'),
]);

export const SignpostIcon = /*#__PURE__*/ createIcon('Signpost', () => [
  body(roundPolygon(0.75, 3, 2.75, 12.5, 2.75, 15.5, 4.75, 12.5, 6.75, 3, 6.75), { tint: true }),
  body(roundPolygon(0.75, 15, 9.75, 5.5, 9.75, 2.5, 11.75, 5.5, 13.75, 15, 13.75)),
  stroke(seg(9, 6.75, 9, 9.75)),
  stroke(seg(9, 13.75, 9, 16)),
]);

export const FlagIcon = /*#__PURE__*/ createIcon('Flag', () => [
  body(roundPolygon(1, 4.25, 2.75, 15, 6.25, 4.25, 9.75), { tint: true }),
  stroke(seg(4.25, 2.5, 4.25, 16)),
]);

export const FlagCheckeredIcon = /*#__PURE__*/ createIcon('FlagCheckered', () => {
  const cell = (c: number, r: number): Part => ({ k: 'hole', d: rect(4.5 + c * 3.25, 3.75 + r * 3.25, 3.25, 3.25) });
  return [
    body(rect(3.75, 3, 11.25, 8, 1), { tint: true }),
    cell(0, 0),
    cell(2, 0),
    cell(1, 1),
    stroke(seg(3.75, 2, 3.75, 16)),
  ];
});

export const MilestoneIcon = /*#__PURE__*/ createIcon('Milestone', () => [
  body(rect(4.25, 2.5, 9.5, 10.25, [4.75, 4.75, 1, 1]), { tint: true }),
  cut(seg(6.75, 7, 11.25, 7)),
  cut(seg(7.5, 9.75, 10.5, 9.75)),
  stroke(seg(2.5, 15.75, 15.5, 15.75)),
]);

export const LocateIcon = /*#__PURE__*/ createIcon('Locate', () => [
  body(circle(9, 9, 4.5), { tint: true }),
  stroke(seg(9, 2, 9, 4.5)),
  stroke(seg(9, 13.5, 9, 16)),
  stroke(seg(2, 9, 4.5, 9)),
  stroke(seg(13.5, 9, 16, 9)),
]);

export const LocateFixedIcon = /*#__PURE__*/ createIcon('LocateFixed', () => [
  body(circle(9, 9, 4.5), { tint: true }),
  hole(9, 9, 1.5),
  stroke(seg(9, 2, 9, 4.5)),
  stroke(seg(9, 13.5, 9, 16)),
  stroke(seg(2, 9, 4.5, 9)),
  stroke(seg(13.5, 9, 16, 9)),
]);

/** Globe arc that stops 2.25 short of the pin, plus the pin in the bottom-right. */
export const GlobePinIcon = /*#__PURE__*/ createIcon('GlobePin', () => [
  body(arc(7.5, 7.5, 5.5, 178.5, 431.5), { tint: true, only: LINED }),
  body(`${arc(7.5, 7.5, 5.5, 178.5, 431.5)}A5.25 5.25 0 0 0 7.64 13Z`, { only: SOLID }),
  cut(seg(2, 7.5, 8.75, 7.5)),
  cut('M7.5 2A2.25 5.5 0 0 0 7.5 13'),
  body(pin(12.5, 11, 3)),
  hole(12.5, 11, 1),
]);

export const EarthGridIcon = /*#__PURE__*/ createIcon('EarthGrid', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(ellipse(9, 9, 3, 7)),
  cut(seg(2.9, 5.5, 15.1, 5.5)),
  cut(seg(2.9, 12.5, 15.1, 12.5)),
]);

export const MountainIcon = /*#__PURE__*/ createIcon('Mountain', () => [
  body(roundPolygon(1, 2, 14.5, 7, 4.5, 10, 10.25, 11.75, 7.5, 16, 14.5), { tint: true }),
  dot(13.75, 4, 1.25),
]);

export const TentIcon = /*#__PURE__*/ createIcon('Tent', () => [
  body(roundPolygon(1, 9, 3, 16, 14.5, 2, 14.5), { tint: true }),
  cut(poly(6.5, 14.5, 9, 9.5, 11.5, 14.5)),
]);

export const TreeIcon = /*#__PURE__*/ createIcon('Tree', () => [
  body(
    roundPolygon(0.75, 9, 2.25, 12.25, 7.25, 10.75, 7.25, 14.25, 12, 3.75, 12, 7.25, 7.25, 5.75, 7.25),
    { tint: true },
  ),
  stroke(seg(9, 12, 9, 15.75)),
]);

export const ParkIcon = /*#__PURE__*/ createIcon('Park', () => [
  body(circle(9, 6.5, 4.5), { tint: true }),
  cut(seg(9, 11, 9, 7.25)),
  cut(poly(7.25, 5.5, 9, 7.25, 10.75, 5.5)),
  stroke(seg(9, 11, 9, 16)),
  stroke(seg(5.5, 16, 12.5, 16)),
]);

export const BridgeIcon = /*#__PURE__*/ createIcon('Bridge', () => [
  stroke(seg(2, 5.5, 16, 5.5)),
  stroke(seg(3.5, 5.5, 3.5, 14.5)),
  stroke(seg(14.5, 5.5, 14.5, 14.5)),
  stroke('M3.5 14.5A5.5 5.5 0 0 1 14.5 14.5'),
  stroke(seg(9, 5.5, 9, 9), { soft: true }),
]);

export const SuspensionBridgeIcon = /*#__PURE__*/ createIcon('SuspensionBridge', () => [
  stroke(seg(5.5, 4, 5.5, 15)),
  stroke(seg(12.5, 4, 12.5, 15)),
  stroke(seg(2, 11, 16, 11)),
  stroke('M5.5 4Q9 10.5 12.5 4'),
  stroke(seg(9, 7.25, 9, 11), { soft: true }),
  stroke(seg(5.5, 4, 2, 11)),
  stroke(seg(12.5, 4, 16, 11)),
]);

export const LighthouseIcon = /*#__PURE__*/ createIcon('Lighthouse', () => [
  body(roundPolygon(1, 7.25, 2.5, 10.75, 2.5, 12.5, 15.75, 5.5, 15.75), { tint: true }),
  cut(seg(6.79, 6, 11.21, 6)),
  cut(seg(6.19, 10.5, 11.81, 10.5)),
  stroke(seg(2, 4.25, 4, 4.25)),
  stroke(seg(14, 4.25, 16, 4.25)),
]);

export const DirectionsIcon = /*#__PURE__*/ createIcon('Directions', () => [
  body(roundPolygon(1.5, 9, 2, 16, 9, 9, 16, 2, 9), { tint: true }),
  cut(roundPoly(1, 7.5, 10.75, 7.5, 8.25, 11.25, 8.25)),
  cut(head(11.25, 8.25, 90, 3)),
]);

export const DistanceIcon = /*#__PURE__*/ createIcon('Distance', () => [
  body(pin(4.75, 5.5, 2.75), { tint: true }),
  hole(4.75, 5.5, 1),
  body(pin(13.25, 5.5, 2.75), { tint: true }),
  hole(13.25, 5.5, 1),
  stroke(seg(2.75, 13.5, 15.25, 13.5)),
  stroke(head(2.75, 13.5, 270, 3.5)),
  stroke(head(15.25, 13.5, 90, 3.5)),
]);

export const ElevationIcon = /*#__PURE__*/ createIcon('Elevation', () => [
  body(roundPolygon(1, 2, 15.25, 5.75, 6.5, 9.75, 15.25), { tint: true }),
  stroke(seg(13.75, 3, 13.75, 15)),
  stroke(head(13.75, 3, 0, 3.5)),
  stroke(head(13.75, 15, 180, 3.5)),
]);

export const ZoomToFitIcon = /*#__PURE__*/ createIcon('ZoomToFit', () => [
  stroke(roundPoly(1.25, 6.25, 2.75, 2.75, 2.75, 2.75, 6.25)),
  stroke(roundPoly(1.25, 11.75, 2.75, 15.25, 2.75, 15.25, 6.25)),
  stroke(roundPoly(1.25, 15.25, 11.75, 15.25, 15.25, 11.75, 15.25)),
  stroke(roundPoly(1.25, 6.25, 15.25, 2.75, 15.25, 2.75, 11.75)),
  body(rect(6.5, 6.5, 5, 5, 1.25), { tint: true }),
]);

export const StreetViewIcon = /*#__PURE__*/ createIcon('StreetView', () => [
  body(circle(9, 4.75, 2.5)),
  body('M5.5 12.75V11.5C5.5 10.2 6.8 9.5 9 9.5S12.5 10.2 12.5 11.5V12.75Z', { tint: true }),
  stroke('M2.5 13A6.5 2.75 0 0 0 15.5 13'),
]);

/** Plane in side view, nose tipped down toward the runway: capsule fuselage, tail fin and wing on a turned axis. */
export const PlaneLandingIcon = /*#__PURE__*/ createIcon('PlaneLanding', () => {
  const a = ((108 - 90) * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const tp = (u: number, v: number): [number, number] => [8.5 + u * c - v * s, 8.25 + u * s + v * c];
  const path = (...uv: number[]) => {
    const pts: number[] = [];
    for (let i = 0; i < uv.length; i += 2) pts.push(...tp(uv[i]!, uv[i + 1]!));
    return pts;
  };
  return [
    body(roundPolygon(1.25, ...path(-6, -1.25, 6, -1.25, 6, 1.25, -6, 1.25)), { tint: true }),
    stroke(poly(...path(-3, -1.25, -5.75, -4.25))),
    stroke(poly(...path(1.75, 1.25, -1, 5.25))),
    stroke(seg(2.5, 15.75, 15.5, 15.75)),
  ];
});

export const ExploreIcon = /*#__PURE__*/ createIcon('Explore', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(roundPolygon(0.5, 12, 6, 10.25, 10.25, 6, 12, 7.75, 7.75)),
]);

export const WaypointsIcon = /*#__PURE__*/ createIcon('Waypoints', () => {
  const link = (ax: number, ay: number, bx: number, by: number, r: number) => {
    const d = Math.hypot(bx - ax, by - ay);
    const ux = (bx - ax) / d;
    const uy = (by - ay) / d;
    return stroke(seg(ax + ux * r, ay + uy * r, bx - ux * r, by - uy * r));
  };
  return [
    body(circle(4.25, 4.5, 1.75)),
    body(circle(13.75, 9, 1.75), { tint: true }),
    body(circle(4.25, 13.5, 1.75)),
    link(4.25, 4.5, 13.75, 9, 1.75),
    link(13.75, 9, 4.25, 13.5, 1.75),
  ];
});

export const AnchorIcon = /*#__PURE__*/ createIcon('Anchor', () => [
  body(circle(9, 3.75, 1.75), { tint: true }),
  stroke(seg(9, 5.5, 9, 15.5)),
  stroke(seg(6.5, 8.5, 11.5, 8.5)),
  stroke('M2.75 11A6.25 4.5 0 0 0 15.25 11'),
]);
