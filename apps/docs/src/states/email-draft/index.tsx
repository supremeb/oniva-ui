import { EmailDraft } from 'oniva-ui';
import type { StateModule } from '../types';

const longName = 'Dr. Marguerite Alessandra Vandenberghe-Okonkwo';
const longEmail = 'marguerite.vandenberghe-okonkwo@finance-operations.nwlog.example';

const mod: StateModule = {
  slug: 'email-draft',
  title: 'Email draft',
  width: 520,
  groups: [
    {
      label: 'Default',
      states: [
        { id: 'default', label: 'renewal reminder', render: () => <EmailDraft link={{ label: 'Review quote', href: '#quote' }} /> },
        {
          id: 'overdue',
          label: 'custom copy, one contact, one tone',
          render: () => (
            <EmailDraft
              reference="INV-3307"
              account="Pine & Co."
              amount="$2,150"
              status="Overdue 6 days"
              agent="Collections agent"
              attachment={null}
              contacts={[{ name: 'Mara Lindqvist', email: 'mara@pine.example' }]}
              tones={[{ id: 'nudge', label: 'Nudge', body: (c) => `Hi ${c.name.split(' ')[0]}, invoice INV-3307 is 6 days past due.` }]}
            />
          ),
        },
      ],
    },
    {
      label: 'Attachment',
      states: [
        { id: 'no-attachment', label: 'no attachment', render: () => <EmailDraft attachment={null} /> },
        {
          id: 'long-attachment',
          label: 'long attachment name',
          render: () => <EmailDraft attachment="Northwind-Logistics-Growth-plan-renewal-quote-with-seat-adjustments-and-monthly-billing-options-FY2027-v3-final.pdf" />,
        },
      ],
    },
    {
      label: 'Recipient',
      states: [
        { id: 'no-contacts', label: 'no contacts', render: () => <EmailDraft contacts={[]} /> },
        {
          id: 'long-contact',
          label: 'long name and email',
          render: () => <EmailDraft contacts={[{ name: longName, email: longEmail }]} />,
        },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'no-tones', label: 'no tones (empty body)', render: () => <EmailDraft tones={[]} /> },
        { id: 'no-status', label: 'no status badge', render: () => <EmailDraft status="" /> },
        {
          id: 'long-record',
          label: 'long reference, account, status, agent',
          render: () => (
            <EmailDraft
              reference="SUB-1182-NORTHWIND-ANNUAL-RENEWAL-2027"
              account="Northwind Logistics International Freight and Warehousing Holdings"
              amount="$1,248,900.00"
              status="Renews in 5 days, auto-renew enabled"
              agent="Renewal and collections agent"
            />
          ),
        },
        {
          id: 'long-body',
          label: 'long tone body with unbroken url',
          render: () => (
            <EmailDraft
              link={{ label: 'https://billing.nwlog.example/quotes/1182/revisions/3/line-items/seat-adjustments?utm_source=renewal-agent', href: '#quote' }}
              tones={[
                {
                  id: 'detail',
                  label: 'Detailed',
                  body: (c) =>
                    `Hi ${c.name.split(' ')[0]}, your Growth plan renews on Nov 2 for $8,900 a year. Since March your team added 14 seats, moved two warehouses onto the shared workspace, and exported 3,200 manifests, so the renewal quote now includes volume pricing. Reply here if you'd like to change anything before the renewal date. Quote:`,
                },
                { id: 'short', label: 'Short', body: (c) => `Hi ${c.name.split(' ')[0]}, renewal quote:` },
              ]}
            />
          ),
        },
      ],
    },
  ],
  missing: [
    'sending (internal phase after pressing Send, no prop)',
    'sent receipt with Undo (internal phase)',
    'discarded receipt with Undo (internal phase)',
    'editing the text in the textarea (internal, no defaultEditing prop)',
    'a non-first tone selected (initial tone is always tones[0])',
    'recipient menu open (internal)',
  ],
};

export default mod;
