import * as stylex from '@stylexjs/stylex';
import { Check, ChevronDown, ChevronUp, Globe, Lightbulb, Sparkles } from 'lucide-react';
import { useState, type CSSProperties, type Ref } from 'react';
import { Button } from '../../components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
} from '../../components/DropdownMenu';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { useFormatters } from '../../internal/format';
import { m3 } from '../../internal/m3-motion';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { CrossFade } from '../../motion/CrossFade';
import { Presence } from '../../motion/Presence';

const styles = stylex.create({
  desc: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-regular'],
  },
  chevron: { color: colors['--oniva-color-icon-muted'] },
  inl: { display: 'inline-flex' },
  row: { alignItems: 'center', display: 'flex', gap: 12, justifyContent: 'space-between', minWidth: 240 },
  col: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  metrics: { alignItems: 'flex-end', display: 'flex', flexDirection: 'column', flexShrink: 0, gap: 3 },
  meters: { display: 'flex', gap: 8 },
  meter: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'inline-flex', fontSize: font['--oniva-font-size-11'], gap: 3 },
  segs: { display: 'inline-flex', gap: 1 },
  seg: { backgroundColor: colors['--oniva-color-border-control'], borderRadius: radius['--oniva-radius-full'], height: 6, width: 4 },
  segOn: { backgroundColor: accent['--oniva-accent-solid'] },
  cost: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], fontVariantNumeric: 'tabular-nums' },
  bulb: { color: colors['--oniva-color-accent-text'] },
  tile: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  tileSm: { borderRadius: radius['--oniva-radius-sm'], fontSize: font['--oniva-font-size-11'], height: 20, width: 20 },
  nameRow: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  tick: { color: accent['--oniva-accent-solid'] },
  headRow: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 8,
    justifyContent: 'space-between',
    letterSpacing: '0.06em',
    paddingBlock: 4,
    paddingInline: 8,
    textTransform: 'uppercase',
  },
  headCols: { display: 'flex', gap: 8 },
  headCol: { textAlign: 'center', width: 54 },
  footRow: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-regular'],
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 6,
    paddingInline: 8,
  },
  strong: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  kbds: { display: 'inline-flex', gap: 4 },
  kbd: {
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-sm'],
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: font['--oniva-font-size-11'],
    paddingBlock: 1,
    paddingInline: 6,
  },
  toggle: {
    backgroundColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-full'],
    flexShrink: 0,
    height: 18,
    marginInlineStart: 'auto',
    position: 'relative',
    transitionDuration: '150ms',
    transitionProperty: 'background-color',
    width: 32,
  },
  toggleOn: { backgroundColor: accent['--oniva-accent-solid'] },
  knob: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-full'],
    height: 14,
    insetBlockStart: 2,
    insetInlineStart: 2,
    position: 'absolute',
    transitionDuration: '150ms',
    transitionProperty: 'transform',
    width: 14,
  },
  knobOn: { transform: 'translateX(14px)' },
  wide: { height: 4, width: 10, borderRadius: radius['--oniva-radius-full'] },
  settingRow: { alignItems: 'center', display: 'flex', flexGrow: 1, gap: 12, minWidth: 240 },
  sr: {
    borderWidth: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
});

export interface ModelOption {
  id: string;
  name: string;
  description?: string;
  /** Strengths from 1 to 5 (cost 5 is the most expensive). Leave all out for a router; the row says "Varies". */
  speed?: number;
  quality?: number;
  cost?: number;
  /** Time to first token in ms, without extended thinking. */
  latencyMs?: number;
  /** Price in USD per million tokens. */
  pricePerM?: number;
}

export type ModelEffort = 'low' | 'medium' | 'high';
const EFFORTS: ModelEffort[] = ['low', 'medium', 'high'];
const EFFORT_MULT: Record<ModelEffort, number> = { low: 1.6, medium: 2.5, high: 4 };
const EFFORT_LABEL: Record<ModelEffort, string> = { low: 'Low effort', medium: 'Medium effort', high: 'High effort' };

