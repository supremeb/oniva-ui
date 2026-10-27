import * as stylex from '@stylexjs/stylex';
import { ChevronDown, X } from 'lucide-react';
import { Autocomplete, Input, Label, TextField, useFilter, type Key, type Selection } from 'react-aria-components';
import { useId, useMemo, useRef, useState, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { cx, ff } from '../../internal/forms-field';
import { FormsItem, FormsListBox, FormsPopover, FormsSection } from '../../internal/forms-listbox';
import { fp } from '../../internal/forms-popover';
import { Kbd } from '../Kbd';

const styles = stylex.create({
  root: { width: '100%' },
  control: { alignItems: 'center', cursor: 'text', display: 'flex', gap: 6, height: 'auto', minHeight: 40, paddingBlock: 4 },
  chips: { alignItems: 'center', display: 'flex', flexGrow: 1, flexWrap: 'wrap', gap: 4, minWidth: 0 },
  chip: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-text-on-tertiary'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-semibold'],
    gap: 4,
    lineHeight: font['--oniva-font-lh-12'],
    paddingBlock: 2,
    paddingInlineEnd: 4,
    paddingInlineStart: 8,
  },
  chipX: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: radius['--oniva-radius-full'],
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    padding: 2,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    flexBasis: 80,
    flexGrow: 1,
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    minWidth: 60,
    outline: 'none',
    paddingBlock: 4,
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
  },
  member: { alignItems: 'center', display: 'inline-flex', gap: 8 },
  role: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  footer: {
    alignItems: 'center',
    borderTopColor: colors['--oniva-color-separator'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 8,
    paddingInline: 12,
  },
  hints: { alignItems: 'center', display: 'inline-flex', gap: 4 },
  listWrap: { maxHeight: 300, overflow: 'auto', padding: 4 },
});

export interface ComboboxMultiOption {
  id: string;
  /** Searchable name, shown in the row and in the chip. */
  label: string;
  /** Muted trailing text in the row (e.g. a role). */
  description?: string;
  /** Leading node in the row (e.g. an `Avatar`). */
  icon?: ReactNode;
  /** Options sharing a group render under an uppercase section header. */
  group?: string;
}

export interface ComboboxMultiProps {
  label?: ReactNode;
  options: ComboboxMultiOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: ReactNode;
  /** Footer with the selected count and key hints. Default true. */
  footer?: boolean;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLInputElement>;
}

/** Combobox with multiple selection: chips in the field, grouped searchable list, selected-count footer. */
export function ComboboxMulti({
  label,
  options,
  value,
  defaultValue = [],
  onChange,
  placeholder = 'Add…',
  emptyMessage = 'No results',
  footer = true,
  className,
  xstyle,
  ref,
}: ComboboxMultiProps) {
  const [inner, setInner] = useState(defaultValue);
  const selected = value ?? inner;
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const triggerRef = useRef<HTMLDivElement>(null);
  const { contains } = useFilter({ sensitivity: 'base' });
  const labelId = useId();
  const root = stylex.props(ff.root, styles.root, xstyle);
  const set = (next: string[]) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  const byId = useMemo(() => new Map(options.map((o) => [o.id, o])), [options]);
  const groups = useMemo(() => {
    const m = new Map<string, ComboboxMultiOption[]>();
    for (const o of options) m.set(o.group ?? '', [...(m.get(o.group ?? '') ?? []), o]);
    return [...m.entries()];
  }, [options]);
  const row = (o: ComboboxMultiOption) => (
    <FormsItem key={o.id} id={o.id} textValue={o.label}>
      <span {...stylex.props(styles.member)}>
        {o.icon}
        <span>{o.label}</span>
        {o.description && <span {...stylex.props(styles.role)}>{o.description}</span>}
      </span>
    </FormsItem>
  );
  return (
    <div {...root} className={cx(root.className, className)}>
      {label != null && <Label id={labelId} {...stylex.props(ff.label)}>{label}</Label>}
      <Autocomplete filter={contains} inputValue={text} onInputChange={setText}>
        <div
          ref={triggerRef}
          onClick={() => setOpen(true)}
          {...stylex.props(ff.control, ff.md, styles.control)}
        >
          <div {...stylex.props(styles.chips)}>
            {selected.map((id) => (
              <span key={id} {...stylex.props(styles.chip)}>
                {byId.get(id)?.label ?? id}
                <button
                  type="button"
                  aria-label={`Remove ${byId.get(id)?.label ?? id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    set(selected.filter((s) => s !== id));
                  }}
                  {...stylex.props(styles.chipX)}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </span>
            ))}
            <TextField aria-labelledby={label != null ? labelId : undefined} aria-label={label != null ? undefined : 'Search'} style={{ display: 'contents' }}>
              <Input
                ref={ref}
                placeholder={selected.length ? '' : placeholder}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setOpen(false);
                  else if (e.key === 'Backspace' && text === '' && selected.length) set(selected.slice(0, -1));
                  else setOpen(true);
                }}
                {...stylex.props(styles.input)}
              />
            </TextField>
          </div>
          <ChevronDown size={16} aria-hidden="true" {...stylex.props(fp.iconButton)} />
        </div>
        <FormsPopover triggerRef={triggerRef} isOpen={open} onOpenChange={setOpen} isNonModal placement="bottom start">
          <div {...stylex.props(styles.listWrap)}>
            <FormsListBox
              aria-label={typeof label === 'string' ? label : 'Options'}
              selectionMode="multiple"
              selectedKeys={new Set<Key>(selected)}
              onSelectionChange={(k: Selection) => set(k === 'all' ? options.map((o) => o.id) : [...k].map(String))}
              renderEmptyState={() => <div style={{ padding: 12, textAlign: 'center' }}>{emptyMessage}</div>}
            >
              {groups.map(([g, list]) =>
                g ? (
                  <FormsSection key={g} title={g.toUpperCase()}>
                    {list.map(row)}
                  </FormsSection>
                ) : (
                  list.map(row)
                ),
              )}
            </FormsListBox>
          </div>
          {footer && (
            <div {...stylex.props(styles.footer)}>
              <span>{selected.length} selected</span>
              <span {...stylex.props(styles.hints)}>
                <Kbd size="sm">↑</Kbd>
                <Kbd size="sm">↓</Kbd> to move <Kbd size="sm">↵</Kbd> to toggle
              </span>
            </div>
          )}
        </FormsPopover>
      </Autocomplete>
    </div>
  );
}
