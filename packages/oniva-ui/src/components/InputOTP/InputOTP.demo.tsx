import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { InputOTP } from './InputOTP';

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

const demo: DemoModule = {
  meta: {
    title: 'Input OTP',
    slug: 'input-otp',
    category: 'Forms',
    description: 'One-time-code input with slot display, paste and SMS-autofill support.',
  },
  demos: [
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
  ],
};

export default demo;
