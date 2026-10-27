import * as stylex from '@stylexjs/stylex';
import { Check, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useId, useState, type ReactNode, type Ref } from 'react';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { Presence } from '../../motion/Presence';
import { CopyButton } from '../../motion/CopyButton';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select, SelectItem } from '../Select';
import { Switch } from '../Switch';
import { VisuallyHidden } from '../VisuallyHidden';

const barIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const barFade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    containerType: 'inline-size',
    fontFamily: font['--oniva-font-sans'],
    overflow: 'hidden',
    width: '100%',
  },
  tile: { overflow: 'hidden' },
  valid: { color: colors['--oniva-color-success-solid'], display: 'inline-flex' },
  section: {
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    padding: 20,
  },
  head: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    padding: 20,
  },
  logo: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  titles: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  nameRow: { alignItems: 'center', display: 'flex', gap: 8 },
  name: { fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  count: {
    backgroundColor: colors['--oniva-color-surface-active'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    paddingBlock: 1,
    paddingInline: 8,
  },
  meta: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'], margin: 0 },
  body: {
    display: 'flex',
    flexDirection: 'column',
  },
  keyRow: { alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: 8 },
  keyField: { flexGrow: 1, minWidth: 200 },
  bar: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: barIn, [media.reducedMotion]: barFade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
    padding: 12,
  },
  barText: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], marginInlineEnd: 'auto' },
  error: { color: colors['--oniva-color-text-error'], fontSize: font['--oniva-font-size-13'] },
});

export interface IntegrationValues {
  enabled: boolean;
  siteUrl: string;
  timeZone: string;
  apiKey: string;
}

export const defaultTimeZones = [
  '(GMT -08:00) Los Angeles',
  '(GMT -05:00) New York',
  '(GMT +00:00) London',
  '(GMT +01:00) Berlin',
  '(GMT +05:30) Mumbai',
  '(GMT +09:00) Tokyo',
];

