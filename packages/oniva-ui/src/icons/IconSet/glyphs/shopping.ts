import { createIcon } from '../createIcon';
import { arc, body, circle, cut, dot, head, hole, poly, polar, rect, roundPoly, roundPolygon, seg, SOLID, stroke } from '../shapes';
import type { Part } from '../shapes';

// Shopping and commerce.

const f = (v: number) => String(Math.round(v * 100) / 100);

// ---- modifier zone ------------------------------------------------------------
// Modifiers sit at 13.75,13.75. The base shape stops on a circle of radius 5.25 around that point.

const MX = 13.75;
const MY = 13.75;
const MR = 5.25;
/** y where a vertical wall at x meets the upper half of the modifier circle. */
const wallY = (x: number, cy = MY, r = MR) => cy - Math.sqrt(r * r - (x - MX) ** 2);
/** x where a horizontal edge at y meets the left half of the modifier circle. */
const edgeX = (y: number, cx = MX, r = MR) => cx - Math.sqrt(r * r - (y - MY) ** 2);

const plusMod = (): Part[] => [stroke(seg(13.75, 11.5, 13.75, 16)), stroke(seg(11.5, 13.75, 16, 13.75))];
const checkMod = (): Part[] => [stroke(poly(11.5, 13.75, 13.25, 15.5, 16.25, 12))];
const xMod = (): Part[] => [stroke(seg(11.75, 11.75, 15.75, 15.75)), stroke(seg(15.75, 11.75, 11.75, 15.75))];

// ---- carts ----------------------------------------------------------------------

export const ShoppingCartIcon = /*#__PURE__*/ createIcon('ShoppingCart', () => [
  body(roundPolygon(1, 4.125, 5.5, 15.5, 5.5, 13.75, 11.5, 6, 11.5), { tint: true }),
  stroke(poly(2, 3.5, 3.5, 3.5, 6, 11.5)),
  dot(7.5, 14.75, 1.25),
  dot(12.5, 14.75, 1.25),
]);

/** Cart with its basket cut back around the modifier. */
const cartMod = (...mod: Part[]): Part[] => {
  const wx = 14.78;
  const wy = wallY(wx);
  const bx = edgeX(10);
  return [
    body(`M4.1 4.5H14.4Q15.8 4.5 15.5 5.9L${f(wx)} ${f(wy)}A5.25 5.25 0 0 0 ${f(bx)} 10H6Z`, { tint: true }),
    stroke(poly(2, 2.75, 3.5, 2.75, 6, 10)),
    dot(7.5, 13.5, 1.25),
    ...mod,
  ];
};

export const CartPlusIcon = /*#__PURE__*/ createIcon('CartPlus', () => cartMod(...plusMod()));
export const CartXIcon = /*#__PURE__*/ createIcon('CartX', () => cartMod(...xMod()));
export const CartMinusIcon = /*#__PURE__*/ createIcon('CartMinus', () => cartMod(stroke(seg(11.5, 13.75, 16, 13.75))));
export const CartCheckIcon = /*#__PURE__*/ createIcon('CartCheck', () => cartMod(...checkMod()));

// ---- bags and baskets -----------------------------------------------------------

const bagHandle = (): Part => stroke('M6.5 5.5A2.5 2.5 0 0 1 11.5 5.5');

export const ShoppingBagIcon = /*#__PURE__*/ createIcon('ShoppingBag', () => [
  body(rect(3, 5.5, 12, 10.5, 2.5), { tint: true }),
  bagHandle(),
  hole(6.5, 9, 1),
  hole(11.5, 9, 1),
]);

/** Bag cut back around the modifier. */
const bagMod = (...mod: Part[]): Part[] => {
  const wy = wallY(15);
  const bx = edgeX(16);
  return [
    body(
      `M5.5 5.5H12.5A2.5 2.5 0 0 1 15 8V${f(wy)}A5.25 5.25 0 0 0 ${f(bx)} 16H5.5A2.5 2.5 0 0 1 3 13.5V8A2.5 2.5 0 0 1 5.5 5.5Z`,
      { tint: true },
    ),
    bagHandle(),
    ...mod,
  ];
};

