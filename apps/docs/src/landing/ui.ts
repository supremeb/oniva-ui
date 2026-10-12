import * as stylex from '@stylexjs/stylex';
import { accent } from '@oniva-tokens/accent.stylex';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';

import { mq } from './mq.stylex';

export const ui = stylex.create({
  wrap: {
    marginInline: 'auto',
    maxWidth: 1200,
    paddingInline: { default: 20, [mq.BP]: 32 },
    position: 'relative',
    width: '100%',
  },
  section: { paddingBlock: { default: 72, [mq.BP]: 128 } },
  eyebrow: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-12'],
    letterSpacing: '0.08em',
    margin: 0,
    textTransform: 'uppercase',
  },
  eyebrowAccent: { color: colors['--oniva-color-accent-soft-fg'] },
  h2: {
    color: colors['--oniva-color-text'],
    fontFamily: mq.DISPLAY,
    fontSize: { default: 'clamp(30px, 8vw, 40px)', [mq.BP]: 'clamp(40px, 4.4vw, 56px)' },
    fontWeight: 500,
    letterSpacing: '-0.035em',
    lineHeight: 1.04,
    margin: 0,
    marginBlockStart: 14,
    maxWidth: 780,
    textWrap: 'balance',
  },
  lead: {
    color: colors['--oniva-color-text-muted'],
    fontSize: { default: font['--oniva-font-size-16'], [mq.BP]: font['--oniva-font-size-18'] },
    lineHeight: 1.55,
    margin: 0,
    marginBlockStart: 18,
    maxWidth: 560,
    textWrap: 'pretty',
  },
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
  },
  mono: { fontFamily: font['--oniva-font-mono'] },
  accentText: { color: accent['--oniva-accent-500'] },
});
