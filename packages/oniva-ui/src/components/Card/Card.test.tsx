import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Tile,
} from './Card';

describe('Card', () => {
  it('composes header, content, tile and footer', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Steps</CardTitle>
          <CardDescription>This week</CardDescription>
        </CardHeader>
        <CardContent>
          <Tile data-testid="tile">12,480</Tile>
        </CardContent>
        <CardFooter>Updated</CardFooter>
      </Card>,
    );
    expect(screen.getByTestId('card').tagName).toBe('SECTION');
    expect(screen.getByRole('heading', { name: 'Steps' })).toBeInTheDocument();
    expect(screen.getByTestId('tile')).toHaveTextContent('12,480');
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });

  it('forwards className and ref, varies by variant', () => {
    let el: HTMLElement | null = null;
    const { rerender } = render(
      <Card
        data-testid="c"
        className="extra"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    const a = screen.getByTestId('c').className;
    expect(a).toContain('extra');
    expect(el).toBeInstanceOf(HTMLElement);
    rerender(<Card data-testid="c" variant="outline" />);
    expect(screen.getByTestId('c').className).not.toBe(a);
  });
});
