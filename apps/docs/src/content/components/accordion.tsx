import { CreditCard, Shield, Truck } from 'lucide-react';
import { Accordion, AccordionItem } from 'oniva-ui';
import type { DocPage } from '../types';

const Demo = (p: { variant?: 'divided' | 'cards'; multiple?: boolean; icons?: boolean; open?: string[]; disabled?: boolean; onEvent?: (n: string) => void }) => (
  <div style={{ width: 360 }}>
    <Accordion
      variant={p.variant}
      allowsMultipleExpanded={p.multiple}
      defaultExpandedKeys={p.open ?? ['shipping']}
      onExpandedChange={() => p.onEvent?.('onExpandedChange')}
    >
      <AccordionItem id="shipping" icon={p.icons ? <Truck size={16} /> : undefined} title="Shipping & delivery">
        Orders ship within 2 business days. Standard delivery takes 3 to 5 days.
      </AccordionItem>
      <AccordionItem id="returns" icon={p.icons ? <CreditCard size={16} /> : undefined} title="Returns" isDisabled={p.disabled}>
        Return unused items within 30 days for a full refund.
      </AccordionItem>
      <AccordionItem id="warranty" icon={p.icons ? <Shield size={16} /> : undefined} title="Warranty">
        Every plan includes a 12-month limited warranty.
      </AccordionItem>
    </Accordion>
  </div>
);

const page: DocPage = {
  slug: 'accordion',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Accordion',
  group: ['Components', 'Data display'],
  sourcePath: 'components/Accordion',
  lede: 'Stacked sections that expand in place. Use it to keep long reference content scannable: FAQs, policy details, settings groups.',
  anatomy: {
    intro: 'Five parts. The container, trigger, title and chevron are always present; the leading icon is optional.',
    Render: () => <Demo icons open={['shipping']} />,
    parts: [
      { name: 'Container', description: 'Divided variant: 1px border, 12px radius, hairlines between items. Cards variant: 16px radius inset tray, 8px padding and gap.', selector: 'div[style] > div[data-rac]' },
      { name: 'Trigger', description: 'Full-width button inside an h3. 48px minimum height, 16px horizontal padding, 14px medium text. Hover tints the surface.', selector: '[data-expanded] h3 button' },
      { name: 'Icon', description: 'Optional 16px leading icon in the muted icon color. Decorative, hidden from assistive tech.', selector: '[data-expanded] h3 button > span[aria-hidden="true"]', fallback: { x: 8, y: 12 } },
      { name: 'Chevron', description: '16px, muted. Rotates 180 degrees when open; no rotation under reduced motion.', selector: '[data-expanded] h3 button > svg' },
      { name: 'Panel', description: '14px muted text, 22px line height, 16px side and bottom padding. Height animates open and closed.', selector: '[data-expanded] [role="group"]', fallback: { x: 50, y: 40 } },
    ],
  },
  usage: {
    use: ['FAQs and policy details where most readers open one or two items.', 'Grouping settings so a long page stays scannable.', 'Secondary content that supports a primary task.'],
    avoid: [
      { text: 'A single show/hide region.', instead: { slug: 'collapsible', label: 'Collapsible' } },
      { text: 'Switching between peer views of equal weight.', instead: { slug: 'tabs', label: 'Tabs' } },
      { text: 'Hierarchical navigation with nested levels.', instead: { slug: 'tree-view', label: 'TreeView' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['divided', 'cards'] },
      { kind: 'toggle', key: 'multiple', label: 'Allow multiple open' },
      { kind: 'toggle', key: 'icons', label: 'Icons' },
    ],
    initial: { variant: 'divided', multiple: false, icons: false },
    render: (p, onEvent) => <Demo variant={p.variant as 'divided' | 'cards'} multiple={Boolean(p.multiple)} icons={Boolean(p.icons)} onEvent={onEvent} />,
    code: (p) => `<Accordion${p.variant === 'cards' ? ' variant="cards"' : ''}${p.multiple ? ' allowsMultipleExpanded' : ''} defaultExpandedKeys={['shipping']}>\n  <AccordionItem id="shipping" title="Shipping & delivery">...</AccordionItem>\n  <AccordionItem id="returns" title="Returns">...</AccordionItem>\n</Accordion>`,
  },
  states: [
    { name: 'Collapsed', description: 'Every panel closed; chevron points down.', Render: () => <Demo open={[]} /> },
    { name: 'Expanded', description: 'One panel open, chevron rotated.', Render: () => <Demo open={['shipping']} /> },
    { name: 'Multiple open', description: 'With allowsMultipleExpanded, panels open independently.', Render: () => <Demo multiple open={['shipping', 'warranty']} /> },
    { name: 'Disabled item', description: 'Muted title, not focusable, no hover.', Render: () => <Demo disabled open={[]} /> },
    { name: 'Cards variant', description: 'White tiles on an inset tray, separated by a hairline border and no shadow.', Render: () => <Demo variant="cards" icons open={['shipping']} /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Single by default', body: 'One open item at a time keeps the page short. Turn on allowsMultipleExpanded when readers compare sections.' },
      { title: 'Open the likely answer', body: 'Pre-expand the item most people need through defaultExpandedKeys. Never expand everything.' },
      { title: 'No forms in panels', body: 'Panels are for reading. Put multi-step input in a Dialog or a page.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With Badge', body: 'Put a Badge in the title for counts, such as "Open issues 4". Keep it short so the title does not wrap.' },
      { title: 'With Alert', body: 'Place an inline Alert at the top of a panel for a warning that belongs to that section only.' },
    ] },
  ],
  content: { rules: [
    { title: 'Titles', body: 'A noun phrase or question under 60 characters. Sentence case, no trailing punctuation.' },
    { title: 'Panels', body: 'Lead with the answer. Two to four sentences; link out for more.' },
    { title: 'Order', body: 'Most asked first, not alphabetical.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves between triggers.' },
      { keys: ['Enter', 'Space'], action: 'Toggles the focused item.' },
    ],
    notes: ['Each trigger is a button with aria-expanded inside an h3, so the section titles appear in the heading outline.', 'The panel is a group labelled by its trigger.', 'The chevron and icon are aria-hidden.', 'Disabled items are skipped by Tab.'],
    reducedMotion: 'The height animation and the chevron rotation are removed; panels switch instantly.',
  },
  props: [
    { name: 'variant', type: "'divided' | 'cards'", default: "'divided'", description: 'Single bordered container, or white tiles on a gray tray.' },
    { name: 'allowsMultipleExpanded', type: 'boolean', default: 'false', description: 'Let several items stay open.' },
    { name: 'expandedKeys / defaultExpandedKeys', type: 'Iterable<Key>', description: 'Controlled or initial open items.' },
    { name: 'onExpandedChange', type: '(keys: Set<Key>) => void', description: 'Fires when the open set changes.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disable every item.' },
    { name: 'AccordionItem.id', type: 'string', description: 'Required. Identifies the item in expandedKeys.' },
    { name: 'AccordionItem.title', type: 'ReactNode', description: 'Trigger label.' },
    { name: 'AccordionItem.icon', type: 'ReactNode', description: 'Optional 16px leading icon.' },
    { name: 'AccordionItem.isDisabled', type: 'boolean', default: 'false', description: 'Disable one item.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override on either component.' },
  ],
  related: ['collapsible', 'tabs', 'tree-view', 'description-list'],
};
export default page;
