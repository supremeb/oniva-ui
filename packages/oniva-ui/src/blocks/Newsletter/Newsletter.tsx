import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import type { FormEvent, HTMLAttributes, Ref } from 'react';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';

const NARROW = '@media (max-width: 720px)';

const styles = stylex.create({
  card: { alignItems: 'center', display: 'flex', flexDirection: { default: 'row', [NARROW]: 'column' }, gap: 24, justifyContent: 'space-between', padding: { default: 32, [NARROW]: 20 } },
  text: { display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 420 },
  form: { display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 420, minWidth: { default: 340, [NARROW]: 0 }, width: '100%' },
  row: { alignItems: 'flex-start', display: 'flex', flexDirection: { default: 'row', [NARROW]: 'column' }, gap: 8 },
  grow: { flex: '1 1 0%', width: { default: 'auto', [NARROW]: '100%' } },
  btn: { flexShrink: 0, width: { default: 'auto', [NARROW]: '100%' } },
  note: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], margin: 0 },
});

export interface NewsletterProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'onSubmit'> {
  onSubscribe?: (email: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Newsletter({ onSubscribe, className, xstyle, ref, ...rest }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const sx = stylex.props(bs.section, xstyle);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubscribe?.(email);
    setDone(true);
  };
  return (
    <section ref={ref} aria-label="Newsletter" {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <div {...stylex.props(bs.card, styles.card)}>
          <div {...stylex.props(styles.text)}>
            <h2 {...stylex.props(bs.h3)}>The Oniva Ops Letter</h2>
            <p {...stylex.props(bs.p)}>One email a month on running AI agents in production. No fluff, unsubscribe any time.</p>
          </div>
          <form {...stylex.props(styles.form)} onSubmit={submit} aria-live="polite">
            {done ? (
              <p {...stylex.props(bs.p)}>Thanks! Check {email} to confirm your subscription.</p>
            ) : (
              <>
                <div {...stylex.props(styles.row)}>
                  <Input xstyle={styles.grow} type="email" aria-label="Email address" placeholder="you@company.com" isRequired value={email} onChange={setEmail} />
                  <Button type="submit" xstyle={styles.btn}>Subscribe</Button>
                </div>
                <p {...stylex.props(styles.note)}>Join 9,000 operators.</p>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
