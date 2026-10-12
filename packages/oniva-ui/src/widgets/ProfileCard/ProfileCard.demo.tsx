import type { DemoModule } from '../../internal/demo';
import { ProfileCard } from './ProfileCard';

const details = [
  { label: 'Date of birth', value: '28 July, 1997' },
  { label: 'Gender', value: 'Female' },
  { label: 'Blood type', value: 'A rh+' },
  { label: 'Primary doctor', value: 'Dr. Elena Marsh' },
];

const demo: DemoModule = {
  meta: {
    title: 'ProfileCard',
    slug: 'profile-card',
    category: 'Widgets',
    description: 'Large initial avatar with add-photo button, name and key/value detail rows.',
  },
  demos: [
    {
      name: 'Patient profile',
      code: `<ProfileCard name="Mira Okonkwo" details={details} onAddPhoto={() => {}} />`,
      Component: () => (
        <div style={{ maxWidth: 360 }}>
          <ProfileCard name="Mira Okonkwo" details={details} onAddPhoto={() => {}} />
        </div>
      ),
    },
    {
      name: 'With subtitle',
      code: `<ProfileCard name="Tomás Reyes" subtitle="Platform engineer · Lisbon" details={details.slice(0, 2)} />`,
      Component: () => (
        <div style={{ maxWidth: 360 }}>
          <ProfileCard
            name="Tomás Reyes"
            subtitle="Platform engineer · Lisbon"
            details={details.slice(0, 2)}
          />
        </div>
      ),
    },
  ],
};

export default demo;