export interface ModelSelectorProps {
  models: ModelOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  isDisabled?: boolean;
  /** Extended thinking switch. Providing `onThinkingChange` or `thinking` adds a settings section to the menu. */
  thinking?: boolean;
  defaultThinking?: boolean;
  onThinkingChange?: (on: boolean) => void;
  /** Web search switch, same rules as `thinking`. */
  webSearch?: boolean;
  defaultWebSearch?: boolean;
  onWebSearchChange?: (on: boolean) => void;
  /** Thinking effort; only offered while thinking is on. */
  effort?: ModelEffort;
  defaultEffort?: ModelEffort;
  onEffortChange?: (effort: ModelEffort) => void;
  /** `detailed` adds a letter tile per model, a SPEED / QUALITY / COST header, toggle rows for settings and a first-token / price footer. */
  variant?: 'default' | 'detailed';
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

function Tile({ name, small }: { name: string; small?: boolean }) {
  return (
    <span aria-hidden="true" {...stylex.props(styles.tile, small && styles.tileSm)}>
      {name === 'Auto' ? <Sparkles size={12} /> : name[0]}
    </span>
  );
}

function Bars({ label, value }: { label: string; value: number }) {
  return (
    <span {...stylex.props(styles.segs)} style={{ width: 54, justifyContent: 'space-between' }}>
      <span aria-hidden="true" style={{ display: 'contents' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ '--oniva-i': i } as CSSProperties} {...stylex.props(styles.seg, styles.wide, i <= value && styles.segOn, i <= value && m3.seg)} />
        ))}
      </span>
      <span {...stylex.props(styles.sr)}>{`${label} ${value} of 5`}</span>
    </span>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" {...stylex.props(styles.toggle, on && styles.toggleOn)}>
      <span {...stylex.props(styles.knob, on && styles.knobOn)} />
    </span>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <span {...stylex.props(styles.meter)}>
      <span aria-hidden="true">{label[0]}</span>
      <span aria-hidden="true" {...stylex.props(styles.segs)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ '--oniva-i': i } as CSSProperties} {...stylex.props(styles.seg, i <= value && styles.segOn, i <= value && m3.seg)} />
        ))}
      </span>
      <span {...stylex.props(styles.sr)}>{`${label} ${value} of 5`}</span>
    </span>
  );
}

