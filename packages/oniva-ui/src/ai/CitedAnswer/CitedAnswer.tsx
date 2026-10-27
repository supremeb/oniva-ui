import * as stylex from '@stylexjs/stylex';
import { ArrowRight, Check, Copy, ExternalLink } from 'lucide-react';
import { useId, useRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { CrossFade } from '../../motion/CrossFade';
import { m3 } from '../../internal/m3-motion';
import { aiStyles } from '../../internal/ai-styles';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { markQuote } from '../../internal/w3-answer-text';


const styles = stylex.create({
  root: {
    boxSizing: 'border-box',
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 0,
    maxWidth: 460,
    padding: 0,
    width: '100%',
  },
  top: { alignItems: 'center', display: 'flex', gap: 8, padding: '14px 14px 0' },
  faces: { display: 'inline-flex' },
  face: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-sm'],
    borderStyle: 'solid',
    borderWidth: 1.5,
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-11'],
    height: 18,
    justifyContent: 'center',
    marginInlineStart: -4,
    width: 18,
  },
  faceFirst: { marginInlineStart: 0 },
  body: { display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 14px 12px' },
  foot: {
    alignItems: 'center',
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 8,
    justifyContent: 'space-between',
    marginBlockStart: 14,
    padding: '8px 10px 8px 14px',
  },
  footN: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  tray: { display: 'flex', flexDirection: 'column', gap: 8 },
  chipAv: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-hover'],
    borderRadius: radius['--oniva-radius-sm'],
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-11'],
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  text: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-14'], lineHeight: 1.6, margin: 0 },
  seg: {
    backgroundColor: {
      default: 'transparent',
      ':is([data-lit])': colors['--oniva-color-accent-soft'],
    },
    borderRadius: 4,
    opacity: { default: 1, ':is([data-dim])': 0.45 },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  marker: {
    appearance: 'none',
    backgroundColor: {
      default: colors['--oniva-color-surface-inner'],
      ':is([data-lit])': accent['--oniva-accent-solid'],
      ':is([aria-expanded="true"])': accent['--oniva-accent-solid'],
    },
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: {
      default: colors['--oniva-color-text-muted'],
      ':is([data-lit])': colors['--oniva-color-accent-fg'],
      ':is([aria-expanded="true"])': colors['--oniva-color-accent-fg'],
    },
    cursor: 'pointer',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-11'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    height: { default: 16, '@media (pointer: coarse)': 24 },
    marginInline: 2,
    minWidth: { default: 16, '@media (pointer: coarse)': 24 },
    paddingInline: 4,
    verticalAlign: 'baseline',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  head: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: colors['--oniva-color-surface-inner'],
      ':is([data-lit])': colors['--oniva-color-accent-soft'],
      ':is([aria-expanded="true"])': colors['--oniva-color-accent-soft'],
    },
    borderColor: {
      default: colors['--oniva-color-border'],
      ':is([aria-expanded="true"])': colors['--oniva-color-accent-text'],
    },
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    gap: 6,
    maxWidth: '100%',
    minHeight: { default: 26, '@media (pointer: coarse)': 36 },
    paddingBlock: 2,
    paddingInline: 10,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  chipNum: { color: colors['--oniva-color-text-muted'], fontVariantNumeric: 'tabular-nums' },
  chipName: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  preview: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-lg'],
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBlockStart: 4,
    padding: 12,
  },
  pTitle: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  pMeta: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], margin: 0 },
  quote: {
    borderInlineStartColor: colors['--oniva-color-border-control'],
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 2,
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: 1.5,
    margin: 0,
    paddingInlineStart: 10,
  },
  mark: { backgroundColor: colors['--oniva-color-warning-bg'], borderRadius: 2, color: 'inherit' },
  btns: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 6 },
  btn: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    gap: 4,
    minHeight: 28,
    paddingInline: 10,
    textDecoration: 'none',
  },
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

export interface CitedSource {
  id: string;
  title: string;
  /** Site name, e.g. `Tokenwise`. */
  site: string;
  url?: string;
  /** Pre-formatted, e.g. `Sep 18, 2026`. */
  date?: string;
  /** The passage your retrieval step used. */
  quote?: string;
  /** Exact phrases to mark in the quote; otherwise words shared with the citing sentences are marked. */
  highlight?: string[];
}

export interface CitedSegment {
  text: string;
  /** Source ids this sentence cites (one marker each). Unknown ids are skipped. */
  cite?: string[];
  /** Starts a new paragraph. */
  paragraph?: boolean;
}

export interface CitedAnswerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  segments: CitedSegment[];
  sources: CitedSource[];
  /** Pages read while searching, shown in the head. */
  pagesRead?: number;
  /** Id of the source whose preview is open at first. */
  defaultOpen?: string;
  onOpenSource?: (source: CitedSource) => void;
  onPreviewChange?: (id: string | null) => void;
  /** Extra button on the tray, e.g. a follow-up. */
  action?: { label: string; onPress: () => void };
  /** Footer summary; defaults to "N of M sentences backed by a source". Pass `null` to hide the summary. */
  summary?: ReactNode | null;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** A finished answer wired to its sources: hover a marker to light up its sentence and chip, press to unfold the quoted passage. */
