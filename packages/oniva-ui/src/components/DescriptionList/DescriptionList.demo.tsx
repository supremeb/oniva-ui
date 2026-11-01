import { CalendarIcon, DropletIcon, MailIcon, MapPinIcon, StethoscopeIcon, UserIcon } from '../../icons/IconSet';
import type { DemoModule } from '../../internal/demo';
import { DescriptionItem, DescriptionList } from './DescriptionList';

const demo: DemoModule = {
  meta: {
    title: 'Description list',
    slug: 'description-list',
    category: 'Data display',
    description:
      'Semantic <dl> of key/value rows rendered as white tiles on a gray inset card, with optional leading icons.',
  },
  demos: [
    {
      name: 'Profile card',
      code: `<DescriptionList title="Medical ID">
  <DescriptionItem icon={<CalendarIcon size={16} />} label="Date of Birth">Mar 14, 1991</DescriptionItem>
  <DescriptionItem icon={<UserIcon size={16} />} label="Gender">Female</DescriptionItem>
  <DescriptionItem icon={<DropletIcon size={16} />} label="Blood Type">O positive</DescriptionItem>
  <DescriptionItem icon={<StethoscopeIcon size={16} />} label="GP Doctor">Dr. Elena Marsh</DescriptionItem>
</DescriptionList>`,
      Component: () => (
        <div style={{ maxWidth: 360 }}>
          <DescriptionList title="Medical ID">
            <DescriptionItem icon={<CalendarIcon size={16} />} label="Date of Birth">
              Mar 14, 1991
            </DescriptionItem>
            <DescriptionItem icon={<UserIcon size={16} />} label="Gender">
              Female
            </DescriptionItem>
            <DescriptionItem icon={<DropletIcon size={16} />} label="Blood Type">
              O positive
            </DescriptionItem>
            <DescriptionItem icon={<StethoscopeIcon size={16} />} label="GP Doctor">
              Dr. Elena Marsh
            </DescriptionItem>
          </DescriptionList>
        </div>
      ),
    },
    {
      name: 'Two columns',
      code: `<DescriptionList title="Customer" columns={2}>
  <DescriptionItem icon={<MailIcon size={16} />} label="Email">amara@northwind.co</DescriptionItem>
  <DescriptionItem icon={<MapPinIcon size={16} />} label="Region">Lisbon, PT</DescriptionItem>
  ...
</DescriptionList>`,
      Component: () => (
        <DescriptionList title="Customer" columns={2}>
          <DescriptionItem icon={<MailIcon size={16} />} label="Email">
            amara@northwind.co
          </DescriptionItem>
          <DescriptionItem icon={<MapPinIcon size={16} />} label="Region">
            Lisbon, PT
          </DescriptionItem>
          <DescriptionItem icon={<CalendarIcon size={16} />} label="Customer since">
            Jan 08, 2024
          </DescriptionItem>
          <DescriptionItem icon={<UserIcon size={16} />} label="Plan">
            Growth, $249.00 / mo
          </DescriptionItem>
        </DescriptionList>
      ),
    },
  ],
};

export default demo;