export const BagPlusIcon = /*#__PURE__*/ createIcon('BagPlus', () => bagMod(...plusMod()));
export const BagCheckIcon = /*#__PURE__*/ createIcon('BagCheck', () => bagMod(...checkMod()));

export const BasketIcon = /*#__PURE__*/ createIcon('Basket', () => [
  body(roundPolygon(1.25, 3.5, 10, 14.5, 10, 13.25, 15.5, 4.75, 15.5), { tint: true }),
  stroke(seg(2, 10, 16, 10)),
  stroke('M5.75 10C5.75 6 7 3.5 9 3.5S12.25 6 12.25 10'),
  cut(seg(7.5, 10, 7.5, 15.5)),
  cut(seg(10.5, 10, 10.5, 15.5)),
]);

// ---- stores ---------------------------------------------------------------------

export const StoreIcon = /*#__PURE__*/ createIcon('Store', () => [
  body(roundPolygon(1, 4.5, 3.5, 13.5, 3.5, 16, 8.5, 2, 8.5), { tint: true }),
  cut(seg(7.5, 3.5, 6.67, 8.5)),
  cut(seg(10.5, 3.5, 11.33, 8.5)),
  stroke('M3.5 8.5V14A2 2 0 0 0 5.5 16H12.5A2 2 0 0 0 14.5 14V8.5'),
  stroke('M7.25 16V12.75A1 1 0 0 1 8.25 11.75H9.75A1 1 0 0 1 10.75 12.75V16'),
]);

export const ShopIcon = /*#__PURE__*/ createIcon('Shop', () => [
  body('M5 3.5H13L16 8.5A2.33 2.33 0 0 1 11.33 8.5A2.33 2.33 0 0 1 6.67 8.5A2.33 2.33 0 0 1 2 8.5Z', { tint: true }),
  stroke('M3.5 10.5V14A2 2 0 0 0 5.5 16H12.5A2 2 0 0 0 14.5 14V10.5'),
  stroke('M7.25 16V14.25A1.75 1.75 0 0 1 10.75 14.25V16'),
]);

// ---- codes ----------------------------------------------------------------------

export const BarcodeIcon = /*#__PURE__*/ createIcon('Barcode', () => [
  stroke(seg(2.5, 3.75, 2.5, 14.25)),
  stroke(seg(5.5, 3.75, 5.5, 14.25)),
  stroke(seg(9.5, 3.75, 9.5, 14.25)),
  stroke(seg(12.5, 3.75, 12.5, 14.25)),
  stroke(seg(15.5, 3.75, 15.5, 14.25)),
]);

export const QrCodeIcon = /*#__PURE__*/ createIcon('QrCode', () => [
  body(rect(2.5, 2.5, 5.5, 5.5, 1.5), { tint: true }),
  body(rect(10, 2.5, 5.5, 5.5, 1.5), { tint: true }),
  body(rect(2.5, 10, 5.5, 5.5, 1.5), { tint: true }),
  hole(5.25, 5.25, 0.9),
  hole(12.75, 5.25, 0.9),
  hole(5.25, 12.75, 0.9),
  dot(11, 11, 1),
  dot(15, 11, 1),
  dot(13, 13, 1),
  dot(11, 15, 1),
  dot(15, 15, 1),
]);

export const ScanBarcodeIcon = /*#__PURE__*/ createIcon('ScanBarcode', () => [
  stroke('M2 6V4.5A2.5 2.5 0 0 1 4.5 2H6'),
  stroke('M12 2H13.5A2.5 2.5 0 0 1 16 4.5V6'),
  stroke('M16 12V13.5A2.5 2.5 0 0 1 13.5 16H12'),
  stroke('M6 16H4.5A2.5 2.5 0 0 1 2 13.5V12'),
  stroke(seg(6, 6.5, 6, 11.5)),
  stroke(seg(9, 6.5, 9, 11.5)),
  stroke(seg(12, 6.5, 12, 11.5)),
]);

