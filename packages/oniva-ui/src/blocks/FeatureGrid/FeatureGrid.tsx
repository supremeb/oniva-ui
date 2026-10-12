import * as stylex from '@stylexjs/stylex';
import { Activity, Gauge, GitBranch, ShieldCheck, Workflow, Bell } from 'lucide-react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { SectionHead } from '../../internal/blocks-parts';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { Stagger } from '../../motion/Stagger';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';

const NARROW = '@media (max-width: 720px)';
const MID = '@media (max-width: 960px)';

const styles = stylex.create({
  grid: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: { default: 'repeat(3, 1fr)', [MID]: 'repeat(2, 1fr)', [NARROW]: '1fr' },
  },
  item: { display: 'flex', flexDirection: 'column', gap: 12, height: '100%' },
  tile: {
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'border-color',
    borderColor: { default: colors['--oniva-color-border'], ':hover': colors['--oniva-color-border-hover'] },
  },
});

export interface Feature {
  icon?: ReactNode;
  title: string;
  description: string;
}

export const defaultFeatures: Feature[] = [
  { icon: <Activity size={18} />, title: 'Live run traces', description: 'Follow every agent step, tool call and token as it happens, then replay any run in one click.' },
  { icon: <Gauge size={18} />, title: 'Budgets that hold', description: 'Set spend caps per team, agent or customer. Oniva pauses runaway loops before they cost you.' },
  { icon: <GitBranch size={18} />, title: 'Safe rollouts', description: 'Ship prompt and model changes to 5% of traffic first, and roll back automatically on regressions.' },
  { icon: <ShieldCheck size={18} />, title: 'Guardrails built in', description: 'Redact PII, block unsafe tools and keep an audit trail that satisfies your security review.' },
  { icon: <Workflow size={18} />, title: 'Visual workflows', description: 'Wire agents, approvals and human handoffs together without writing glue code.' },
  { icon: <Bell size={18} />, title: 'Alerts that matter', description: 'Get one clear page when success rate drops, not forty. Routed to Slack, email or PagerDuty.' },
];

export interface FeatureGridProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title'> {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  features?: Feature[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function FeatureGrid({
  eyebrow = 'Platform',
  title = 'Everything your agents need to run in production',
  description = 'One place to observe, control and improve every automation.',
  features = defaultFeatures,
  className,
  xstyle,
  ref,
  ...rest
}: FeatureGridProps) {
  const sx = stylex.props(bs.section, xstyle);
  return (
    <section ref={ref} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <SectionHead eyebrow={eyebrow} title={title} lead={description} />
        <Stagger xstyle={styles.grid}>
          {features.map((f) => (
            <div key={f.title} {...stylex.props(bs.tile, styles.item, styles.tile)}>
              {f.icon && (
                <span {...stylex.props(bs.iconBox)} aria-hidden="true">
                  {f.icon}
                </span>
              )}
              <h3 {...stylex.props(bs.h3)}>{f.title}</h3>
              <p {...stylex.props(bs.p)}>{f.description}</p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