export function CitedAnswer({
  segments,
  sources,
  pagesRead,
  defaultOpen,
  onOpenSource,
  onPreviewChange,
  action,
  summary,
  className,
  xstyle,
  ref,
  ...rest
}: CitedAnswerProps) {
  const fmt = useFormatters();
  const uid = useId();
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const [lit, setLit] = useState<string | null>(null);
  const [live, setLive] = useState('');
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const byId = new Map(sources.map((s, i) => [s.id, { s, n: i + 1 }]));

  const toggle = (id: string) => {
    const next = open === id ? null : id;
    setOpen(next);
    onPreviewChange?.(next);
    setLive(next ? `Source ${byId.get(id)!.n}: ${byId.get(id)!.s.title}` : '');
  };
  const point = (id: string | null) => {
    setLit(id);
    const src = id ? byId.get(id) : undefined;
    setLive(src ? `Source ${src.n}: ${src.s.title}` : '');
  };
  const label = (id: string) => `Source ${byId.get(id)!.n}: ${byId.get(id)!.s.site} – ${byId.get(id)!.s.title}`;

  const onChipKey = (e: KeyboardEvent, i: number) => {
    const last = sources.length - 1;
    const to = e.key === 'ArrowRight' ? Math.min(i + 1, last) : e.key === 'ArrowLeft' ? Math.max(i - 1, 0) : e.key === 'Home' ? 0 : e.key === 'End' ? last : null;
    if (to === null) return;
    e.preventDefault();
    chipRefs.current.get(sources[to]!.id)?.focus();
  };

  const paragraphs: CitedSegment[][] = [];
  for (const seg of segments) {
    if (seg.paragraph || !paragraphs.length) paragraphs.push([seg]);
    else paragraphs[paragraphs.length - 1]!.push(seg);
  }

  const openSrc = open ? byId.get(open) : undefined;
  // Keep the last preview mounted while the region folds closed.
  const lastSrc = useRef(openSrc);
  if (openSrc) lastSrc.current = openSrc;
  const shownSrc = openSrc ?? lastSrc.current;
  const citing = open ? segments.filter((s) => s.cite?.includes(open)).map((s) => s.text) : [];
  const [copied, setCopied] = useState(false);

  const backed = segments.filter((sg) => sg.cite?.some((id) => byId.has(id))).length;
  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  return (
    <div
      {...rest}
      ref={ref}
      onKeyDown={(e) => {
        rest.onKeyDown?.(e);
        if (e.key === 'Escape' && open) {
          const id = open;
          toggle(id);
          chipRefs.current.get(id)?.focus();
        }
      }}
      {...mergeSx(sx, className)}
    >
      <div {...stylex.props(styles.top)}>
        <span aria-hidden="true" {...stylex.props(styles.faces)}>
          {sources.slice(0, 3).map((s, i) => (
            <span key={s.id} {...stylex.props(styles.face, i === 0 && styles.faceFirst)}>{s.site.charAt(0).toUpperCase()}</span>
          ))}
        </span>
        <span {...stylex.props(styles.head)}>
          <CrossFade as="span" contentKey={`${sources.length}-${pagesRead ?? ''}`} duration={220}>
            {fmt.plural(sources.length, { one: '# source', other: '# sources' })}
            {pagesRead != null && ` · ${fmt.plural(pagesRead, { one: '# page read', other: '# pages read' })}`}
          </CrossFade>
        </span>
      </div>
      <div {...stylex.props(styles.body)}>
      {paragraphs.map((para, pi) => (
        <p key={pi} {...stylex.props(styles.text)}>
          {para.map((seg, si) => {
            const ids = (seg.cite ?? []).filter((id) => byId.has(id));
            const isLit = lit !== null && ids.includes(lit);
            const dim = lit !== null && !isLit;
            const trimmed = seg.text.trimEnd();
            const tail = seg.text.slice(trimmed.length);
            const lead = trimmed.length - trimmed.trimStart().length;
            const core = trimmed.trimStart();
            const lastSpace = core.lastIndexOf(' ');
            const head = ids.length && lastSpace > 0 ? core.slice(0, lastSpace + 1) : ids.length ? '' : core;
            const last = ids.length ? core.slice(head.length) : '';
            return (
              <span key={si}>
                {seg.text.slice(0, lead)}
                <span data-lit={isLit ? '' : undefined} data-dim={dim ? '' : undefined} {...stylex.props(styles.seg)}>
                  {head}
                  {ids.length > 0 && (
                    <span style={{ whiteSpace: 'nowrap' }}>
                      {last}
                      {ids.map((id) => (
                        <button
                          key={id}
                          type="button"
                          aria-label={label(id)}
                          aria-expanded={open === id}
                          aria-controls={`${uid}-preview`}
                          data-lit={lit === id ? '' : undefined}
                          onClick={() => toggle(id)}
                          onMouseEnter={() => point(id)}
                          onMouseLeave={() => point(null)}
                          onFocus={() => point(id)}
                          onBlur={() => point(null)}
                          {...stylex.props(styles.marker)}
                        >
                          {byId.get(id)!.n}
                        </button>
                      ))}
                    </span>
                  )}
                </span>
                {tail}
              </span>
            );
          })}
        </p>
      ))}
      <div {...stylex.props(styles.tray)}>
        <div role="group" aria-label="Sources" {...stylex.props(styles.chips)}>
          {sources.map((s, i) => (
            <button
              key={s.id}
              type="button"
              ref={(el) => {
                if (el) chipRefs.current.set(s.id, el);
                else chipRefs.current.delete(s.id);
              }}
              aria-label={label(s.id)}
              aria-expanded={open === s.id}
              aria-controls={`${uid}-preview`}
              data-lit={lit === s.id ? '' : undefined}
              onClick={() => toggle(s.id)}
              onKeyDown={(e) => onChipKey(e, i)}
              onMouseEnter={() => point(s.id)}
              onMouseLeave={() => point(null)}
              onFocus={() => point(s.id)}
              onBlur={() => point(null)}
              {...stylex.props(styles.chip, m3.rise)}
              style={{ '--oniva-i': Math.min(i, 6) } as CSSProperties}
            >
              <span aria-hidden="true" {...stylex.props(styles.chipAv)}>{s.site.charAt(0).toUpperCase()}</span>
              <span aria-hidden="true" {...stylex.props(styles.chipName)}>{s.site}</span>
              <span aria-hidden="true" {...stylex.props(styles.chipNum)}>{i + 1}</span>
            </button>
          ))}
        </div>
        <AnimatedHeight isOpen={!!openSrc}>
          <div id={`${uid}-preview`} role="region" aria-label={openSrc ? `Source ${openSrc.n} preview` : 'Source preview'} inert={!openSrc} {...stylex.props(styles.preview)}>
            {shownSrc && (
              <CrossFade contentKey={shownSrc.s.id} morph="height" duration={220}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p {...stylex.props(styles.pTitle)}>{shownSrc.s.title}</p>
                <p {...stylex.props(styles.pMeta)}>
                  {shownSrc.s.site}
                  {shownSrc.s.date ? ` · ${shownSrc.s.date}` : ''}
                </p>
                {shownSrc.s.quote && (
                  <blockquote {...stylex.props(styles.quote)}>
                    {markQuote(shownSrc.s.quote, shownSrc.s.highlight, citing).map(
                      (p, i): ReactNode => (p.mark ? <mark key={i} {...stylex.props(styles.mark)}>{p.text}</mark> : p.text),
                    )}
                  </blockquote>
                )}
                <div {...stylex.props(styles.btns)}>
                  {shownSrc.s.quote && (
                    <button
                      type="button"
                      onClick={() => {
                        void Promise.resolve(navigator.clipboard?.writeText(shownSrc.s.quote!)).catch(() => {});
                        setCopied(true);
                        setLive('Quote copied');
                        setTimeout(() => setCopied(false), 1600);
                      }}
                      {...stylex.props(styles.btn)}
                    >
                      <CrossFade as="span" contentKey={copied ? 'check' : 'copy'} duration={200}>
                        {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                      </CrossFade>
                      <span>{copied ? 'Copied' : 'Copy quote'}</span>
                    </button>
                  )}
                  {(shownSrc.s.url || onOpenSource) && (
                    <a
                      href={onOpenSource || !shownSrc.s.url || !/^https?:/i.test(shownSrc.s.url) ? undefined : shownSrc.s.url}
                      role={onOpenSource ? 'button' : undefined}
                      tabIndex={0}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => onOpenSource?.(shownSrc.s)}
                      onKeyDown={(e) => {
                        if (onOpenSource && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          onOpenSource(shownSrc.s);
                        }
                      }}
                      {...stylex.props(styles.btn)}
                    >
                      <ExternalLink size={12} aria-hidden="true" /> Open source
                    </a>
                  )}
                </div>
              </div>
              </CrossFade>
            )}
          </div>
        </AnimatedHeight>
        <span role="status" aria-live="polite" {...stylex.props(styles.sr)}>
          {live}
        </span>
      </div>
      </div>
      {(action || summary !== null) && (
        <div {...stylex.props(styles.foot)}>
          <span>{summary !== undefined ? summary : <><span {...stylex.props(styles.footN)}>{backed}</span> of {segments.length} {segments.length === 1 ? 'sentence' : 'sentences'} backed by a source</>}</span>
          {action && (
            <button type="button" onClick={action.onPress} {...stylex.props(styles.btn)}>
              {action.label} <ArrowRight size={12} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
