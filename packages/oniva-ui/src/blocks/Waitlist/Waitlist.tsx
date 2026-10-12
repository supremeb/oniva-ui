import * as stylex from '@stylexjs/stylex';
import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden';
import { ArrowRight } from 'lucide-react';
import { useId, useState } from 'react';
import type { FormEvent, HTMLAttributes, Ref } from 'react';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const NARROW = '@media (max-width: 720px)';

const pop = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.9)' },
  to: { opacity: 1, transform: 'scale(1)' },
});
const draw = stylex.keyframes({ from: { strokeDashoffset: 24 }, to: { strokeDashoffset: 0 } });
const rise = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(var(--oniva-motion-travel))' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const styles = stylex.create({
  wrap: { alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 16, marginInline: 'auto', maxWidth: 480, minHeight: 168, textAlign: 'center' },
  form: { alignItems: 'flex-start', display: 'flex', flexDirection: { default: 'row', [NARROW]: 'column' }, gap: 8, width: '100%' },
  grow: { flex: '1 1 0%', textAlign: 'start', width: { default: 'auto', [NARROW]: '100%' } },
  btn: { flexShrink: 0, width: { default: 'auto', [NARROW]: '100%' } },
  success: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  badge: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: pop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
    backgroundColor: colors['--oniva-color-success-bg'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-success-fg'],
    display: 'flex',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  path: {
    animationDelay: '120ms',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: draw, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    strokeDasharray: 24,
  },
  count: { fontSize: font['--oniva-font-size-14'], color: colors['--oniva-color-text-muted'], margin: 0 },
});

export interface WaitlistProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'onSubmit'> {
  onJoin?: (email: string) => void | Promise<void>;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Waitlist({ onJoin, className, xstyle, ref, ...rest }: WaitlistProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const errId = useId();
  const [error, setError] = useState<string | null>(null);
  const sx = stylex.props(bs.section, xstyle);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState('loading');
    setError(null);
    try {
      await onJoin?.(email);
      setState('done');
    } catch {
      setState('idle');
      setError("Couldn't add you to the waitlist. Check your connection and try again.");
    }
  };
  return (
    <section ref={ref} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <div {...stylex.props(styles.wrap)}>
          <VisuallyHidden>
            <span role="status">{state === 'done' ? "You're on the list" : ''}</span>
          </VisuallyHidden>
          {state === 'done' ? (
            <div {...stylex.props(styles.success)}>
              <span {...stylex.props(styles.badge)}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5 10 17.5 19 7.5" {...stylex.props(styles.path)} />
                </svg>
              </span>
              <h2 {...stylex.props(bs.h3)}>You're on the list</h2>
              <p {...stylex.props(styles.count)}>We'll email {email} when your invite is ready.</p>
            </div>
          ) : (
            <>
              <h2 {...stylex.props(bs.h2)}>Get early access</h2>
              <p {...stylex.props(bs.lead)}>Join 4,200 teams waiting for Oniva Agents. Invites go out weekly.</p>
              <form {...stylex.props(styles.form)} onSubmit={submit}>
                <Input xstyle={styles.grow} type="email" name="email" autoComplete="email" inputMode="email" aria-label="Email address" aria-describedby={error ? errId : undefined} isInvalid={error ? true : undefined} placeholder="you@company.com" isRequired value={email} onChange={setEmail} />
                <Button type="submit" isLoading={state === 'loading'} xstyle={styles.btn} endIcon={<ArrowRight size={16} />}>
                  Join waitlist
                </Button>
                {error && (
                  <p id={errId} role="alert" {...stylex.props(styles.count)}>
                    {error}
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
