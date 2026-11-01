import { createIcon } from '../createIcon';
import type { Part } from '../shapes';
import {
  arc,
  body,
  circle,
  cut,
  head,
  hole,
  LINED,
  polar,
  poly,
  rect,
  seg,
  SOLID,
  stroke,
} from '../shapes';

// Business and finance.

const q = (v: number) => String(Math.round(v * 100) / 100);

/**
 * A dollar-like S centered on cx,cy with half width `a` and half height `b`.
 * Used inside coins, bags and receipts.
 */
function sCurve(cx: number, cy: number, a: number, b: number): string {
  const p = (x: number, y: number) => `${q(cx + x * a)} ${q(cy + y * b)}`;
  return (
    `M${p(1, -0.5)}C${p(1, -0.85)} ${p(0.5, -1)} ${p(0, -1)}` +
    `C${p(-0.55, -1)} ${p(-1, -0.8)} ${p(-1, -0.4)}` +
    `C${p(-1, -0.1)} ${p(-0.5, 0)} ${p(0, 0)}` +
    `C${p(0.5, 0)} ${p(1, 0.1)} ${p(1, 0.4)}` +
    `C${p(1, 0.8)} ${p(0.55, 1)} ${p(0, 1)}` +
    `C${p(-0.5, 1)} ${p(-1, 0.85)} ${p(-1, 0.5)}`
  );
}

/** Portrait page with a folded top-right corner (same as File) and its fold. */
const PAGE = 'M10.5 2H5.25A2 2 0 0 0 3.25 4V14A2 2 0 0 0 5.25 16H12.75A2 2 0 0 0 14.75 14V6.25Z';
const FOLD = 'M10.5 2.25V5.25A1 1 0 0 0 11.5 6.25H14.5';
const page = (...marks: Part[]): Part[] => [body(PAGE, { tint: true }), cut(FOLD), ...marks];

/** Plus modifier in the bottom-right zone; the base glyph stops on a circle of radius 5.25 around 13.75,13.75. */
const plusMod = (): Part[] => [stroke(seg(13.75, 11.5, 13.75, 16)), stroke(seg(11.5, 13.75, 16, 13.75))];

/** Briefcase body and handle shared by Briefcase and Portfolio. */
const CASE_HANDLE = 'M6.75 5.5V5A2 2 0 0 1 8.75 3H9.25A2 2 0 0 1 11.25 5V5.5';

// ---- coins and notes --------------------------------------------------------

export const CoinIcon = /*#__PURE__*/ createIcon('Coin', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut('M7.25 7.75L9.5 5.75V12.25'),
]);

export const CoinsIcon = /*#__PURE__*/ createIcon('Coins', () => [
  stroke(arc(11, 7, 5, -79.4, 169.5)),
  body(circle(7, 11, 5), { tint: true }),
  cut(circle(7, 11, 2)),
]);

export const DollarCircleIcon = /*#__PURE__*/ createIcon('DollarCircle', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(sCurve(9, 9, 2.1, 3.25)),
]);

export const CurrencyIcon = /*#__PURE__*/ createIcon('Currency', () => {
  const ticks = [45, 135, 225, 315].map((a) => {
    const [x0, y0] = polar(9, 9, 3.5, a);
    const [x1, y1] = polar(9, 9, 6.75, a);
    return stroke(seg(x0, y0, x1, y1));
  });
  return [body(circle(9, 9, 3.5), { tint: true }), hole(9, 9, 1.25), ...ticks];
});

export const BanknoteIcon = /*#__PURE__*/ createIcon('Banknote', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(circle(9, 9, 2.25)),
]);

export const CashIcon = /*#__PURE__*/ createIcon('Cash', () => [
  stroke('M5 7.5V7A2.5 2.5 0 0 1 7.5 4.5H13.5A2.5 2.5 0 0 1 16 7V10.5A2.5 2.5 0 0 1 13.5 13H13'),
  body(rect(2, 7.5, 11, 8, 2.5), { tint: true }),
  hole(7.5, 11.5, 1.25),
]);

