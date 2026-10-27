import * as stylex from '@stylexjs/stylex';
import { ArrowRight, Check, X } from 'lucide-react';
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type Ref } from 'react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ProgressBar } from '../../components/ProgressBar';
import { Radio, RadioGroup } from '../../components/RadioGroup';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { Select, SelectItem } from '../../components/Select';
import { Switch } from '../../components/Switch';
import { m8 } from '../../internal/m8-motion';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { focus } from '../../internal/focus';
import { pluralize } from '../../internal/format';
import { s3, ScreenShell, type ScreenUser } from '../../internal/s3-shell';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const WIDE = '@container (min-width: 900px)';

export interface OnboardingValues {
  workspace: string;
  slug: string;
  teamSize: string;
  tools: string[];
  invites: string[];
  role: string;
  template: string;
}

const STEPS = [
  { title: 'Name your workspace', short: 'Workspace' },
  { title: 'Connect your tools', short: 'Tools' },
  { title: 'Invite your team', short: 'Team' },
  { title: 'Create your first agent', short: 'First agent' },
] as const;

const TOOLS = [
  { id: 'mail', name: 'Mail', note: 'Read and draft messages' },
  { id: 'calendar', name: 'Calendar', note: 'Find time, schedule meetings' },
  { id: 'docs', name: 'Docs', note: 'Search and write documents' },
  { id: 'tickets', name: 'Tickets', note: 'Triage and update issues' },
];
const ROLES = ['Operations', 'Support', 'Research', 'Finance'];
const TEMPLATES = [
  { id: 'inbox', name: 'Inbox triager', note: 'Sorts and drafts replies for review.' },
  { id: 'brief', name: 'Daily briefer', note: 'Summarises your day every morning.' },
  { id: 'blank', name: 'Blank agent', note: 'Start from an empty prompt.' },
];

const enter = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const pop = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.85)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  layout: {
    alignItems: 'start',
    display: 'grid',
    gap: 16,
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [WIDE]: 'minmax(0, 1fr) 300px' },
  },
  greeting: { display: 'flex', flexDirection: 'column', gap: 4 },
  hello: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-20'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-24'],
    margin: 0,
  },
  step: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: enter, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-standard'],
    animationFillMode: 'both',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  footer: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  footerEnd: { alignItems: 'center', display: 'flex', gap: 8, marginInlineStart: 'auto' },
  tool: { alignItems: 'center', display: 'flex', gap: 12, justifyContent: 'space-between' },
  toolText: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  toolName: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6, listStyle: 'none', margin: 0, padding: 0 },
  chip: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 4,
    paddingBlock: 2,
    paddingInlineEnd: 2,
    paddingInlineStart: 10,
  },
  chipX: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-full'],
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    height: 20,
    justifyContent: 'center',
    padding: 0,
    width: 20,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text-muted'],
    cursor: { default: 'pointer', ':disabled': 'default' },
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    gap: 10,
    paddingBlock: 8,
    paddingInline: 8,
    textAlign: 'start',
    width: '100%',
  },
  itemCurrent: {
    backgroundColor: colors['--oniva-color-accent-soft'],
    color: colors['--oniva-color-accent-soft-fg'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  dot: {
    alignItems: 'center',
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-11'],
    fontVariantNumeric: 'tabular-nums',
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  dotDone: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: pop, [media.reducedMotion]: 'none' },
    backgroundColor: colors['--oniva-color-success-solid'],
    borderColor: colors['--oniva-color-success-solid'],
    color: colors['--oniva-color-success-on-solid'],
  },
  done: { alignItems: 'flex-start', display: 'flex', flexDirection: 'column', gap: 12 },
  nextRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
});

