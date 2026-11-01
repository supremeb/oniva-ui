import { createIcon } from '../createIcon';
import {
  LINED,
  SOLID,
  arc,
  body,
  circle,
  cut,
  dot,
  hole,
  poly,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  stroke,
  type Part,
} from '../shapes';

// Home, buildings and furniture.

// ---- shared pieces -------------------------------------------------------

/** House silhouette (same as Home). */
const HOUSE = roundPolygon(1.25, 9, 2.25, 15.5, 7.5, 15.5, 15.5, 2.5, 15.5, 2.5, 7.5);

/** Solid mark that knocks out in the fill styles. */
const holeShape = (d: string): Part => ({ k: 'hole', d });

const plusMod = () => [stroke(seg(13.75, 11.5, 13.75, 16)), stroke(seg(11.5, 13.75, 16, 13.75))];

// ---- houses ----------------------------------------------------------------

export const HousePlusIcon = /*#__PURE__*/ createIcon('HousePlus', () => [
  body(roundPoly(1.25, 9.25, 15.5, 2.5, 15.5, 2.5, 7.5, 9, 2.25, 15.5, 7.5, 15.5, 8.5), {
    tint: true,
    only: LINED,
  }),
  body(roundPolygon(1.25, 9, 2.25, 15.5, 7.5, 15.5, 8.5, 9.25, 8.5, 9.25, 15.5, 2.5, 15.5, 2.5, 7.5), {
    only: SOLID,
  }),
  ...plusMod(),
]);

export const HouseHeartIcon = /*#__PURE__*/ createIcon('HouseHeart', () => [
  body(HOUSE, { tint: true }),
  holeShape(
    'M9 13.25C6.75 11.75 5.75 10.75 5.75 9.65C5.75 8.6 6.5 8 7.4 8C8.1 8 8.7 8.4 9 9C9.3 8.4 9.9 8 10.6 8' +
      'C11.5 8 12.25 8.6 12.25 9.65C12.25 10.75 11.25 11.75 9 13.25Z',
  ),
]);

export const HouseWifiIcon = /*#__PURE__*/ createIcon('HouseWifi', () => [
  body(HOUSE, { tint: true }),
  cut(arc(9, 13, 3, -45, 45)),
  cut(arc(9, 13, 6, -45, 45)),
  hole(9, 12.75, 1),
]);

export const HouseChimneyIcon = /*#__PURE__*/ createIcon('HouseChimney', () => [
  body(HOUSE, { tint: true }),
  stroke(poly(11.5, 4.5, 11.5, 2.75, 14.5, 2.75, 14.5, 6.75)),
  cut(poly(7.25, 15.5, 7.25, 12, 10.75, 12, 10.75, 15.5)),
]);

export const KeyHouseIcon = /*#__PURE__*/ createIcon('KeyHouse', () => [
  body(roundPolygon(0.75, 5.75, 8.5, 9, 11.25, 9, 15, 2.5, 15, 2.5, 11.25), { tint: true }),
  hole(5.75, 12.75, 1),
  stroke(poly(9, 11.25, 15.25, 5)),
  stroke(seg(13.75, 6.5, 15.25, 8)),
  stroke(seg(11, 9.25, 12.5, 10.75)),
]);

// ---- buildings -------------------------------------------------------------

export const BuildingsIcon = /*#__PURE__*/ createIcon('Buildings', () => [
  body(rect(2.5, 2, 7.5, 14, 2), { tint: true }),
  body(rect(10, 7.75, 5.5, 8.25, [0, 2, 2, 0])),
  hole(6.25, 5.25),
  hole(6.25, 8.75),
  hole(6.25, 12.25),
  hole(12.75, 12),
]);

export const OfficeIcon = /*#__PURE__*/ createIcon('Office', () => [
  body(roundPolygon(1, 2.5, 15.5, 2.5, 7.5, 5.75, 7.5, 5.75, 2.5, 12.25, 2.5, 12.25, 7.5, 15.5, 7.5, 15.5, 15.5), {
    tint: true,
  }),
  holeShape(rect(8.25, 4.25, 1.5, 2, 0.75)),
  holeShape(rect(4.75, 10, 1.5, 3.5, 0.75)),
  holeShape(rect(8.25, 10, 1.5, 3.5, 0.75)),
  holeShape(rect(11.75, 10, 1.5, 3.5, 0.75)),
]);

export const WarehouseIcon = /*#__PURE__*/ createIcon('Warehouse', () => [
  body(roundPolygon(1.25, 9, 3, 15.5, 6.75, 15.5, 15.5, 2.5, 15.5, 2.5, 6.75), { tint: true }),
  cut(poly(5.75, 15.5, 5.75, 9.5, 12.25, 9.5, 12.25, 15.5)),
  cut(seg(9, 9.5, 9, 15.5)),
]);

