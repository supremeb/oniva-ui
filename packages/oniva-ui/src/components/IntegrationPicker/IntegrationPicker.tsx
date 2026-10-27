import * as stylex from '@stylexjs/stylex';
import { ArrowLeftRight, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import {
  Button as AriaButton,
  Header,
  Input as AriaInput,
  Keyboard as AriaKeyboard,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  SearchField,
  type Key,
} from 'react-aria-components';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { GlideSurface } from '../../internal/m5-glide';
import { radius } from '../../tokens/radius.stylex';
import { Button } from '../Button';
import { Switch } from '../Switch';

const tileIn = stylex.keyframes({
  from: { filter: 'blur(3px)', opacity: 0, transform: 'translateY(4px)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
});
const tileFade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const spread = stylex.keyframes({
  '0%': { opacity: 0.5, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(1.5)' },
});
const turn = stylex.keyframes({ from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(180deg)' } });

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    containerType: 'inline-size',
    fontFamily: font['--oniva-font-sans'],
    overflow: 'hidden',
    width: '100%',
  },
  top: {
    alignItems: 'center',
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    gap: 8,
    paddingBlock: 6,
    paddingInline: 12,
  },
  back: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-icon-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  scope: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-sm'],
    color: colors['--oniva-color-text'],
    flexShrink: 0,
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    paddingBlock: 2,
    paddingInline: 8,
  },
  kbdHint: {
    backgroundColor: colors['--oniva-color-kbd-bg'],
    borderRadius: 4,
    color: colors['--oniva-color-text-on-tertiary'],
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-11'],
    paddingBlock: 1,
    paddingInline: 5,
  },
  search: { display: 'flex', flexGrow: 1 },
  input: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    flexGrow: 1,
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    height: 36,
    outline: 'none',
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
    '::-webkit-search-cancel-button': { appearance: 'none', display: 'none' },
  },
  body: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(180px, 260px) minmax(0, 1fr)',
      '@container (max-width: 560px)': 'minmax(0, 1fr)',
    },
    minHeight: 320,
  },
  list: {
    borderInlineEndColor: { default: colors['--oniva-color-border'], '@container (max-width: 560px)': 'transparent' },
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
    maxHeight: 360,
    outline: 'none',
    overflowY: 'auto',
    padding: 6,
  },
  groupHead: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: '0.06em',
    paddingBlock: 8,
    paddingInline: 10,
    textTransform: 'uppercase',
  },
  item: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      '[data-selected]': colors['--oniva-color-surface-active'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    cursor: 'pointer',
    display: 'flex',
    gap: 10,
    outline: 'none',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineStyle: { default: 'none', '[data-focus-visible]': 'solid' },
    outlineWidth: 2,
    paddingBlock: 6,
    paddingInline: 8,
  },
  itemText: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  itemName: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-regular'] },
  itemCat: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  mono: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  monoLg: { borderRadius: radius['--oniva-radius-lg'], fontSize: font['--oniva-font-size-20'], height: 60, width: 60 },
  monoApp: {
    backgroundColor: colors['--oniva-color-text'],
    borderColor: colors['--oniva-color-text'],
    color: colors['--oniva-color-bg'],
  },
  detail: { display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, padding: 20 },
  hero: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    minHeight: 144,
    overflow: 'hidden',
  },
  tiles: { alignItems: 'center', display: 'flex', gap: 20, position: 'relative', width: 'fit-content' },
  titleRow: { alignItems: 'flex-start', display: 'flex', gap: 12, justifyContent: 'space-between' },
  meta: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-13'], gap: 8, marginBlockStart: 4 },
  chip: {
    backgroundColor: colors['--oniva-color-success-bg'],
    borderRadius: radius['--oniva-radius-sm'],
    color: colors['--oniva-color-success-fg'],
    fontSize: font['--oniva-font-size-12'],
    paddingBlock: 1,
    paddingInline: 6,
  },
  foot: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: font['--oniva-font-size-13'],
    gap: 12,
    justifyContent: 'space-between',
    paddingBlock: 10,
    paddingInline: 16,
  },
  footCount: { alignItems: 'center', display: 'flex', gap: 8, fontVariantNumeric: 'tabular-nums' },
  dot: { backgroundColor: colors['--oniva-color-success-solid'], borderRadius: radius['--oniva-radius-full'], height: 6, width: 6 },
  footHints: { alignItems: 'center', display: 'flex', gap: 14 },
  tile: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: tileIn, [media.reducedMotion]: tileFade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    position: 'relative',
  },
  ring: {
    animationDuration: '2200ms',
    animationIterationCount: 'infinite',
    animationName: { default: spread, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    borderColor: colors['--oniva-color-success-solid'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    inset: -6,
    pointerEvents: 'none',
    position: 'absolute',
  },
  arrows: {
    animationDuration: motion['--oniva-motion-dur-slower'],
    animationName: { default: turn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-in-out'],
    color: colors['--oniva-color-icon-muted'],
  },
  h: { fontSize: font['--oniva-font-size-18'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  p: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'], lineHeight: font['--oniva-font-lh-14'], margin: 0 },
  features: { display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', margin: 0, padding: 0 },
  feature: { alignItems: 'center', display: 'flex', fontSize: font['--oniva-font-size-14'], gap: 8 },
  tick: { color: colors['--oniva-color-success-solid'], flexShrink: 0 },
  actions: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12 },
  empty: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'], padding: 16, textAlign: 'center' },
});

export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  connected?: boolean;
  /** Shown under the title next to the Connected chip, e.g. `linear.app`. */
  domain?: string;
}

export interface IntegrationPickerProps {
  integrations: Integration[];
  /** Your product name, used in the title and on the app tile. */
  appName?: string;
  /** Custom mark for the app tile; defaults to a monogram of `appName`. */
  appIcon?: ReactNode;
  defaultSelected?: string;
  /** Called when an integration is switched on or off. */
  onToggle?: (id: string, connected: boolean) => void;
  onExplore?: (id: string) => void;
  /** Shows the back button and runs on ← in an empty search. */
  onBack?: () => void;
  /** Runs on Esc in an empty search. */
  onClose?: () => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Search + list of services (Connected / Available) and the picked one shown with its connection on two neutral monogram tiles. */
export function IntegrationPicker({
  integrations,
  appName = 'Oniva',
  appIcon,
  defaultSelected,
  onToggle,
  onExplore,
  onBack,
  onClose,
  className,
  xstyle,
  ref,
}: IntegrationPickerProps) {
  const [query, setQuery] = useState('');
  const [connected, setConnected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(integrations.map((i) => [i.id, !!i.connected])),
  );
  const [selected, setSelected] = useState<string>(defaultSelected ?? integrations[0]?.id ?? '');
  const listRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () => integrations.filter((i) => !q || `${i.name} ${i.category} ${i.description}`.toLowerCase().includes(q)),
    [integrations, q],
  );
  const conn = visible.filter((i) => connected[i.id]);
  const avail = visible.filter((i) => !connected[i.id]);
  const current = integrations.find((i) => i.id === selected) ?? visible[0];
  const isOn = current ? !!connected[current.id] : false;

  const toggle = (id: string, on: boolean) => {
    setConnected((c) => ({ ...c, [id]: on }));
    onToggle?.(id, on);
  };

  const onSearchKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      listRef.current?.querySelector<HTMLElement>('[role="option"][data-selected], [role="option"]')?.focus();
    } else if (e.key === 'ArrowLeft' && !query && onBack) {
      e.preventDefault();
      onBack();
    } else if (e.key === 'Escape' && !query && onClose) {
      e.preventDefault();
      onClose();
    }
  };

  const row = (i: Integration) => (
    <ListBoxItem key={i.id} id={i.id} textValue={i.name} {...stylex.props(styles.item)}>
      <span aria-hidden="true" {...stylex.props(styles.mono)}>
        {initials(i.name)}
      </span>
      <span {...stylex.props(styles.itemText)}>
        <span {...stylex.props(styles.itemName)}>{i.name}</span>
        <span {...stylex.props(styles.itemCat)}>{i.category}</span>
      </span>
    </ListBoxItem>
  );

  return (
    <div ref={ref} {...mergeSx(stylex.props(styles.root, xstyle), className)}>
      <div {...stylex.props(styles.top)}>
        {onBack && (
          <AriaButton aria-label="Back" onPress={onBack} {...stylex.props(styles.back, focus.ring)}>
            <ChevronLeft size={18} aria-hidden="true" />
          </AriaButton>
        )}
        <span aria-hidden="true" {...stylex.props(styles.scope)}>
          Integrations
        </span>
        <SearchField
          aria-label="Search integrations"
          value={query}
          onChange={setQuery}
          onKeyDown={onSearchKey}
          {...stylex.props(styles.search)}
        >
          <AriaInput placeholder="Search integrations" {...stylex.props(styles.input)} />
        </SearchField>
        <AriaKeyboard aria-hidden="true" {...stylex.props(styles.kbdHint)}>
          ⌘/
        </AriaKeyboard>
      </div>
      <div {...stylex.props(styles.body)}>
        <GlideSurface track="selected">
        <ListBox
          ref={listRef}
          aria-label="Integrations"
          selectionMode="single"
          selectionBehavior="replace"
          disallowEmptySelection
          selectedKeys={current ? [current.id] : []}
          onSelectionChange={(keys) => {
            const k = [...keys][0] as Key | undefined;
            if (k != null) setSelected(String(k));
          }}
          onAction={(k) => toggle(String(k), !connected[String(k)])}
          renderEmptyState={() => <div {...stylex.props(styles.empty)}>No integrations match “{query}”.</div>}
          {...stylex.props(styles.list)}
        >
          {conn.length > 0 && (
            <ListBoxSection id="connected">
              <Header {...stylex.props(styles.groupHead)}>Connected</Header>
              {conn.map(row)}
            </ListBoxSection>
          )}
          {avail.length > 0 && (
            <ListBoxSection id="available">
              <Header {...stylex.props(styles.groupHead)}>Available</Header>
              {avail.map(row)}
            </ListBoxSection>
          )}
        </ListBox>
        </GlideSurface>
        <div aria-live="polite" {...stylex.props(styles.detail)}>
          {current ? (
            <>
              <div {...stylex.props(styles.hero)}>
                <div {...stylex.props(styles.tiles)} key={current.id}>
                  <span aria-hidden="true" {...stylex.props(styles.tile, styles.mono, styles.monoLg, styles.monoApp)}>
                    {appIcon ?? initials(appName)}
                    {isOn && <span {...stylex.props(styles.ring)} />}
                  </span>
                  <ArrowLeftRight key={String(isOn)} size={18} aria-hidden="true" {...stylex.props(styles.arrows)} />
                  <span aria-hidden="true" {...stylex.props(styles.tile, styles.mono, styles.monoLg)}>
                    {initials(current.name)}
                    {isOn && <span {...stylex.props(styles.ring)} />}
                  </span>
                </div>
              </div>
              <div {...stylex.props(styles.titleRow)}>
                <div>
                  <h3 {...stylex.props(styles.h)}>
                    {appName} + {current.name}
                  </h3>
                  <div {...stylex.props(styles.meta)}>
                    {current.domain && <span>{current.domain}</span>}
                    {isOn && <span {...stylex.props(styles.chip)}>Connected</span>}
                  </div>
                </div>
                <Switch
                  aria-label={`${isOn ? 'Disconnect' : 'Connect'} ${current.name}`}
                  isSelected={isOn}
                  onChange={(on) => toggle(current.id, on)}
                />
              </div>
              <p {...stylex.props(styles.p)}>{current.description}</p>
              <ul aria-label={`${current.name} features`} {...stylex.props(styles.features)}>
                {current.features.map((f) => (
                  <li key={f} {...stylex.props(styles.feature)}>
                    <Check size={14} aria-hidden="true" {...stylex.props(styles.tick)} />
                    {f}
                  </li>
                ))}
              </ul>
              {onExplore && (
                <div {...stylex.props(styles.actions)}>
                  <Button variant="secondary" size="sm" endIcon={<ChevronRight size={14} aria-hidden="true" />} onPress={() => onExplore(current.id)}>
                    Explore integration
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p {...stylex.props(styles.p)}>Nothing to show.</p>
          )}
        </div>
      </div>
      <div aria-hidden="true" {...stylex.props(styles.foot)}>
        <span {...stylex.props(styles.footCount)}>
          <span {...stylex.props(styles.dot)} />
          {integrations.filter((i) => connected[i.id]).length} of {integrations.length} connected
        </span>
        <span {...stylex.props(styles.footHints)}>
          <span>
            <AriaKeyboard {...stylex.props(styles.kbdHint)}>↑↓</AriaKeyboard> to move
          </span>
          <span>
            <AriaKeyboard {...stylex.props(styles.kbdHint)}>↵</AriaKeyboard> to switch
          </span>
        </span>
      </div>
    </div>
  );
}
