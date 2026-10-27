import * as stylex from '@stylexjs/stylex';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';

/** Shared styles for the loop-7 application blocks (TaskBoard, KpiBoard, ...). Container-query friendly, no overflow at 360px. */
export const w8 = stylex.create({
  root: {
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    containerType: 'inline-size',
    display: 'block',
    fontFamily: font['--oniva-font-sans'],
    maxWidth: '100%',
    minWidth: 0,
    width: '100%',
  },
  panel: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-card'],
    boxSizing: 'border-box',
    minWidth: 0,
    padding: 16,
  },
  tile: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-card'],
    boxSizing: 'border-box',
    minWidth: 0,
    padding: 16,
  },
  title: { fontSize: font['--oniva-font-size-18'], fontWeight: font['--oniva-font-weight-semibold'], letterSpacing: font['--oniva-font-track-hero'], lineHeight: 1.25, margin: 0 },
  h3: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], lineHeight: 1.3, margin: 0 },
  muted: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], lineHeight: 1.45, margin: 0 },
  num: { fontVariantNumeric: 'tabular-nums' },
  row: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, minWidth: 0 },
  between: { justifyContent: 'space-between' },
  ellipsis: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  list: { display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', margin: 0, padding: 0 },
  srOnly: { borderWidth: 0, clip: 'rect(0 0 0 0)', height: 1, margin: -1, overflow: 'hidden', padding: 0, position: 'absolute', whiteSpace: 'nowrap', width: 1 },
  /** Bare pressable surface (card / row button) — add focus.ring on use. */
  press: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    font: 'inherit',
    margin: 0,
    padding: 0,
    textAlign: 'start',
  },
});
