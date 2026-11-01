import { createIcon } from '../createIcon';
import { body, circle, cut, dot, ellipse, hole, poly, rect, roundPoly, roundPolygon, seg, stroke } from '../shapes';

// Transportation.

const r3 = (v: number) => {
  const r = Math.round(v * 1000) / 1000;
  return String(Object.is(r, -0) ? 0 : r);
};

/** Local frame for diagonal glyphs: `u` runs toward `deg` (0 = up, 90 = right), `v` runs across it. */
function frame(cx: number, cy: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return (u: number, v: number): [number, number] => [cx + u * c - v * s, cy + u * s + v * c];
}

/**
 * Closed vehicle outline with wheel arches. `upper` is an open polyline (x,y pairs) that starts at the right end
 * of the underbody and ends at the left end, both on the line `y`; the underbody then runs left to right with a
 * circular arch (centre cx,cy, radius R) over every wheel.
 */
function wheeled(round: number, upper: readonly number[], y: number, wells: readonly (readonly [number, number, number])[]) {
  let d = roundPoly(round, ...upper);
  for (const [cx, cy, big] of [...wells].sort((a, b) => a[0] - b[0])) {
    const h = Math.sqrt(big * big - (cy - y) * (cy - y));
    d += `L${r3(cx - h)} ${r3(y)}A${r3(big)} ${r3(big)} 0 0 1 ${r3(cx + h)} ${r3(y)}`;
  }
  return `${d}Z`;
}

const wheel = (cx: number, cy: number, r = 1.5) => body(circle(cx, cy, r));

// ---- road vehicles ---------------------------------------------------------

/** Generic sedan in side view, facing right: flat roof, raked windshield, two wheels in arches. */
export const CarIcon = /*#__PURE__*/ createIcon('Car', () => [
  body(wheeled(0.75, [16, 11.5, 16, 9, 12.5, 8.25, 10.5, 5.25, 5.75, 5.25, 4.5, 8.25, 2, 8.75, 2, 11.5], 11.5, [[5, 12.5, 3], [13, 12.5, 3]]), {
    tint: true,
  }),
  cut(seg(8.25, 5.25, 8.25, 8.25)),
  wheel(5, 12.5),
  wheel(13, 12.5),
]);

/** Car seen from the front. */
export const CarFrontIcon = /*#__PURE__*/ createIcon('CarFront', () => [
  body(roundPolygon(1.25, 5.75, 3.5, 12.25, 3.5, 13.75, 8, 15.25, 9, 15.25, 13, 2.75, 13, 2.75, 9, 4.25, 8), { tint: true }),
  cut(seg(4.25, 8, 13.75, 8)),
  hole(5.75, 10.75),
  hole(12.25, 10.75),
  stroke(seg(5.25, 13, 5.25, 15.5)),
  stroke(seg(12.75, 13, 12.75, 15.5)),
]);

/** Taxi: the sedan with a roof sign. */
export const TaxiIcon = /*#__PURE__*/ createIcon('Taxi', () => [
  body(wheeled(0.75, [16, 11.5, 16, 9.5, 12.5, 8.75, 10.75, 6, 5.75, 6, 4.5, 8.75, 2, 9.25, 2, 11.5], 11.5, [[5, 12.5, 3], [13, 12.5, 3]]), {
    tint: true,
  }),
  cut(seg(8.25, 6, 8.25, 8.75)),
  stroke(seg(7.25, 3, 10.75, 3)),
  wheel(5, 12.5),
  wheel(13, 12.5),
]);

/** Bus from the front. */
export const BusIcon = /*#__PURE__*/ createIcon('Bus', () => [
  body(rect(3, 2.5, 12, 11, 2.5), { tint: true }),
  cut(rect(5.5, 5.5, 7, 3, 1)),
  hole(6.25, 11.25),
  hole(11.75, 11.25),
  stroke(seg(5.75, 13.5, 5.75, 15.5)),
  stroke(seg(12.25, 13.5, 12.25, 15.5)),
  stroke(seg(3, 6.5, 1.75, 6.5)),
  stroke(seg(15, 6.5, 16.25, 6.5)),
]);

/** Train from the front, on its rails. */
export const TrainIcon = /*#__PURE__*/ createIcon('Train', () => [
  body(rect(4, 2.25, 10, 11.75, [4, 4, 2, 2]), { tint: true }),
  cut(rect(7, 5.5, 4, 3, 1)),
  hole(6.75, 11.25),
  hole(11.25, 11.25),
  stroke(seg(6.5, 14, 5, 16)),
  stroke(seg(11.5, 14, 13, 16)),
]);

