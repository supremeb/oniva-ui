import type { DemoModule } from '../../internal/demo';
import { CloseButton } from './CloseButton';

const demo: DemoModule = {
  meta: {
    title: 'CloseButton',
    slug: 'close-button',
    category: 'Actions',
    description: 'Compact dismiss control used by alerts, tags, dialogs and toasts.',
  },
  demos: [
    {
      name: 'Sizes',
      code: `<CloseButton size="sm" />
<CloseButton size="md" aria-label="Close panel" />`,
      Component: () => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <CloseButton size="sm" />
          <CloseButton size="md" aria-label="Close panel" />
          <CloseButton isDisabled />
        </div>
      ),
    },
  ],
};
export default demo;
