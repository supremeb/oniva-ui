import * as stylex from '@stylexjs/stylex';
import { Check, ChevronDown, Paperclip, Pencil, Plus, X } from 'lucide-react';
import { useRef, useState, type Ref } from 'react';
import { ToggleButton as AriaToggleButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { mergeSx, sxClass } from '../../internal/sx';
import { useTimeouts } from '../../internal/w4-hooks';
import { w4 } from '../../internal/w4-styles';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '../../components/DropdownMenu';
import { Link } from '../../components/Link';
import { CrossFade } from '../../motion/CrossFade';
import { m3 } from '../../internal/m3-motion';

const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

const styles = stylex.create({
  root: { containerType: 'inline-size', maxWidth: 520, overflow: 'hidden', width: '100%' },
  record: {
    alignItems: 'baseline',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    padding: 14,
  },
  ref: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, minWidth: 0 },
  id: {
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
  },
  account: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], width: '100%' },
  amount: {
    fontSize: font['--oniva-font-size-16'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
  },
  mail: {
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 14,
  },
  toRow: {
    alignItems: 'center',
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    paddingBlock: 10,
    paddingInline: 14,
  },
  mailNoBorder: { borderBlockStartWidth: 0 },
  toolbar: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 6 },
  toolbarHint: { marginInlineStart: 'auto' },
  to: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  email: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  tones: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    minHeight: 28,
    paddingInline: 10,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  chipOn: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border-control'],
    color: colors['--oniva-color-text'],
  },
  bodyWrap: { position: 'relative' },
  body: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-20'],
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  editBtn: {
    alignItems: 'center',
    color: colors['--oniva-color-icon-muted'],
    display: 'inline-flex',
  },
  textarea: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    font: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-20'],
    minHeight: 96,
    padding: 8,
    resize: 'vertical',
    width: '100%',
  },
  attach: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 6,
    minWidth: 0,
    paddingBlock: 2,
    paddingInlineEnd: 2,
    paddingInlineStart: 8,
  },
  foot: {
    alignItems: 'center',
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    padding: 10,
  },
  agent: { alignItems: 'center', display: 'inline-flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-13'], gap: 8 },
  btns: { alignItems: 'center', display: 'flex', gap: 6, marginInlineStart: 'auto' },
  hint: {
    color: colors['--oniva-color-text-muted'],
    display: { default: 'none', '@container (min-width: 400px)': 'inline' },
    fontSize: font['--oniva-font-size-12'],
  },
  receipt: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    justifyContent: 'space-between',
    padding: 14,
  },
  receiptText: { alignItems: 'center', display: 'inline-flex', gap: 8, minWidth: 0 },
  ok: { color: colors['--oniva-color-success-solid'], flexShrink: 0 },
  muted: { color: colors['--oniva-color-icon-muted'], flexShrink: 0 },
});

export interface DraftContact {
  name: string;
  email: string;
}
export interface DraftTone {
  id: string;
  label: string;
  body: (contact: DraftContact) => string;
}
export interface DraftEmail {
  to: DraftContact;
  body: string;
  attachment: string | null;
}

const first = (c: DraftContact) => c.name.trim().split(/\s+/)[0] ?? '';

const defaultContacts: DraftContact[] = [
  { name: 'Jonas Weber', email: 'jonas@nwlog.example' },
  { name: 'Lena Hart', email: 'lena@nwlog.example' },
  { name: 'Finance team', email: 'billing@nwlog.example' },
];

const defaultTones: DraftTone[] = [
  {
    id: 'friendly',
    label: 'Friendly',
    body: (c) =>
      `Hi ${first(c)}, a heads-up that your Growth plan renews on Nov 2 for $8,900 a year. If you'd like to add seats or switch to monthly billing, you can review the quote here:`,
  },
  { id: 'short', label: 'Short', body: (c) => `Hi ${first(c)}, your Growth plan renews on Nov 2 ($8,900/year). Quote for changes:` },
  {
    id: 'formal',
    label: 'Formal',
    body: (c) =>
      `Dear ${c.name}, this is a reminder that your Growth subscription renews on Nov 2 at $8,900 per year. Should you wish to adjust seats or billing, please review the quote:`,
  },
];

type Phase = 'draft' | 'sending' | 'sent' | 'discarded';

