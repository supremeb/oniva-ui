import type { DemoModule } from '../../internal/demo';
import { Kbd, KbdGroup } from './Kbd';

const row = { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Kbd',
    slug: 'kbd',
    category: 'Data display',
    description: 'Keyboard key caps for shortcuts and hints. Semantic <kbd> with three sizes.',
  },
  demos: [
    {
      name: 'Shortcuts',
      code: `<KbdGroup keys={['⌘', 'K']} />
<KbdGroup keys={['⌘', 'Shift', 'P']} />
<KbdGroup keys={['Ctrl', 'Alt', 'Del']} />
<Kbd>Esc</Kbd>`,
      Component: () => (
        <div style={row}>
          <KbdGroup keys={['⌘', 'K']} />
          <KbdGroup keys={['⌘', 'Shift', 'P']} />
          <KbdGroup keys={['Ctrl', 'Alt', 'Del']} />
          <Kbd>Esc</Kbd>
        </div>
      ),
    },
    {
      name: 'Sizes',
      code: `<Kbd size="sm">↵</Kbd>
<Kbd size="md">↵</Kbd>
<Kbd size="lg">↵</Kbd>`,
      Component: () => (
        <div style={row}>
          <Kbd size="sm">↵</Kbd>
          <Kbd size="md">↵</Kbd>
          <Kbd size="lg">↵</Kbd>
        </div>
      ),
    },
    {
      name: 'In a sentence',
      code: `<p>Press <KbdGroup keys={['⌘', 'K']} /> to open the command palette.</p>`,
      Component: () => (
        <p style={{ margin: 0 }}>
          Press <KbdGroup keys={['⌘', 'K']} /> to open the command palette, or <Kbd>/</Kbd> to focus
          search.
        </p>
      ),
    },
  ],
};

export default demo;
