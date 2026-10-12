import type { DemoModule } from '../../internal/demo';
import { AuthCard } from './AuthCard';

const demo: DemoModule = {
  meta: {
    title: 'Auth card',
    slug: 'auth-card',
    category: 'Widgets',
    description: 'Sign-in card with email/password, forgot-password link and social providers.',
  },
  demos: [
    {
      name: 'Sign in',
      code: `<AuthCard onSubmit={async ({ email }) => console.log(email)} />`,
      Component: () => (
        <div style={{ maxWidth: 400 }}>
          <AuthCard />
        </div>
      ),
    },
    {
      name: 'Rejected credentials',
      code: `<AuthCard
  title="Admin console"
  submitLabel="Continue"
  onSubmit={async () => { throw new Error('Incorrect email or password'); }}
/>`,
      Component: () => (
        <div style={{ maxWidth: 400 }}>
          <AuthCard
            title="Admin console"
            description="Restricted to workspace owners."
            submitLabel="Continue"
            onSubmit={async () => {
              throw new Error('Incorrect email or password');
            }}
          />
        </div>
      ),
    },
  ],
};

export default demo;