export interface OnboardingProps {
  /** Step shown first; the steps before it count as done. */
  defaultStep?: 1 | 2 | 3 | 4;
  /** Called after Create agent (or skipping the last step). */
  onComplete?: (values: OnboardingValues) => void;
  onStepChange?: (step: number) => void;
  onNavigate?: (label: string) => void;
  workspace?: string;
  user?: ScreenUser;
  headingLevel?: 1 | 2;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function Onboarding({
  defaultStep = 2,
  onComplete,
  onStepChange,
  onNavigate,
  workspace = 'Northwind Labs',
  user = { name: 'Alex Morgan' },
  headingLevel = 1,
  className,
  ref,
}: OnboardingProps) {
  const [step, setStep] = useState<number>(defaultStep);
  const [finished, setFinished] = useState(false);
  const [name, setName] = useState(workspace);
  const [slug, setSlug] = useState(slugify(workspace));
  const [slugTouched, setSlugTouched] = useState(false);
  const [teamSize, setTeamSize] = useState('2-10');
  const [tools, setTools] = useState<string[]>(['mail']);
  const [invites, setInvites] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [role, setRole] = useState('Operations');
  const [template, setTemplate] = useState('inbox');
  const [error, setError] = useState('');
  const [announce, setAnnounce] = useState('');
  const stepRef = useRef<HTMLHeadingElement>(null);
  const id = useId();
  const first = user.name.split(' ')[0] ?? user.name;

  const values: OnboardingValues = {
    workspace: name,
    slug,
    teamSize,
    tools,
    invites,
    role,
    template,
  };
  // Step direction drives the slide: forward steps enter from the inline end, back steps from the start.
  const dir = useRef(1);
  const go = (n: number) => {
    dir.current = n >= step ? 1 : -1;
    setStep(n);
    setError('');
    onStepChange?.(n);
    setAnnounce(`Step ${n} of ${STEPS.length}: ${STEPS[n - 1]!.title}`);
    requestAnimationFrame(() => stepRef.current?.focus());
  };
  const finish = () => {
    setFinished(true);
    setAnnounce('Setup complete.');
    onComplete?.(values);
  };
  const next = () => (step >= STEPS.length ? finish() : go(step + 1));

  const addInvite = () => {
    const email = draft.trim().replace(/,$/, '');
    if (!email) return false;
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return true;
    }
    if (!invites.includes(email)) setInvites([...invites, email]);
    setDraft('');
    setError('');
    return true;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && !name.trim()) return setError('Give your workspace a name.');
    if (step === 3 && addInvite()) return;
    next();
  };

  const onInviteKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === ' ') {
      if (draft.trim()) {
        e.preventDefault();
        addInvite();
      }
    } else if (e.key === 'Backspace' && !draft && invites.length) setInvites(invites.slice(0, -1));
  };

  const H = headingLevel === 1 ? 'h2' : 'h3';
  const cur = STEPS[Math.min(step, STEPS.length) - 1]!;
  const doneCount = finished ? STEPS.length : step - 1;

  return (
    <ScreenShell
      ref={ref}
      className={className}
      workspace={name || workspace}
      user={user}
      active="Home"
      title="Get started"
      headingLevel={headingLevel}
      onNavigate={onNavigate}
    >
      <div role="status" aria-live="polite" {...stylex.props(s3.srOnly)}>
        {announce}
      </div>
      <div {...stylex.props(styles.greeting)}>
        <p {...stylex.props(styles.hello)}>Welcome, {first}</p>
        <p {...stylex.props(s3.muted)}>
          Four short steps to get {name || workspace} running. You can skip any of them and come
          back later.
        </p>
      </div>
      <div {...stylex.props(styles.layout)}>
        <section aria-label="Setup" {...stylex.props(s3.card)}>
          <ProgressBar
            aria-label="Setup progress"
            value={doneCount}
            minValue={0}
            maxValue={STEPS.length}
            valueLabel={
              finished ? 'Setup complete' : `Step ${step} of ${STEPS.length}: ${cur.title}`
            }
            size="sm"
            tone={finished ? 'success' : 'accent'}
          />
          {finished ? (
            <div {...stylex.props(styles.done, m8.view)}>
              <H {...stylex.props(s3.h)} ref={stepRef} tabIndex={-1}>
                You’re all set
              </H>
              <p {...stylex.props(s3.muted)}>
                {name} is ready with {pluralize(tools.length, { one: '# tool', other: '# tools' })}{' '}
                connected and{' '}
                {pluralize(invites.length, {
                  zero: 'no invites',
                  one: '# invite',
                  other: '# invites',
                })}{' '}
                sent. Where next?
              </p>
              <div {...stylex.props(styles.nextRow)}>
                <Button endIcon={<ArrowRight size={14} />} onPress={() => onNavigate?.('Chat')}>
                  Chat
                </Button>
                <Button variant="secondary" onPress={() => onNavigate?.('Integrations')}>
                  Integrations
                </Button>
                <Button variant="secondary" onPress={() => onNavigate?.('Analytics')}>
                  Analytics
                </Button>
              </div>
            </div>
          ) : (
            <form key={step} onSubmit={submit} noValidate style={{ '--oniva-m8-dir': `${dir.current * 24}px` } as CSSProperties} {...stylex.props(styles.step, m8.slideX)}>
              <div>
                <p {...stylex.props(s3.muted, s3.num)}>
                  Step {step} of {STEPS.length}
                </p>
                <H {...stylex.props(s3.h)} ref={stepRef} tabIndex={-1}>
                  {cur.title}
                </H>
              </div>

              {step === 1 && (
                <>
                  <Input
                    label="Workspace name"
                    value={name}
                    isInvalid={!!error}
                    errorMessage={error}
                    onChange={(v) => {
                      setName(v);
                      if (!slugTouched) setSlug(slugify(v));
                    }}
                  />
                  <Input
                    label="Workspace URL"
                    prefix="app/"
                    value={slug}
                    onChange={(v) => {
                      setSlug(slugify(v));
                      setSlugTouched(true);
                    }}
                  />
                  <SegmentedControl
                    aria-label="Team size"
                    size="sm"
                    value={teamSize}
                    onChange={setTeamSize}
                  >
                    <SegmentedControlItem value="1">Just me</SegmentedControlItem>
                    <SegmentedControlItem value="2-10">2 to 10</SegmentedControlItem>
                    <SegmentedControlItem value="11-50">11 to 50</SegmentedControlItem>
                    <SegmentedControlItem value="50+">50+</SegmentedControlItem>
                  </SegmentedControl>
                </>
              )}

              {step === 2 && (
                <ul {...stylex.props(s3.list)}>
                  {TOOLS.map((t) => (
                    <li key={t.id} {...stylex.props(styles.tool)}>
                      <span {...stylex.props(styles.toolText)}>
                        <span {...stylex.props(styles.toolName)}>{t.name}</span>
                        <span {...stylex.props(s3.muted)}>{t.note}</span>
                      </span>
                      <Switch
                        aria-label={`Connect ${t.name}`}
                        isSelected={tools.includes(t.id)}
                        onChange={(on) =>
                          setTools(on ? [...tools, t.id] : tools.filter((x) => x !== t.id))
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}

              {step === 3 && (
                <>
                  <Input
                    label="Teammate emails"
                    description="Press Enter or comma to add. Backspace removes the last one."
                    type="email"
                    value={draft}
                    onChange={(v) => {
                      setDraft(v);
                      setError('');
                    }}
                    onKeyDown={onInviteKey}
                    isInvalid={!!error}
                    errorMessage={error}
                    placeholder="name@company.com"
                  />
                  {invites.length > 0 && (
                    <ul aria-label="Invited" {...stylex.props(styles.chips)}>
                      {invites.map((m) => (
                        <li key={m} {...stylex.props(styles.chip, m8.pop)}>
                          {m}
                          <button
                            type="button"
                            aria-label={`Remove ${m}`}
                            onClick={() => setInvites(invites.filter((x) => x !== m))}
                            {...stylex.props(styles.chipX, focus.ring)}
                          >
                            <X size={12} aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {step === 4 && (
                <>
                  <Select
                    label="What will it help with?"
                    selectedKey={role}
                    onSelectionChange={(k) => k && setRole(String(k))}
                  >
                    {ROLES.map((r) => (
                      <SelectItem key={r} id={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </Select>
                  <RadioGroup
                    label="Start from a template"
                    cards
                    value={template}
                    onChange={setTemplate}
                  >
                    {TEMPLATES.map((t) => (
                      <Radio key={t.id} value={t.id} variant="card" description={t.note}>
                        {t.name}
                      </Radio>
                    ))}
                  </RadioGroup>
                </>
              )}

              <div {...stylex.props(styles.footer)}>
                <Button variant="ghost" isDisabled={step === 1} onPress={() => go(step - 1)}>
                  Back
                </Button>
                <span {...stylex.props(styles.footerEnd)}>
                  <Button variant="ghost" onPress={next}>
                    Skip for now
                  </Button>
                  <Button type="submit">
                    {step === STEPS.length ? 'Create agent' : 'Continue'}
                  </Button>
                </span>
              </div>
            </form>
          )}
        </section>

        <section aria-label="Getting started" {...stylex.props(s3.card)}>
          <div {...stylex.props(s3.between)}>
            <h2 {...stylex.props(s3.h)} id={`${id}-list`}>
              Getting started
            </h2>
            <Badge variant={finished ? 'success' : 'neutral'}>
              <AnimatedNumber value={doneCount} />/{STEPS.length}
            </Badge>
          </div>
          <ol aria-labelledby={`${id}-list`} {...stylex.props(styles.list)}>
            {STEPS.map((s, i) => {
              const n = i + 1;
              const isDone = finished || n < step;
              const isCurrent = !finished && n === step;
              return (
                <li key={s.short}>
                  <button
                    type="button"
                    aria-current={isCurrent ? 'step' : undefined}
                    disabled={!isDone && !isCurrent}
                    onClick={() => !finished && go(n)}
                    {...stylex.props(styles.item, focus.ring, isCurrent && styles.itemCurrent)}
                  >
                    <span
                      aria-hidden="true"
                      {...stylex.props(styles.dot, isDone && styles.dotDone)}
                    >
                      {isDone ? <Check size={12} /> : n}
                    </span>
                    <span>
                      {s.short}
                      {isDone && <span {...stylex.props(s3.srOnly)}> (done)</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </ScreenShell>
  );
}