export interface EmailDraftProps {
  /** Reference of the record the email is about. */
  reference?: string;
  account?: string;
  amount?: string;
  status?: string;
  /** Who wrote the draft. */
  agent?: string;
  contacts?: DraftContact[];
  attachment?: string | null;
  tones?: DraftTone[];
  /** Link appended to the email text. */
  link?: { label: string; href: string };
  onSend?: (email: DraftEmail) => void;
  onDiscard?: () => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Agent-written email for review: switch recipient and tone, edit inline, drop the attachment, send or discard with undo. */
export function EmailDraft({
  reference = 'SUB-1182',
  account = 'Northwind Logistics',
  amount = '$8,900',
  status = 'Renews in 5 days',
  agent = 'Renewal agent',
  contacts = defaultContacts,
  attachment = 'Renewal-quote.pdf',
  tones = defaultTones,
  link = { label: 'Review quote', href: '#' },
  onSend,
  onDiscard,
  className,
  xstyle,
  ref,
}: EmailDraftProps) {
  const after = useTimeouts();
  const [to, setTo] = useState<DraftContact | undefined>(contacts[0]);
  const [file, setFile] = useState<string | null>(attachment);
  const [tone, setTone] = useState(tones[0]?.id ?? '');
  const [edited, setEdited] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [phase, setPhase] = useState<Phase>('draft');
  const [toneKey, setToneKey] = useState(0);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const recipient = to ?? { name: '', email: '' };
  const generated = tones.find((t) => t.id === tone)?.body(recipient) ?? '';
  const body = edited ?? generated;

  const startEditing = () => {
    setEdited(body);
    setEditing(true);
    requestAnimationFrame(() => textRef.current?.focus());
  };

  const pickTone = (id: string) => {
    if (id === tone && edited === null) return;
    setTone(id);
    setEdited(null);
    setEditing(false);
    setToneKey((k) => k + 1);
  };

  const send = () => {
    if (phase !== 'draft' || !to) return;
    setEditing(false);
    setPhase('sending');
    after(900, () => {
      setPhase('sent');
      onSend?.({ to, body: `${body} ${link.label}: ${link.href}`, attachment: file });
    });
  };

  const draftOpen = phase === 'draft' || phase === 'sending';

  return (
    <div
      ref={ref}
      data-phase={phase}
      {...mergeSx(stylex.props(w4.card, styles.root, xstyle), className)}
    >
      <div {...stylex.props(styles.record)}>
        <div {...stylex.props(styles.ref)}>
          <span {...stylex.props(styles.id)}>{reference}</span>
          {status && (
            <Badge size="sm" variant="warning">
              {status}
            </Badge>
          )}
        </div>
        <span {...stylex.props(styles.amount)}>{amount}</span>
        <span {...stylex.props(styles.account)}>{account}</span>
      </div>

      <CrossFade contentKey={draftOpen ? 'draft' : phase} morph="height" duration={300}>
      {draftOpen ? (
        <>
            <div {...stylex.props(styles.toRow)}>
              <span {...stylex.props(styles.to)}>To</span>
              <DropdownMenu>
                <Button size="sm" variant="secondary" isDisabled={!to || phase === 'sending'} endIcon={<ChevronDown size={14} />} aria-label={`Recipient: ${recipient.name}`}>
                  {recipient.name || 'No recipient'}
                  {to && <span {...stylex.props(styles.email)}>{to.email}</span>}
                </Button>
                <DropdownMenuContent
                  aria-label="Recipient"
                  selectionMode="single"
                  selectedKeys={to ? [to.email] : []}
                  onSelectionChange={(keys) => {
                    const k = [...keys][0];
                    const c = contacts.find((x) => x.email === k);
                    if (c) setTo(c);
                  }}
                >
                  {contacts.map((c) => (
                    <DropdownMenuItem key={c.email} id={c.email} textValue={c.name}>
                      {c.name} <span {...stylex.props(styles.email)}>{c.email}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {file ? (
                <span {...stylex.props(styles.attach)}>
                  <Paperclip size={14} aria-hidden="true" />
                  {file}
                  <Button size="xs" variant="ghost" isIconOnly aria-label={`Remove ${file}`} onPress={() => setFile(null)}>
                    <X size={12} />
                  </Button>
                </span>
              ) : (
                attachment && (
                  <Button size="xs" variant="ghost" startIcon={<Plus size={12} />} onPress={() => setFile(attachment)}>
                    Add {attachment}
                  </Button>
                )
              )}
            </div>
          <div {...stylex.props(styles.mail, styles.mailNoBorder)}>
            <div {...stylex.props(styles.bodyWrap)}>
              {editing ? (
                <textarea
                  ref={textRef}
                  aria-label="Email text"
                  value={body}
                  onChange={(e) => setEdited(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.stopPropagation();
                      setEditing(false);
                    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  {...stylex.props(styles.textarea, focus.ring)}
                />
              ) : (
                <p key={toneKey} {...stylex.props(styles.body)}>
                  {body}{' '}
                  <Link href={link.href}>{link.label}</Link>
                </p>
              )}
            </div>

            <div {...stylex.props(styles.toolbar)}>
              <div role="group" aria-label="Tone" {...stylex.props(styles.tones)}>
                {tones.map((t) => (
                  <AriaToggleButton
                    key={t.id}
                    isSelected={t.id === tone}
                    onChange={() => pickTone(t.id)}
                    isDisabled={phase === 'sending'}
                    className={({ isSelected }) => sxClass(stylex.props(styles.chip, focus.ring, isSelected && styles.chipOn))}
                  >
                    {t.label}
                  </AriaToggleButton>
                ))}
              </div>
              <button type="button" aria-label="Edit text" onClick={startEditing} {...stylex.props(w4.reset, styles.editBtn, focus.ring)}>
                <Pencil size={14} aria-hidden="true" />
              </button>
              <span {...stylex.props(styles.hint, styles.toolbarHint)}>⌘ Enter to send</span>
            </div>
          </div>
          <div {...stylex.props(styles.foot)}>
            <span {...stylex.props(styles.agent)}>{agent}<Badge size="sm" variant="success">Ready for review</Badge></span>
            <span {...stylex.props(styles.btns)}>
              <Button size="sm" variant="secondary" isDisabled={phase === 'sending'} onPress={() => { setEditing(false); setPhase('discarded'); onDiscard?.(); }}>
                Discard
              </Button>
              <Button size="sm" variant="primary" isLoading={phase === 'sending'} isDisabled={!to} onPress={send}>
                Send email
              </Button>
            </span>
          </div>
        </>
      ) : (
        <div role="status" {...stylex.props(styles.receipt)}>
          <span {...stylex.props(styles.receiptText)}>
            {phase === 'sent' ? (
              <>
                <Check size={16} aria-hidden="true" {...stylex.props(styles.ok, m3.pop)} />
                Sent to {recipient.name}
              </>
            ) : (
              <>
                <X size={16} aria-hidden="true" {...stylex.props(styles.muted, m3.pop)} />
                Draft discarded
              </>
            )}
          </span>
          <Button size="sm" variant="ghost" onPress={() => setPhase('draft')}>
            Undo
          </Button>
        </div>
      )}
      </CrossFade>
    </div>
  );
}
