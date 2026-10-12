import type { DemoModule } from '../../internal/demo';
import { Button } from '../Button';
import { Text } from '../Text';
import { Spinner } from './Spinner';

const row = { display: 'flex', gap: 16, alignItems: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Spinner',
    slug: 'spinner',
    category: 'Feedback',
    description: 'Indeterminate loader. Pauses offscreen; pulses instead of spinning under prefers-reduced-motion.',
  },
  demos: [
    {
      name: 'Sizes',
      code: `<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`,
      Component: () => (
        <div style={row}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
            <Spinner key={s} size={s} />
          ))}
        </div>
      ),
    },
    {
      name: 'Inline status',
      code: `<Spinner size="sm" label="Syncing" />
<Text tone="muted">Syncing 1,204 transactions...</Text>`,
      Component: () => (
        <div style={row}>
          <Spinner size="sm" label="Syncing" />
          <Text tone="muted">Syncing 1,204 transactions...</Text>
          <Button
            variant="secondary"
            size="sm"
            isDisabled
            startIcon={<Spinner size="xs" tone="current" />}
          >
            Exporting
          </Button>
        </div>
      ),
    },
  ],
};
export default demo;