export const EuroIcon = /*#__PURE__*/ createIcon('Euro', () => [
  stroke('M13.5 5C12.6 3.9 11.3 3.25 9.75 3.25C6.8 3.25 4.5 5.8 4.5 9S6.8 14.75 9.75 14.75C11.3 14.75 12.6 14.1 13.5 13'),
  stroke(seg(2.5, 7.5, 10.5, 7.5)),
  stroke(seg(2.5, 10.5, 10.5, 10.5)),
]);

export const PoundIcon = /*#__PURE__*/ createIcon('Pound', () => [
  stroke('M12.75 6A3.5 3.5 0 0 0 9.25 3C7.3 3 5.75 4.5 5.75 6.5V11.5C5.75 13 5.25 14 4 14.75H13.5'),
  stroke(seg(3.75, 9.5, 9.5, 9.5)),
]);

export const YenIcon = /*#__PURE__*/ createIcon('Yen', () => [
  stroke(poly(4.5, 2.75, 9, 8, 13.5, 2.75)),
  stroke(seg(9, 8, 9, 15.5)),
  stroke(seg(5.5, 10.25, 12.5, 10.25)),
  stroke(seg(5.5, 13, 12.5, 13)),
]);

export const MoneyBagIcon = /*#__PURE__*/ createIcon('MoneyBag', () => [
  body(
    'M7.25 3.25H10.75L11.25 5.5C13.4 7 15.25 9.4 15.25 12.25C15.25 14.3 13.8 16 11.5 16H6.5C4.2 16 2.75 14.3 2.75 12.25C2.75 9.4 4.6 7 6.75 5.5Z',
    { tint: true },
  ),
  cut(sCurve(9, 11.25, 1.75, 2.6)),
]);

// ---- saving and investing ---------------------------------------------------

export const PiggyBankIcon = /*#__PURE__*/ createIcon('PiggyBank', () => [
  body(
    'M14 7.25C14.9 7.5 16 8.1 16 9V11.25H14.1C13.5 12.3 12.7 13 11.75 13.4V15.25H9.75V14.25H7.5V15.25H5.5V13.6C3.9 12.7 2.75 11.1 2.75 9.25C2.75 6.5 5.4 4.5 8.5 4.5C10.8 4.5 12.8 5.5 14 7.25Z',
    { tint: true },
  ),
  cut(seg(6.75, 7, 9.75, 7)),
  hole(12.5, 9.25),
]);

export const SavingsIcon = /*#__PURE__*/ createIcon('Savings', () => [
  body(rect(5, 2.25, 8, 3.25, 1)),
  body(
    'M5.5 5.5H12.5C13.9 6.3 14.75 7.5 14.75 9V13.5A2.5 2.5 0 0 1 12.25 16H5.75A2.5 2.5 0 0 1 3.25 13.5V9C3.25 7.5 4.1 6.3 5.5 5.5Z',
    { tint: true },
  ),
  cut(seg(5.5, 5.5, 12.5, 5.5), { only: SOLID }),
  cut(circle(9, 11.25, 2.25)),
]);

export const InvestIcon = /*#__PURE__*/ createIcon('Invest', () => [
  body(circle(9, 13, 3), { tint: true }),
  stroke(seg(9, 10, 9, 7.25)),
  body('M9 9.25C5.25 9.25 3.5 7.5 3.5 4.5C7 4.5 9 6 9 9.25Z'),
  body('M9 7C9 4 10.75 2.5 14.5 2.5C14.5 5.5 12.5 7 9 7Z'),
]);