// ---- gifts, coupons, tags -----------------------------------------------------------

export const GiftIcon = /*#__PURE__*/ createIcon('Gift', () => [
  body('M3.25 9V13.5A2.5 2.5 0 0 0 5.75 16H12.25A2.5 2.5 0 0 0 14.75 13.5V9', { tint: true }),
  body(rect(2, 5.5, 14, 3.5, 1.25)),
  cut(seg(9, 5.5, 9, 9)),
  cut(seg(9, 9, 9, 16)),
  stroke('M9 5.5C7.5 5.5 5.5 4.75 5.5 3.75C5.5 2.75 6.75 2.25 7.75 2.75C8.5 3.15 9 4.5 9 5.5'),
  stroke('M9 5.5C10.5 5.5 12.5 4.75 12.5 3.75C12.5 2.75 11.25 2.25 10.25 2.75C9.5 3.15 9 4.5 9 5.5'),
]);

export const CouponIcon = /*#__PURE__*/ createIcon('Coupon', () => [
  body(
    'M4.5 3.75H13.5A2.5 2.5 0 0 1 16 6.25V7.25A1.75 1.75 0 0 0 16 10.75V11.75A2.5 2.5 0 0 1 13.5 14.25H4.5A2.5 2.5 0 0 1 2 11.75V10.75A1.75 1.75 0 0 0 2 7.25V6.25A2.5 2.5 0 0 1 4.5 3.75Z',
    { tint: true },
  ),
  hole(6.75, 6.75, 1),
  hole(11.25, 11.25, 1),
  cut(seg(6.75, 11.25, 11.25, 6.75)),
]);

/** Tag leaned 45 degrees (point up-left) at centre cx,cy and scale s. */
const tagAt = (cx: number, cy: number, s: number) => {
  const k = Math.SQRT1_2 * s;
  return (x: number, y: number): [number, number] => [cx + (x + y) * k, cy + (y - x) * k];
};

export const TagsIcon = /*#__PURE__*/ createIcon('Tags', () => {
  const front = tagAt(6.2, 9.2, 0.85);
  const back = tagAt(9.2, 6.2, 0.85);
  const [hx, hy] = front(0, -2.5);
  const [tx, ty] = back(0, -6.5);
  const [rx, ry] = back(4.25, -2.5);
  const [qx, qy] = back(4.25, 6.5);
  return [
    stroke(roundPoly(1, tx + 0.1, ty + 3, tx, ty, rx, ry, qx, qy, qx - 2, qy + 2)),
    body(
      roundPolygon(
        1.25,
        ...front(0, -6.5),
        ...front(4.25, -2.5),
        ...front(4.25, 6.5),
        ...front(-4.25, 6.5),
        ...front(-4.25, -2.5),
      ),
      { tint: true },
    ),
    hole(hx, hy, 1),
  ];
});

// ---- packages ---------------------------------------------------------------------

export const BoxIcon = /*#__PURE__*/ createIcon('Box', () => [
  body(rect(2.5, 3, 13, 13, 2.5), { tint: true }),
  cut(seg(2.5, 7, 15.5, 7)),
  cut(seg(9, 3, 9, 7)),
  cut(seg(6, 12, 9.5, 12)),
]);

/** Carton cut back around the modifier. */
const boxMod = (...mod: Part[]): Part[] => {
  const wy = wallY(15.5);
  const bx = edgeX(16);
  return [
    body(
      `M5 3H13A2.5 2.5 0 0 1 15.5 5.5V${f(wy)}A5.25 5.25 0 0 0 ${f(bx)} 16H5A2.5 2.5 0 0 1 2.5 13.5V5.5A2.5 2.5 0 0 1 5 3Z`,
      { tint: true },
    ),
    cut(seg(2.5, 7, 15.5, 7)),
    cut(seg(9, 3, 9, 7)),
    ...mod,
  ];
};

export const PackageCheckIcon = /*#__PURE__*/ createIcon('PackageCheck', () => boxMod(...checkMod()));
export const PackageXIcon = /*#__PURE__*/ createIcon('PackageX', () => boxMod(...xMod()));

