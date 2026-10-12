import * as stylex from '@stylexjs/stylex';
import { Plus } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { Avatar } from '../../components/Avatar';
import { Card } from '../../components/Card';
import { DescriptionItem, DescriptionList } from '../../components/DescriptionList';
import { IconButton } from '../../components/IconButton';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';

const styles = stylex.create({
  head: { alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 12, paddingBlock: 16 },
  avatarWrap: { position: 'relative' },
  avatar: { fontSize: font.size40, height: 92, lineHeight: font.lh40, width: 92 },
  add: { insetBlockStart: -2, insetInlineEnd: -2, position: 'absolute' },
  name: {
    color: colors.text,
    fontSize: font.size24,
    fontWeight: font.weightMedium,
    letterSpacing: font.trackHero,
    lineHeight: font.lh24,
    margin: 0,
    textAlign: 'center',
  },
  sub: { color: colors.textMuted, fontSize: font.size13, margin: 0 },
  list: { padding: 0 },
});

export interface ProfileDetail {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}

export interface ProfileCardProps {
  name: string;
  subtitle?: string;
  src?: string;
  details: ProfileDetail[];
  /** Fires from the "+" button on the avatar. Omit to hide the button. */
  onAddPhoto?: () => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Profile summary: big initial avatar with add button, name, and key/value rows. */
export function ProfileCard({
  name,
  subtitle,
  src,
  details,
  onAddPhoto,
  className,
  xstyle,
  ref,
}: ProfileCardProps) {
  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <div {...stylex.props(styles.head)}>
        <div {...stylex.props(styles.avatarWrap)}>
          <Avatar name={name} src={src} alt={src ? name : undefined} xstyle={styles.avatar} />
          {onAddPhoto && (
            <IconButton
              aria-label="Add photo"
              size="xs"
              variant="secondary"
              xstyle={styles.add}
              onPress={onAddPhoto}
            >
              <Plus size={14} />
            </IconButton>
          )}
        </div>
        <h3 {...stylex.props(styles.name)}>{name}</h3>
        {subtitle && <p {...stylex.props(styles.sub)}>{subtitle}</p>}
      </div>
      <DescriptionList xstyle={styles.list}>
        {details.map((d) => (
          <DescriptionItem key={d.label} label={d.label} icon={d.icon}>
            {d.value}
          </DescriptionItem>
        ))}
      </DescriptionList>
    </Card>
  );
}