/** Tram from the front with its overhead pole. */
export const TramIcon = /*#__PURE__*/ createIcon('Tram', () => [
  body(rect(3.5, 5.5, 11, 8.5, 2.5), { tint: true }),
  cut(rect(6.5, 8.5, 5, 3, 1)),
  stroke(seg(9, 5.5, 9, 2.25)),
  stroke(seg(4.5, 2.25, 13.5, 2.25)),
  stroke(seg(6.5, 14, 5.5, 16)),
  stroke(seg(11.5, 14, 12.5, 16)),
]);

/** Bicycle. */
export const BikeIcon = /*#__PURE__*/ createIcon('Bike', () => [
  stroke(circle(4.25, 11.75, 3)),
  stroke(circle(13.75, 11.75, 3)),
  stroke(poly(4.25, 11.75, 9, 11.75, 7.5, 6.25, 12, 6.25, 13.75, 11.75)),
  stroke(poly(9, 11.75, 12, 6.25)),
  stroke(seg(6.25, 4.25, 8.5, 4.25)),
  stroke(seg(7.5, 4.25, 7.5, 6.25)),
  stroke(seg(11, 3.75, 13.25, 3.75)),
]);

/** Kick scooter. */
export const ScooterIcon = /*#__PURE__*/ createIcon('Scooter', () => [
  wheel(4.25, 13.75, 1.75),
  wheel(13.75, 13.75, 1.75),
  stroke(seg(4.25, 11.5, 13.4, 11.5)),
  stroke(seg(13.75, 13.75, 12.25, 3.5)),
  stroke(seg(10, 3.25, 14.5, 3.25)),
]);

/** Motorcycle: two wheels, a tank and seat on a frame, forks and handlebar. */
export const MotorcycleIcon = /*#__PURE__*/ createIcon('Motorcycle', () => [
  stroke(circle(3.75, 12.75, 2.5)),
  stroke(circle(14.25, 12.75, 2.5)),
  body(roundPolygon(1.25, 3.75, 8.5, 8, 8.5, 9, 6.25, 11.25, 6.25, 10.75, 11.25, 6.5, 11.25), { tint: true }),
  stroke(poly(3.75, 12.75, 6.5, 11.25)),
  stroke(poly(14.25, 12.75, 12.5, 6.25, 11.5, 3.75)),
  stroke(seg(10, 3.75, 13, 3.75)),
]);

/** Steering wheel. */
export const SteeringWheelIcon = /*#__PURE__*/ createIcon('SteeringWheel', () => [
  stroke(circle(9, 9, 7)),
  body(circle(9, 9, 2), { tint: true }),
  stroke(seg(11, 9, 16, 9)),
  stroke(seg(7, 9, 2, 9)),
  stroke(seg(9, 11, 9, 16)),
]);

/** Wheel: tyre, rim and lug nuts. */
export const TireIcon = /*#__PURE__*/ createIcon('Tire', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(circle(9, 9, 4.5)),
  hole(9, 6.9, 0.9),
  hole(9, 11.1, 0.9),
  hole(6.9, 9, 0.9),
  hole(11.1, 9, 0.9),
]);

/** Traffic light with three lamps. */
export const TrafficLightIcon = /*#__PURE__*/ createIcon('TrafficLight', () => [
  body(rect(5.25, 2, 7.5, 14, 2.5), { tint: true }),
  hole(9, 5.5, 1.25),
  hole(9, 9, 1.25),
  hole(9, 12.5, 1.25),
]);

/** Road running to the horizon. */
export const RoadIcon = /*#__PURE__*/ createIcon('Road', () => [
  body(roundPolygon(1, 6.5, 2.5, 11.5, 2.5, 15.5, 15.5, 2.5, 15.5), { tint: true }),
  cut(seg(9, 5, 9, 6)),
  cut(seg(9, 8.5, 9, 10)),
  cut(seg(9, 12.5, 9, 14)),
]);

/** Traffic cone on its base. */
export const TrafficConeIcon = /*#__PURE__*/ createIcon('TrafficCone', () => [
  body(roundPolygon(0.75, 7.75, 2.5, 10.25, 2.5, 13.5, 12, 4.5, 12), { tint: true }),
  body(rect(2.5, 12, 13, 3.5, 1.25)),
]);

/** Parking sign. */
export const ParkingIcon = /*#__PURE__*/ createIcon('Parking', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut('M7 12.25V5.75H9.75A2 2 0 0 1 9.75 9.75H7'),
]);