export const PackageOpenIcon = /*#__PURE__*/ createIcon('PackageOpen', () => [
  body(roundPolygon(0.75, 3, 9, 2, 4.5, 7, 4.5, 7.5, 9)),
  body(roundPolygon(0.75, 15, 9, 16, 4.5, 11, 4.5, 10.5, 9)),
  body(rect(3, 9, 12, 7, 2), { tint: true }),
  cut(seg(3, 9, 15, 9), { only: SOLID }),
  cut(seg(7, 12.5, 11, 12.5)),
]);

export const DeliveryIcon = /*#__PURE__*/ createIcon('Delivery', () => [
  body(rect(7.5, 4, 8.5, 10, 2), { tint: true }),
  cut(seg(7.5, 7.5, 16, 7.5)),
  cut(seg(11.75, 4, 11.75, 7.5)),
  stroke(seg(2, 6, 4.5, 6)),
  stroke(seg(3.5, 9, 4.5, 9)),
  stroke(seg(2, 12, 4.5, 12)),
]);

/** Delivery truck: cargo box, cab and two wheels. */
export const ShippingIcon = /*#__PURE__*/ createIcon('Shipping', () => [
  body(rect(2, 3.5, 9, 8.75, 2), { tint: true }),
  body(roundPolygon(1, 11, 7, 13.75, 7, 16, 9.75, 16, 12.25, 11, 12.25)),
  dot(5.5, 14.25, 1.25),
  dot(13, 14.25, 1.25),
]);

// ---- orders and checkout ----------------------------------------------------------------

export const CashRegisterIcon = /*#__PURE__*/ createIcon('CashRegister', () => [
  body(rect(5, 2.5, 8, 5, 1.25), { tint: true }),
  body(rect(2, 7.5, 14, 8.5, 2)),
  cut(seg(7.5, 5, 10.5, 5)),
  hole(5.75, 10.5, 1),
  hole(9, 10.5, 1),
  hole(12.25, 10.5, 1),
  cut(seg(5.5, 13.5, 12.5, 13.5)),
]);

export const PosTerminalIcon = /*#__PURE__*/ createIcon('PosTerminal', () => [
  body(rect(4.5, 2, 9, 14, 2), { tint: true }),
  cut(seg(7, 5.5, 11, 5.5)),
  hole(7, 9.5, 1),
  hole(11, 9.5, 1),
  hole(7, 12.75, 1),
  hole(11, 12.75, 1),
]);

export const CardTapIcon = /*#__PURE__*/ createIcon('CardTap', () => [
  body(rect(2, 8.5, 14, 7.5, 2), { tint: true }),
  cut(seg(2, 11.5, 16, 11.5)),
  stroke(arc(9, 7.5, 2.75, -45, 45)),
  stroke(arc(9, 7.5, 5.5, -45, 45)),
]);

export const WishlistIcon = /*#__PURE__*/ createIcon('Wishlist', () => [
  body(rect(3, 5.5, 12, 10.5, 2.5), { tint: true }),
  bagHandle(),
  cut('M9 14C7 12.7 5.75 11.7 5.75 10.45A1.6 1.6 0 0 1 9 10A1.6 1.6 0 0 1 12.25 10.45C12.25 11.7 11 12.7 9 14Z'),
]);

export const ScaleWeightIcon = /*#__PURE__*/ createIcon('ScaleWeight', () => [
  body(rect(2.5, 2.75, 13, 13, 3), { tint: true }),
  cut('M5.25 10.75A3.75 3.75 0 0 1 12.75 10.75'),
  cut(seg(9, 10.75, 10.25, 9)),
]);

export const RefundIcon = /*#__PURE__*/ createIcon('Refund', () => {
  const [ex, ey] = polar(9, 9, 7, 300);
  return [
    stroke(arc(9, 9, 7, 210, -60)),
    stroke(head(ex, ey, 210, 3.5)),
    body(circle(9, 9, 3), { tint: true }),
  ];
});
