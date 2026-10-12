import * as stylex from '@stylexjs/stylex';
import { AlertTriangle, CircleCheck, Info, ShieldAlert } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { Badge } from '../../components/Badge';
import { Card, CardHeader, CardHeaderText, CardTitle, Tile } from '../../components/Card';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    listStyle: 'none',
    margin: 0,
    maxHeight: 360,
    overflowY: 'auto',
    padding: 0,
  },
  item: { alignItems: 'flex-start', display: 'flex', gap: 12 },
  icon: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-full'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  critical: {
    backgroundColor: colors['--oniva-color-danger-bg'],
    color: colors['--oniva-color-danger-fg'],
  },
  warning: {
    backgroundColor: colors['--oniva-color-warning-bg'],
    color: colors['--oniva-color-warning-fg'],
  },
  info: {
    backgroundColor: colors['--oniva-color-info-bg'],
    color: colors['--oniva-color-info-fg'],
  },
  success: {
    backgroundColor: colors['--oniva-color-success-bg'],
    color: colors['--oniva-color-success-fg'],
  },
  text: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
  },
  desc: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
    margin: 0,
  },
  count: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  head: { alignItems: 'baseline', display: 'flex', gap: 6 },
});

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  /** Display date, e.g. "Oct 9". */
  date: string;
  severity?: AlertSeverity;
  icon?: ReactNode;
}

export interface AlertsFeedProps {
  alerts: AlertItem[];
  title?: string;
  /** Text after the count, default "this week". */
  period?: string;
  /** Max height of the scroll area in px. */
  maxHeight?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const ICONS = {
  critical: <ShieldAlert size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
  success: <CircleCheck size={18} />,
};

/** "Important alerts · 12 this week": scrollable cards with icon circle, copy and date chip. */
export function AlertsFeed({
  alerts,
  title = 'Important alerts',
  period = 'this week',
  maxHeight,
  className,
  xstyle,
  ref,
}: AlertsFeedProps) {
  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <CardHeader>
        <CardHeaderText>
          <div {...stylex.props(styles.head)}>
            <CardTitle>{title}</CardTitle>
            <span aria-hidden="true" {...stylex.props(styles.count)}>
              ·
            </span>
            <span {...stylex.props(styles.count)}>
              {alerts.length} {period}
            </span>
          </div>
        </CardHeaderText>
      </CardHeader>
      <ul
        aria-label={title}
        tabIndex={0}
        {...stylex.props(styles.list)}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {alerts.map((a) => {
          const sev = a.severity ?? 'info';
          return (
            <li key={a.id}>
              <Tile padding="sm">
                <div {...stylex.props(styles.item)}>
                  <span aria-hidden="true" {...stylex.props(styles.icon, styles[sev])}>
                    {a.icon ?? ICONS[sev]}
                  </span>
                  <div {...stylex.props(styles.text)}>
                    <h4 {...stylex.props(styles.title)}>{a.title}</h4>
                    <p {...stylex.props(styles.desc)}>{a.description}</p>
                  </div>
                  <Badge size="sm" shape="square">
                    {a.date}
                  </Badge>
                </div>
              </Tile>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
