import * as stylex from '@stylexjs/stylex';
import {
  Autocomplete,
  Input as AriaInput,
  Keyboard as AriaKeyboard,
  Menu as AriaMenu,
  SearchField as AriaSearchField,
  type Key,
} from 'react-aria-components';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useState, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { menuStyles as m } from '../../internal/overlays-menu';
import { Dialog, Modal } from '../Dialog';
import { DropdownMenuItem, DropdownMenuSection } from '../DropdownMenu';

// Keyboard-opened (hundreds of times a day): no scale/translate, a short fade only.
const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });

const styles = stylex.create({
  overlay: { alignItems: 'flex-start', paddingTop: '12vh' },
  panel: {
    animationDuration: { default: '0s', '[data-entering]': '80ms', '[data-exiting]': '80ms' },
    animationName: { default: 'none', '[data-entering]': fadeIn, '[data-exiting]': fadeOut },
    animationTimingFunction: 'ease-out',
    maxWidth: 'calc(100vw - 32px)',
    width: 560,
  },
  searchRow: {
    alignItems: 'center',
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    color: colors['--oniva-color-icon-muted'],
    display: 'flex',
    gap: 10,
    paddingBlock: 0,
    paddingInline: 16,
  },
  search: { alignItems: 'center', display: 'flex', flexGrow: 1 },
  input: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    flexGrow: 1,
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-16'],
    height: 52,
    lineHeight: font['--oniva-font-lh-16'],
    outline: 'none',
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
    '::-webkit-search-cancel-button': { appearance: 'none', display: 'none' },
  },
  list: { maxHeight: 340, padding: 8 },
  empty: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    paddingBlock: 32,
    paddingInline: 16,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    gap: 16,
    paddingBlock: 8,
    paddingInline: 16,
  },
  hint: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  kbd: {
    backgroundColor: colors['--oniva-color-kbd-bg'],
    borderRadius: 4,
    color: colors['--oniva-color-text-on-tertiary'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-medium'],
    paddingBlock: 1,
    paddingInline: 5,
  },
});

export interface CommandItem {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Shortcut hint, e.g. "⌘N". */
  shortcut?: string;
  /** Extra search terms that are not displayed. */
  keywords?: string[];
  isDisabled?: boolean;
  variant?: 'default' | 'danger';
}
export interface CommandGroup {
  id: string;
  title: string;
  items: CommandItem[];
}

/** Subsequence ("fuzzy") match: every query character appears in order. Case/diacritic insensitive. */
export function fuzzyMatch(text: string, query: string): boolean {
  const norm = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const t = norm(text);
  const q = norm(query).replace(/\s+/g, '');
  if (!q) return true;
  if (t.includes(norm(query).trim())) return true;
  let i = 0;
  for (const ch of t) {
    if (ch === q[i]) i++;
    if (i === q.length) return true;
  }
  return false;
}

export interface CommandPaletteProps {
  groups: CommandGroup[];
  /** Called with the chosen item; the palette then closes. */
  onSelect?: (item: CommandItem) => void;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  /** Registers a global ⌘K / Ctrl+K toggle. Default true. */
  hotkey?: boolean;
  emptyMessage?: ReactNode;
  'aria-label'?: string;
  xstyle?: stylex.StyleXStyles;
  className?: string;
  ref?: Ref<HTMLElement>;
}

export function CommandPalette({
  groups,
  onSelect,
  isOpen: isOpenProp,
  defaultOpen = false,
  onOpenChange,
  placeholder = 'Search commands…',
  hotkey = true,
  emptyMessage = 'No results found.',
  'aria-label': ariaLabel = 'Command palette',
  xstyle,
  className,
  ref,
}: CommandPaletteProps) {
  const [inner, setInner] = useState(defaultOpen);
  const open = isOpenProp ?? inner;
  const setOpen = useCallback(
    (next: boolean) => {
      if (isOpenProp === undefined) setInner(next);
      onOpenChange?.(next);
    },
    [isOpenProp, onOpenChange],
  );

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [hotkey, open, setOpen]);

  const all = new Map<Key, CommandItem>();
  for (const g of groups) for (const it of g.items) all.set(it.id, it);

  return (
    <Modal
      isOpen={open}
      onOpenChange={setOpen}
      overlayXstyle={styles.overlay}
      xstyle={[styles.panel, xstyle] as unknown as stylex.StyleXStyles}
    >
      <Dialog ref={ref} className={className} aria-label={ariaLabel} showCloseButton={false}>
        <Autocomplete filter={(text, input) => fuzzyMatch(text, input)}>
          <div {...stylex.props(styles.searchRow)}>
            <Search size={18} aria-hidden="true" />
            <AriaSearchField
              aria-label="Search commands"
              autoFocus
              {...stylex.props(styles.search)}
            >
              <AriaInput placeholder={placeholder} {...stylex.props(styles.input)} />
            </AriaSearchField>
          </div>
          <AriaMenu
            aria-label="Commands"
            {...stylex.props(m.menu, styles.list)}
            renderEmptyState={() => <div {...stylex.props(styles.empty)}>{emptyMessage}</div>}
            onAction={(key) => {
              const item = all.get(key);
              if (!item) return;
              setOpen(false);
              onSelect?.(item);
            }}
          >
            {groups.map((g) => (
              <DropdownMenuSection key={g.id} id={g.id} title={g.title}>
                {g.items.map((it) => (
                  <DropdownMenuItem
                    key={it.id}
                    id={it.id}
                    icon={it.icon}
                    shortcut={it.shortcut}
                    isDisabled={it.isDisabled}
                    variant={it.variant}
                    textValue={[it.label, ...(it.keywords ?? [])].join(' ')}
                  >
                    {it.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSection>
            ))}
          </AriaMenu>
        </Autocomplete>
        <div {...stylex.props(styles.footer)} aria-hidden="true">
          <span {...stylex.props(styles.hint)}>
            <AriaKeyboard {...stylex.props(styles.kbd)}>↑↓</AriaKeyboard> navigate
          </span>
          <span {...stylex.props(styles.hint)}>
            <AriaKeyboard {...stylex.props(styles.kbd)}>↵</AriaKeyboard> select
          </span>
          <span {...stylex.props(styles.hint)}>
            <AriaKeyboard {...stylex.props(styles.kbd)}>esc</AriaKeyboard> close
          </span>
        </div>
      </Dialog>
    </Modal>
  );
}
