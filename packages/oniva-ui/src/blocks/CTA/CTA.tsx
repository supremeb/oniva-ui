import * as stylex from '@stylexjs/stylex';
import { ArrowRight } from 'lucide-react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { Button } from '../../components/Button/Button';
import { InView } from '../../motion/InView';
import { colors } from '../../tokens/colors.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  panel: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-tint'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xxxl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingBlock: 56,
    paddingInline: 24,
    textAlign: 'center',
  },
  narrow: { maxWidth: 560 },
});

export interface CTAProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  primaryLabel?: string;
  secondaryLabel?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function CTA({
  title = 'Put your agents on autopilot, with a safety net',
  description = 'Connect your first agent in under ten minutes. No credit card, no sales call.',
  primaryLabel = 'Start free',
  secondaryLabel = 'Talk to us',
  className,
  xstyle,
  ref,
  ...rest
}: CTAProps) {
  const sx = stylex.props(bs.section, xstyle);
  return (
    <section ref={ref} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <InView preset="scale">
          <div {...stylex.props(styles.panel)}>
            <h2 {...stylex.props(bs.h2, styles.narrow)}>{title}</h2>
            <p {...stylex.props(bs.lead, styles.narrow)}>{description}</p>
            <div {...stylex.props(bs.row, bs.rowCenter)}>
              <Button size="lg" endIcon={<ArrowRight size={16} />}>{primaryLabel}</Button>
              <Button size="lg" variant="secondary">{secondaryLabel}</Button>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
}
