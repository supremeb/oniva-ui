import { Button } from '../../components/Button/Button';
import type { DemoModule } from '../../internal/demo';
import { MagneticButton } from './MagneticButton';

const demo: DemoModule = {
  meta: {
    title: "Magnetic button",
    slug: "magnetic-button",
    category: 'Motion',
    description: "Wrap any control; it drifts toward the pointer inside a padded zone and eases back.",
  },
  demos: [
    {
      name: "Primary CTA",
      code: "<div style={{ padding: 32 }}><MagneticButton><Button>Start free trial</Button></MagneticButton></div>",
      Component: () => (
        <div style={{ padding: 32 }}><MagneticButton><Button>Start free trial</Button></MagneticButton></div>
      ),
    },
    {
      name: "Stronger pull",
      code: "<div style={{ padding: 32 }}><MagneticButton strength={0.6} radius={40}><Button variant=\"secondary\">Book a demo</Button></MagneticButton></div>",
      Component: () => (
        <div style={{ padding: 32 }}><MagneticButton strength={0.6} radius={40}><Button variant="secondary">Book a demo</Button></MagneticButton></div>
      ),
    },
  ],
};
export default demo;
