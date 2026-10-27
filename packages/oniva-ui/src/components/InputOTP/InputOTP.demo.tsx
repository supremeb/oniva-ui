import { useState } from 'react';
import { Mail } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { InputOTP, type InputOTPStatus } from './InputOTP';

function Verify() {
  const [done, setDone] = useState<string | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <InputOTP
        label="Verification code"
        description="We sent a 6-digit code to b***@acme.co."
        separatorAt={3}
        onChange={() => setDone(null)}
        onComplete={setDone}
      />
      {done && <span style={{ fontSize: 13 }}>Verifying {done}…</span>}
    </div>
  );
}

function Flow() {
  const [status, setStatus] = useState<InputOTPStatus>('idle');
  return (
    <InputOTP
      label="Verification code"
      description="Try 424242 to verify, anything else fails."
      status={status}
      separatorAt={3}
      onChange={(v) => v && setStatus('idle')}
      onComplete={(code) => {
        setStatus('verifying');
        setTimeout(() => setStatus(code === '424242' ? 'success' : 'error'), 900);
      }}
      onResend={() => undefined}
      resendIn={20}
    />
  );
}

function EmailCard() {
  const [status, setStatus] = useState<InputOTPStatus>('error');
  const [tries, setTries] = useState(2);
  const t = (extra: object) => ({ color: 'var(--oniva-color-text-muted)', fontSize: 14, margin: 0, ...extra });
  return (
    <div style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: 16, boxShadow: 'var(--oniva-shadow-xs)', maxWidth: 400, overflow: 'hidden', width: '100%' }}>
      <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 16, padding: '28px 24px 24px' }}>
        <span style={{ alignItems: 'center', border: '1px solid var(--oniva-color-border)', borderRadius: 12, color: 'var(--oniva-color-text-muted)', display: 'inline-flex', height: 40, justifyContent: 'center', width: 40 }}>
          <Mail size={18} aria-hidden="true" />
        </span>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Check your email</h3>
          <p style={t({ marginBlockStart: 4 })}>
            We sent a code to <span style={{ color: 'var(--oniva-color-text)', fontWeight: 500 }}>maya@acme.com</span>
          </p>
        </div>
        <InputOTP
          aria-label="Verification code"
          align="center"
          variant="filled"
          separatorAt={3}
          status={status}
          clearOnError={false}
          errorMessage={`That code didn't work. ${tries} tries left.`}
          onChange={(v) => v && setStatus('idle')}
          onComplete={(code) => {
            setStatus('verifying');
            setTimeout(() => {
              if (code === '482913') setStatus('success');
              else {
                setTries((n) => Math.max(0, n - 1));
                setStatus('error');
              }
            }, 700);
          }}
          onResend={() => undefined}
          resendIn={27}
        />
      </div>
      <div style={{ ...t({ fontSize: 13 }), borderBlockStart: '1px solid var(--oniva-color-separator)', padding: '12px 24px', textAlign: 'center' }}>
        Demo code: <span style={{ color: 'var(--oniva-color-text)', fontWeight: 500 }}>482 913</span>
      </div>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Input OTP',
    slug: 'input-otp',
    category: 'Forms',
    description: 'One-time-code input with slot display, paste and SMS-autofill support.',
  },
  demos: [
    {
      name: 'Verification card',
      code: `<InputOTP align="center" variant="filled" separatorAt={3} status={status} errorMessage="That code didn't work. 2 tries left." onResend={sendCode} resendIn={27} />`,
      Component: EmailCard,
    },
    {
      name: 'Six digits with separator',
      code: `<InputOTP label="Verification code" separatorAt={3} onComplete={(code) => verify(code)} />`,
      Component: Verify,
    },
    {
      name: 'Four digit PIN and error',
      code: `<InputOTP label="Card PIN" length={4} />
<InputOTP label="Code" length={4} defaultValue="1234" isInvalid errorMessage="That code has expired." />`,
      Component: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <InputOTP label="Card PIN" length={4} />
          <InputOTP
            label="Code"
            length={4}
            defaultValue="1234"
            isInvalid
            errorMessage="That code has expired."
          />
        </div>
      ),
    },
    {
      name: 'Verify flow with resend',
      code: `<InputOTP
  label="Verification code"
  status={status}
  separatorAt={3}
  onComplete={(code) => verify(code)}
  onResend={() => sendCode()}
  resendIn={20}
/>`,
      Component: Flow,
    },
  ],
};

export default demo;
