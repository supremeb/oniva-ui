import * as stylex from '@stylexjs/stylex';
import { ArrowRight } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge';
import { AgentAvatar } from '../AgentAvatar';

const slide = stylex.keyframes({
  '0%': { opacity: 0, transform: 'translateX(-6px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: 12, padding: 14 },
  pair: { alignItems: 'center', display: 'flex', gap: 12 },
  who: { alignItems: 'center', display: 'flex', flexBasis: 0, flexGrow: 1, gap: 10, minWidth: 0 },
  arrow: {
    animationDuration: motion['--oniva-motion-dur-slower'],
    animationFillMode: 'both',
    animationName: { default: slide, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    color: colors['--oniva-color-icon-muted'],
    flexShrink: 0,
  },
  ctx: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: 8,
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-18'],
    margin: 0,
    padding: 10,
  },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 6 },
});

export interface AgentHandoffProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  from: { name: string; role?: string };
  to: { name: string; role?: string };
  /** Why control is being transferred. */
  reason: string;
  /** Summary of the context passed along. */
  context?: string;
  /** Carried-over artifacts, e.g. file names. */
  carried?: string[];
  status?: 'pending' | 'accepted';
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Transfer card: agent A -> agent B, with reason, context summary and carried artifacts. */
export function AgentHandoff({ from, to, reason, context, carried = [], status = 'accepted', className, xstyle, ref, ...rest }: AgentHandoffProps) {
  return (
    <div {...rest} ref={ref} role="group" aria-label={`Handoff from ${from.name} to ${to.name}`} {...mergeSx(stylex.props(aiStyles.tile, styles.root, xstyle), className)}>
      <div {...stylex.props(styles.pair)}>
        <div {...stylex.props(styles.who)}>
          <AgentAvatar name={from.name} size={32} />
          <div {...stylex.props(aib.grow)}>
            <p {...stylex.props(aib.name, aib.clamp)}>{from.name}</p>
            {from.role && <p {...stylex.props(aib.meta, aib.clamp)}>{from.role}</p>}
          </div>
        </div>
        <ArrowRight size={16} aria-hidden="true" {...stylex.props(styles.arrow)} />
        <div {...stylex.props(styles.who)}>
          <AgentAvatar name={to.name} size={32} status={status === 'pending' ? 'waiting' : 'working'} />
          <div {...stylex.props(aib.grow)}>
            <p {...stylex.props(aib.name, aib.clamp)}>{to.name}</p>
            {to.role && <p {...stylex.props(aib.meta, aib.clamp)}>{to.role}</p>}
          </div>
        </div>
        <Badge variant={status === 'pending' ? 'warning' : 'success'}>{status}</Badge>
      </div>
      <p {...stylex.props(aib.meta)} style={{ margin: 0 }}>
        <strong {...stylex.props(aib.name)}>Reason: </strong>
        {reason}
      </p>
      {context && <p {...stylex.props(styles.ctx)}>{context}</p>}
      {carried.length > 0 && (
        <div {...stylex.props(styles.tags)}>
          {carried.map((c) => (
            <Badge key={c} variant="neutral">{c}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}
