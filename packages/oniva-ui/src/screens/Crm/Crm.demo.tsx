import type { DemoModule } from '../../internal/demo';
import { CrmScreen } from './Crm';

const frame = {
  border: '1px solid var(--oniva-color-border)',
  borderRadius: 16,
  height: 720,
  overflow: 'hidden',
  position: 'relative',
  transform: 'translateZ(0)',
  width: '100%',
} as const;

const demo: DemoModule = {
  meta: {
    title: 'CRM screen',
    slug: 'crm-screen',
    category: 'Screens',
    description: 'Company list with saved views as tabs and an editable, searchable data table with stage selects and an add-row action.',
  },
  demos: [
    {
      name: 'Default',
      code: `<CrmScreen />`,
      Component: () => (
        <div style={frame}>
          <CrmScreen headingLevel={2} />
        </div>
      ),
    },
    {
      name: 'Custom workspace',
      code: `<CrmScreen
  workspace="Fieldstone Co"
  user={{ name: 'Sam Okafor' }}
  onCompaniesChange={(rows) => console.log(rows.length)}
  onNavigate={(label) => console.log(label)}
/>`,
      Component: () => (
        <div style={frame}>
          <CrmScreen
            headingLevel={2}
            workspace="Fieldstone Co"
            user={{ name: 'Sam Okafor' }}
            onCompaniesChange={(rows) => console.log(rows.length)}
            onNavigate={(label) => console.log(label)}
          />
        </div>
      ),
    },
  ],
};

export default demo;
