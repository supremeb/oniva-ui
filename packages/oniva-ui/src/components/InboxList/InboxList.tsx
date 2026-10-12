import * as stylex from '@stylexjs/stylex';
import { Archive, Mail, MailOpen } from 'lucide-react';
import { useRef, useState } from 'react';
import type { PointerEvent, Ref } from 'react';
import { Button as AriaButton, GridList, GridListItem, type GridListProps } from 'react-aria-components';
import { Avatar } from '../Avatar';
import { dash } from '../../internal/dash-styles';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

export interface InboxItem {
  id: string;
  from: string;
  subject?: string;
  snippet: string;
  /** Short display time, e.g. "9:41 AM" or "Oct 8". */
  time: string;
  unread?: boolean;
  avatarSrc?: string;
}

const SWIPE_COMMIT = 88;

const styles = stylex.create({
  list: { display: 'flex', flexDirection: 'column', outline: 'none' },
  row: {
    backgroundColor: colors['--oniva-color-surface'],
    borderBottomColor: colors['--oniva-color-separator'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    outline: 'none',
    overflow: 'hidden',
    position: 'relative',
  },
  rowFocus: {
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':is([data-focus-visible])': 'solid' },
    outlineWidth: 2,
  },
  swipeBg: {
    alignItems: 'center',
    color: colors['--oniva-color-on-solid'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    inset: 0,
    paddingInline: 20,
    position: 'absolute',
  },
  bgArchive: { backgroundColor: colors['--oniva-color-danger-solid'], justifyContent: 'flex-end' },
  bgRead: { backgroundColor: colors['--oniva-color-info-solid'], justifyContent: 'flex-start' },
  content: {
    alignItems: 'flex-start',
    backgroundColor: {
      default: colors['--oniva-color-surface'],
      ':is([data-hovered])': colors['--oniva-color-surface-hover'],
      ':is([data-selected])': colors['--oniva-color-accent-tint'],
    },
    display: 'flex',
    gap: 12,
    padding: 12,
    position: 'relative',
    touchAction: 'pan-y',
  },
  settle: {
    transitionDuration: { default: motion['--oniva-motion-dur-base'], [media.reducedMotion]: '0s' },
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  dotWrap: { alignItems: 'center', display: 'flex', flexShrink: 0, height: 32, width: 8 },
  dot: { backgroundColor: colors['--oniva-color-accent-soft-fg'], borderRadius: radius['--oniva-radius-full'], height: 8, width: 8 },
  body: { display: 'flex', flexGrow: 1, flexDirection: 'column', gap: 2, minWidth: 0 },
  head: { alignItems: 'baseline', display: 'flex', gap: 8 },
  from: { flexGrow: 1, minWidth: 0 },
  unreadText: { fontWeight: font['--oniva-font-weight-semibold'] },
  time: { color: colors['--oniva-color-text-muted'], flexShrink: 0, fontSize: font['--oniva-font-size-12'] },
  subject: { color: colors['--oniva-color-text'] },
  snippet: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  actions: { display: 'flex', flexShrink: 0, gap: 2 },
  act: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-tertiary'] },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-icon-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    opacity: { default: 0, ':focus-visible': 1 },
    padding: 0,
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'opacity, background-color',
    width: 28,
  },
  actShown: { opacity: 1 },
});

export interface InboxListProps extends Omit<GridListProps<InboxItem>, 'children' | 'items' | 'className' | 'style' | 'renderEmptyState'> {
  items: InboxItem[];
  onArchive?: (id: string) => void;
  onToggleRead?: (id: string) => void;
  /** Open an item (Enter or click). */
  onOpen?: (id: string) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

function Row({ item, hovered, focusVisible, onArchive, onToggleRead }: { item: InboxItem; hovered: boolean; focusVisible: boolean; onArchive?: (id: string) => void; onToggleRead?: (id: string) => void }) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number; locked: boolean } | null>(null);

  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') return;
    start.current = { x: e.clientX, y: e.clientY, locked: false };
  };
  const onMove = (e: PointerEvent) => {
    const s = start.current;
    if (!s) return;
    const mx = e.clientX - s.x;
    const my = e.clientY - s.y;
    if (!s.locked) {
      if (Math.abs(my) > Math.abs(mx) + 4) {
        start.current = null;
        return;
      }
      if (Math.abs(mx) > 8) s.locked = true;
      else return;
    }
    setDragging(true);
    setDx(Math.max(-160, Math.min(160, mx)));
  };
  const end = () => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    setDragging(false);
    if (dx <= -SWIPE_COMMIT) {
      setDx(-400);
      setTimeout(() => {
        onArchive?.(item.id);
        setDx(0);
      }, 160);
    } else if (dx >= SWIPE_COMMIT) {
      setDx(0);
      onToggleRead?.(item.id);
    } else setDx(0);
  };

  const show = hovered || focusVisible;
  return (
    <>
      {dx !== 0 && (
        <span aria-hidden="true" {...stylex.props(styles.swipeBg, dx < 0 ? styles.bgArchive : styles.bgRead)}>
          {dx < 0 ? (
            <>
              Archive <Archive size={16} />
            </>
          ) : (
            <>
              <MailOpen size={16} /> {item.unread ? 'Mark read' : 'Mark unread'}
            </>
          )}
        </span>
      )}
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={end}
        onPointerCancel={end}
        {...mergeSx(stylex.props(styles.content, !dragging && styles.settle), undefined, { transform: `translateX(${dx}px)` })}
      >
        <span {...stylex.props(styles.dotWrap)}>
          {item.unread && (
            <span {...stylex.props(styles.dot)}>
              <span {...stylex.props(dash.sr)}>Unread</span>
            </span>
          )}
        </span>
        <Avatar name={item.from} src={item.avatarSrc} size="md" />
        <span {...stylex.props(styles.body)}>
          <span {...stylex.props(styles.head)}>
            <span {...stylex.props(styles.from, dash.ellipsis, dash.title, item.unread && styles.unreadText)}>{item.from}</span>
            <span {...stylex.props(styles.time, dash.num)}>{item.time}</span>
          </span>
          {item.subject && <span {...stylex.props(styles.subject, dash.ellipsis, item.unread && styles.unreadText)}>{item.subject}</span>}
          <span {...stylex.props(styles.snippet, dash.ellipsis)}>{item.snippet}</span>
        </span>
        <span {...stylex.props(styles.actions)}>
          <AriaButton aria-label={item.unread ? `Mark ${item.from} as read` : `Mark ${item.from} as unread`} onPress={() => onToggleRead?.(item.id)} {...stylex.props(styles.act, focus.ring, show && styles.actShown)}>
            {item.unread ? <MailOpen size={16} aria-hidden="true" /> : <Mail size={16} aria-hidden="true" />}
          </AriaButton>
          <AriaButton aria-label={`Archive ${item.from}`} onPress={() => onArchive?.(item.id)} {...stylex.props(styles.act, focus.ring, show && styles.actShown)}>
            <Archive size={16} aria-hidden="true" />
          </AriaButton>
        </span>
      </div>
    </>
  );
}

/** Chat/email inbox list. Swipe left to archive, right to toggle read on touch; icon buttons on hover/focus for pointer + keyboard. */
export function InboxList({ items, onArchive, onToggleRead, onOpen, className, xstyle, ref, ...rest }: InboxListProps) {
  const sx = stylex.props(dash.root, styles.list, xstyle);
  return (
    <GridList
      selectionMode="single"
      aria-label="Inbox"
      {...rest}
      ref={ref}
      items={items}
      onAction={(k) => onOpen?.(String(k))}
      {...mergeSx(sx, className)}
      renderEmptyState={() => <p {...stylex.props(dash.label)}>Inbox zero. Nothing to read.</p>}
    >
      {(item) => (
        <GridListItem id={item.id} textValue={`${item.unread ? 'Unread. ' : ''}${item.from}: ${item.subject ?? item.snippet}`} {...stylex.props(styles.row, styles.rowFocus)}>
          {({ isHovered, isFocusVisible }) => <Row item={item} hovered={isHovered} focusVisible={isFocusVisible} onArchive={onArchive} onToggleRead={onToggleRead} />}
        </GridListItem>
      )}
    </GridList>
  );
}
