import * as stylex from '@stylexjs/stylex';
import { CalendarDays, GripVertical, Plus, TriangleAlert } from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';
import type { FormEvent, HTMLAttributes, Ref } from 'react';
import {
  Button as AriaButton,
  GridList,
  GridListItem,
  useDragAndDrop,
  type DroppableCollectionReorderEvent,
  type DroppableCollectionInsertDropEvent,
  type DroppableCollectionRootDropEvent,
} from 'react-aria-components';
import { Avatar, AvatarGroup } from '../Avatar';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { dash } from '../../internal/dash-styles';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

export type KanbanPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface KanbanCardData {
  id: string;
  title: string;
  tags?: string[];
  /** Assignee display names. */
  assignees?: string[];
  /** ISO date (YYYY-MM-DD). */
  due?: string;
  priority?: KanbanPriority;
}

export interface KanbanColumnData {
  id: string;
  title: string;
  /** Work-in-progress limit; the header warns when the card count exceeds it. */
  wipLimit?: number;
  cards: KanbanCardData[];
}

const CARD_TYPE = 'application/x-oniva-kanban-card';

/** Pure move helper (exported for tests): moves `ids` into `columnId` before/after `targetId` (or to the end). */
export function moveCards(
  columns: KanbanColumnData[],
  ids: string[],
  columnId: string,
  targetId?: string,
  position: 'before' | 'after' = 'before',
): KanbanColumnData[] {
  const moving = columns.flatMap((c) => c.cards).filter((c) => ids.includes(c.id));
  if (!moving.length) return columns;
  const stripped = columns.map((c) => ({ ...c, cards: c.cards.filter((k) => !ids.includes(k.id)) }));
  return stripped.map((c) => {
    if (c.id !== columnId) return c;
    const idx = targetId ? c.cards.findIndex((k) => k.id === targetId) : -1;
    if (idx < 0) return { ...c, cards: [...c.cards, ...moving] };
    const at = position === 'before' ? idx : idx + 1;
    return { ...c, cards: [...c.cards.slice(0, at), ...moving, ...c.cards.slice(at)] };
  });
}

const settle = stylex.keyframes({
  from: { boxShadow: shadow['--oniva-shadow-lg'], transform: 'scale(1.02)' },
  to: { boxShadow: shadow['--oniva-shadow-xs'], transform: 'scale(1)' },
});

const styles = stylex.create({
  board: {
    alignItems: 'flex-start',
    display: 'flex',
    gap: 12,
    overflowX: 'auto',
    paddingBlock: 4,
  },
  column: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-xl'],
    boxSizing: 'border-box',
    display: 'flex',
    flex: '0 0 288px',
    flexDirection: 'column',
    gap: 8,
    padding: 8,
    width: 288,
  },
  header: { alignItems: 'center', display: 'flex', gap: 8, paddingInline: 6, paddingBlock: 4 },
  headerTitle: { flexGrow: 1, margin: 0, fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-semibold'] },
  wipWarn: { color: colors['--oniva-color-warning-fg'] },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minHeight: 48,
    outline: 'none',
    borderRadius: radius['--oniva-radius-lg'],
    backgroundColor: {
      default: 'transparent',
      ':is([data-drop-target])': colors['--oniva-color-accent-tint'],
    },
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'background-color',
  },
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: {
      default: colors['--oniva-color-border'],
      ':is([data-dragging])': colors['--oniva-color-border-active'],
    },
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: {
      default: shadow['--oniva-shadow-xs'],
      ':is([data-dragging])': shadow['--oniva-shadow-lg'],
    },
    boxSizing: 'border-box',
    cursor: 'grab',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    opacity: { default: 1, ':is([data-dragging])': 0.92 },
    outline: 'none',
    padding: 12,
    position: 'relative',
    transform: { default: 'scale(1)', ':is([data-dragging])': 'scale(1.02)' },
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'transform, box-shadow, border-color, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    userSelect: 'none',
  },
  cardFocus: {
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':is([data-focus-visible])': 'solid' },
    outlineWidth: 2,
  },
  settled: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationName: { default: settle, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  cardTop: { alignItems: 'flex-start', display: 'flex', gap: 4 },
  cardTitle: {
    flexGrow: 1,
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
  },
  grip: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: colors['--oniva-color-icon-muted'],
    cursor: 'grab',
    display: 'inline-flex',
    flexShrink: 0,
    height: 24,
    justifyContent: 'center',
    marginInlineEnd: -4,
    marginTop: -2,
    padding: 0,
    width: 24,
  },
  meta: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 6 },
  spacer: { flexGrow: 1 },
  due: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 4,
  },
  dueLate: { color: colors['--oniva-color-danger-fg'] },
  form: { display: 'flex', flexDirection: 'column', gap: 8 },
  field: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: { default: colors['--oniva-color-border-control'], ':focus-visible': colors['--oniva-color-border-active'] },
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    font: 'inherit',
    height: 36,
    outline: 'none',
    paddingInline: 10,
    width: '100%',
  },
  empty: { margin: 0, padding: 12, textAlign: 'center' },
  formActions: { display: 'flex', gap: 8 },
});