/** Fuel pump with hose. */
export const FuelPumpIcon = /*#__PURE__*/ createIcon('FuelPump', () => [
  body(rect(2.5, 2.5, 9, 13, 2), { tint: true }),
  cut(rect(5, 5, 4, 3.5, 1)),
  stroke(roundPoly(1.5, 11.5, 6.5, 14.5, 6.5, 14.5, 12.5)),
  dot(14.5, 13.5),
]);

/** Charging station with a bolt and cable. */
export const EvChargerIcon = /*#__PURE__*/ createIcon('EvCharger', () => [
  body(rect(2.5, 2.5, 9, 13, 2), { tint: true }),
  cut(poly(8.5, 5.5, 6.25, 9, 9, 9, 6.75, 12.5)),
  stroke(roundPoly(1.5, 11.5, 6.5, 14.5, 6.5, 14.5, 12.5)),
  dot(14.5, 13.5),
]);

/** Suitcase on wheels. */
export const LuggageIcon = /*#__PURE__*/ createIcon('Luggage', () => [
  body(rect(3, 5.25, 12, 9, 2.5), { tint: true }),
  stroke('M6.75 5.25V3.75A1 1 0 0 1 7.75 2.75H10.25A1 1 0 0 1 11.25 3.75V5.25'),
  cut(seg(6.5, 5.25, 6.5, 14.25)),
  cut(seg(11.5, 5.25, 11.5, 14.25)),
  stroke(seg(6.5, 14.25, 6.5, 16)),
  stroke(seg(11.5, 14.25, 11.5, 16)),
]);

/** Bus stop: a bus sign on a pole. */
export const BusStopIcon = /*#__PURE__*/ createIcon('BusStop', () => [
  body(rect(3, 2, 12, 9.5, 2.5), { tint: true }),
  cut(rect(5.5, 4, 7, 2.5, 1)),
  hole(6.75, 9),
  hole(11.25, 9),
  stroke(seg(9, 11.5, 9, 16)),
  stroke(seg(6.5, 16, 11.5, 16)),
]);

// ---- air ---------------------------------------------------------------

/** Airliner in top view, flying up and to the right. */
export const PlaneIcon = /*#__PURE__*/ createIcon('Plane', () => {
  const p = frame(9, 9, 45);
  const right: [number, number][] = [
    [7.75, 0],
    [5.5, 1.25],
    [1.75, 1.25],
    [-2, 5.75],
    [-3.75, 5.75],
    [-3, 1.25],
    [-5.5, 1.25],
    [-6.5, 3],
    [-7.75, 3],
    [-7.75, 0],
  ];
  const left = right
    .slice(1, -1)
    .map(([u, v]): [number, number] => [u, -v])
    .reverse();
  const pts = [...right, ...left].flatMap(([u, v]) => p(u, v));
  return [body(roundPolygon(0.75, ...pts), { tint: true })];
});

/** Plane climbing away from a runway. */
export const PlaneTakeoffIcon = /*#__PURE__*/ createIcon('PlaneTakeoff', () => {
  const p = frame(9.5, 7.5, 45);
  const right: [number, number][] = [
    [6, 0],
    [4.25, 1.25],
    [1.25, 1.25],
    [-1.75, 4.75],
    [-3.25, 4.75],
    [-2.5, 1.25],
    [-4.5, 1.25],
    [-5.25, 2.5],
    [-6.25, 2.5],
    [-6.25, 0],
  ];
  const left = right
    .slice(1, -1)
    .map(([u, v]): [number, number] => [u, -v])
    .reverse();
  const pts = [...right, ...left].flatMap(([u, v]) => p(u, v));
  return [body(roundPolygon(0.75, ...pts), { tint: true }), stroke(seg(2.5, 15.75, 15.5, 15.75))];
});

/** Helicopter in side view. */
export const HelicopterIcon = /*#__PURE__*/ createIcon('Helicopter', () => [
  body(ellipse(7.5, 9.75, 4.75, 3.25), { tint: true }),
  stroke(seg(2.5, 4.25, 12.5, 4.25)),
  stroke(seg(7.5, 4.25, 7.5, 6.5)),
  stroke(poly(12, 8.75, 15.5, 6.5)),
  stroke(seg(15.5, 4.5, 15.5, 8.5)),
  stroke(seg(3.5, 15.5, 11.5, 15.5)),
  stroke(seg(5.75, 12.9, 5.75, 15.5)),
  stroke(seg(9.25, 12.9, 9.25, 15.5)),
]);

