import * as stylex from '@stylexjs/stylex';
import { PinIcon, PinOffIcon, PencilIcon, SearchIcon } from '../../icons/IconSet';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  search: { margin: 4, position: 'relative' },
  icon: { color: colors['--oniva-color-icon-muted'], insetInlineStart: 10, pointerEvents: 'none', position: 'absolute', top: 9 },
  group: { color: colors['--oniva-color-text-subtle'], fontSize: font['--oniva-font-size-11'], fontWeight: font['--oniva-font-weight-medium'], letterSpacing: font['--oniva-font-track-label'], margin: 0, paddingBlock: 8, paddingInline: 10, textTransform: 'uppercase' },
  list: { display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, padding: 0 },
  item: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] }, ':focus-within': colors['--oniva-color-surface-inset-hover'] },
    borderRadius: radius['--oniva-radius-md'],
    display: 'flex',
    gap: 4,
    paddingInline: 4,
    position: 'relative',
    transitionDuration: motion['--oniva-motion-dur-instant'],
    transitionProperty: 'background-color',
  },
  active: { backgroundColor: colors['--oniva-color-surface-inner'], boxShadow: `0 0 0 1px ${colors['--oniva-color-border']}` },
  open: {
    alignItems: 'flex-start',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    fontFamily: font['--oniva-font-sans'],
    gap: 1,
    minWidth: 0,
    paddingBlock: 8,
    paddingInline: 6,
    textAlign: 'start',
  },
  tools: { display: 'flex', flexShrink: 0 },
  fill: { maxWidth: '100%' },
  renameField: { margin: 4 },
  searchField: { paddingInlineStart: 30 },
  empty: { padding: 16, textAlign: 'center' },
});

export interface Thread {
  id: string;
  title: string;
  preview?: string;
  /** e.g. `2h`. */
  time?: string;
  pinned?: boolean;
}

export interface ConversationListProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'onSelect'> {
  threads: Thread[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onPin?: (id: string, pinned: boolean) => void;
  onRename?: (id: string, title: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/** Threads sidebar: search, pin and inline rename. Row highlights are instant. */
export function ConversationList({ threads, activeId, onSelect, onPin, onRename, className, xstyle, ref, ...rest }: ConversationListProps) {
  const [q, setQ] = useState('');
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  // Row to hand focus back to once rename ends via keyboard (the rename button remounts, so focus would otherwise drop to <body>).
  const restoreRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (renaming === null && restoreRef.current) {
      restoreRef.current.querySelector<HTMLElement>('[data-rename]')?.focus();
      restoreRef.current = null;
    }
  }, [renaming]);
  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    return threads.filter((t) => !n || t.title.toLowerCase().includes(n) || t.preview?.toLowerCase().includes(n));
  }, [threads, q]);
  const pinned = shown.filter((t) => t.pinned);
  const recent = shown.filter((t) => !t.pinned);

  const group = (label: string, list: Thread[]) =>
    list.length > 0 && (
      <section aria-label={label}>
        <h4 {...stylex.props(styles.group)}>{label}</h4>
        <ul {...stylex.props(styles.list)}>
          {list.map((t) => (
            <li key={t.id} {...stylex.props(styles.item, activeId === t.id && styles.active)}>
              {renaming === t.id ? (
                <input
                  autoFocus
                  aria-label="Rename conversation"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={() => setRenaming(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      if (e.key === 'Enter' && draft.trim()) onRename?.(t.id, draft.trim());
                      restoreRef.current = e.currentTarget.closest('li');
                      setRenaming(null);
                    }
                  }}
                  {...stylex.props(aib.field, styles.renameField)}
                />
              ) : (
                <>
                  <button type="button" aria-current={activeId === t.id ? 'true' : undefined} onClick={() => onSelect?.(t.id)} {...stylex.props(styles.open, focus.inset)}>
                    <span title={t.title} {...stylex.props(aib.name, aib.clamp, styles.fill)}>{t.title}</span>
                    {t.preview && <span title={t.preview} {...stylex.props(aib.meta, aib.clamp, styles.fill)}>{t.preview}</span>}
                  </button>
                  {t.time && <span {...stylex.props(aib.meta, aiStyles.num)}>{t.time}</span>}
                  <span {...stylex.props(styles.tools)}>
                    <button type="button" data-rename aria-label={`Rename ${t.title}`} onClick={() => { setDraft(t.title); setRenaming(t.id); }} {...stylex.props(aib.mini, focus.ring)}><PencilIcon size={13} /></button>
                    <button type="button" aria-label={`${t.pinned ? 'Unpin' : 'Pin'} ${t.title}`} onClick={() => onPin?.(t.id, !t.pinned)} {...stylex.props(aib.mini, focus.ring)}>
                      {t.pinned ? <PinOffIcon size={13} /> : <PinIcon size={13} />}
                    </button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    );

  return (
    <nav {...rest} ref={ref} aria-label={rest['aria-label'] ?? 'Conversations'} {...mergeSx(stylex.props(aiStyles.panel, aib.pad, xstyle), className)}>
      <div {...stylex.props(styles.search)}>
        <SearchIcon size={14} aria-hidden="true" {...stylex.props(styles.icon)} />
        <input type="search" aria-label="Search conversations" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} {...stylex.props(aib.field, styles.searchField)} />
      </div>
      {group('Pinned', pinned)}
      {group('Recent', recent)}
      <div role="status">
        {shown.length === 0 && <p {...stylex.props(aib.meta, styles.empty)}>{threads.length === 0 ? 'No conversations yet.' : 'No conversations found.'}</p>}
      </div>
    </nav>
  );
}
