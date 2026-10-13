import * as stylex from '@stylexjs/stylex';
import { Maximize, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type Ref } from 'react';
import { IconButton, Kbd, ListBox, ListBoxItem, SearchField } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';
import { searchItems, type SearchItem } from './search';

const styles = stylex.create({
  dock: {
    alignItems: 'center',
    bottom: 20,
    display: 'flex',
    gap: 8,
    insetInline: 0,
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 30,
  },
  cluster: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-bg'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: '0 8px 32px color-mix(in srgb, black 18%, transparent)',
    display: 'flex',
    gap: 8,
    padding: 8,
    pointerEvents: 'auto',
  },
  field: { position: 'relative', width: { default: 'min(360px, 56vw)', '@media (min-width: 900px)': 380 } },
  count: {
    color: colors['--oniva-color-text-muted'],
    display: { default: 'none', '@media (min-width: 700px)': 'block' },
    fontSize: font['--oniva-font-size-13'],
    paddingInline: 4,
    whiteSpace: 'nowrap',
  },
  results: {
    backgroundColor: colors['--oniva-color-bg'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: '0 8px 32px color-mix(in srgb, black 18%, transparent)',
    insetInline: 0,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 'calc(100% + 16px)',
  },
  list: { maxHeight: 320, overflowY: 'auto', padding: 4 },
  listInner: { maxHeight: 'none', overflow: 'visible' },
  hints: {
    alignItems: 'center',
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 6,
    padding: '6px 10px',
  },
  empty: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], padding: 12 },
});

export interface SearchBarProps {
  items: SearchItem[];
  inputRef: Ref<HTMLInputElement>;
  onSelect: (id: string) => void;
  onFit: () => void;
  onReset: () => void;
  onEscape: () => void;
}

export function SearchBar({ items, inputRef, onSelect, onFit, onReset, onEscape }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchItems(items, query, 40), [items, query]);
  const activeId = results[Math.min(active, results.length - 1)]?.id;

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [activeId, open]);

  const choose = (id: string) => {
    setOpen(false);
    onSelect(id);
  };

  return (
    <div {...stylex.props(styles.dock)}>
      <div data-canvas-ui {...stylex.props(styles.cluster)}>
        <div
          {...stylex.props(styles.field)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
          }}
        >
          {open ? (
            <div {...stylex.props(styles.results)} onMouseDown={(e) => e.preventDefault()} data-testid="canvas-results">
              {results.length === 0 ? (
                <p role="status" {...stylex.props(styles.empty)}>No components match “{query}”.</p>
              ) : (
                <div ref={listRef} {...stylex.props(styles.list)}>
                  <ListBox
                    aria-label="Matching components"
                    xstyle={styles.listInner}
                    selectionMode="single"
                    selectedKeys={activeId ? [activeId] : []}
                    disallowEmptySelection
                    onAction={(key) => choose(String(key))}
                  >
                    {results.map((r) => (
                      <ListBoxItem key={r.id} id={r.id} textValue={r.title} trailing={r.category}>
                        {r.title}
                      </ListBoxItem>
                    ))}
                  </ListBox>
                </div>
              )}
              <div aria-hidden="true" {...stylex.props(styles.hints)}>
                <Kbd size="sm">↑</Kbd>
                <Kbd size="sm">↓</Kbd> move <Kbd size="sm">↵</Kbd> go <Kbd size="sm">esc</Kbd> close
              </div>
            </div>
          ) : null}
          <SearchField
            ref={inputRef}
            aria-label="Search components"
            placeholder="Search components"
            shortcut="/"
            type="text"
            value={query}
            onChange={(v) => {
              setQuery(v);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                setOpen(true);
                if (results.length) setActive((i) => (i + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
              } else if (e.key === 'Enter' && activeId) {
                e.preventDefault();
                choose(activeId);
              } else if (e.key === 'Escape') {
                setOpen(false);
                if (!query) onEscape();
              }
            }}
          />
        </div>
        <span aria-live="polite" {...stylex.props(styles.count)}>{items.length} components</span>
        <IconButton aria-label="Fit all components" variant="ghost" size="sm" onPress={onFit}>
          <Maximize size={16} />
        </IconButton>
        <IconButton aria-label="Reset view" variant="ghost" size="sm" onPress={onReset}>
          <RotateCcw size={16} />
        </IconButton>
      </div>
    </div>
  );
}