/** Hot air balloon. */
export const HotAirBalloonIcon = /*#__PURE__*/ createIcon('HotAirBalloon', () => [
  body(
    'M9 2.25C12.5 2.25 14.5 4.75 14.5 7.25C14.5 9.75 12.25 11 10.75 11.5H7.25C5.75 11 3.5 9.75 3.5 7.25C3.5 4.75 5.5 2.25 9 2.25Z',
    { tint: true },
  ),
  cut('M7.5 2.75C5.75 5 5.75 9 7.5 11.25'),
  cut('M10.5 2.75C12.25 5 12.25 9 10.5 11.25'),
  body(rect(7.25, 13.5, 3.5, 2.25, 0.75)),
  stroke(seg(7.25, 11.5, 7.75, 13.5)),
  stroke(seg(10.75, 11.5, 10.25, 13.5)),
]);

// ---- water -------------------------------------------------------------

const wave = (y: number) => `M2 ${y}q1.75-1.5 3.5 0t3.5 0t3.5 0t3.5 0`;

/** Passenger ship with a funnel. */
export const ShipIcon = /*#__PURE__*/ createIcon('Ship', () => [
  body(roundPolygon(1, 2, 9.75, 16, 9.75, 14, 13.25, 4, 13.25), { tint: true }),
  stroke(poly(5.5, 9.75, 5.5, 6.75, 12.5, 6.75, 12.5, 9.75)),
  stroke(poly(8, 6.75, 8, 3.75, 11, 3.75, 11, 6.75)),
  stroke(wave(16)),
]);

/** Container ship. */
export const CargoShipIcon = /*#__PURE__*/ createIcon('CargoShip', () => [
  body(roundPolygon(1, 2, 11.75, 16, 11.75, 14, 15.25, 4, 15.25), { tint: true }),
  body(rect(2.5, 7.25, 3.25, 3, 0.75)),
  body(rect(7.25, 7.25, 3.25, 3, 0.75)),
  body(rect(12, 5.25, 3.5, 5, 0.75)),
]);

/** Sailing boat. */
export const SailboatIcon = /*#__PURE__*/ createIcon('Sailboat', () => [
  body(roundPolygon(0.75, 8.5, 2.75, 8.5, 10.5, 3.75, 10.5), { tint: true }),
  body(roundPolygon(0.75, 10.5, 6, 10.5, 10.5, 14.5, 10.5)),
  body(roundPolygon(1, 3, 12.75, 15, 12.75, 13, 15.75, 5, 15.75)),
]);

/** Small submarine with a periscope. */
export const SubmarineIcon = /*#__PURE__*/ createIcon('Submarine', () => [
  body(rect(4, 8, 12, 6.5, 3.25), { tint: true }),
  stroke(poly(7, 8, 7.75, 5.5, 11.25, 5.5, 12, 8)),
  stroke(poly(9.5, 5.5, 9.5, 2.75, 12.25, 2.75)),
  stroke(seg(2, 11.25, 4, 11.25)),
  stroke(seg(2, 9.25, 2, 13.25)),
  hole(7.5, 11.25),
  hole(10.5, 11.25),
  hole(13.5, 11.25),
]);

// ---- work vehicles -----------------------------------------------------

/** Forklift with its forks lowered. */
export const ForkliftIcon = /*#__PURE__*/ createIcon('Forklift', () => [
  body(rect(2.25, 8, 8.75, 3, 1), { tint: true }),
  wheel(4.5, 12.75, 1.5),
  wheel(9, 12.75, 1.75),
  stroke(roundPoly(1, 4.25, 8, 4.25, 3.5, 8.5, 3.5, 8.5, 8)),
  stroke(seg(11, 9.5, 13.5, 9.5)),
  stroke(seg(13.5, 2.5, 13.5, 14)),
  stroke(seg(13.5, 14, 16, 14)),
]);

/** Farm tractor. */
export const TractorIcon = /*#__PURE__*/ createIcon('Tractor', () => [
  stroke(circle(5.5, 11.75, 3.25)),
  body(rect(10.75, 7, 5, 4, 1), { tint: true }),
  wheel(13.25, 14.25, 1.75),
  stroke(roundPoly(1.25, 5.5, 8.5, 5.5, 3.5, 9.25, 3.5, 9.25, 7, 10.75, 7)),
  stroke(seg(8.25, 10, 10.75, 10)),
  stroke(seg(13.25, 7, 13.25, 4)),
]);

/** Caravan with a hitch. */
export const CaravanIcon = /*#__PURE__*/ createIcon('Caravan', () => [
  body(wheeled(2.5, [13, 12.5, 13, 3.75, 2, 3.75, 2, 12.5], 12.5, [[7.5, 12.5, 3.25]]), { tint: true }),
  cut(seg(5, 6.75, 10, 6.75)),
  wheel(7.5, 12.5),
  stroke(seg(13, 11, 16, 11)),
]);
