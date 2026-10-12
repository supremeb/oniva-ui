import type { DemoModule } from '../../internal/demo';
import { Badge } from '../Badge';
import { Button } from '../Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeaderText,
  CardTitle,
  Tile,
} from './Card';

const demo: DemoModule = {
  meta: {
    title: 'Card',
    slug: 'card',
    category: 'Layout',
    description: 'Inset gray card that holds white inner tiles, the signature nested-surface look.',
  },
  demos: [
    {
      name: 'Inset card with tiles',
      code: `<Card>
  <CardHeader>
    <CardHeaderText>
      <CardTitle>Total steps</CardTitle>
      <CardDescription>Last 7 days</CardDescription>
    </CardHeaderText>
    <Badge variant="success" dot>On track</Badge>
  </CardHeader>
  <CardContent>
    <Tile>12,480 steps</Tile>
    <Tile>9,214 steps</Tile>
  </CardContent>
</Card>`,
      Component: () => (
        <div style={{ maxWidth: 360 }}>
          <Card>
            <CardHeader>
              <CardHeaderText>
                <CardTitle>Total steps</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeaderText>
              <Badge variant="success" dot>
                On track
              </Badge>
            </CardHeader>
            <CardContent>
              <Tile>12,480 steps</Tile>
              <Tile>9,214 steps</Tile>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      name: 'Outline card with footer',
      code: `<Card variant="outline">
  <CardHeader><CardTitle>Billing</CardTitle></CardHeader>
  <CardContent><Tile padding="sm">Pro plan, renews monthly</Tile></CardContent>
  <CardFooter><Button size="sm">Manage</Button></CardFooter>
</Card>`,
      Component: () => (
        <div style={{ maxWidth: 360 }}>
          <Card variant="outline">
            <CardHeader>
              <CardTitle>Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <Tile padding="sm">Pro plan, renews monthly</Tile>
            </CardContent>
            <CardFooter>
              <Button size="sm">Manage</Button>
            </CardFooter>
          </Card>
        </div>
      ),
    },
  ],
};

export default demo;
