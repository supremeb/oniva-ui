import * as stylex from '@stylexjs/stylex';
import { GitBranch, Globe } from 'lucide-react';
import { useState, type FormEvent, type Ref } from 'react';
import { Button } from '../../components/Button';
import { Card, Tile } from '../../components/Card';
import { Input } from '../../components/Input';
import { Link } from '../../components/Link';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';

const styles = stylex.create({
  head: { display: 'flex', flexDirection: 'column', gap: 4, paddingInline: 8, paddingTop: 8 },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-20'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-20'],
    margin: 0,
  },
  sub: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  forgot: { alignSelf: 'flex-end', fontSize: font['--oniva-font-size-13'] },
  or: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 10,
  },
  rule: { backgroundColor: colors['--oniva-color-separator'], flexGrow: 1, height: 1 },
  socials: { display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' },
  foot: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    textAlign: 'center',
  },
  error: {
    color: colors['--oniva-color-text-error'],
    fontSize: font['--oniva-font-size-13'],
    margin: 0,
  },
});

export interface AuthCardProps {
  title?: string;
  description?: string;
  submitLabel?: string;
  /** Called with the entered credentials; may be async. Throw / reject to show an error. */
  onSubmit?: (values: { email: string; password: string }) => void | Promise<void>;
  onForgotPassword?: () => void;
  onSocial?: (provider: 'github' | 'google') => void;
  onSignUp?: () => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Sign-in card: email + password, forgot-password link, social buttons and sign-up link. */
export function AuthCard({
  title = 'Welcome back',
  description = 'Sign in to your workspace to continue.',
  submitLabel = 'Sign in',
  onSubmit,
  onForgotPassword,
  onSocial,
  onSignUp,
  className,
  xstyle,
  ref,
}: AuthCardProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await onSubmit?.({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <div {...stylex.props(styles.head)}>
        <h3 {...stylex.props(styles.title)}>{title}</h3>
        <p {...stylex.props(styles.sub)}>{description}</p>
      </div>
      <Tile padding="lg">
        <form onSubmit={submit} {...stylex.props(styles.form)}>
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            isRequired
            value={email}
            onChange={setEmail}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            isRequired
            value={password}
            onChange={setPassword}
          />
          <Link href="#forgot" xstyle={styles.forgot} onPress={onForgotPassword} tone="accent">
            Forgot password?
          </Link>
          {error && (
            <p role="alert" {...stylex.props(styles.error)}>
              {error}
            </p>
          )}
          <Button type="submit" isLoading={busy}>
            {submitLabel}
          </Button>
          <div {...stylex.props(styles.or)} aria-hidden="true">
            <span {...stylex.props(styles.rule)} />
            or continue with
            <span {...stylex.props(styles.rule)} />
          </div>
          <div {...stylex.props(styles.socials)}>
            <Button
              variant="secondary"
              startIcon={<GitBranch size={16} />}
              onPress={() => onSocial?.('github')}
            >
              GitHub
            </Button>
            <Button
              variant="secondary"
              startIcon={<Globe size={16} />}
              onPress={() => onSocial?.('google')}
            >
              Google
            </Button>
          </div>
        </form>
      </Tile>
      <p {...stylex.props(styles.foot)}>
        New here?{' '}
        <Link href="#signup" tone="accent" onPress={onSignUp}>
          Create an account
        </Link>
      </p>
    </Card>
  );
}