export const StockUpIcon = /*#__PURE__*/ createIcon('StockUp', () => [
  stroke(seg(4.5, 7, 4.5, 9.5)),
  stroke(seg(4.5, 13, 4.5, 15.5)),
  body(rect(3.25, 9.5, 2.5, 3.5, 0.75)),
  stroke(seg(9.5, 3, 9.5, 5.5)),
  stroke(seg(9.5, 10.5, 9.5, 13)),
  body(rect(8.25, 5.5, 2.5, 5, 0.75), { tint: true }),
  stroke(seg(14.5, 15.5, 14.5, 3.25)),
  stroke(head(14.5, 3.25, 0, 3.5)),
]);

export const PortfolioIcon = /*#__PURE__*/ createIcon('Portfolio', () => [
  stroke(CASE_HANDLE),
  body(rect(2, 5.5, 14, 10.5, 2.5), { tint: true }),
  cut(poly(5.5, 12.5, 8, 10, 10, 11.75, 12.5, 9)),
]);

export const BriefcaseIcon = /*#__PURE__*/ createIcon('Briefcase', () => [
  stroke(CASE_HANDLE),
  body(rect(2, 5.5, 14, 10.5, 2.5), { tint: true }),
  cut(seg(2, 10, 16, 10)),
  hole(9, 10, 1.25),
]);

export const SafeIcon = /*#__PURE__*/ createIcon('Safe', () => [
  stroke(seg(5.5, 14, 5.5, 16)),
  stroke(seg(12.5, 14, 12.5, 16)),
  body(rect(2.5, 2.5, 13, 11.5, 2.5), { tint: true }),
  cut(circle(9, 8.25, 2.5)),
  hole(9, 8.25, 1),
]);

export const ExchangeIcon = /*#__PURE__*/ createIcon('Exchange', () => {
  const [x1, y1] = polar(9, 9, 6.5, 155);
  const [x2, y2] = polar(9, 9, 6.5, 335);
  return [
    body(circle(9, 9, 2.75), { tint: true }),
    stroke(arc(9, 9, 6.5, 25, 155)),
    stroke(head(x1, y1, 245, 3.5)),
    stroke(arc(9, 9, 6.5, 205, 335)),
    stroke(head(x2, y2, 65, 3.5)),
  ];
});

export const HandCoinsIcon = /*#__PURE__*/ createIcon('HandCoins', () => [
  body(circle(11.5, 5, 3), { tint: true }),
  hole(11.5, 5, 1),
  body(rect(2, 10.25, 3.25, 5.75, 1)),
  stroke('M5.25 11.5H7.5L9 10.75H11.75A1.5 1.5 0 0 1 11.75 13.75H8.5'),
  stroke('M5.25 14.75L8.5 15.75H11.5C12.3 15.75 13 15.4 13.6 14.9L16 12.75'),
]);

// ---- weighing and documents -------------------------------------------------

export const ScaleIcon = /*#__PURE__*/ createIcon('Scale', () => [
  stroke(seg(9, 3, 9, 15)),
  stroke(seg(6, 15.5, 12, 15.5)),
  stroke(seg(3.75, 5, 14.25, 5)),
  stroke(poly(3.75, 5, 1.5, 10.5)),
  stroke(poly(3.75, 5, 6, 10.5)),
  stroke(poly(14.25, 5, 12, 10.5)),
  stroke(poly(14.25, 5, 16.5, 10.5)),
  body('M1.5 10.5H6A2.25 2.25 0 0 1 1.5 10.5Z', { tint: true }),
  body('M12 10.5H16.5A2.25 2.25 0 0 1 12 10.5Z', { tint: true }),
]);

export const InvoiceIcon = /*#__PURE__*/ createIcon('Invoice', () =>
  page(cut(seg(6.25, 9, 11.75, 9)), cut(seg(6.25, 12.25, 8.5, 12.25)), hole(11.25, 12.25)),
);

export const ContractIcon = /*#__PURE__*/ createIcon('Contract', () =>
  page(cut(seg(6.25, 8.75, 11.75, 8.75)), cut('M6.25 13.25C7 10.75 8 11 8.25 12.25S9.5 13.75 11.75 11.75')),
);

