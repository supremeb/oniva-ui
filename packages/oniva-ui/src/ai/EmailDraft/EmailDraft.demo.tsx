import type { DemoModule } from '../../internal/demo';
import { EmailDraft } from './EmailDraft';

const demo: DemoModule = {
  meta: {
    title: 'Email draft',
    slug: 'email-draft',
    category: 'AI & Agent',
    description:
      'Agent-written email for review: switch recipient and tone, edit inline, send or discard with undo.',
  },
  demos: [
    {
      name: 'Renewal reminder',
      code: `<EmailDraft
  reference="SUB-1182"
  account="Northwind Logistics"
  amount="$8,900"
  status="Renews in 5 days"
  agent="Renewal agent"
  attachment="Renewal-quote.pdf"
  link={{ label: 'Review quote', href: '/quotes/1182' }}
  onSend={(email) => api.send(email)}
/>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 520 }}>
          <EmailDraft link={{ label: 'Review quote', href: '#quote' }} />
        </div>
      ),
    },
    {
      name: 'Custom copy, no attachment',
      code: `<EmailDraft
  reference="INV-3307"
  account="Pine & Co."
  amount="$2,150"
  status="Overdue 6 days"
  agent="Collections agent"
  attachment={null}
  contacts={[{ name: 'Mara Lindqvist', email: 'mara@pine.example' }]}
  tones={[{ id: 'nudge', label: 'Nudge', body: (c) => \`Hi \${c.name.split(' ')[0]}, invoice INV-3307 is 6 days past due.\` }]}
/>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 520 }}>
          <EmailDraft
            reference="INV-3307"
            account="Pine & Co."
            amount="$2,150"
            status="Overdue 6 days"
            agent="Collections agent"
            attachment={null}
            contacts={[{ name: 'Mara Lindqvist', email: 'mara@pine.example' }]}
            tones={[
              {
                id: 'nudge',
                label: 'Nudge',
                body: (c) => `Hi ${c.name.split(' ')[0]}, invoice INV-3307 is 6 days past due.`,
              },
            ]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
