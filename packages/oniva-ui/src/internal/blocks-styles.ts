import * as stylex from '@stylexjs/stylex';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';

const NARROW = '@media (max-width: 720px)';

/** Shared layout + type styles for marketing blocks (`src/blocks/*`). */
export const bs = stylex.create({
  section: {
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    containerType: 'inline-size',
    fontFamily: font['--oniva-font-sans'],
    paddingBlock: { default: 80, [NARROW]: 48 },
    paddingInline: { default: 32, [NARROW]: 16 },
    width: '100%',
  },
  inner: { marginInline: 'auto', maxWidth: 1120, width: '100%' },
  head: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40, maxWidth: 640 },
  headCenter: { alignItems: 'center', marginInline: 'auto', textAlign: 'center' },
  eyebrow: {
    color: colors['--oniva-color-accent-soft-fg'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-label'],
    margin: 0,
    textTransform: 'uppercase',
  },
  h2: {
    fontSize: { default: font['--oniva-font-size-40'], [NARROW]: font['--oniva-font-size-32'] },
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-hero'],
    lineHeight: 1.1,
    margin: 0,
    textWrap: 'balance',
  },
  h1: {
    fontSize: { default: font['--oniva-font-size-56'], [NARROW]: font['--oniva-font-size-40'] },
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-hero'],
    lineHeight: 1.05,
    margin: 0,
    textWrap: 'balance',
  },
  lead: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-18'],
    lineHeight: 1.5,
    margin: 0,
    textWrap: 'pretty',
  },
  h3: {
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: 1.3,
    margin: 0,
  },
  p: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: 1.55,
    margin: 0,
  },
  row: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12 },
  rowCenter: { justifyContent: 'center' },
  /** Nested surface: gray card holding white tiles. */
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-card'],
    boxSizing: 'border-box',
    padding: 24,
  },
  tile: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-card'],
    boxSizing: 'border-box',
    padding: 20,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-lg'],
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'inline-flex',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  num: { fontVariantNumeric: 'tabular-nums' },
  link: {
    color: { default: colors['--oniva-color-text-muted'], ':hover': colors['--oniva-color-text'] },
    fontSize: font['--oniva-font-size-14'],
    textDecoration: { default: 'none', ':hover': 'underline' },
  },
  srOnly: {
    borderWidth: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
});