export const TaxIcon = /*#__PURE__*/ createIcon('Tax', () =>
  page(cut(seg(11.5, 8.25, 6.5, 13.25)), hole(6.75, 8.75), hole(11.25, 12.75)),
);

export const ReceiptDollarIcon = /*#__PURE__*/ createIcon('ReceiptDollar', () => [
  body(
    'M3.75 4A2 2 0 0 1 5.75 2H12.25A2 2 0 0 1 14.25 4V16L12.5 14.75L10.75 16L9 14.75L7.25 16L5.5 14.75L3.75 16Z',
    { tint: true },
  ),
  cut(sCurve(9, 8.75, 1.75, 2.75)),
]);

export const ChequeIcon = /*#__PURE__*/ createIcon('Cheque', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(seg(5, 7.5, 8.5, 7.5)),
  cut(seg(5, 10.5, 7.5, 10.5)),
  cut('M10.25 11.25C10.9 9.75 11.5 10 11.75 11S12.5 11.75 13.25 10.75'),
]);

export const ReceiptPercentIcon = /*#__PURE__*/ createIcon('ReceiptPercent', () => [
  body(
    'M3.75 4A2 2 0 0 1 5.75 2H12.25A2 2 0 0 1 14.25 4V16L12.5 14.75L10.75 16L9 14.75L7.25 16L5.5 14.75L3.75 16Z',
    { tint: true },
  ),
  cut(seg(11, 5.75, 7, 9.75)),
  hole(7, 5.75),
  hole(11, 9.75),
]);

// ---- cards and calculators --------------------------------------------------

export const CalculatorIcon = /*#__PURE__*/ createIcon('Calculator', () => [
  body(rect(3.25, 2, 11.5, 14, 2.5), { tint: true }),
  cut(seg(6.5, 5.75, 11.5, 5.75)),
  hole(6.75, 9.5),
  hole(11.25, 9.5),
  hole(6.75, 12.75),
  hole(11.25, 12.75),
]);

export const PercentIcon = /*#__PURE__*/ createIcon('Percent', () => [
  stroke(seg(13.25, 4.75, 4.75, 13.25)),
  body(circle(5.25, 5.25, 2.25), { tint: true }),
  body(circle(12.75, 12.75, 2.25), { tint: true }),
]);

export const BankCardIcon = /*#__PURE__*/ createIcon('BankCard', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(rect(4.25, 6.5, 4, 4.25, 1)),
  cut(seg(10.75, 8.5, 13, 8.5)),
]);

export const CreditCardPlusIcon = /*#__PURE__*/ createIcon('CreditCardPlus', () => [
  body('M16 9V6.25A2.5 2.5 0 0 0 13.5 3.75H4.5A2.5 2.5 0 0 0 2 6.25V11.75A2.5 2.5 0 0 0 4.5 14.25H8.5H7', {
    tint: true,
    only: LINED,
  }),
  body('M16 9V6.25A2.5 2.5 0 0 0 13.5 3.75H4.5A2.5 2.5 0 0 0 2 6.25V11.75A2.5 2.5 0 0 0 4.5 14.25H8.5A5.25 5.25 0 0 1 16 9Z', {
    only: SOLID,
  }),
  cut(seg(2, 7.5, 16, 7.5)),
  cut(seg(5.25, 11.25, 7.75, 11.25)),
  ...plusMod(),
]);

export const WalletCardsIcon = /*#__PURE__*/ createIcon('WalletCards', () => [
  stroke('M4.25 6.5V5.5A2 2 0 0 1 6.25 3.5H11.75A2 2 0 0 1 13.75 5.5V6.5'),
  body(rect(2, 6.5, 14, 9.5, 2.5), { tint: true }),
  cut('M16 9.25H11.75A1.5 1.5 0 0 0 10.25 10.75V12.25A1.5 1.5 0 0 0 11.75 13.75H16'),
  hole(13, 11.5),
]);
