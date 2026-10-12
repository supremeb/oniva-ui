import * as stylex from '@stylexjs/stylex';
import { Bell, CheckCheck } from 'lucide-react';
import { useState, type ReactNode, type Ref } from 'react';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Card, CardHeader, CardHeaderText, CardTitle, Tile } from '../../components/Card';
import { Tab, TabList, TabPanel, Tabs } from '../../components/Tabs';
import { wstyles } from '../../internal/widgets-parts';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    listStyle: 'none',
    margin: 0,
    maxHeight: 360,
    overflowY: 'auto',
    padding: 0,
  },
  item: {
    alignItems: 'flex-start',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 10,
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors['--oniva-color-focus-ring']}`,
    },
    padding: 8,
    textAlign: 'start',
    width: '100%',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-text-on-tertiary'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  text: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
  },
  unreadTitle: { fontWeight: font['--oniva-font-weight-medium'] },
  body: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
    margin: 0,
  },
  time: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    whiteSpace: 'nowrap',
  },
  dot: {
    backgroundColor: colors['--oniva-color-accent-soft-fg'],
    borderRadius: radius['--oniva-radius-full'],
    flexShrink: 0,
    height: 8,
    marginBlockStart: 6,
    width: 8,
  },
  empty: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    padding: 24,
    textAlign: 'center',
  },
  tabs: { display: 'flex', flexDirection: 'column', gap: 8 },
});

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  /** Display time, e.g. "2h ago". */
  time: string;
  read?: boolean;
  /** Counts under the Mentions tab. */
  mention?: boolean;
  /** Person who triggered it; shown as an avatar. */
  actor?: string;
  icon?: ReactNode;
}

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  /** Called with the next list state-independent id when an item is pressed. */
  onOpen?: (item: NotificationItem) => void;
  onChange?: (items: NotificationItem[]) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Inbox with All / Unread / Mentions tabs and mark-all-read. */
export function NotificationCenter({
  notifications,
  onOpen,
  onChange,
  className,
  xstyle,
  ref,
}: NotificationCenterProps) {
  const [items, setItems] = useState(notifications);
  const update = (next: NotificationItem[]) => {
    setItems(next);
    onChange?.(next);
  };
  const unread = items.filter((n) => !n.read);
  const mentions = items.filter((n) => n.mention);

  const renderList = (list: NotificationItem[], empty: string) =>
    list.length === 0 ? (
      <p {...stylex.props(styles.empty)}>{empty}</p>
    ) : (
      <ul {...stylex.props(styles.list)}>
        {list.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              {...stylex.props(styles.item)}
              onClick={() => {
                update(items.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
                onOpen?.(n);
              }}
            >
              {n.actor ? (
                <Avatar name={n.actor} size="lg" />
              ) : (
                <span aria-hidden="true" {...stylex.props(styles.icon)}>
                  {n.icon ?? <Bell size={16} />}
                </span>
              )}
              <span {...stylex.props(styles.text)}>
                <span {...stylex.props(styles.title, !n.read && styles.unreadTitle)}>
                  {n.title}
                  {!n.read && <span {...stylex.props(wstyles.srOnly)}> (unread)</span>}
                </span>
                {n.body && <span {...stylex.props(styles.body)}>{n.body}</span>}
                <span {...stylex.props(styles.time)}>{n.time}</span>
              </span>
              {!n.read && <span aria-hidden="true" {...stylex.props(styles.dot)} />}
            </button>
          </li>
        ))}
      </ul>
    );

  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>Notifications</CardTitle>
        </CardHeaderText>
        <Button
          size="sm"
          variant="ghost"
          startIcon={<CheckCheck size={14} />}
          isDisabled={unread.length === 0}
          onPress={() => update(items.map((n) => ({ ...n, read: true })))}
        >
          Mark all as read
        </Button>
      </CardHeader>
      <Tile padding="sm">
        <Tabs variant="pill" size="sm" xstyle={styles.tabs}>
          <TabList aria-label="Notification filter">
            <Tab id="all">All</Tab>
            <Tab id="unread" count={unread.length}>
              Unread
            </Tab>
            <Tab id="mentions" count={mentions.length}>
              Mentions
            </Tab>
          </TabList>
          <TabPanel id="all">{renderList(items, 'No notifications yet.')}</TabPanel>
          <TabPanel id="unread">{renderList(unread, 'You are all caught up.')}</TabPanel>
          <TabPanel id="mentions">{renderList(mentions, 'No mentions.')}</TabPanel>
        </Tabs>
      </Tile>
    </Card>
  );
}
