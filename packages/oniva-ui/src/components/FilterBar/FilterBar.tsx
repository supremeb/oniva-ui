import * as stylex from '@stylexjs/stylex';
import { Bookmark, ListFilter, Plus, X } from 'lucide-react';
import { useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { Button } from '../Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../DropdownMenu';
import { Input } from '../Input';
import { Popover, PopoverTrigger } from '../Popover';
import { Select, SelectItem } from '../Select';
import { dash } from '../../internal/dash-styles';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { media } from '../../tokens/media.stylex';

export type FilterOperator = 'contains' | 'is' | 'is not' | '=' | '>' | '<';

export interface FilterField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
}
export interface FilterValue {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
}
export interface SavedView {
  id: string;
  name: string;
  filters: FilterValue[];
}

const operatorsFor: Record<FilterField['type'], FilterOperator[]> = {
  text: ['contains', 'is', 'is not'],
  number: ['=', '>', '<'],
  select: ['is', 'is not'],
};

/** Applies filters to a list of records (exported for demos/tests). */
export function applyFilters<T extends Record<string, unknown>>(rows: T[], filters: FilterValue[]): T[] {
  return rows.filter((r) =>
    filters.every((f) => {
      if (f.value === '') return true;
      const raw = r[f.field];
      const s = String(raw ?? '').toLowerCase();
      const v = f.value.toLowerCase();
      switch (f.operator) {
        case 'contains':
          return s.includes(v);
        case 'is':
          return s === v;
        case 'is not':
          return s !== v;
        case '=':
          return Number(raw) === Number(f.value);
        case '>':
          return Number(raw) > Number(f.value);
        case '<':
          return Number(raw) < Number(f.value);
      }
    }),
  );
}

const pop = stylex.keyframes({ from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'scale(1)' } });

const styles = stylex.create({
  bar: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: pop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'inline-flex',
    height: 32,
    overflow: 'hidden',
  },
  chipMain: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    font: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    gap: 4,
    height: '100%',
    paddingInline: 10,
  },
  chipField: { color: colors['--oniva-color-text-muted'] },
  chipValue: { fontWeight: font['--oniva-font-weight-medium'] },
  chipX: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderColor: colors['--oniva-color-border'],
    borderStyle: 'solid',
    borderWidth: 0,
    borderInlineStartWidth: 1,
    color: colors['--oniva-color-icon-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    height: '100%',
    justifyContent: 'center',
    padding: 0,
    width: 28,
  },
  editor: { display: 'flex', flexDirection: 'column', gap: 12, padding: 4, width: 240 },
  spacer: { flexGrow: 1 },
});

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'onChange'> {
  fields: FilterField[];
  filters: FilterValue[];
  onFiltersChange: (filters: FilterValue[]) => void;
  /** Initial saved views; the "Save current view" action appends to the internal list. */
  savedViews?: SavedView[];
  onSaveView?: (view: SavedView) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function FilterBar({ fields, filters, onFiltersChange, savedViews = [], onSaveView, className, xstyle, ref, ...rest }: FilterBarProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [views, setViews] = useState(savedViews);
  const fieldOf = (id: string) => fields.find((f) => f.id === id)!;

  const update = (id: string, patch: Partial<FilterValue>) => onFiltersChange(filters.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const remove = (id: string) => onFiltersChange(filters.filter((f) => f.id !== id));

  const add = (fieldId: string) => {
    const field = fieldOf(fieldId);
    const id = `f${Date.now().toString(36)}${filters.length}`;
    onFiltersChange([...filters, { id, field: fieldId, operator: operatorsFor[field.type][0]!, value: field.type === 'select' ? (field.options?.[0] ?? '') : '' }]);
    setOpenId(id);
  };

  const saveView = () => {
    const view: SavedView = { id: `v${views.length + 1}`, name: `View ${views.length + 1}`, filters };
    setViews([...views, view]);
    onSaveView?.(view);
  };

  const sx = stylex.props(dash.root, styles.bar, xstyle);
  return (
    <div role="group" aria-label="Filters" {...rest} ref={ref} {...mergeSx(sx, className)}>
      {filters.map((f) => {
        const field = fieldOf(f.field);
        return (
          <span key={f.id} role="group" aria-label={`${field.label} filter`} {...stylex.props(styles.chip)}>
            <PopoverTrigger isOpen={openId === f.id} onOpenChange={(o) => setOpenId(o ? f.id : null)}>
              <button type="button" aria-label={`Edit ${field.label} filter: ${f.operator} ${f.value || 'any'}`} {...stylex.props(dash.reset, styles.chipMain, focus.inset)}>
                <span {...stylex.props(styles.chipField)}>{field.label}</span>
                <span {...stylex.props(styles.chipField)}>{f.operator}</span>
                <span {...stylex.props(styles.chipValue)}>{f.value || '…'}</span>
              </button>
              <Popover placement="bottom start" aria-label={`${field.label} filter`}>
                <div {...stylex.props(styles.editor)}>
                  <Select aria-label="Operator" size="sm" selectedKey={f.operator} onSelectionChange={(k) => update(f.id, { operator: String(k) as FilterOperator })}>
                    {operatorsFor[field.type].map((op) => (
                      <SelectItem key={op} id={op}>
                        {op}
                      </SelectItem>
                    ))}
                  </Select>
                  {field.type === 'select' ? (
                    <Select aria-label="Value" size="sm" selectedKey={f.value} onSelectionChange={(k) => update(f.id, { value: String(k) })}>
                      {(field.options ?? []).map((o) => (
                        <SelectItem key={o} id={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </Select>
                  ) : (
                    <Input aria-label="Value" size="sm" autoFocus value={f.value} inputMode={field.type === 'number' ? 'decimal' : 'text'} placeholder={field.type === 'number' ? 'Enter a number' : 'Enter a value'} onChange={(v) => update(f.id, { value: v })} />
                  )}
                  <Button size="sm" onPress={() => setOpenId(null)}>
                    Done
                  </Button>
                </div>
              </Popover>
            </PopoverTrigger>
            <button type="button" aria-label={`Remove ${field.label} filter`} onClick={() => remove(f.id)} {...stylex.props(dash.reset, styles.chipX, focus.inset)}>
              <X size={14} aria-hidden="true" />
            </button>
          </span>
        );
      })}
      <DropdownMenu>
        <Button variant="secondary" size="sm" startIcon={<Plus size={14} aria-hidden="true" />}>
          Add filter
        </Button>
        <DropdownMenuContent aria-label="Add filter" placement="bottom start" onAction={(k) => add(String(k))}>
          {fields.map((f) => (
            <DropdownMenuItem key={f.id} id={f.id} icon={<ListFilter size={16} aria-hidden="true" />}>
              {f.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {filters.length > 0 && (
        <Button variant="ghost" size="sm" onPress={() => onFiltersChange([])}>
          Clear all
        </Button>
      )}
      <span {...stylex.props(styles.spacer)} />
      <DropdownMenu>
        <Button variant="secondary" size="sm" startIcon={<Bookmark size={14} aria-hidden="true" />}>
          Views
        </Button>
        <DropdownMenuContent
          aria-label="Saved views"
          placement="bottom end"
          onAction={(k) => {
            if (k === '__save') return saveView();
            const v = views.find((x) => x.id === k);
            if (v) onFiltersChange(v.filters);
          }}
        >
          {views.map((v) => (
            <DropdownMenuItem key={v.id} id={v.id}>
              {v.name}
            </DropdownMenuItem>
          ))}
          {views.length > 0 && <DropdownMenuSeparator />}
          <DropdownMenuItem id="__save" isDisabled={filters.length === 0}>
            Save current view
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
