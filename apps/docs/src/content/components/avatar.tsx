import { User } from 'lucide-react';
import { Avatar, AvatarGroup } from 'oniva-ui';
import type { DocPage } from '../types';

type S = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const Demo = (p: { size?: S; color?: 'neutral' | 'accent'; name?: string; broken?: boolean }) => (
  <Avatar size={p.size} color={p.color} name={p.name ?? 'Ada Lovelace'} src={p.broken ? '/missing.png' : undefined} />
);
const Group = (p: { max?: number; size?: S }) => (
  <AvatarGroup max={p.max} size={p.size} aria-label="Team">
    <Avatar name="Ada Lovelace" /><Avatar name="Grace Hopper" color="accent" /><Avatar name="Alan Turing" /><Avatar name="Linus Torvalds" /><Avatar name="Margaret Hamilton" />
  </AvatarGroup>
);

const page: DocPage = {
  slug: 'avatar',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Avatar',
  group: ['Components', 'Data display'],
  sourcePath: 'components/Avatar',
  lede: 'A person or entity as a circle: photo when there is one, initials or an icon when there is not. AvatarGroup stacks several with a +N overflow.',
  anatomy: {
    intro: 'Four parts. The circle and its label are always present; the image shows only when src loads.',
    Render: () => <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}><Demo size="xl" /><Group max={3} /></div>,
    parts: [
      { name: 'Circle', description: 'Full radius, clipped. Five sizes: 20, 24, 32, 36, 48px. Semibold text. role="img" with the name as its label.', selector: 'div > [role="img"]:first-child' },
      { name: 'Initials', description: 'First letter of the first and last word, uppercase. 10px at xs and sm, 12px md, 16px lg, 18px xl. Falls back to the fallback node.', selector: 'div > [role="img"]:first-child > span[aria-hidden="true"]' },
      { name: 'Overflow avatar', description: 'Closing "+N" avatar in the neutral color, same size as the group. Labelled "N more".', selector: '[role="group"] > [role="img"]:last-child' },
      { name: 'Group', description: 'Overlaps avatars by 8px with a 2px ring in the page background. Beyond max, a "+N" avatar closes the stack.', selector: '[role="group"]' },
    ],
  },
  usage: {
    use: ['People in lists, comments and assignee fields.', 'A stacked group of collaborators with an overflow count.', 'Entities with a fallback icon, such as a bot or team.'],
    avoid: [
      { text: 'Product or content imagery.', instead: { slug: 'image', label: 'Image' } },
      { text: 'A status label next to a name.', instead: { slug: 'badge', label: 'Badge' } },
      { text: 'A removable person chip in a field.', instead: { slug: 'tag', label: 'Tag' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'size', label: 'Size', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
      { kind: 'segmented', key: 'color', label: 'Color', options: ['neutral', 'accent'] },
      { kind: 'text', key: 'name', label: 'Name', presets: ['Ada Lovelace', 'Grace Hopper', 'Linus'] },
    ],
    initial: { size: 'lg', color: 'neutral', name: 'Ada Lovelace' },
    render: (p) => <Demo size={p.size as S} color={p.color as 'neutral' | 'accent'} name={String(p.name)} />,
    code: (p) => `<Avatar name="${p.name}"${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.color === 'accent' ? ' color="accent"' : ''} />`,
  },
  states: [
    { name: 'Initials', description: 'No src: two letters from the name.', Render: () => <Demo size="lg" /> },
    { name: 'Single name', description: 'One word gives one letter.', Render: () => <Demo size="lg" name="Linus" /> },
    { name: 'Accent', description: 'Accent 300 background, 900 text.', Render: () => <Demo size="lg" color="accent" /> },
    { name: 'Icon fallback', description: 'No name: the fallback node renders.', Render: () => <Avatar size="lg" name="" fallback={<User size={16} />} aria-label="Unassigned" /> },
    { name: 'Image failed', description: 'A broken src falls back to initials.', Render: () => <Demo size="lg" broken /> },
    { name: 'Group with overflow', description: 'max=3 shows three and "+2".', Render: () => <Group max={3} /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Always pass a name', body: 'The name gives the accessible label and the initials. Use alt only when the label should differ.' },
      { title: 'Pick size by row height', body: '24px in dense tables, 32px in lists, 48px in profile headers.' },
      { title: 'Cap the group', body: 'Show 3 to 5 avatars then +N. The overflow avatar is labelled "N more".' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'In a list row', body: 'Avatar, name and a muted secondary line. See List and InboxList.' },
      { title: 'With status', body: 'Place a Badge dot beside the name, not on the avatar.' },
    ] },
  ],
  content: { rules: [
    { title: 'Names', body: 'Use the full display name so initials come out right.' },
    { title: 'Group label', body: 'Give AvatarGroup an aria-label such as "Team".' },
    { title: 'Entities', body: 'Use an icon fallback, not initials, for non-people.' },
  ] },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Avatars are not interactive. Wrap in a Button or Link if needed.' }],
    notes: ['The circle is role="img" with aria-label from alt, then name, then "Avatar".', 'The image and initials are hidden from assistive tech so the name is read once.', 'The group is role="group"; the overflow avatar reads "N more".'],
  },
  props: [
    { name: 'src', type: 'string', description: 'Image URL. Failure falls back to initials.' },
    { name: 'alt', type: 'string', description: 'Accessible label. Defaults to name.' },
    { name: 'name', type: 'string', description: 'Source for initials and label.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Diameter: 20, 24, 32, 36, 48px.' },
    { name: 'color', type: "'neutral' | 'accent'", default: "'neutral'", description: 'Fallback background.' },
    { name: 'fallback', type: 'ReactNode', description: 'Shown when no image or name.' },
    { name: 'AvatarGroup.max', type: 'number', description: 'Visible count before +N.' },
    { name: 'AvatarGroup.size', type: 'AvatarSize', default: "'md'", description: 'Size of every avatar.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['badge', 'list', 'inbox-list', 'tag'],
};
export default page;
