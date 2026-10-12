import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { useInView } from '../../motion/InView';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';

const NARROW = '@media (max-width: 720px)';

const styles = stylex.create({
  band: { backgroundColor: colors['--oniva-color-surface'], borderBlockColor: colors['--oniva-color-border'], borderBlockStyle: 'solid', borderBlockWidth: 1 },
  grid: { display: 'grid', gap: 32, gridTemplateColumns: { default: 'repeat(4, 1fr)', [NARROW]: 'repeat(2, 1fr)' }, margin: 0 },
  stat: { display: 'flex', flexDirection: 'column-reverse', gap: 4, margin: 0 },
  value: {
    fontSize: { default: font['--oniva-font-size-48'], [NARROW]: font['--oniva-font-size-32'] },
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-hero'],
    margin: 0,
  },
  label: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'] },
});

export interface Stat {
  label: string;
  value: number;
  format?: Intl.NumberFormatOptions;
}

export const defaultStats: Stat[] = [
  { label: 'Agent runs traced daily', value: 12400000, format: { notation: 'compact', maximumFractionDigits: 1 } },
  { label: 'Teams in production', value: 1860 },
  { label: 'Average success rate', value: 0.992, format: { style: 'percent', minimumFractionDigits: 1 } },
  { label: 'Median incident response (minutes)', value: 4 },
];

export interface StatsBandProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  stats?: Stat[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/** Numbers roll up from zero once the band scrolls into view (AnimatedNumber, transform only). */
export function StatsBand({ stats = defaultStats, className, xstyle, ref, ...rest }: StatsBandProps) {
  const { ref: viewRef, inView } = useInView<HTMLDListElement>({ rootMargin: '0px 0px -10% 0px' });
  const sx = stylex.props(bs.section, styles.band, xstyle);
  return (
    <section ref={ref} aria-label="Oniva in numbers" {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <dl ref={viewRef} {...stylex.props(styles.grid)}>
          {stats.map((s) => (
            <div key={s.label} {...stylex.props(styles.stat)}>
              <dd {...stylex.props(styles.value)}>
                <AnimatedNumber value={inView ? s.value : 0} format={s.format} />
              </dd>
              <dt {...stylex.props(styles.label)}>{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