export const FactoryIcon = /*#__PURE__*/ createIcon('Factory', () => [
  body(roundPolygon(0.75, 2.5, 15.5, 2.5, 10, 6.75, 7, 6.75, 10, 11, 7, 11, 2.75, 15.5, 2.75, 15.5, 15.5), {
    tint: true,
  }),
  hole(5.5, 12.75),
  hole(9.25, 12.75),
  hole(13, 12.75),
]);

export const HospitalIcon = /*#__PURE__*/ createIcon('Hospital', () => [
  body(rect(2.5, 3, 13, 13, 2.5), { tint: true }),
  cut(seg(9, 6.75, 9, 12.25)),
  cut(seg(6.25, 9.5, 11.75, 9.5)),
]);

export const CastleIcon = /*#__PURE__*/ createIcon('Castle', () => [
  body(roundPolygon(1, 2.5, 15.5, 2.5, 3, 6.5, 3, 6.5, 7.5, 11.5, 7.5, 11.5, 3, 15.5, 3, 15.5, 15.5), {
    tint: true,
  }),
  cut('M7.5 15.5V12.5A1.5 1.5 0 0 1 10.5 12.5V15.5'),
]);

export const TowerIcon = /*#__PURE__*/ createIcon('Tower', () => [
  body(roundPolygon(1, 3.75, 2.5, 14.25, 2.5, 14.25, 5.75, 12.25, 6.75, 12.25, 15.5, 5.75, 15.5, 5.75, 6.75, 3.75, 5.75), { tint: true }),
  cut(seg(7.25, 2.5, 7.25, 4.25)),
  cut(seg(10.75, 2.5, 10.75, 4.25)),
  cut('M7.75 15.5V12.5A1.25 1.25 0 0 1 10.25 12.5V15.5'),
]);

// ---- doors and windows ----------------------------------------------------------

export const DoorIcon = /*#__PURE__*/ createIcon('Door', () => [
  body(rect(4, 2, 10, 14, 1.5), { tint: true }),
  hole(11, 9.25),
]);

export const DoorOpenIcon = /*#__PURE__*/ createIcon('DoorOpen', () => [
  body(roundPolygon(0.75, 4, 2, 9, 5, 9, 13, 4, 16), { tint: true }),
  stroke(poly(4, 2, 14, 2, 14, 16, 4, 16)),
]);

export const WindowIcon = /*#__PURE__*/ createIcon('Window', () => [
  body(rect(3.25, 2, 11.5, 11, 2), { tint: true }),
  cut(seg(9, 2, 9, 13)),
  cut(seg(3.25, 7.5, 14.75, 7.5)),
  stroke(seg(2, 16, 16, 16)),
]);

export const FenceIcon = /*#__PURE__*/ createIcon('Fence', () => [
  body(roundPolygon(0.75, 2.5, 15.5, 2.5, 8, 4.67, 5, 6.83, 8, 9, 5, 11.17, 8, 13.33, 5, 15.5, 8, 15.5, 15.5), {
    tint: true,
  }),
  cut(seg(6.83, 8, 6.83, 15.5)),
  cut(seg(11.17, 8, 11.17, 15.5)),
]);

export const GarageIcon = /*#__PURE__*/ createIcon('Garage', () => [
  body(roundPolygon(1.25, 9, 2.75, 15.5, 6.5, 15.5, 15.5, 2.5, 15.5, 2.5, 6.5), { tint: true }),
  cut(poly(5.5, 15.5, 5.5, 9, 12.5, 9, 12.5, 15.5)),
  cut(seg(5.5, 12.25, 12.5, 12.25)),
]);

// ---- furniture ---------------------------------------------------------------

export const BedIcon = /*#__PURE__*/ createIcon('Bed', () => [
  stroke(seg(2.5, 3.5, 2.5, 15.5)),
  body(rect(2.5, 9, 13, 4, 1.25), { tint: true }),
  stroke(seg(15.5, 13, 15.5, 15.5)),
  stroke('M5.5 9V7.75A1.75 1.75 0 0 1 7.25 6H8.5A1.75 1.75 0 0 1 10.25 7.75V9'),
]);

export const SofaIcon = /*#__PURE__*/ createIcon('Sofa', () => [
  stroke('M4.5 8V6.5A2 2 0 0 1 6.5 4.5H11.5A2 2 0 0 1 13.5 6.5V8'),
  body(rect(2.5, 8, 13, 5.5, 2), { tint: true }),
  cut(seg(5.5, 8, 5.5, 13.5)),
  cut(seg(12.5, 8, 12.5, 13.5)),
  stroke(seg(4.75, 13.5, 4.75, 15.5)),
  stroke(seg(13.25, 13.5, 13.25, 15.5)),
]);

