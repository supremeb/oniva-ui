import * as stylex from '@stylexjs/stylex';
import { useDeferredValue, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { SearchField } from '../../components/SearchField';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import type { IconGlyph, IconVariant } from './createIcon';
import * as glyphs from './glyphs';
import { BellIcon, CircleCheckIcon, FolderClockIcon, MailIcon, SettingsIcon, SparklesIcon, TriangleAlertIcon } from './glyphs';

const all = Object.entries(glyphs)
  .filter((e): e is [string, IconGlyph] => typeof e[1] === 'function' && 'parts' in e[1])
  .sort(([a], [b]) => a.localeCompare(b));

const LIMIT = 360;

const styles = stylex.create({
  stack: { display: 'flex', flexDirection: 'column', gap: 16, width: '100%' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
    gap: 4,
    width: '100%',
  },
  cell: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-text'],
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: '14px 4px 10px',
  },
  name: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-11'],
    maxWidth: '100%',
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  count: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums' },
  row: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 20 },
  accent: { color: colors['--oniva-color-accent-text'] },
});

function Gallery() {
  const [variant, setVariant] = useState<IconVariant>('outline');
  const [query, setQuery] = useState('');
  const q = useDeferredValue(query.trim().toLowerCase());
  const matches = q ? all.filter(([name]) => name.toLowerCase().includes(q)) : all;
  // Thousands of glyphs: render the first page and let the filter narrow the rest.
  const shown = matches.slice(0, LIMIT);
  return (
    <div {...stylex.props(styles.stack)}>
      <div {...stylex.props(styles.row)}>
        <SegmentedControl
          size="sm"
          aria-label="Icon style"
          value={variant}
          onChange={(v) => setVariant(v as IconVariant)}
        >
          <SegmentedControlItem value="outline">Outline</SegmentedControlItem>
          <SegmentedControlItem value="duo">Duo</SegmentedControlItem>
          <SegmentedControlItem value="fill">Fill</SegmentedControlItem>
          <SegmentedControlItem value="fill-duo">Fill duo</SegmentedControlItem>
        </SegmentedControl>
        <SearchField
          aria-label="Filter icons"
          placeholder="Filter icons"
          shortcut={null}
          size="sm"
          value={query}
          onChange={setQuery}
        />
        <span {...stylex.props(styles.count)}>
          {matches.length > shown.length
            ? `Showing ${shown.length} of ${matches.length} matches (${all.length} glyphs). Filter to narrow.`
            : `${matches.length} of ${all.length} glyphs`}
        </span>
      </div>
      <div {...stylex.props(styles.grid)}>
        {shown.map(([name, Glyph]) => (
          <div key={name} {...stylex.props(styles.cell)}>
            <Glyph variant={variant} size={24} />
            <span {...stylex.props(styles.name)}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Icon set',
    slug: 'icon-set',
    category: 'Primitives',
    description:
      'Oniva glyphs drawn on an 18-unit grid with a 1.5 stroke, in outline, duo, fill and fill-duo. Each takes size, variant, strokeWidth and a title, and colours with currentColor.',
  },
  demos: [
    {
      name: 'All glyphs',
      code: `import { BellIcon } from 'oniva-ui';

<BellIcon />                 // outline
<BellIcon variant="duo" />
<BellIcon variant="fill" />
<BellIcon variant="fill-duo" />`,
      Component: Gallery,
    },
    {
      name: 'Styles',
      code: `<SparklesIcon />
<SparklesIcon variant="duo" />
<SparklesIcon variant="fill" />
<CircleCheckIcon variant="fill-duo" />`,
      Component: () => (
        <div {...stylex.props(styles.row)}>
          {(['outline', 'duo', 'fill'] as const).map((v) => (
            <SparklesIcon key={v} variant={v} size={32} />
          ))}
          <CircleCheckIcon variant="fill-duo" size={32} />
        </div>
      ),
    },
    {
      name: 'Size and colour',
      code: `<MailIcon size={16} />
<MailIcon size={20} />
<MailIcon size={24} />
<MailIcon size={32} />
<span style={{ color: 'var(--oniva-color-accent-text)' }}><MailIcon variant="duo" /></span>`,
      Component: () => (
        <div {...stylex.props(styles.row)}>
          {[16, 20, 24, 32].map((s) => (
            <MailIcon key={s} size={s} />
          ))}
          <span {...stylex.props(styles.accent)}>
            <MailIcon variant="duo" size={32} />
          </span>
        </div>
      ),
    },
    {
      name: 'Optical size',
      code: `<SettingsIcon size={12} />                  // 12-grid compact drawing (auto at 14px and below)
<SettingsIcon size={12} optical="regular" /> // the 18-grid drawing, scaled down
<FolderClockIcon size={12} />               // variants inherit compact drawings`,
      Component: () => (
        <div {...stylex.props(styles.row)}>
          <SettingsIcon size={12} />
          <SettingsIcon size={12} optical="regular" />
          <FolderClockIcon size={12} />
          <FolderClockIcon size={12} optical="regular" />
          <SettingsIcon size={24} />
        </div>
      ),
    },
    {
      name: 'Accessible name',
      code: `<BellIcon />                                 // decorative: aria-hidden
<TriangleAlertIcon title="Payment overdue" />  // role="img" with a name`,
      Component: () => (
        <div {...stylex.props(styles.row)}>
          <BellIcon />
          <TriangleAlertIcon title="Payment overdue" />
        </div>
      ),
    },
  ],
};
export default demo;
