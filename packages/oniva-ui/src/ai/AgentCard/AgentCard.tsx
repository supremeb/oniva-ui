import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge';
import { AgentAvatar, type AgentAvatarStatus } from '../AgentAvatar';

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: 12, padding: 14 },
  top: { alignItems: 'center', display: 'flex', gap: 12 },
  desc: { margin: 0, overflowWrap: 'anywhere' },
  wrap: { overflowWrap: 'anywhere' },
  noShrink: { flexShrink: 0 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tag: { maxWidth: '100%', minWidth: 0 },
  stats: {
    borderTopColor: colors['--oniva-color-separator'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'grid',
    gap: 8,
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    paddingTop: 12,
  },
  stat: { display: 'flex', flexDirection: 'column-reverse', minWidth: 0 },
  statVal: { margin: 0 },
  statLabel: { margin: 0 },
  statsList: { margin: 0 },
  foot: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
});

export interface AgentCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  name: string;
  role: string;
  description?: string;
  status?: AgentAvatarStatus;
  model?: string;
  tools?: string[];
  stats?: { label: string; value: string }[];
  /** Footer actions, e.g. `<Button>`s. */
  actions?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const statusBadge: Record<AgentAvatarStatus, 'neutral' | 'success' | 'warning' | 'danger'> = {
  idle: 'neutral',
  working: 'success',
  waiting: 'warning',
  error: 'danger',
};

/** Profile card for an agent: avatar, role, model, tools and run stats. */
export function AgentCard({
  name,
  role,
  description,
  status = 'idle',
  model,
  tools = [],
  stats = [],
  actions,
  className,
  xstyle,
  ref,
  ...rest
}: AgentCardProps) {
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.tile, styles.root, xstyle), className)}>
      <div {...stylex.props(styles.top)}>
        <AgentAvatar name={name} status={status} size={44} />
        <div {...stylex.props(aib.grow)}>
          <p {...stylex.props(aib.name, styles.wrap)}>{name}</p>
          <p {...stylex.props(aib.meta, styles.wrap)}>{role}</p>
        </div>
        <Badge variant={statusBadge[status]} role="status" xstyle={styles.noShrink}>
          {status}
        </Badge>
      </div>
      {description && <p {...stylex.props(aib.meta, styles.desc)}>{description}</p>}
      {(model || tools.length > 0) && (
        <div {...stylex.props(styles.tags)}>
          {model && (
            <Badge variant="accent" xstyle={styles.tag} title={model}>
              <span {...stylex.props(aib.clamp)}>{model}</span>
            </Badge>
          )}
          {tools.map((t, i) => (
            <Badge key={`${t}-${i}`} variant="neutral" xstyle={styles.tag} title={t}>
              <span {...stylex.props(aib.clamp)}>{t}</span>
            </Badge>
          ))}
        </div>
      )}
      {stats.length > 0 && (
        <dl {...stylex.props(styles.stats, styles.statsList)}>
          {stats.map((s, i) => (
            <div key={`${s.label}-${i}`} {...stylex.props(styles.stat)}>
              <dt {...stylex.props(aib.meta, styles.statLabel, styles.wrap)}>{s.label}</dt>
              <dd {...stylex.props(aib.name, aiStyles.num, styles.statVal, styles.wrap)}>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {actions && <div {...stylex.props(styles.foot)}>{actions}</div>}
    </div>
  );
}