export interface IntegrationSettingsProps {
  /** Service name. */
  name: string;
  /** Mark in the tile; defaults to a monogram of `name` (no brand logos). */
  logo?: ReactNode;
  /** Small number next to the name. */
  count?: number;
  /** Line under the name while enabled. */
  meta?: ReactNode;
  /** Line shown instead of `meta` when switched off. */
  pausedMeta?: ReactNode;
  defaultValues?: Partial<IntegrationValues>;
  siteHint?: ReactNode;
  timeZones?: string[];
  /** Creates a key. A random demo key is used without it. */
  onGenerateKey?: () => string | Promise<string>;
  /** Called from the save bar with all values; reject to keep the bar open and show the message. */
  onSave?: (values: IntegrationValues) => void | Promise<void>;
  onToggle?: (enabled: boolean) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const HOST = /^(https?:\/\/)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i;
/** True for addresses like `shop.example.com` or `https://shop.example.com/store`. */
export function isValidSiteUrl(v: string): boolean {
  return HOST.test(v.trim());
}

function randomKey(): string {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return `ok_${Array.from(bytes, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 28)}`;
}

/** Settings card for one connected service: on/off switch, API key, validated site address, time zone and a save bar. */
export function IntegrationSettings({
  name,
  logo,
  count,
  meta,
  pausedMeta = 'Paused. Syncing is off until you switch it back on.',
  defaultValues,
  siteHint = 'The address your data is read from.',
  timeZones = defaultTimeZones,
  onGenerateKey,
  onSave,
  onToggle,
  className,
  xstyle,
  ref,
}: IntegrationSettingsProps) {
  const uid = useId();
  const fmt = useFormatters();
  const initial: IntegrationValues = {
    enabled: true,
    siteUrl: '',
    timeZone: timeZones[0] ?? '',
    apiKey: '',
    ...defaultValues,
  };
  const [saved, setSaved] = useState(initial);
  const [values, setValues] = useState(initial);
  const [reveal, setReveal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [announce, setAnnounce] = useState('');

  const patch = (p: Partial<IntegrationValues>) => setValues((v) => ({ ...v, ...p }));
  const canAnimate = typeof Element !== 'undefined' && typeof Element.prototype.getAnimations === 'function';
  const dirty = (Object.keys(values) as (keyof IntegrationValues)[]).some((k) => values[k] !== saved[k]);
  const urlInvalid = values.siteUrl.trim() !== '' && !isValidSiteUrl(values.siteUrl);

  const generate = async () => {
    const key = await (onGenerateKey ?? randomKey)();
    patch({ apiKey: key });
    setReveal(true);
    setAnnounce('New key generated. Copy it now, it will be hidden after you save.');
  };
  const save = async () => {
    setBusy(true);
    setSaveError(null);
    try {
      await onSave?.(values);
      setSaved(values);
      setReveal(false);
      setAnnounce('Settings saved');
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setBusy(false);
    }
  };
  const masked = values.apiKey ? `${'•'.repeat(16)}${values.apiKey.slice(-4)}` : '';

  return (
    <div ref={ref} {...mergeSx(stylex.props(styles.root, xstyle), className)}>
      <section aria-labelledby={`${uid}-name`} {...stylex.props(styles.tile)}>
        <div {...stylex.props(styles.head)}>
          <span aria-hidden="true" {...stylex.props(styles.logo)}>
            {logo ?? name.slice(0, 1).toUpperCase()}
          </span>
          <div {...stylex.props(styles.titles)}>
            <div {...stylex.props(styles.nameRow)}>
              <h3 id={`${uid}-name`} {...stylex.props(styles.name)}>
                {name}
              </h3>
              {count != null && <span {...stylex.props(styles.count)}>{fmt.number(count)}</span>}
            </div>
            <p {...stylex.props(styles.meta)}>{values.enabled ? meta : pausedMeta}</p>
          </div>
          <Switch
            isSelected={values.enabled}
            onChange={(enabled) => {
              patch({ enabled });
              onToggle?.(enabled);
            }}
            aria-label={`${name} sync`}
          />
        </div>
        <AnimatedHeight isOpen={values.enabled}>
          <div {...stylex.props(styles.body)}>
            <div {...stylex.props(styles.section)}>
            <div {...stylex.props(styles.keyRow)}>
              <Input
                label="API key"
                aria-describedby={`${uid}-key`}
                value={reveal ? values.apiKey : masked}
                isReadOnly
                placeholder="Generate a new API key"
                xstyle={styles.keyField}
                suffix={
                  values.apiKey ? (
                    <Button
                      variant="ghost"
                      size="xs"
                      isIconOnly
                      aria-label={reveal ? 'Hide key' : 'Show key'}
                      onPress={() => setReveal((r) => !r)}
                    >
                      {reveal ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
                    </Button>
                  ) : undefined
                }
              />
              {values.apiKey && <CopyButton value={values.apiKey} size="md" aria-label="Copy API key" />}
              <Button
                variant="secondary"
                startIcon={<RefreshCw size={14} aria-hidden="true" />}
                onPress={() => void generate()}
              >
                {values.apiKey ? 'Regenerate' : 'Generate key'}
              </Button>
            </div>
            <VisuallyHidden>
              <span id={`${uid}-key`}>Keep this key secret. Regenerating it signs out anything using the old one.</span>
            </VisuallyHidden>
            </div>
            <div {...stylex.props(styles.section)}>
            <Input
              label="Site address"
              prefix="https://"
              suffix={
                values.siteUrl && !urlInvalid ? (
                  <span aria-hidden="true" {...stylex.props(styles.valid)}>
                    <Check size={16} />
                  </span>
                ) : undefined
              }
              placeholder="shop.example.com"
              description={siteHint}
              value={values.siteUrl}
              onChange={(siteUrl) => patch({ siteUrl })}
              isInvalid={urlInvalid}
              errorMessage="Enter a valid address, like shop.example.com"
              inputMode="url"
              autoComplete="off"
            />
            </div>
            <div {...stylex.props(styles.section)}>
            <Select
              label="Time zone"
              selectedKey={values.timeZone}
              onSelectionChange={(k) => patch({ timeZone: String(k) })}
            >
              {timeZones.map((z) => (
                <SelectItem key={z} id={z}>
                  {z}
                </SelectItem>
              ))}
            </Select>
            </div>
          </div>
        </AnimatedHeight>
        {(dirty || canAnimate) && (
          <Presence isPresent={dirty} preset="slide" initial={false} exitTimeoutMs={200}>
          <div {...stylex.props(styles.bar)}>
            <span {...stylex.props(styles.barText)}>
              {saveError ? <span role="alert" {...stylex.props(styles.error)}>{saveError}</span> : 'You have unsaved changes'}
            </span>
            <Button variant="ghost" size="sm" isDisabled={busy} onPress={() => { setValues(saved); setReveal(false); setSaveError(null); }}>
              Discard
            </Button>
            <Button size="sm" isLoading={busy} isDisabled={urlInvalid} onPress={() => void save()}>
              Save changes
            </Button>
          </div>
          </Presence>
        )}
      </section>
      <VisuallyHidden>
        <span role="status" aria-live="polite">
          {announce}
        </span>
      </VisuallyHidden>
    </div>
  );
}