export const ArmchairIcon = /*#__PURE__*/ createIcon('Armchair', () => [
  stroke('M4.75 8.5V5A2.5 2.5 0 0 1 7.25 2.5H10.75A2.5 2.5 0 0 1 13.25 5V8.5'),
  body(rect(3, 8.5, 12, 5, 2), { tint: true }),
  cut(seg(6, 8.5, 6, 13.5)),
  cut(seg(12, 8.5, 12, 13.5)),
  stroke(seg(5, 13.5, 5, 15.5)),
  stroke(seg(13, 13.5, 13, 15.5)),
]);

export const LampIcon = /*#__PURE__*/ createIcon('Lamp', () => [
  body(roundPolygon(1, 6.25, 2.5, 11.75, 2.5, 14, 8.5, 4, 8.5), { tint: true }),
  stroke(seg(9, 8.5, 9, 15.5)),
  stroke(seg(5.5, 15.5, 12.5, 15.5)),
]);

export const LampDeskIcon = /*#__PURE__*/ createIcon('LampDesk', () => [
  body(roundPolygon(0.75, 6.73, 2.98, 8.27, 4.52, 6.28, 8.83, 2.42, 4.97), { tint: true }),
  stroke(roundPoly(1, 8.4, 4.4, 12.25, 8.25, 12.25, 13.5)),
  body(rect(8.75, 13.5, 7, 2.5, 1.25)),
]);

// ---- bathroom and kitchen ------------------------------------------------------------

export const BathIcon = /*#__PURE__*/ createIcon('Bath', () => [
  body('M2.5 8.5H15.5V10.5A3.5 3.5 0 0 1 12 14H6A3.5 3.5 0 0 1 2.5 10.5Z', { tint: true }),
  stroke('M4.75 8.5V4.75A2 2 0 0 1 6.75 2.75H8'),
  dot(11.5, 5.5, 1, { soft: true }),
  dot(14, 3.75, 1, { soft: true }),
]);

export const ShowerIcon = /*#__PURE__*/ createIcon('Shower', () => [
  stroke('M2.5 14V4.5A2.5 2.5 0 0 1 5 2H11V4'),
  body('M6.5 9A4.5 4.5 0 0 1 15.5 9Z', { tint: true }),
  stroke(seg(8, 11.5, 8, 13.5)),
  stroke(seg(11, 11.5, 11, 15)),
  stroke(seg(14, 11.5, 14, 13.5)),
]);

export const StoveIcon = /*#__PURE__*/ createIcon('Stove', () => [
  body(rect(2.5, 2, 13, 14, 2), { tint: true }),
  cut(seg(2.5, 6.25, 15.5, 6.25)),
  hole(5.75, 4.1, 0.8),
  hole(9, 4.1, 0.8),
  hole(12.25, 4.1, 0.8),
  cut(rect(5.25, 9, 7.5, 4.25, 1)),
]);

export const FridgeIcon = /*#__PURE__*/ createIcon('Fridge', () => [
  body(rect(4.5, 2, 9, 14, 2), { tint: true }),
  cut(seg(4.5, 8, 13.5, 8)),
  hole(11, 5),
  cut(seg(11, 10.75, 11, 13)),
]);

export const WashingMachineIcon = /*#__PURE__*/ createIcon('WashingMachine', () => [
  body(rect(3, 2, 12, 14, 2), { tint: true }),
  hole(5.75, 4.75),
  hole(9, 4.75),
  cut(circle(9, 10.75, 2.75)),
]);

// ---- plants, stairs, plans --------------------------------------------------------------

export const PlantPotIcon = /*#__PURE__*/ createIcon('PlantPot', () => [
  body(roundPolygon(1, 4.5, 10, 13.5, 10, 12.25, 15.5, 5.75, 15.5), { tint: true }),
  body('M9 10C9 7.25 6.75 5.5 3.5 5.75C3.5 8.75 5.5 10 9 10Z'),
  body('M9 10C9 5.5 11 3.25 14.5 3C14.5 7 12.5 10 9 10Z'),
]);

export const StairsIcon = /*#__PURE__*/ createIcon('Stairs', () => [
  body(
    roundPolygon(0.75, 2.5, 15.5, 2.5, 12.5, 6.25, 12.5, 6.25, 9.5, 10, 9.5, 10, 6.5, 13.75, 6.5, 13.75, 3.5, 15.5, 3.5, 15.5, 15.5),
    { tint: true },
  ),
]);

export const ElevatorIcon = /*#__PURE__*/ createIcon('Elevator', () => [
  body(rect(3, 2, 12, 14, 2), { tint: true }),
  cut(poly(7, 7.5, 9, 5.5, 11, 7.5)),
  cut(poly(7, 10.5, 9, 12.5, 11, 10.5)),
]);

export const BlueprintIcon = /*#__PURE__*/ createIcon('Blueprint', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut(seg(9.5, 2.5, 9.5, 6.5)),
  cut(seg(9.5, 9.5, 9.5, 15.5)),
  cut(seg(2.5, 9.5, 6.5, 9.5)),
  cut(seg(12.5, 9.5, 15.5, 9.5)),
]);
