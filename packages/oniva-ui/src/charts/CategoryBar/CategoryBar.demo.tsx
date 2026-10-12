import type { DemoModule } from '../../internal/demo';
import { CategoryBar } from './CategoryBar';

const stack = {
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  maxWidth: 480,
  width: '100%',
} as const;

const demo: DemoModule = {
  meta: {
    title: 'Category bar',
    slug: 'category-bar',
    category: 'Charts',
    description:
      'Segmented bar showing ranges or shares, with an optional marker for the current value.',
  },
  demos: [
    {
      name: 'Score ranges with marker',
      code: `<CategoryBar showLabels marker={64} segments={[{ value: 40, tone: 3, label: 'Low' }, { value: 30, tone: 8, label: 'Fair' }, { value: 30, tone: 7, label: 'Good' }]} />`,
      Component: () => (
        <div style={stack}>
          <CategoryBar
            showLabels
            marker={64}
            segments={[
              { value: 40, tone: 3, label: 'Low' },
              { value: 30, tone: 8, label: 'Fair' },
              { value: 30, tone: 7, label: 'Good' },
            ]}
          />
        </div>
      ),
    },
    {
      name: 'Share of storage',
      code: `<CategoryBar segments={[{ value: 42, tone: 6 }, { value: 23, tone: 5 }, { value: 11, tone: 3 }, { value: 24, tone: 10 }]} />`,
      Component: () => (
        <div style={stack}>
          <CategoryBar
            segments={[
              { value: 42, tone: 6, label: 'Documents' },
              { value: 23, tone: 5, label: 'Media' },
              { value: 11, tone: 3, label: 'Apps' },
              { value: 24, tone: 10, label: 'Free' },
            ]}
            showLabels
          />
        </div>
      ),
    },
  ],
};
export default demo;
