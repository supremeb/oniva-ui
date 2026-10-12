import type { DemoModule } from '../../internal/demo';
import { Button } from '../Button';
import { Input } from '../Input';
import { Form } from './Form';

const demo: DemoModule = {
  meta: {
    title: 'Form',
    slug: 'form',
    category: 'Forms',
    description: 'Form wrapper with native + server validation, consistent vertical rhythm.',
  },
  demos: [
    {
      name: 'Invite teammate',
      code: `<Form onSubmit={(e) => e.preventDefault()}>
  <Input label="Full name" isRequired defaultValue="Priya Raman" />
  <Input label="Work email" type="email" isRequired />
  <Button type="submit">Send invite</Button>
</Form>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 360 }}>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Input label="Full name" isRequired defaultValue="Priya Raman" />
            <Input label="Work email" type="email" isRequired />
            <Button type="submit">Send invite</Button>
          </Form>
        </div>
      ),
    },
    {
      name: 'Server errors',
      code: `<Form validationErrors={{ email: 'This email already belongs to a workspace member.' }}>
  <Input label="Email" name="email" defaultValue="marcus@acme.co" />
</Form>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 360 }}>
          <Form validationErrors={{ email: 'This email already belongs to a workspace member.' }}>
            <Input label="Email" name="email" defaultValue="marcus@acme.co" />
          </Form>
        </div>
      ),
    },
  ],
};

export default demo;
