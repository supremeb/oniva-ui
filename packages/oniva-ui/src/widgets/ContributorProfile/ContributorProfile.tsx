import * as stylex from '@stylexjs/stylex';
import { Pencil, Share2 } from 'lucide-react';
import { useState, type Ref } from 'react';
import { ContributionHeatmap, type ContributionDay } from '../../charts/Heatmap';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card, Tile } from '../../components/Card';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { fmtUsd, wstyles } from '../../internal/widgets-parts';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { DeltaBadge } from '../DeltaBadge';

const styles = stylex.create({
  top: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12, padding: 8 },
  who: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  nameRow: { alignItems: 'center', display: 'flex', gap: 8 },
  name: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-18'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-18'],
    margin: 0,
  },
  handle: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
  },
  actions: { display: 'flex', gap: 8 },
  contrib: { display: 'flex', flexDirection: 'column', gap: 6 },
  caption: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  amount: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 10 },
  stats: { display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))' },
  stat: { display: 'flex', flexDirection: 'column', gap: 2 },
  statValue: {
    color: colors['--oniva-color-text'],
    fontFeatureSettings: "'tnum'",
    fontSize: font['--oniva-font-size-20'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-20'],
  },
  heatHead: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' },
  heat: { overflowX: 'auto' },
});

export interface ContributorStat {
  label: string;
  value: string | number;
}

export interface ContributorProfileProps {
  name: string;
  handle: string;
  src?: string;
  pro?: boolean;
  /** Total contributions in dollars this year. */
  amount: number;
  /** Year-over-year change in percent. */
  delta?: number;
  year?: number;
  stats: ContributorStat[];
  /** Daily contribution counts for the heatmap. */
  activity: ContributionDay[];
  onShare?: () => void;
  onEdit?: () => void;
  defaultRange?: 'weekly' | 'monthly' | 'yearly';
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Contributor profile: identity, yearly $ total with delta, stat tiles and a purple contribution heatmap. */
export function ContributorProfile({
  name,
  handle,
  src,
  pro,
  amount,
  delta,
  year = new Date().getFullYear(),
  stats,
  activity,
  onShare,
  onEdit,
  defaultRange = 'yearly',
  className,
  xstyle,
  ref,
}: ContributorProfileProps) {
  const [range, setRange] = useState<'weekly' | 'monthly' | 'yearly'>(defaultRange);
  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <div {...stylex.props(styles.top)}>
        <Avatar name={name} src={src} alt={src ? name : undefined} size="xl" />
        <div {...stylex.props(styles.who)}>
          <div {...stylex.props(styles.nameRow)}>
            <h3 {...stylex.props(styles.name)}>{name}</h3>
          </div>
          <div {...stylex.props(styles.nameRow)}>
            <span {...stylex.props(styles.handle)}>@{handle}</span>
            {pro && (
              <Badge variant="accent" size="sm" shape="square">
                PRO
              </Badge>
            )}
          </div>
        </div>
        <div {...stylex.props(styles.actions)}>
          <Button variant="secondary" size="sm" startIcon={<Share2 size={14} />} onPress={onShare}>
            Share
          </Button>
          <Button variant="secondary" size="sm" startIcon={<Pencil size={14} />} onPress={onEdit}>
            Edit
          </Button>
        </div>
      </div>
      <Tile>
        <div {...stylex.props(styles.contrib)}>
          <span {...stylex.props(styles.caption)}>Contributions this year</span>
          <div {...stylex.props(styles.amount)}>
            <p {...stylex.props(wstyles.value)}>{fmtUsd(amount)}</p>
            {delta !== undefined && <DeltaBadge value={delta} />}
          </div>
        </div>
      </Tile>
      <div {...stylex.props(styles.stats)}>
        {stats.map((s) => (
          <Tile key={s.label} padding="sm">
            <div {...stylex.props(styles.stat)}>
              <span {...stylex.props(styles.caption)}>{s.label}</span>
              <span {...stylex.props(styles.statValue)}>{s.value}</span>
            </div>
          </Tile>
        ))}
      </div>
      <Tile>
        <div {...stylex.props(wstyles.col)}>
          <div {...stylex.props(styles.heatHead)}>
            <span {...stylex.props(styles.caption)}>Activity in {year}</span>
            <SegmentedControl
              size="sm"
              aria-label="Heatmap range"
              value={range}
              onChange={(v) => setRange(v as typeof range)}
            >
              <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
              <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
              <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
            </SegmentedControl>
          </div>
          <div {...stylex.props(styles.heat)}>
            <ContributionHeatmap data={activity} range={range} tone={5} unit="contribution" />
          </div>
        </div>
      </Tile>
    </Card>
  );
}