/** Model picker: a compact ghost button that opens a menu with strengths, first-token time and price, plus optional thinking / effort / web search settings. */
export function ModelSelector({
  models,
  value,
  defaultValue,
  onChange,
  isDisabled,
  thinking,
  defaultThinking = false,
  onThinkingChange,
  webSearch,
  defaultWebSearch = false,
  onWebSearchChange,
  effort,
  defaultEffort = 'medium',
  onEffortChange,
  variant = 'default',
  xstyle,
  ref,
}: ModelSelectorProps) {
  const fmt = useFormatters();
  const [open, setOpen] = useState(false);
  const [innerThinking, setInnerThinking] = useState(defaultThinking);
  const [innerWeb, setInnerWeb] = useState(defaultWebSearch);
  const [innerEffort, setInnerEffort] = useState<ModelEffort>(defaultEffort);
  const [innerModel, setInnerModel] = useState(defaultValue);
  const thinkingOn = thinking ?? innerThinking;
  const webOn = webSearch ?? innerWeb;
  const effortValue = effort ?? innerEffort;
  const selected = value ?? innerModel;
  const current = models.find((m) => m.id === selected) ?? models[0];
  const hasSettings =
    thinking !== undefined || onThinkingChange !== undefined || webSearch !== undefined || onWebSearchChange !== undefined;
  const mult = thinkingOn ? EFFORT_MULT[effortValue] : 1;

  const pickModel = (id: string) => {
    setInnerModel(id);
    onChange?.(id);
  };

  const detailed = variant === 'detailed';
  const content = (m: ModelOption) => {
    const hasMetrics = m.speed != null || m.quality != null || m.cost != null;
    if (detailed) {
      return (
        <span {...stylex.props(styles.row)}>
          <Tile name={m.name} />
          <span {...stylex.props(styles.col)} style={{ flexGrow: 1 }}>
            <span {...stylex.props(styles.nameRow)}>
              {m.name}
              {m.id === current?.id && <Check size={13} aria-hidden="true" {...stylex.props(styles.tick)} />}
            </span>
            {m.description && <span {...stylex.props(styles.desc)}>{m.description}</span>}
          </span>
          {hasMetrics ? (
            <span {...stylex.props(styles.meters)}>
              {m.speed != null && <Bars label="Speed" value={m.speed} />}
              {m.quality != null && <Bars label="Quality" value={m.quality} />}
              {m.cost != null && <Bars label="Cost" value={m.cost} />}
            </span>
          ) : (
            <span {...stylex.props(styles.cost)} style={{ width: 170, textAlign: 'center' }}>Varies</span>
          )}
        </span>
      );
    }
    return (
      <span {...stylex.props(styles.row)}>
        <span {...stylex.props(styles.col)}>
          <span>{m.name}</span>
          {m.description && <span {...stylex.props(styles.desc)}>{m.description}</span>}
        </span>
        <span {...stylex.props(styles.metrics)}>
          {hasMetrics ? (
            <span {...stylex.props(styles.meters)}>
              {m.speed != null && <Meter label="Speed" value={m.speed} />}
              {m.quality != null && <Meter label="Quality" value={m.quality} />}
              {m.cost != null && <Meter label="Cost" value={m.cost} />}
            </span>
          ) : (
            (m.latencyMs != null || m.pricePerM != null) && <span {...stylex.props(styles.cost)}>Varies</span>
          )}
          {(m.latencyMs != null || m.pricePerM != null) && hasMetrics && (
            <span {...stylex.props(styles.cost)}>
              {m.latencyMs != null && (
                <>
                  <AnimatedNumber value={(m.latencyMs * mult) / 1000} format={{ maximumFractionDigits: 1, minimumFractionDigits: 0 }} />s
                </>
              )}
              {m.latencyMs != null && m.pricePerM != null && ' · '}
              {m.pricePerM != null && `${fmt.currency(m.pricePerM, 'USD', { maximumFractionDigits: 0 })}/M`}
            </span>
          )}
        </span>
      </span>
    );
  };

  const trigger = (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      isDisabled={isDisabled}
      aria-label={`Model: ${current?.name ?? ''}${thinkingOn ? ', extended thinking on' : ''}`}
      startIcon={detailed && current ? <Tile name={current.name} small /> : <Sparkles size={14} aria-hidden="true" />}
      endIcon={
        <>
          <Presence isPresent={thinkingOn} preset="scale" initial={false} xstyle={styles.inl}>
            <Lightbulb size={14} aria-hidden="true" {...stylex.props(styles.bulb)} />
          </Presence>
          {detailed && open ? (
            <ChevronUp size={14} aria-hidden="true" {...stylex.props(styles.chevron)} />
          ) : (
            <ChevronDown size={14} aria-hidden="true" {...stylex.props(styles.chevron)} />
          )}
        </>
      }
      xstyle={xstyle}
    >
      <CrossFade as="span" contentKey={current?.id ?? ''} duration={200} morph="both">
        {current?.name}
      </CrossFade>
    </Button>
  );

  if (!hasSettings) {
    return (
      <DropdownMenu isOpen={open} onOpenChange={setOpen}>
        {trigger}
        <DropdownMenuContent
          placement="top start"
          aria-label="Choose model"
          selectionMode="single"
          selectedKeys={new Set<string>(current ? [current.id] : [])}
          onSelectionChange={(keys) => {
            const k = [...keys][0];
            if (k != null) pickModel(String(k));
          }}
        >
          {models.map((m) => (
            <DropdownMenuItem key={m.id} id={m.id} textValue={m.name}>
              {content(m)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // With settings the whole menu is multi-select; keys are prefixed per group and diffed against state.
  const keys = new Set<string>([
    ...(current ? [`m:${current.id}`] : []),
    ...(thinkingOn ? ['t'] : []),
    ...(webOn ? ['w'] : []),
    ...(thinkingOn ? [`e:${effortValue}`] : []),
  ]);
  const onSelection = (next: Iterable<string | number> | 'all') => {
    if (next === 'all') return;
    const n = new Set([...next].map(String));
    for (const k of n) {
      if (keys.has(k)) continue;
      if (k.startsWith('m:')) {
        pickModel(k.slice(2));
        setOpen(false);
      } else if (k.startsWith('e:')) {
        const e = k.slice(2) as ModelEffort;
        setInnerEffort(e);
        onEffortChange?.(e);
      } else if (k === 't') {
        setInnerThinking(true);
        onThinkingChange?.(true);
      } else if (k === 'w') {
        setInnerWeb(true);
        onWebSearchChange?.(true);
      }
    }
    for (const k of keys) {
      if (n.has(k)) continue;
      if (k === 't') {
        setInnerThinking(false);
        onThinkingChange?.(false);
      } else if (k === 'w') {
        setInnerWeb(false);
        onWebSearchChange?.(false);
      }
    }
  };

  const header = (
    <span {...stylex.props(styles.headRow)}>
      <span>Model</span>
      <span {...stylex.props(styles.headCols)}>
        <span {...stylex.props(styles.headCol)}>Speed</span>
        <span {...stylex.props(styles.headCol)}>Quality</span>
        <span {...stylex.props(styles.headCol)}>Cost</span>
      </span>
    </span>
  );
  const footer = (
    <span {...stylex.props(styles.footRow)}>
      <span>
        {current?.latencyMs != null && (
          <>
            ~<span {...stylex.props(styles.strong)}>{((current.latencyMs * mult) / 1000).toFixed(1)}s</span> first token
          </>
        )}
        {current?.latencyMs != null && current?.pricePerM != null && ' · '}
        {current?.pricePerM != null && (
          <>
            <span {...stylex.props(styles.strong)}>{fmt.currency(current.pricePerM, 'USD', { maximumFractionDigits: 0 })}</span> / M tokens
          </>
        )}
      </span>
      <span aria-hidden="true" {...stylex.props(styles.kbds)}>
        <span {...stylex.props(styles.kbd)}>↑↓</span>
        <span {...stylex.props(styles.kbd)}>↵</span>
      </span>
    </span>
  );

  return (
    <DropdownMenu isOpen={open} onOpenChange={setOpen}>
      {trigger}
      <DropdownMenuContent
        placement="top start"
        aria-label="Choose model"
        selectionMode="multiple"
        selectedKeys={keys}
        onSelectionChange={onSelection}
      >
        <DropdownMenuSection
          aria-label="Models"
          title={detailed ? header : undefined}
        >
          {models.map((m) => (
            <DropdownMenuItem key={m.id} id={`m:${m.id}`} textValue={m.name}>
              {content(m)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSection>
        <DropdownMenuSeparator />
        <DropdownMenuSection aria-label="Settings">
          <DropdownMenuItem id="t" textValue="Extended thinking" icon={detailed ? <Lightbulb size={16} /> : undefined}>
            {detailed ? <span {...stylex.props(styles.settingRow)}>Extended thinking<Toggle on={thinkingOn} /></span> : 'Extended thinking'}
          </DropdownMenuItem>
          {thinkingOn &&
            EFFORTS.map((e) => (
              <DropdownMenuItem key={e} id={`e:${e}`} textValue={EFFORT_LABEL[e]}>
                <span style={{ '--oniva-i': EFFORTS.indexOf(e) } as CSSProperties} {...stylex.props(styles.inl, m3.rise)}>
                  {EFFORT_LABEL[e]}
                </span>
              </DropdownMenuItem>
            ))}
          <DropdownMenuItem id="w" textValue="Web search" icon={detailed ? <Globe size={16} /> : undefined}>
            {detailed ? <span {...stylex.props(styles.settingRow)}>Web search<Toggle on={webOn} /></span> : 'Web search'}
          </DropdownMenuItem>
        </DropdownMenuSection>
        {detailed && (
          <DropdownMenuSection aria-label="Summary" title={footer} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
