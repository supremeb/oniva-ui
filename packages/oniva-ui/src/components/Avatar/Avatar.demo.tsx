import { User } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Avatar, AvatarGroup } from './Avatar';

const row = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Avatar',
    slug: 'avatar',
    category: 'Data display',
    description:
      'User image with initials fallback, five sizes, accent variant and an overlapping group.',
  },
  demos: [
    {
      name: 'Sizes and fallbacks',
      code: `<Avatar size="xs" name="Ada Lovelace" />
<Avatar size="sm" name="Grace Hopper" />
<Avatar size="md" name="Alan Turing" color="accent" />
<Avatar size="lg" fallback={<User size={16} />} />
<Avatar size="xl" name="Broken" src="/missing.png" />`,
      Component: () => (
        <div style={row}>
          <Avatar size="xs" name="Ada Lovelace" />
          <Avatar size="sm" name="Grace Hopper" />
          <Avatar size="md" name="Alan Turing" color="accent" />
          <Avatar size="lg" name="Anon" fallback={<User size={16} />} />
          <Avatar size="xl" name="Broken Image" src="/missing.png" />
        </div>
      ),
    },
    {
      name: 'Group',
      code: `<AvatarGroup max={3}>
  <Avatar name="Ada Lovelace" />
  <Avatar name="Grace Hopper" color="accent" />
  <Avatar name="Alan Turing" />
  <Avatar name="Linus Torvalds" />
  <Avatar name="Margaret Hamilton" />
</AvatarGroup>`,
      Component: () => (
        <AvatarGroup max={3} aria-label="Team">
          <Avatar name="Ada Lovelace" />
          <Avatar name="Grace Hopper" color="accent" />
          <Avatar name="Alan Turing" />
          <Avatar name="Linus Torvalds" />
          <Avatar name="Margaret Hamilton" />
        </AvatarGroup>
      ),
    },
  ],
};

export default demo;