const priorityTone = { low: 'neutral', medium: 'info', high: 'warning', urgent: 'danger' } as const;

function fmtDue(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y!, (m ?? 1) - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export interface KanbanProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'onChange'> {
  columns: KanbanColumnData[];
  onColumnsChange?: (columns: KanbanColumnData[]) => void;
  /** Called when a card is added through a column's "Add card" form. */
  onAddCard?: (columnId: string, title: string) => void;
  /** ISO date used to flag overdue cards. Defaults to today. */
  today?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function Kanban({
  columns,
  onColumnsChange,
  onAddCard,
  today,
  className,
  xstyle,
  ref,
  ...rest
}: KanbanProps) {
  const [settledId, setSettledId] = useState<string | null>(null);
  const commit = useCallback(
    (next: KanbanColumnData[], movedId?: string) => {
      onColumnsChange?.(next);
      if (movedId) setSettledId(movedId);
    },
    [onColumnsChange],
  );
  const nowIso = today ?? new Date().toISOString().slice(0, 10);
  const sx = stylex.props(dash.root, styles.board, xstyle);
  return (
    <div role="group" aria-label="Board" {...rest} ref={ref} {...mergeSx(sx, className)}>
      {columns.map((col) => (
        <KanbanColumn
          key={col.id}
          col={col}
          columns={columns}
          commit={commit}
          settledId={settledId}
          today={nowIso}
          onAddCard={onAddCard}
        />
      ))}
    </div>
  );
}

function KanbanColumn({
  col,
  columns,
  commit,
  settledId,
  today,
  onAddCard,
}: {
  col: KanbanColumnData;
  columns: KanbanColumnData[];
  commit: (next: KanbanColumnData[], movedId?: string) => void;
  settledId: string | null;
  today: string;
  onAddCard?: (columnId: string, title: string) => void;
}) {
  const headingId = useId();
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const over = col.wipLimit != null && col.cards.length > col.wipLimit;

  const readIds = async (items: { kind: string; types?: Set<string>; getText?: (t: string) => Promise<string> }[]) => {
    const out: string[] = [];
    for (const item of items) {
      if (item.kind === 'text' && item.types?.has(CARD_TYPE) && item.getText) {
        out.push(...(JSON.parse(await item.getText(CARD_TYPE)) as string[]));
      }
    }
    return out;
  };

  const { dragAndDropHooks } = useDragAndDrop({
    acceptedDragTypes: [CARD_TYPE],
    getItems: (keys) => [{ [CARD_TYPE]: JSON.stringify([...keys]), 'text/plain': [...keys].join(',') }],
    getAllowedDropOperations: () => ['move'],
    onReorder(e: DroppableCollectionReorderEvent) {
      const ids = [...e.keys].map(String);
      commit(moveCards(columns, ids, col.id, String(e.target.key), e.target.dropPosition === 'after' ? 'after' : 'before'), ids[0]);
    },
    async onInsert(e: DroppableCollectionInsertDropEvent) {
      const ids = await readIds(e.items as never);
      commit(moveCards(columns, ids, col.id, String(e.target.key), e.target.dropPosition === 'after' ? 'after' : 'before'), ids[0]);
    },
    async onRootDrop(e: DroppableCollectionRootDropEvent) {
      const ids = await readIds(e.items as never);
      commit(moveCards(columns, ids, col.id), ids[0]);
    },
    renderDragPreview: () => <span />,
  });

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const title = inputRef.current?.value.trim();
    if (!title) return;
    onAddCard?.(col.id, title);
    setAdding(false);
  };

  return (
    <section aria-labelledby={headingId} {...stylex.props(styles.column)}>
      <header {...stylex.props(styles.header)}>
        <h3 id={headingId} {...stylex.props(styles.headerTitle)}>
          {col.title}
        </h3>
        {over && (
          <span {...stylex.props(styles.due, styles.wipWarn)}>
            <TriangleAlert size={14} aria-hidden="true" />
            <span {...stylex.props(dash.sr)}>Over work-in-progress limit.</span>
            <span aria-hidden="true">WIP limit {col.wipLimit}</span>
          </span>
        )}
        <Badge shape="square" variant={over ? 'warning' : 'neutral'}>
          <span aria-hidden="true">{col.wipLimit != null ? `${col.cards.length}/${col.wipLimit}` : col.cards.length}</span>
          <span {...stylex.props(dash.sr)}>{` cards${col.wipLimit != null ? `, limit ${col.wipLimit}` : ''}`}</span>
        </Badge>
      </header>
      <GridList
        aria-label={`${col.title} cards`}
        items={col.cards}
        dragAndDropHooks={dragAndDropHooks}
        keyboardNavigationBehavior="tab"
        {...stylex.props(styles.list)}
        renderEmptyState={() => (
          <p {...stylex.props(dash.label, styles.empty)}>
            Drop cards here
          </p>
        )}
      >
        {(card) => (
          <GridListItem id={card.id} textValue={card.title} {...stylex.props(styles.card, styles.cardFocus, settledId === card.id && styles.settled)}>
            <div {...stylex.props(styles.cardTop)}>
              <h4 {...stylex.props(styles.cardTitle)}>{card.title}</h4>
              <AriaButton slot="drag" {...stylex.props(styles.grip, focus.ring)}>
                <GripVertical size={14} aria-hidden="true" />
              </AriaButton>
            </div>
            {card.tags && card.tags.length > 0 && (
              <div {...stylex.props(styles.meta)}>
                {card.tags.map((t) => (
                  <Badge key={t} size="sm" variant="accent">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
            <div {...stylex.props(styles.meta)}>
              {card.priority && (
                <Badge size="sm" dot variant={priorityTone[card.priority]}>
                  {card.priority[0]!.toUpperCase() + card.priority.slice(1)}
                </Badge>
              )}
              {card.due && (
                <span {...stylex.props(styles.due, card.due < today && styles.dueLate)}>
                  <CalendarDays size={12} aria-hidden="true" />
                  <span {...stylex.props(dash.sr)}>{card.due < today ? 'Overdue, due' : 'Due'}</span>
                  {fmtDue(card.due)}
                </span>
              )}
              <span {...stylex.props(styles.spacer)} />
              {card.assignees && card.assignees.length > 0 && (
                <AvatarGroup size="xs" max={3} aria-label="Assignees">
                  {card.assignees.map((n) => (
                    <Avatar key={n} name={n} size="xs" />
                  ))}
                </AvatarGroup>
              )}
            </div>
          </GridListItem>
        )}
      </GridList>
      {adding ? (
        <form onSubmit={submit} {...stylex.props(styles.form)}>
          <input
            ref={inputRef}
            autoFocus
            aria-label={`New card title in ${col.title}`}
            placeholder="Card title…"
            autoComplete="off"
            onKeyDown={(e) => e.key === 'Escape' && setAdding(false)}
            {...stylex.props(styles.field)}
          />
          <div {...stylex.props(styles.formActions)}>
            <Button type="submit" size="sm">
              Add card
            </Button>
            <Button size="sm" variant="ghost" onPress={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="ghost" size="sm" startIcon={<Plus size={14} aria-hidden="true" />} onPress={() => setAdding(true)} aria-label={`Add card to ${col.title}`}>
          Add card
        </Button>
      )}
    </section>
  );
}
